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

  const event = await prisma.event.create({
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
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
