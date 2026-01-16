import { prisma } from "@/server/db";

export async function getAllSeasons() {
  return prisma.season.findMany({
    orderBy: { startAt: "desc" },
    include: {
      series: true,
    },
  });
}

export async function getSeasonById(id: string) {
  return prisma.season.findUnique({
    where: { id },
    include: {
      series: true,
    },
  });
}
