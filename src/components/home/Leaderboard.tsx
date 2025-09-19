import Link from "next/link"
import SectionReveal from "./SectionReveal"
import { type Profile } from "@prisma/client"
import Image from "next/image"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  index: number
  drivers: Profile[]
}

export default function Leaderboard({ index, drivers }: Props) {
  const trophyColors = [
    "text-yellow-400", // 1st
    "text-gray-400",   // 2nd
    "text-orange-400", // 3rd
  ]

  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Drivers Podium (This semester)</h2>
          <Link href="/drivers" className="text-sm underline hover:no-underline">Full standings</Link>
        </div>
        <ul className="mt-4 grid gap-2 text-sm">
          {drivers.slice(0, 3).map((driver, i) => {
            const initials = driver.displayName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()

            return (
              <li key={driver.id}
                  className={`flex items-center justify-between gap-4 ${i < 2 ? "border-b border-white/10" : ""} py-2`}>
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-4 text-center text-white/60">{i + 1}</div>
                  <div
                    className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-lsr-charcoal-darker">
                    {driver.avatarUrl ? (
                      <Image
                        src={driver.avatarUrl}
                        alt={driver.displayName}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs">
                        {initials || "U"}
                      </div>
                    )}
                  </div>
                  <Link href={`/drivers/${driver.handle}`} className="hover:underline min-w-0 flex items-center gap-2">
                    <div className="truncate font-medium">{driver.displayName}</div>
                    <Trophy className={cn("h-4 w-4", trophyColors[i])} />
                  </Link>
                </div>
                <div className="font-semibold">{driver.iRating}</div>
              </li>
            )
          })}
        </ul>
      </div>
    </SectionReveal>
  )
}
