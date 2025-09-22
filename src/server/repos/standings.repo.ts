// src/server/repos/standings.repo.ts
import { prisma } from '@/server/db';
import { listResultsForSession } from './league.repo';

export type Standing = {
  entryId: string;
  entryName: string; // User or Team name
  classId: string;
  className: string;
  points: number;
};

export async function getStandingsForSeason(seasonId: string) {
  const rounds = await prisma.round.findMany({
    where: { seasonId },
    include: { sessions: true },
  });

  const allResults = (
    await Promise.all(
      rounds.flatMap((r) => r.sessions).map((s) => listResultsForSession(s.id)),
    )
  ).flat();

  const standingsByEntry = allResults.reduce<Record<string, Standing>>((acc, result) => {
    if (!result.entry) return acc;

    const entryId = result.entry.id;
    if (!acc[entryId]) {
      acc[entryId] = {
        entryId,
        entryName: result.entry.team?.name ?? result.entry.user?.displayName ?? 'Unknown',
        classId: result.entry.classId,
        className: result.entry.class.name,
        points: 0,
      };
    }
    acc[entryId].points += result.points ?? 0;
    return acc;
  }, {});

  return Object.values(standingsByEntry).sort((a, b) => b.points - a.points);
}
