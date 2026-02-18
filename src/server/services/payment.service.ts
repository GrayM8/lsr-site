import { getStripe } from "@/lib/stripe";
import { prisma } from "@/server/db";
import { RegistrationStatus, Prisma } from "@prisma/client";
import { createAuditLog } from "@/server/audit/log";
import { sendNotification } from "@/server/services/notification.service";
import { format } from "date-fns";
import type Stripe from "stripe";

// ---------------------------------------------------------------------------
// Checkout Session Creation
// ---------------------------------------------------------------------------

export async function createEventCheckoutSession(
  userId: string,
  eventSlug: string
): Promise<string> {
  const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
  if (!event) throw new Error("Event not found");

  if (!event.registrationEnabled) {
    throw new Error("Registration is closed for this event.");
  }
  if (event.registrationFeeCents == null || event.registrationFeeCents <= 0) {
    throw new Error("This event does not require payment.");
  }

  const now = new Date();
  if (event.registrationOpensAt && now < event.registrationOpensAt) {
    throw new Error("Registration has not opened yet.");
  }
  if (event.registrationClosesAt && now > event.registrationClosesAt) {
    throw new Error("Registration is closed.");
  }

  // Check if already registered
  const existing = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId: event.id, userId } },
  });
  if (existing?.status === "REGISTERED") {
    throw new Error("You are already registered for this event.");
  }

  // Check capacity — if full, they should join waitlist (free) instead
  if (event.registrationMax !== null) {
    const registeredCount = await prisma.eventRegistration.count({
      where: { eventId: event.id, status: "REGISTERED" },
    });
    if (registeredCount >= event.registrationMax) {
      throw new Error(
        "This event is currently full. You can join the waitlist for free."
      );
    }
  }

  // Create a pending payment record
  const payment = await prisma.payment.create({
    data: {
      userId,
      productId: null,
      amountCents: event.registrationFeeCents,
      currency: "USD",
      provider: "stripe",
      status: "pending",
      metadata: {
        eventId: event.id,
        eventSlug: event.slug,
        eventTitle: event.title,
      },
    },
  });

  // Build base URL using the same pattern as the rest of the codebase
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: event.registrationFeeCents,
          product_data: {
            name: `${event.title} — Registration`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/events/${event.slug}?payment=success`,
    cancel_url: `${baseUrl}/events/${event.slug}?payment=cancelled`,
    metadata: {
      paymentId: payment.id,
      userId,
      eventId: event.id,
    },
    client_reference_id: payment.id,
  });

  // Store the checkout session ID as the provider reference
  await prisma.payment.update({
    where: { id: payment.id },
    data: { providerRef: session.id },
  });

  if (!session.url) {
    throw new Error("Failed to create Stripe Checkout session.");
  }

  return session.url;
}

// ---------------------------------------------------------------------------
// Webhook Handler
// ---------------------------------------------------------------------------

export async function handleStripeWebhook(
  rawBody: Buffer,
  signature: string
): Promise<void> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
  }

  const event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;
    case "charge.refunded":
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;
  }
}

// ---------------------------------------------------------------------------
// checkout.session.completed
// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const paymentId = session.metadata?.paymentId;
  if (!paymentId) {
    throw new Error("No paymentId in Stripe session metadata");
  }

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new Error(`Payment ${paymentId} not found`);

  // Idempotency: don't process twice
  if (payment.status === "succeeded") return;

  const meta = payment.metadata as {
    eventId: string;
    eventSlug: string;
    eventTitle: string;
  };

  let registrationStatus: RegistrationStatus = "REGISTERED";
  let waitlistOrder: number | null = null;

  await prisma.$transaction(async (tx) => {
    // Update payment
    await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "succeeded",
        paidAt: new Date(),
        providerRef: (session.payment_intent as string) ?? session.id,
      },
    });

    // Lock event row for capacity check
    await tx.$executeRaw`SELECT 1 FROM "Event" WHERE id = ${meta.eventId} FOR UPDATE`;
    const event = await tx.event.findUnique({ where: { id: meta.eventId } });
    if (!event) throw new Error("Event not found");

    // Check capacity
    if (event.registrationMax !== null) {
      const registeredCount = await tx.eventRegistration.count({
        where: { eventId: meta.eventId, status: "REGISTERED" },
      });
      if (registeredCount >= event.registrationMax) {
        // Event filled while user was paying — go to waitlist
        registrationStatus = "WAITLISTED";
        const maxOrder = await tx.eventRegistration.aggregate({
          where: { eventId: meta.eventId, status: "WAITLISTED" },
          _max: { waitlistOrder: true },
        });
        waitlistOrder = (maxOrder._max.waitlistOrder || 0) + 1;
      }
    }

    // Upsert registration (user might already be WAITLISTED from a free waitlist join)
    const existing = await tx.eventRegistration.findUnique({
      where: { eventId_userId: { eventId: meta.eventId, userId: payment.userId } },
    });

    if (existing) {
      await tx.eventRegistration.update({
        where: { id: existing.id },
        data: {
          status: registrationStatus,
          waitlistOrder:
            registrationStatus === "WAITLISTED" ? waitlistOrder : null,
          sourcePaymentId: paymentId,
        },
      });
    } else {
      await tx.eventRegistration.create({
        data: {
          eventId: meta.eventId,
          userId: payment.userId,
          status: registrationStatus,
          waitlistOrder:
            registrationStatus === "WAITLISTED" ? waitlistOrder : null,
          sourcePaymentId: paymentId,
        },
      });
    }

    // NOTE: Do NOT call reconcileEvent here. For paid events, auto-promotion
    // is disabled — officers handle waitlist manually.
  });

  // Audit log (after transaction)
  await createAuditLog({
    actorUserId: null,
    actionType: "PAYMENT_SUCCEEDED",
    entityType: "PAYMENT",
    entityId: paymentId,
    targetUserId: payment.userId,
    summary: `Stripe checkout completed for event registration`,
    metadata: { sessionId: session.id, eventId: meta.eventId },
  });

  // Send notification (fire and forget)
  const event = await prisma.event.findUnique({
    where: { id: meta.eventId },
  });
  if (event && registrationStatus === "REGISTERED") {
    const eventDate = format(event.startsAtUtc, "EEEE, MMMM d 'at' h:mm a");
    sendNotification({
      userId: payment.userId,
      type: "REGISTRATION_CONFIRMED",
      title: `You're registered for ${event.title}!`,
      body: `Payment confirmed. See you on ${eventDate}.`,
      actionUrl: `/events/${event.slug}`,
      channels: ["IN_APP", "EMAIL"],
      metadata: {
        eventId: meta.eventId,
        title: event.title,
        startsAt: event.startsAtUtc,
        slug: event.slug,
      },
    }).catch((err) =>
      console.error(
        "[Payment] Failed to send registration notification:",
        err
      )
    );
  }
}

// ---------------------------------------------------------------------------
// charge.refunded
// ---------------------------------------------------------------------------

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  // Find payment by the payment_intent stored in providerRef
  const payment = await prisma.payment.findFirst({
    where: { providerRef: charge.payment_intent as string },
  });
  if (!payment) return; // Not a payment we track

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "refunded" },
  });

  await createAuditLog({
    actorUserId: null,
    actionType: "PAYMENT_REFUNDED",
    entityType: "PAYMENT",
    entityId: payment.id,
    summary: `Stripe charge refunded`,
    metadata: { chargeId: charge.id },
  });
}
