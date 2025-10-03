"use server";

import { prisma } from "@/server/db";

export async function getLeorgeGawrenceEnforcementUnitStatus() {
  const flag = await prisma.featureFlag.findUnique({
    where: { key: "leorge-gawrence-enforcement-unit" },
  });
  return flag?.enabled ?? false;
}

export async function setLeorgeGawrenceEnforcementUnitStatus(enabled: boolean) {
  await prisma.featureFlag.upsert({
    where: { key: "leorge-gawrence-enforcement-unit" },
    update: { enabled },
    create: { key: "leorge-gawrence-enforcement-unit", enabled },
  });
}