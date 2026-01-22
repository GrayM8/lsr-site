"use server";

import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/server/audit/log";
import { getSessionUser } from "@/server/auth/session";

export async function updateDriverMapping(id: string, userId: string | null) {
  const { ok } = await requireAdmin();
  const { user } = await getSessionUser();
  if (!ok || !user) throw new Error("Unauthorized");

  const identity = await prisma.driverIdentity.update({
    where: { id },
    data: { userId },
  });

  // Cascade update to existing race participants for this driver
  await prisma.raceParticipant.updateMany({
    where: { driverGuid: identity.driverGuid },
    data: { userId },
  });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "UPDATE",
    entityType: "DRIVER_IDENTITY",
    entityId: id,
    targetUserId: userId,
    summary: `Mapped driver GUID ${identity.driverGuid} to user ${userId || "NULL"}`,
    after: { userId },
  });

  revalidatePath("/admin/drivers");
}

export async function searchUsers(query: string) {
    const { ok } = await requireAdmin();
    if (!ok) throw new Error("Unauthorized");
    
    if (!query || query.length < 2) return [];
    
    return prisma.user.findMany({
        where: {
            OR: [
                { displayName: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { handle: { contains: query, mode: "insensitive" } }
            ]
        },
        take: 10,
        select: { id: true, displayName: true, email: true, handle: true, avatarUrl: true }
    });
}
