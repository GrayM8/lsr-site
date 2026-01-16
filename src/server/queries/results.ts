import { prisma } from "@/server/db";

export async function getIngestedResultsByEventId(eventId: string) {
  return prisma.raceSession.findMany({
    where: {
      eventId,
    },
    include: {
      participants: {
        include: {
          results: true,
        },
      },
      results: {
        include: {
          participant: {
            include: {
              user: true,
              carMapping: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      startedAt: "desc",
    },
  });
}
