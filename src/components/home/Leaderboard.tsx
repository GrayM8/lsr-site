import Link from "next/link"
import SectionReveal from "./SectionReveal"
import { type User } from '@prisma/client';
import Image from "next/image"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  index: number;
  drivers: User[];
};

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
        <div className="mt-4 -mx-4 md:-mx-8">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th className="px-4 md:px-8 py-2 text-left font-normal w-12 md:w-16">Rank</th>
                <th className="px-4 md:px-8 py-2 text-left font-normal">Driver</th>
                <th className="px-4 md:px-8 py-2 text-right font-normal">iRating</th>
              </tr>
            </thead>
            <tbody>
              {drivers.slice(0, 3).map((driver, i) => {
                const initials = driver.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()

                return (
                  <tr key={driver.id} className="border-b border-white/10 last:border-b-0">
                    <td className="px-4 md:px-8 py-2 text-center text-base md:text-lg font-bold text-white/60">{i + 1}</td>
                    <td className="px-4 md:px-8 py-2">
                      <Link href={`/drivers/${driver.handle}`} className="flex items-center gap-2 group">
                        <div
                          className="h-6 w-6 md:h-8 md:w-8 overflow-hidden rounded-full border border-white/10 bg-lsr-charcoal-darker flex-shrink-0">
                          {driver.avatarUrl ? (
                            <Image
                              src={driver.avatarUrl}
                              alt=""
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] md:text-xs">
                              {initials || "U"}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium group-hover:underline truncate">{driver.displayName}</span>
                          <Trophy className={cn("h-4 w-4", trophyColors[i])} />
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 md:px-8 py-2 text-right font-semibold">{driver.iRating}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SectionReveal>
  )
}
