"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSeries as createSeriesInDb, updateSeries as updateSeriesInDb, deleteSeries as deleteSeriesInDb } from "@/server/repos/series.repo";
import { getSessionUser } from "@/server/auth/session";
import { logAudit } from "@/server/audit/log";

export async function createSeries(formData: FormData) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to create a series.");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;

  const series = await createSeriesInDb({
    title,
    slug,
  });

  await logAudit({
    actorUserId: user.id,
    action: "create",
    entityType: "EventSeries",
    entityId: series.id,
  });

  revalidatePath("/admin/series");
  redirect("/admin/series");
}

export async function updateSeries(id: string, formData: FormData) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to update a series.");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;

  await updateSeriesInDb(id, {
    title,
    slug,
  });

  await logAudit({
    actorUserId: user.id,
    action: "update",
    entityType: "EventSeries",
    entityId: id,
  });

  revalidatePath("/admin/series");
  redirect("/admin/series");
}

export async function deleteSeries(id: string) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to delete a series.");
  }

  await deleteSeriesInDb(id);

  await logAudit({
    actorUserId: user.id,
    action: "delete",
    entityType: "EventSeries",
    entityId: id,
  });

  revalidatePath("/admin/series");
}
