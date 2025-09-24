import { cache } from 'react';
import { listAllEvents, getAllEventTypes as getAllEventTypesFromRepo, listAllEventsForAdmin } from '@/server/repos/event.repo';

export const getAllEvents = cache(async () => {
  return await listAllEvents();
});

export const getAllEventsForAdmin = cache(async () => {
  return await listAllEventsForAdmin();
});

export const getAllEventTypes = cache(async () => {
  return await getAllEventTypesFromRepo();
});