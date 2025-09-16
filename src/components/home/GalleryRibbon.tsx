import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function GalleryRibbon({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-lg border border-white/10 bg-white/[0.06]" />
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/about" className="text-sm underline hover:no-underline">See more</Link>
        </div>
      </div>
    </SectionReveal>
  )
}
