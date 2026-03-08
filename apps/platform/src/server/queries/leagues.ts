// src/server/queries/leagues.ts
import { getLeagueBySlug, listSeasonsForLeague, listRoundsWithEvents } from '@/server/repos/league.repo';
import { getStandingsForSeason } from '@/server/repos/standings.repo';
import { cache } from 'react';

export const getLeaguePage = cache(async (slug: string) => {
  const league = await getLeagueBySlug(slug);
  if (!league) {
    return null;
  }

  const seasons = await listSeasonsForLeague(league.id);
  const currentSeason = seasons[0]; // Assume latest is current

  let rounds: Awaited<ReturnType<typeof listRoundsWithEvents>> = [];
  let standings: Awaited<ReturnType<typeof getStandingsForSeason>> = [];

  if (currentSeason) {
    rounds = await listRoundsWithEvents(currentSeason.id);
    standings = await getStandingsForSeason(currentSeason.id);
  }

  return {
    league,
    seasons,
    currentSeason,
    upcomingRounds: rounds.filter(r => r.event && r.event.startsAtUtc > new Date()),
    standings: standings.slice(0, 10), // Top 10 standings
  };
});
