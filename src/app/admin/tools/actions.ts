"use server";

import { prisma } from "@/server/db";
import { requireOfficer } from "@/server/auth/guards";
import { createAuditLog } from "@/server/audit/log";

export async function getLeorgeGawrenceEnforcementUnitStatus() {
  const flag = await prisma.featureFlag.findUnique({
    where: { key: "leorge-gawrence-enforcement-unit" },
  });
  return flag?.enabled ?? false;
}

export async function setLeorgeGawrenceEnforcementUnitStatus(enabled: boolean) {
  const user = await requireOfficer();

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
