import HomePageClient from '@/components/home-page-client';
import { getAllPosts } from '@/lib/news';
import { prisma } from '@/server/db';
import { listUpcomingEvents } from '@/server/repos/event.repo';
import { Event, Venue, EventSeries } from "@prisma/client";

export default async function Home() {
  const posts = getAllPosts();
  const upcomingEventsRaw = await listUpcomingEvents(5);
  const featuredEvent = upcomingEventsRaw[0];
  const upcomingEvents = upcomingEventsRaw.slice(1);
  const drivers = await prisma.user.findMany({
    where: { status: { not: 'deleted' } },
    orderBy: [{ iRating: 'desc' }, { displayName: 'asc' }],
  });

  

  return <HomePageClient
    posts={posts}
    featuredEvent={featuredEvent as Event & { venue: Venue | null; series: EventSeries | null; }}
    upcomingEvents={upcomingEvents as (Event & { venue: Venue | null; series: EventSeries | null; })[]}
    drivers={drivers}
  />;
}
