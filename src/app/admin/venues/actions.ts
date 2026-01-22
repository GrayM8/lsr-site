"use server"

import { GeoPoint } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createVenue as createVenueInDb, updateVenue as updateVenueInDb, deleteVenue as deleteVenueInDb } from "@/server/repos/venue.repo";
import { getSessionUser } from "@/server/auth/session";
import { createAuditLog } from "@/server/audit/log";

export async function createVenue(formData: FormData) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to create a venue.");
  }

  const name = formData.get("name") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const addressLine2 = formData.get("addressLine2") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const postalCode = formData.get("postalCode") as string;
  const country = formData.get("country") as string;
  const room = formData.get("room") as string;
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;

  let geo: GeoPoint | undefined = undefined;
  if (latitude && longitude) {
    geo = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
  }

  const venue = await createVenueInDb({
    name,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    room,
    ...(geo && { geo }),
  });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "CREATE",
    entityType: "VENUE",
    entityId: venue.id,
    summary: `Created venue: ${venue.name}`,
    after: { name, addressLine1, city, state },
  });

  revalidatePath("/admin/venues");
  redirect("/admin/venues");
}

export async function updateVenue(id: string, formData: FormData) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to update a venue.");
  }

  const name = formData.get("name") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const addressLine2 = formData.get("addressLine2") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const postalCode = formData.get("postalCode") as string;
  const country = formData.get("country") as string;
  const room = formData.get("room") as string;
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;

  let geo: GeoPoint | undefined = undefined;
  if (latitude && longitude) {
    geo = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
  }

  await updateVenueInDb(id, {
    name,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    room,
    ...(geo && { geo }),
  });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "UPDATE",
    entityType: "VENUE",
    entityId: id,
    summary: `Updated venue: ${name}`,
    after: { name, addressLine1, city, state },
  });

  revalidatePath("/admin/venues");
  redirect("/admin/venues");
}

export async function deleteVenue(id: string) {
  const { user } = await getSessionUser();
  if (!user) {
    throw new Error("You must be logged in to delete a venue.");
  }

  await deleteVenueInDb(id);

  await createAuditLog({
    actorUserId: user.id,
    actionType: "DELETE",
    entityType: "VENUE",
    entityId: id,
    summary: `Deleted venue ${id}`,
  });

  revalidatePath("/admin/venues");
}
