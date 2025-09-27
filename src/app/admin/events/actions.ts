"use server"

import { prisma } from "@/server/db";
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

  const event = await prisma.event.create({
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      seriesId: seriesId === "" ? null : seriesId,
      venueId: venueId === "" ? null : venueId,
      startsAtUtc: new Date(formData.get("startsAtUtc") as string),
      endsAtUtc: new Date(formData.get("endsAtUtc") as string),
      timezone: formData.get("timezone") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      heroImageUrl: formData.get("heroImageUrl") as string,
      status: "draft",
      visibility: "public",
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

  await prisma.event.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      seriesId: seriesId === "" ? null : seriesId,
      venueId: venueId === "" ? null : venueId,
      startsAtUtc: new Date(formData.get("startsAtUtc") as string),
      endsAtUtc: new Date(formData.get("endsAtUtc") as string),
      timezone: formData.get("timezone") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      heroImageUrl: formData.get("heroImageUrl") as string,
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
