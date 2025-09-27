import { cache } from 'react';
import { getStandings as getStandingsFromRepo } from '@/server/repos/standings.repo';

export const getStandings = cache(async (seriesSlug: string) => {
  return await getStandingsFromRepo(seriesSlug);
});
