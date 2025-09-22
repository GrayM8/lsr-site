// src/server/repos/import.repo.ts
import { prisma } from '@/server/db';
import { Prisma, ResultSource } from '@prisma/client';
import { logAudit } from '@/server/audit/log';

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

  await logAudit({
    actorUserId: createdById,
    action: 'import', // Or a more specific action
    entityType: 'Provenance',
    entityId: provenance.id,
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

  await logAudit({
    actorUserId: createdById,
    action: 'create', // Or a more specific action
    entityType: 'ImportArtifact',
    entityId: artifact.id,
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

  await logAudit({
    actorUserId: actorId,
    action: 'update', // upsert is a form of update
    entityType: 'Result',
    entityId: result.id,
    diffJson: JSON.stringify(data),
  });

  return result;
}
