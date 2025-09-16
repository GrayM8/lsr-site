import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function WhatWeDo({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/events" className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
          <h3 className="font-display text-2xl text-lsr-orange tracking-wide">Compete</h3>
          <p className="text-white/75 mt-2">League races, endurance, time trials.</p>
        </Link>
        <Link href="/drivers" className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
          <h3 className="font-display text-2xl text-lsr-orange tracking-wide">Develop Drivers</h3>
          <p className="text-white/75 mt-2">Coaching, telemetry reviews, hotlap labs.</p>
        </Link>
        <Link href="/about" className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
          <h3 className="font-display text-2xl text-lsr-orange tracking-wide">Community</h3>
          <p className="text-white/75 mt-2">Sim nights, workshops, campus meetups.</p>
        </Link>
      </div>
    </SectionReveal>
  )
}
