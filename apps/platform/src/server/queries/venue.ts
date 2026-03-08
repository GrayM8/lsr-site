// src/server/queries/venue.ts
import { cache } from 'react';
import { listAllVenues, getVenueById } from '@/server/repos/venue.repo';

export const getAllVenues = cache(async () => {
  return await listAllVenues();
});

export const getVenue = cache(async (id: string) => {
  return await getVenueById(id);
});
