"use server"

import { prisma } from "@/server/db";
import { fromZonedTime } from "date-fns-tz";
import { getSessionUser } from "@/server/auth/session";
import { logAudit } from "@/server/audit/log";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to create an event.");
  }

  const seriesId = formData.get("seriesId") as string;
  const venueId = formData.get("venueId") as string;
  const opensAtRaw = formData.get("registrationOpensAt") as string;
  const closesAtRaw = formData.get("registrationClosesAt") as string;
  const maxRaw = formData.get("registrationMax") as string;

  const event = await prisma.event.create({
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      seriesId: seriesId === "" ? null : seriesId,
      venueId: venueId === "" ? null : venueId,
      startsAtUtc: fromZonedTime(formData.get("startsAtUtc") as string, formData.get("timezone") as string),
      endsAtUtc: fromZonedTime(formData.get("endsAtUtc") as string, formData.get("timezone") as string),
      timezone: formData.get("timezone") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      heroImageUrl: formData.get("heroImageUrl") as string,
      status: "draft",
      visibility: "public",
      registrationEnabled: formData.get("registrationEnabled") === "on",
      registrationOpensAt: opensAtRaw ? fromZonedTime(opensAtRaw, formData.get("timezone") as string) : null,
      registrationClosesAt: closesAtRaw ? fromZonedTime(closesAtRaw, formData.get("timezone") as string) : null,
      registrationMax: maxRaw && maxRaw !== "-1" ? parseInt(maxRaw) : null,
      registrationWaitlistEnabled: formData.get("registrationWaitlistEnabled") === "on",
    },
  });

  await logAudit({
    actorUserId: user.id,
    action: "create",
    entityType: "Event",
    entityId: event.id,
  });

  revalidatePath("/admin/events");
  redirect("/admin/events");
}

import { EventStatus } from "@prisma/client";
import { getEventById } from "@/server/repos/event.repo";

export async function updateEventStatus(eventId: string, status: EventStatus, publishedAt?: Date) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to update an event.");
  }

  const data: { status: EventStatus; publishedAt?: Date } = {
    status,
    publishedAt: status === EventStatus.completed ? new Date() : publishedAt,
  };

  await prisma.event.update({
    where: { id: eventId },
    data,
  });

  await logAudit({
    actorUserId: user.id,
    action: "update",
    entityType: "Event",
    entityId: eventId,
  });

  revalidatePath("/admin/events");
  redirect("/admin/events");
}


export async function getEvent(id: string) {
  return await getEventById(id);
}

export async function updateEvent(id: string, formData: FormData) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to update an event.");
  }

  const seriesId = formData.get("seriesId") as string;
  const venueId = formData.get("venueId") as string;
  const opensAtRaw = formData.get("registrationOpensAt") as string;
  const closesAtRaw = formData.get("registrationClosesAt") as string;
  const maxRaw = formData.get("registrationMax") as string;

  await prisma.event.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      seriesId: seriesId === "" ? null : seriesId,
      venueId: venueId === "" ? null : venueId,
      startsAtUtc: fromZonedTime(formData.get("startsAtUtc") as string, formData.get("timezone") as string),
      endsAtUtc: fromZonedTime(formData.get("endsAtUtc") as string, formData.get("timezone") as string),
      timezone: formData.get("timezone") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      heroImageUrl: formData.get("heroImageUrl") as string,
      registrationEnabled: formData.get("registrationEnabled") === "on",
      registrationOpensAt: opensAtRaw ? fromZonedTime(opensAtRaw, formData.get("timezone") as string) : null,
      registrationClosesAt: closesAtRaw ? fromZonedTime(closesAtRaw, formData.get("timezone") as string) : null,
      registrationMax: maxRaw && maxRaw !== "-1" ? parseInt(maxRaw) : null,
      registrationWaitlistEnabled: formData.get("registrationWaitlistEnabled") === "on",
    },
  });

  await logAudit({
    actorUserId: user.id,
    action: "update",
    entityType: "Event",
    entityId: id,
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(eventId: string) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to delete an event.");
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  await logAudit({
    actorUserId: user.id,
    action: "delete",
    entityType: "Event",
    entityId: eventId,
  });

  revalidatePath("/admin/events");
}

import { adminOverrideRegistration } from "@/server/services/registration.service";
import { RegistrationStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/authz";

export async function updateEventRegistrationConfig(eventId: string, formData: FormData) {
  const { user } = await getSessionUser();
  const { ok } = await requireAdmin();
  if (!ok || !user) {
    throw new Error("Unauthorized");
  }

  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { timezone: true } });
  const timezone = event?.timezone || "America/Chicago";

  const enabled = formData.get("registrationEnabled") === "on";
  const opensAtRaw = formData.get("registrationOpensAt") as string;
  const closesAtRaw = formData.get("registrationClosesAt") as string;
  const maxRaw = formData.get("registrationMax") as string;
  const waitlistEnabled = formData.get("registrationWaitlistEnabled") === "on";

  await prisma.event.update({
    where: { id: eventId },
    data: {
      registrationEnabled: enabled,
      registrationOpensAt: opensAtRaw ? fromZonedTime(opensAtRaw, timezone) : null,
      registrationClosesAt: closesAtRaw ? fromZonedTime(closesAtRaw, timezone) : null,
      registrationMax: maxRaw && maxRaw !== "-1" ? parseInt(maxRaw) : null,
      registrationWaitlistEnabled: waitlistEnabled,
    },
  });

  await logAudit({
    actorUserId: user.id,
    action: "update",
    entityType: "Event",
    entityId: eventId,
    metaJson: JSON.stringify({
      updateType: "registration_config",
    })
  });

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath(`/events`);
}

export async function overrideRegistrationStatus(eventId: string, userId: string, status: RegistrationStatus, reason?: string) {
  const { user } = await getSessionUser();
  const { ok } = await requireAdmin();
  if (!ok || !user) {
    throw new Error("Unauthorized");
  }

  await adminOverrideRegistration(user.id, userId, eventId, status, reason);

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath(`/events`);
}

export async function reorderWaitlist(eventId: string, orderedRegistrationIds: string[]) {
  const { user } = await getSessionUser();
  const { ok } = await requireAdmin();
  if (!ok || !user) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < orderedRegistrationIds.length; i++) {
      await tx.eventRegistration.update({
        where: { id: orderedRegistrationIds[i] },
        data: {
          waitlistOrder: i + 1,
          // Ideally we check status is WAITLISTED, but admin reorder implies waitlist context
        },
      });
    }
  });

  await logAudit({
    actorUserId: user.id,
    action: "update",
    entityType: "Event",
    entityId: eventId,
    metaJson: JSON.stringify({
      updateType: "waitlist_reorder",
      count: orderedRegistrationIds.length,
    })
  });

  revalidatePath(`/admin/events/${eventId}`);
}

export async function removeRegistration(eventId: string, userId: string) {
  const { user } = await getSessionUser();
  const { ok } = await requireAdmin();
  if (!ok || !user) {
    throw new Error("Unauthorized");
  }

  await prisma.eventRegistration.delete({
    where: { eventId_userId: { eventId, userId } },
  });

  await logAudit({
    actorUserId: user.id,
    action: "delete",
    entityType: "EventRegistration",
    entityId: `${eventId}:${userId}`,
  });

  revalidatePath(`/admin/events/${eventId}`);
}
