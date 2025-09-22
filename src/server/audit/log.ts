// src/server/audit/log.ts
import { prisma } from '@/server/db';
import { AuditLog } from '@prisma/client';

type AuditLogInput = {
  actorUserId?: string;
  entityType: AuditLog['entityType'];
  entityId: string;
  action: AuditLog['action'];
  diffJson?: string;
  metaJson?: string;
};

export async function logAudit(data: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: data.actorUserId,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        diffJson: data.diffJson,
        metaJson: data.metaJson,
      },
    });
  } catch (error) {
    console.error('Failed to write to audit log:', error);
    // In a production app, you might want to send this to a more robust logging service.
  }
}
