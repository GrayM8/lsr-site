import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function SponsorStrip({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Partners</h2>
          <Link href="/sponsors" className="text-sm underline hover:no-underline">Become a sponsor</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg border border-white/10 bg-white/5 opacity-70 hover:opacity-100 transition" />
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}
