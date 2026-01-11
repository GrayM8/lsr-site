import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function WhatWeDo({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-none">
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/events" className="group relative border-l-2 border-lsr-orange/30 bg-white/5 p-8 hover:bg-white/10 transition-all hover:border-lsr-orange">
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-white/50 group-hover:text-lsr-orange transition-colors">01. Compete</h2>
          <p className="font-sans font-medium text-2xl text-white mt-4 leading-tight">League races, endurance, and time trials.</p>
          <div className="mt-6 h-px w-12 bg-white/10 group-hover:w-full transition-all duration-500" />
        </Link>
        <Link href="/drivers" className="group relative border-l-2 border-lsr-orange/30 bg-white/5 p-8 hover:bg-white/10 transition-all hover:border-lsr-orange">
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-white/50 group-hover:text-lsr-orange transition-colors">02. Develop</h2>
          <p className="font-sans font-medium text-2xl text-white mt-4 leading-tight">Coaching, telemetry reviews, and hotlap labs.</p>
          <div className="mt-6 h-px w-12 bg-white/10 group-hover:w-full transition-all duration-500" />
        </Link>
        <Link href="/about" className="group relative border-l-2 border-lsr-orange/30 bg-white/5 p-8 hover:bg-white/10 transition-all hover:border-lsr-orange">
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-white/50 group-hover:text-lsr-orange transition-colors">03. Community</h2>
          <p className="font-sans font-medium text-2xl text-white mt-4 leading-tight">Sim nights, workshops, and campus meetups.</p>
          <div className="mt-6 h-px w-12 bg-white/10 group-hover:w-full transition-all duration-500" />
        </Link>
      </div>
    </SectionReveal>
  )
}
