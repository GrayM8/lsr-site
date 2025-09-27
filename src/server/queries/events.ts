import { cache } from 'react';
import {
  listAllEvents,
  getAllEventTypes as getAllEventTypesFromRepo,
  listAllEventsForAdmin,
  getAllEventSeries as getAllEventSeriesFromRepo,
  getEventBySlug as getEventBySlugFromRepo,
  getEventById,
} from '@/server/repos/event.repo';

export const getAllEvents = cache(async () => {
  return await listAllEvents();
});

export const getAllEventsForAdmin = cache(async () => {
  return await listAllEventsForAdmin();
});

export const getEventForAdmin = cache(async (id: string) => {
  return await getEventById(id);
});

export const getAllEventTypes = cache(async () => {
  return await getAllEventTypesFromRepo();
});

export const getAllEventSeries = cache(async () => {
  return await getAllEventSeriesFromRepo();
});

export const getEventBySlug = cache(async (slug: string) => {
  return await getEventBySlugFromRepo(slug);
});