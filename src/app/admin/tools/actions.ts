"use server";

import { prisma } from "@/server/db";
import { requireAdmin } from "@/lib/authz";
import { createAuditLog } from "@/server/audit/log";
import { getSessionUser } from "@/server/auth/session";

export async function getLeorgeGawrenceEnforcementUnitStatus() {
  const flag = await prisma.featureFlag.findUnique({
    where: { key: "leorge-gawrence-enforcement-unit" },
  });
  return flag?.enabled ?? false;
}

export async function setLeorgeGawrenceEnforcementUnitStatus(enabled: boolean) {
  const { ok } = await requireAdmin();
  const { user } = await getSessionUser();
  if (!ok || !user) throw new Error("Unauthorized");

  await prisma.featureFlag.upsert({
    where: { key: "leorge-gawrence-enforcement-unit" },
    update: { enabled },
    create: { key: "leorge-gawrence-enforcement-unit", enabled },
  });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "UPDATE",
    entityType: "FEATURE_FLAG",
    entityId: "leorge-gawrence-enforcement-unit",
    summary: `Set Leorge Gawrence Enforcement Unit status to ${enabled}`,
    after: { enabled },
  });
}