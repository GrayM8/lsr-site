import { cache } from 'react';
import { listAllEvents, getAllEventTypes as getAllEventTypesFromRepo } from '@/server/repos/event.repo';

export const getAllEvents = cache(async () => {
  return await listAllEvents();
});

export const getAllEventTypes = cache(async () => {
  return await getAllEventTypesFromRepo();
});