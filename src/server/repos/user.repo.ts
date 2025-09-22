// src/server/repos/user.repo.ts
import { prisma } from '@/server/db';
import { logAudit } from '@/server/audit/log';

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      roles: { include: { role: true } },
      entitlements: true,
    },
  });
}

export async function assignRole(userId: string, roleKey: string, actorId: string) {
  const role = await prisma.role.findUnique({ where: { key: roleKey } });
  if (!role) {
    throw new Error(`Role with key "${roleKey}" not found.`);
  }

  const result = await prisma.userRole.create({
    data: {
      userId,
      roleId: role.id,
    },
  });

  await logAudit({
    actorUserId: actorId,
    action: 'update',
    entityType: 'User',
    entityId: userId,
    metaJson: JSON.stringify({ assignedRole: roleKey }),
  });

  return result;
}
