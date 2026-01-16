"use server";

import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function updateDriverMapping(id: string, userId: string | null) {
  const { ok } = await requireAdmin();
  if (!ok) throw new Error("Unauthorized");

  await prisma.driverIdentity.update({
    where: { id },
    data: { userId },
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
