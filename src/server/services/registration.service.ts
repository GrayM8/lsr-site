import { prisma } from "@/server/db";
import { RegistrationStatus, Prisma } from "@prisma/client";
import { createAuditLog } from "@/server/audit/log";

/**
 * Core Registration Service
 * Handles transactional logic for Event Registration, Waitlists, and Reconciliation.
 */

/**
 * Reconciles the event state:
 * 1. Calculates available slots.
 * 2. Promotes waitlisted users if slots are available (FIFO).
 * 3. Ensures consistency.
 * 
 * Must be called within a transaction where the Event is locked.
 */
async function reconcileEvent(tx: Prisma.TransactionClient, eventId: string) {
  const event = await tx.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found during reconciliation");

  // If no limit, everyone should be registered. 
  // (In practice, if we switch from Limited to Unlimited, we might want to promote everyone)
  if (event.registrationMax === null) {
    const waitlisted = await tx.eventRegistration.findMany({
      where: { eventId, status: "WAITLISTED" },
    });
    
    for (const reg of waitlisted) {
      await tx.eventRegistration.update({
        where: { id: reg.id },
        data: {
          status: "REGISTERED",
          promotedAt: new Date(),
          promotionSource: "AUTO",
          waitlistOrder: null, // Clear waitlist order
        },
      });
    }
    return;
  }

  // Limited Capacity
  const registeredCount = await tx.eventRegistration.count({
    where: { eventId, status: "REGISTERED" },
  });

  const slotsAvailable = event.registrationMax - registeredCount;

  if (slotsAvailable > 0) {
    const promotions = await tx.eventRegistration.findMany({
      where: { eventId, status: "WAITLISTED" },
      orderBy: [
        { waitlistOrder: "asc" }, // Primary: FIFO / Admin Order
        { createdAt: "asc" },     // Fallback
      ],
      take: slotsAvailable,
    });

    for (const reg of promotions) {
      await tx.eventRegistration.update({
        where: { id: reg.id },
        data: {
          status: "REGISTERED",
          promotedAt: new Date(),
          promotionSource: "AUTO",
          waitlistOrder: null,
        },
      });
    }
  }
}

/**
 * Member-facing Registration Action
 */
export async function registerForEvent(
  userId: string,
  eventId: string,
  intent: "YES" | "NO"
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Lock the Event row to ensure sequential processing of capacity
    // This prevents race conditions where multiple users grab the last spot.
    await tx.$executeRaw`SELECT 1 FROM "Event" WHERE id = ${eventId} FOR UPDATE`;

    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Event not found");

    // 2. Validations (Member Rules)
    if (!event.registrationEnabled) {
      throw new Error("Registration is closed for this event.");
    }

    const now = new Date();
    if (event.registrationOpensAt && now < event.registrationOpensAt) {
      throw new Error("Registration has not opened yet.");
    }
    if (event.registrationClosesAt && now > event.registrationClosesAt) {
      throw new Error("Registration is closed.");
    }

    // 3. Get Current Registration
    const currentReg = await tx.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    // 4. Handle "NO" (Not Attending)
    if (intent === "NO") {
      if (currentReg) {
        // If they were registered or waitlisted, this might open a spot
        await tx.eventRegistration.update({
          where: { id: currentReg.id },
          data: {
            status: "NOT_ATTENDING",
            waitlistOrder: null,
            // We keep the record to track they explicitly said NO
          },
        });
        
        // If they were registered, we must reconcile to potentially promote someone
        if (currentReg.status === "REGISTERED") {
          await reconcileEvent(tx, eventId);
        }
      } else {
        // Create explicit NO record
        await tx.eventRegistration.create({
          data: {
            eventId,
            userId,
            status: "NOT_ATTENDING",
          },
        });
      }
      return { status: "NOT_ATTENDING" };
    }

    // 5. Handle "YES" (Registering)
    
    // Determine Target Status based on Capacity
    let targetStatus: RegistrationStatus = "REGISTERED";
    let waitlistOrder: number | null = null;

    if (event.registrationMax !== null) {
      const registeredCount = await tx.eventRegistration.count({
        where: { eventId, status: "REGISTERED" },
      });

      // Check if user is ALREADY registered, they take up a slot, so count remains same for them
      const isAlreadyRegistered = currentReg?.status === "REGISTERED";
      
      if (!isAlreadyRegistered && registeredCount >= event.registrationMax) {
        // Full -> Waitlist
        if (!event.registrationWaitlistEnabled) {
          throw new Error("Event is full and waitlist is disabled.");
        }
        targetStatus = "WAITLISTED";
        
        // Calculate new Waitlist Order (Append to end)
        // We get the max order currently in DB
        const maxOrderAgg = await tx.eventRegistration.aggregate({
          where: { eventId, status: "WAITLISTED" },
          _max: { waitlistOrder: true },
        });
        waitlistOrder = (maxOrderAgg._max.waitlistOrder || 0) + 1;
      }
    }

    // Perform Update or Create
    if (currentReg) {
      // If switching from WAITLISTED to REGISTERED, logic is handled by "targetStatus" calculation above.
      // But usually, you can't jump queue manually unless space is free.
      // The logic above says: if space available -> REGISTERED.
      // If user is currently WAITLISTED and space opened up, they should have been auto-promoted.
      // But if they weren't (race condition), we re-evaluate here.
      
      // Preservation of Waitlist Position:
      // If user is WAITLISTED and stays WAITLISTED, keep order.
      if (currentReg.status === "WAITLISTED" && targetStatus === "WAITLISTED") {
        waitlistOrder = currentReg.waitlistOrder;
      }

      await tx.eventRegistration.update({
        where: { id: currentReg.id },
        data: {
          status: targetStatus,
          waitlistOrder: targetStatus === "WAITLISTED" ? waitlistOrder : null,
          // Reset promotion info if they re-register
          promotedAt: null,
          promotionSource: null,
        },
      });
    } else {
      await tx.eventRegistration.create({
        data: {
          eventId,
          userId,
          status: targetStatus,
          waitlistOrder: targetStatus === "WAITLISTED" ? waitlistOrder : null,
        },
      });
    }

    // Run reconciliation to ensure consistency (e.g. if we just filled the last spot, or if we jumped queue weirdly)
    // Actually, if we just took a spot, reconcile does nothing.
    // If we joined waitlist, reconcile does nothing.
    // But good practice to call it to catch edge cases.
    await reconcileEvent(tx, eventId);

    return { status: targetStatus };
  });
}

