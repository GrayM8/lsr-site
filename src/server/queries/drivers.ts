import { prisma } from "@/server/db";

export async function getDriverStats(handle: string) {
  const user = await prisma.user.findUnique({
    where: { handle },
    include: { roles: { include: { role: true } } },
  });
  if (!user) return null;

  const now = new Date();

  // 1. Current Season Entry
  // Find a season that is active now.
  const currentSeason = await prisma.season.findFirst({
      where: {
          startAt: { lte: now },
          endAt: { gte: now },
      }
  });

  let currentEntry = null;
  if (currentSeason) {
      currentEntry = await prisma.entry.findFirst({
        where: {
          userId: user.id,
          seasonId: currentSeason.id
        },
        include: { season: true },
      });
  }

  // 2. All Time Aggregates
  const allEntries = await prisma.entry.findMany({
    where: { userId: user.id },
  });

  const allTimeStats = allEntries.reduce(
    (acc, entry) => ({
      points: acc.points + entry.totalPoints,
      top10: acc.top10 + entry.top10,
      starts: acc.starts + entry.starts,
      wins: acc.wins + entry.wins,
      podiums: acc.podiums + entry.podiums,
    }),
    { points: 0, top10: 0, starts: 0, wins: 0, podiums: 0 }
  );

  // 3. Race History
  const raceHistory = await prisma.raceResult.findMany({
    where: {
      participant: {
        userId: user.id,
      },
      session: {
        sessionType: "RACE",
      },
    },
    include: {
      session: {
        include: {
          event: true,
        },
      },
      participant: {
        include: {
          carMapping: true,
        },
      },
    },
    orderBy: [
      {
        session: {
          event: {
            startsAtUtc: "desc",
          },
        },
      },
      {
        session: {
          startedAt: "desc",
        },
      },
    ],
  });

  // 4. Event History (Attendance)
  const eventHistory = await prisma.eventAttendance.findMany({
      where: { userId: user.id },
      include: { 
          event: true 
      },
      orderBy: {
          event: { startsAtUtc: 'desc' }
      }
  });

  // 5. Total Registrations Count
  const totalRegistrations = await prisma.eventRegistration.count({
      where: { userId: user.id }
  });

  return {
    user,
    currentSeason: currentEntry
      ? {
          name: currentEntry.season.name,
          points: currentEntry.totalPoints,
          top10: currentEntry.top10,
        }
      : null,
    allTime: allTimeStats,
    history: raceHistory,
    eventHistory,
    totalRegistrations,
  };
}
