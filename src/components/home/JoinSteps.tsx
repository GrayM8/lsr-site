import Link from "next/link"
import { Button } from "@/components/ui/button"
import SectionReveal from "./SectionReveal"

export default function JoinSteps({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Join the Grid</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
          <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="font-semibold">1) Join Discord</div>
            <p className="text-white/75">Meet the team and get announcements.</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="font-semibold">2) Attend a practice</div>
            <p className="text-white/75">Weekly sessions for all levels.</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="font-semibold">3) Get race-ready</div>
            <p className="text-white/75">Setup, etiquette, and licensing.</p>
          </li>
        </ol>
        <div className="mt-4 flex gap-3">
          <Button asChild className="bg-lsr-orange hover:bg-lsr-orange/90"><Link href="https://discord.gg/5Uv9YwpnFz" target="_blank">Join Discord</Link></Button>
          <Button variant="outline" className="border-white/20 hover:bg-white/10" asChild><Link href="/events">See Events</Link></Button>
        </div>
      </div>
    </SectionReveal>
  )
}