/**
 * Admin: Override Registration Status
 * Bypasses dates and enabled checks.
 * Triggers reconciliation.
 */
export async function adminOverrideRegistration(
  adminUserId: string,
  targetUserId: string,
  eventId: string,
  newStatus: RegistrationStatus,
  reason?: string
) {
  return await prisma.$transaction(async (tx) => {
    // Lock Event
    await tx.$executeRaw`SELECT 1 FROM "Event" WHERE id = ${eventId} FOR UPDATE`;

    const currentReg = await tx.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId: targetUserId } },
    });

    // Calculate waitlist order if moving TO waitlist
    let waitlistOrder: number | null = null;
    if (newStatus === "WAITLISTED") {
      if (currentReg?.waitlistOrder) {
        waitlistOrder = currentReg.waitlistOrder;
      } else {
        const maxOrder = await tx.eventRegistration.aggregate({
          where: { eventId, status: "WAITLISTED" },
          _max: { waitlistOrder: true },
        });
        waitlistOrder = (maxOrder._max.waitlistOrder || 0) + 1;
      }
    }

    const data: Prisma.EventRegistrationUncheckedCreateInput = {
      eventId,
      userId: targetUserId,
      status: newStatus,
      waitlistOrder,
      statusReason: reason,
      promotionSource: newStatus === "REGISTERED" && currentReg?.status !== "REGISTERED" ? "ADMIN" : undefined,
      promotedAt: newStatus === "REGISTERED" && currentReg?.status !== "REGISTERED" ? new Date() : undefined,
    };

    if (currentReg) {
      await tx.eventRegistration.update({
        where: { id: currentReg.id },
        data: {
            status: newStatus,
            waitlistOrder: newStatus === "WAITLISTED" ? waitlistOrder : null,
            statusReason: reason,
            promotionSource: data.promotionSource,
            promotedAt: data.promotedAt,
        },
      });
    } else {
      await tx.eventRegistration.create({ data });
    }

    // Audit Log
    await createAuditLog({
      actorUserId: adminUserId,
      actionType: "REGISTRATION_CHANGE",
      entityType: "EVENT_REGISTRATION",
      entityId: currentReg?.id || "NEW",
      targetUserId,
      summary: `Changed registration status for ${targetUserId} to ${newStatus}`,
      metadata: {
        eventId,
        targetUserId,
        oldStatus: currentReg?.status || "NONE",
        newStatus,
        reason,
      },
      before: currentReg ? { status: currentReg.status } : null,
      after: { status: newStatus },
    }, tx);

    // Reconcile: E.g., if Admin removed a REGISTERED user, auto-promote next waitlisted.
    await reconcileEvent(tx, eventId);
  });
}

/**
 * Admin: Reorder Waitlist
 * Sets a specific user's position, shifting others if necessary.
 * Warning: This is a heavy operation if the list is long, but waitlists are usually small.
 */
export async function adminReorderWaitlist(
  eventId: string,
  userId: string,
  newPosition: number
) {
  // TODO: Implement complex reordering if needed.
  // For V1, simplest approach is: swap or insert-and-shift.
  // This is left as a placeholder for specific "Reorder" UI implementation.
  // Ideally, the UI sends the full ordered list of IDs, and we update them all.
}
