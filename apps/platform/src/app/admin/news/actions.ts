"use server";

import { requireRole } from "@/server/auth/guards";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/server/audit/log";

export async function deletePost(id: string) {
  const user = await requireRole(['admin', 'officer']);

  await prisma.post.delete({ where: { id } });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "DELETE",
    entityType: "POST",
    entityId: id,
    summary: `Deleted post ${id}`,
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
}
