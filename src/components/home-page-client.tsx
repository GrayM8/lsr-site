"use client"

import Hero from "@/components/home/Hero"
import NextEvent from "@/components/home/NextEvent"
import WhatWeDo from "@/components/home/WhatWeDo"
import Leaderboard from "@/components/home/Leaderboard"
import Hotlap from "@/components/home/Hotlap"
import SponsorStrip from "@/components/home/SponsorStrip"
import NewsHighlights from "@/components/home/NewsHighlights"
import GalleryRibbon from "@/components/home/GalleryRibbon"
import FinalCta from "@/components/home/FinalCta"
import { type NewsFrontmatter } from "@/lib/news"
import { type Profile } from "@prisma/client"

// This type should be imported from a shared file in a real app
type Event = {
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
  isFeatured?: boolean;
}

type Props = {
  posts: Array<NewsFrontmatter & { slug: string }>
  featuredEvent?: Event
  upcomingEvents: Event[]
  drivers: Profile[]
}

export default function HomePageClient({ posts, featuredEvent, upcomingEvents, drivers }: Props) {
  return (
    <main className="bg-lsr-charcoal text-white overflow-x-clip">
      <Hero />

      {/* Below-hero content */}
      <div className="space-y-10 md:space-y-14 px-6 md:px-8 pb-10 md:pb-14">
        <WhatWeDo index={0} />
        <NextEvent index={1} featuredEvent={featuredEvent} upcomingEvents={upcomingEvents} />
        <Leaderboard index={2} drivers={drivers} />
        <Hotlap index={3} />
        <NewsHighlights index={4} posts={posts} />
        <FinalCta index={5} />
        <GalleryRibbon index={6} />
        <SponsorStrip index={7} />
      </div>
    </main>
  )
}
