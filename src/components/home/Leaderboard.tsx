import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function Leaderboard({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Leaderboard (This Month)</h2>
          <Link href="/drivers" className="text-sm underline hover:no-underline">Full standings</Link>
        </div>
        <ul className="mt-4 grid gap-2 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className={`flex justify-between ${i < 4 ? "border-b border-white/10" : ""} py-2`}>
              <span>{i + 1}. TBD</span><span>—</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionReveal>
  )
}
