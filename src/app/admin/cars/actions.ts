"use server";

import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/server/audit/log";
import { getSessionUser } from "@/server/auth/session";

export async function updateCarMapping(id: string, displayName: string, secondaryDisplayName: string | null) {
  const { ok } = await requireAdmin();
  const { user } = await getSessionUser();
  if (!ok || !user) throw new Error("Unauthorized");

  await prisma.carMapping.update({
    where: { id },
    data: { 
        displayName,
        secondaryDisplayName: secondaryDisplayName || null 
    },
  });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "UPDATE",
    entityType: "CAR_MAPPING",
    entityId: id,
    summary: `Updated car mapping for ${displayName}`,
    after: { displayName, secondaryDisplayName },
  });

  revalidatePath("/admin/cars");
}

export async function createCarMapping(gameCarName: string, displayName: string, secondaryDisplayName: string | null) {
  const { ok } = await requireAdmin();
  const { user } = await getSessionUser();
  if (!ok || !user) throw new Error("Unauthorized");

  const carMapping = await prisma.carMapping.create({
    data: {
      gameCarName,
      displayName,
      secondaryDisplayName: secondaryDisplayName || null,
    },
  });

  // Cascade: Link existing participants to this new mapping
  await prisma.raceParticipant.updateMany({
    where: { carName: gameCarName },
    data: { carMappingId: carMapping.id },
  });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "CREATE",
    entityType: "CAR_MAPPING",
    entityId: carMapping.id,
    summary: `Created car mapping for ${gameCarName}`,
    after: { gameCarName, displayName, secondaryDisplayName },
  });

  revalidatePath("/admin/cars");
}

export async function getUnmappedCarNames() {
    const { ok } = await requireAdmin();
    if (!ok) return []; // Or throw

    // distinct carNames where carMappingId is null
    const results = await prisma.raceParticipant.findMany({
        where: { carMappingId: null },
        select: { carName: true },
        distinct: ['carName'],
        orderBy: { carName: 'asc' }
    });

    return results.map(r => r.carName);
}