import HomePageClient from "@/components/home-page-client"
import { getAllPosts } from "@/lib/news"
import { prisma } from "@/server/db"
import { getNextEventForHomepage } from "@/server/queries/events"
import { Event, EventSeries, Venue } from "@prisma/client"

export default async function Home() {
  const posts = await getAllPosts()
  const upcomingEventsRaw = await getNextEventForHomepage()
  const featuredEvent = upcomingEventsRaw.length > 0 ? upcomingEventsRaw[0] : null
  const upcomingEvents = upcomingEventsRaw.length > 0 ? upcomingEventsRaw.slice(1) : []
  const drivers = await prisma.user.findMany({
    where: { status: { not: "deleted" } },
    orderBy: [{ iRating: { sort: 'desc', nulls: 'last' } }, { displayName: 'asc' }],
  })

  return <HomePageClient
    posts={posts}
    featuredEvent={featuredEvent as Event & { venue: Venue | null; series: EventSeries | null; }}
    upcomingEvents={upcomingEvents as (Event & { venue: Venue | null; series: EventSeries | null; })[]}
    drivers={drivers}
  />
}
