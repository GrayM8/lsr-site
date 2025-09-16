"use client"

import Hero from "@/components/home/Hero"
import NextEvent from "@/components/home/NextEvent"
import WhatWeDo from "@/components/home/WhatWeDo"
import Leaderboard from "@/components/home/Leaderboard"
import Hotlap from "@/components/home/Hotlap"
import SchedulePreview from "@/components/home/SchedulePreview"
import SponsorStrip from "@/components/home/SponsorStrip"
import JoinSteps from "@/components/home/JoinSteps"
import NewsHighlights from "@/components/home/NewsHighlights"
import GalleryRibbon from "@/components/home/GalleryRibbon"
import FinalCta from "@/components/home/FinalCta"
import FooterFade from "@/components/home/FooterFade"

export default function Home() {
  return (
    <main className="bg-lsr-charcoal text-white overflow-x-clip">
      <Hero />

      {/* Below-hero content */}
      <div className="space-y-10 md:space-y-14 px-6 md:px-8">
        <NextEvent index={0} />
        <WhatWeDo index={1} />
        <Leaderboard index={2} />
        <Hotlap index={3} />
        <SchedulePreview index={4} />
        <SponsorStrip index={5} />
        <JoinSteps index={6} />
        <NewsHighlights index={7} />
        <GalleryRibbon index={8} />
        <FinalCta index={9} />
      </div>

      {/* Full-bleed fade into the footer (outside the padded wrapper) */}
      <FooterFade className="mt-10 md:mt-14" bleed={false} height="h-28 md:h-36" />
    </main>
  )
}
