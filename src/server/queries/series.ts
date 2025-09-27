import { cache } from 'react';
import {
  listAllSeries,
  getSeriesById,
  getSeriesBySlug as getSeriesBySlugFromRepo,
} from '@/server/repos/series.repo';

export const getAllSeries = cache(async () => {
  return await listAllSeries();
});

export const getSeries = cache(async (id: string) => {
  return await getSeriesById(id);
});

export const getSeriesBySlug = cache(async (slug: string) => {
  return await getSeriesBySlugFromRepo(slug);
});