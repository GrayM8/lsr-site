import HomePageClient from "@/components/home-page-client"
import { getAllPosts } from "@/lib/news"
import { prisma } from "@/server/db"
import { getNextEventForHomepage } from "@/server/queries/events"
import { Event, EventSeries, Venue } from "@prisma/client"
import { Metadata } from "next"

// Function to get the cache-busting parameter
const getCacheBuster = () => {
  const date = new Date()
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: `/api/og?v=${getCacheBuster()}`,
        width: 1200,
        height: 630,
        alt: "Longhorn Sim Racing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/api/og?v=${getCacheBuster()}`,
        width: 1200,
        height: 630,
        alt: "Longhorn Sim Racing",
      },
    ],
  },
}

export default async function Home() {
  const posts = getAllPosts()
  const upcomingEventsRaw = await getNextEventForHomepage()
  const featuredEvent = upcomingEventsRaw.length > 0 ? upcomingEventsRaw[0] : null
  const upcomingEvents = upcomingEventsRaw.length > 0 ? upcomingEventsRaw.slice(1) : []
  const drivers = await prisma.user.findMany({
    where: { status: { not: "deleted" } },
    orderBy: [{ iRating: "desc" }, { displayName: "asc" }],
  })

  return <HomePageClient
    posts={posts}
    featuredEvent={featuredEvent as Event & { venue: Venue | null; series: EventSeries | null; }}
    upcomingEvents={upcomingEvents as (Event & { venue: Venue | null; series: EventSeries | null; })[]}
    drivers={drivers}
  />
}
