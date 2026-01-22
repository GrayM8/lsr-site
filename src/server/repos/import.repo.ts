// src/server/repos/import.repo.ts
import { prisma } from '@/server/db';
import { Prisma, ResultSource } from '@prisma/client';
import { createAuditLog } from '@/server/audit/log';

export async function recordProvenance(
  source: ResultSource,
  payloadSha256: string,
  createdById: string,
  notes?: string,
) {
  const provenance = await prisma.provenance.create({
    data: {
      source,
      payloadSha256,
      createdById,
      notes,
    },
  });

  await createAuditLog({
    actorUserId: createdById,
    actionType: 'IMPORT',
    entityType: 'PROVENANCE',
    entityId: provenance.id,
    summary: `Imported results via ${source}`,
    after: provenance,
  });

  return provenance;
}

export async function attachArtifact(
  provenanceId: string,
  storageUrl: string,
  contentType: string,
  bytes: number,
  createdById: string,
) {
  const artifact = await prisma.importArtifact.create({
    data: {
      provenanceId,
      storageUrl,
      contentType,
      bytes,
      createdById,
    },
  });

  await createAuditLog({
    actorUserId: createdById,
    actionType: 'CREATE',
    entityType: 'IMPORT_ARTIFACT',
    entityId: artifact.id,
    summary: `Attached artifact: ${storageUrl}`,
  });

  return artifact;
}

export async function upsertResult(
  sessionId: string,
  entryId: string,
  data: Omit<Prisma.ResultUncheckedCreateInput, 'sessionId' | 'entryId'>,
  actorId: string,
) {
  const result = await prisma.result.upsert({
    where: {
      sessionId_entryId: {
        sessionId,
        entryId,
      },
    },
    update: data,
    create: {
      sessionId,
      entryId,
      ...data,
    },
  });

  await createAuditLog({
    actorUserId: actorId,
    actionType: 'UPDATE',
    entityType: 'RESULT',
    entityId: result.id,
    summary: `Upserted race result for entry ${entryId}`,
    after: data,
  });

  return result;
}
