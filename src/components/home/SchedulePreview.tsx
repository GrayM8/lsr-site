import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function SchedulePreview({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Upcoming</h2>
          <Link href="/events" className="text-sm underline hover:no-underline">Full schedule</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs text-white/60">TBD</div>
              <div className="font-medium">Check back later</div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}
