import Link from "next/link"
import { Button } from "@/components/ui/button"
import SectionReveal from "./SectionReveal"

export default function FinalCta({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14 mb-20" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 flex flex-col items-center text-center gap-4">
        <h2 className="font-display text-3xl md:text-4xl text-lsr-orange tracking-wide">Start your first session this week</h2>
        <p className="text-white/80">Join the community and get on the grid.</p>
        <div className="flex gap-3">
          <Button asChild className="bg-lsr-orange hover:bg-lsr-orange/90"><Link href="https://discord.gg/5Uv9YwpnFz" target="_blank">Join Discord</Link></Button>
          <Button variant="outline" className="border-white/20 hover:bg-white/10" asChild><Link href="/events">See Events</Link></Button>
        </div>
      </div>
    </SectionReveal>
  )
}
