import HomePageClient from '@/components/home-page-client';
import { getAllPosts } from '@/lib/news';
import { placeholderEvents } from '@/lib/events';
import { prisma } from '@/server/db';

export default async function Home() {
  const posts = getAllPosts();
  const featuredEvent = placeholderEvents.find(e => e.isFeatured);
  const upcomingEvents = placeholderEvents.filter(e => !e.isFeatured);
  const drivers = await prisma.user.findMany({
    where: { status: { not: 'deleted' } },
    orderBy: [{ iRating: 'desc' }, { displayName: 'asc' }],
  });

  return <HomePageClient
    posts={posts}
    featuredEvent={featuredEvent}
    upcomingEvents={upcomingEvents}
    drivers={drivers}
  />;
}