import { prisma } from '@/server/db';
import { Prisma } from '@prisma/client';

export type CreateAuditLogParams = {
  actorUserId: string | null;
  actionType: string;
  entityType: string;
  entityId: string;
  targetUserId?: string | null;
  summary: string;
  before?: unknown; // Will be cast to Json
  after?: unknown;  // Will be cast to Json
  metadata?: unknown; // Will be cast to Json
  requestId?: string;
  ip?: string;
  userAgent?: string;
};

export async function createAuditLog(params: CreateAuditLogParams, tx?: Prisma.TransactionClient) {
  try {
    const {
      actorUserId,
      actionType,
      entityType,
      entityId,
      targetUserId,
      summary,
      before,
      after,
      metadata,
      requestId,
      ip,
      userAgent,
    } = params;

    const db = tx || prisma;

    await db.auditLog.create({
      data: {
        actorUserId,
        actionType,
        entityType,
        entityId,
        targetUserId,
        summary,
        before: before as Prisma.InputJsonValue,
        after: after as Prisma.InputJsonValue,
        metadata: metadata as Prisma.InputJsonValue,
        requestId,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Silent fail to not block the main action, but should ideally be monitored
  }
}