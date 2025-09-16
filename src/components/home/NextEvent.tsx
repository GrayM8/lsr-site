import Link from "next/link"
import { Button } from "@/components/ui/button"
import SectionReveal from "./SectionReveal"

export default function NextEvent({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-lsr-orange tracking-wide">Next Event</h2>
            <p className="text-white/80 mt-2">Check back later — schedule is being finalized.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="bg-lsr-orange hover:bg-lsr-orange/90"><Link href="/events">View Events</Link></Button>
            <Button variant="outline" className="border-white/20 hover:bg-white/10" asChild><Link href="/about">How to Join</Link></Button>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}
