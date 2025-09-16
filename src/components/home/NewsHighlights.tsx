import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function NewsHighlights({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Latest News</h2>
        <Link href="/news" className="text-sm underline hover:no-underline">All news</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Link key={i} href="/news" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
            <div className="text-xs text-white/60 mb-1">Announcement</div>
            <div className="font-semibold">Post title coming soon</div>
            <div className="text-white/70 text-sm mt-1">Short excerpt placeholder…</div>
          </Link>
        ))}
      </div>
    </SectionReveal>
  )
}
