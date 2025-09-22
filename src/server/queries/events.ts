// src/server/queries/events.ts
import { listUpcomingEvents, getEventBySlug } from '@/server/repos/event.repo';
import { cache } from 'react';

export const getUpcomingEvents = cache(async (limit = 10) => {
  return listUpcomingEvents(limit);
});

export const getEventPage = cache(async (slug: string) => {
  const event = await getEventBySlug(slug);
  if (!event) {
    return null;
  }
  // In a real app, you might fetch additional data for the page here
  return event;
});
