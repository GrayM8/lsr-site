
import { prisma } from '@/server/db';

export async function getStandings(seriesSlug: string) {
  const results = await prisma.result.findMany({
    where: {
      session: {
        round: {
          event: {
            series: {
              slug: seriesSlug,
            },
          },
        },
        kind: 'race',
      },
    },
    include: {
      entry: {
        include: {
          user: true,
          car: true,
        },
      },
    },
  });

  const driverStats = new Map<string, {
    driver: { id: string, name: string };
    points: number;
    wins: number;
    podiums: number;
    starts: number;
    car: string | undefined;
  }>();

  for (const result of results) {
    if (!result.entry || !result.entry.user) {
      continue;
    }

    const userId = result.entry.user.id;
    const driverName = result.entry.user.displayName;
    const carName = result.entry.car?.name;

    if (!driverStats.has(userId)) {
      driverStats.set(userId, {
        driver: { id: userId, name: driverName },
        points: 0,
        wins: 0,
        podiums: 0,
        starts: 0,
        car: carName,
      });
    }

    const stats = driverStats.get(userId)!;

    stats.points += result.points ?? 0;
    stats.starts += 1;

    if (result.position === 1) {
      stats.wins += 1;
    }
    if (result.position && result.position <= 3) {
      stats.podiums += 1;
    }
  }

  const standings = Array.from(driverStats.values());

  standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    return b.podiums - a.podiums;
  });

  return standings;
}

export async function getStandingsForSeason(_seasonId: string) {
  // TODO: Implement the logic to fetch and calculate standings for a season.
  return [];
}