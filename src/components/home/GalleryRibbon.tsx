import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function GalleryRibbon({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Gallery</h2>
          <Link href="/gallery" className="text-sm underline hover:no-underline">See more</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-lg border border-white/10 bg-white/[0.06]" />
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}
