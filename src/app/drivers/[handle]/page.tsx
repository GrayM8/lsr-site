import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const revalidate = 60

type RouteParams = { handle: string }

export default async function DriverProfilePage({
                                                  params,
                                                }: { params: Promise<RouteParams> }) {
  const { handle } = await params

  const driver = await prisma.driver.findUnique({
    where: { handle },
  })

  if (!driver) return notFound()

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-6">
      <Link href="/drivers" className="text-sm underline">&larr; Back to Drivers</Link>

      <header className="flex items-center gap-5">
        {driver.headshotUrl ? (
          <Image
            src={driver.headshotUrl}
            alt={`${driver.fullName} headshot`}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-muted" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{driver.fullName}</h1>
          <p className="text-muted-foreground">@{driver.handle}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">iRating</div>
          <div className="text-xl font-semibold">{driver.iRating ?? "—"}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">Total wins</div>
          <div className="text-xl font-semibold">{driver.totalWins}</div>
        </div>
      </section>

      {/* Room for bio, socials, car/class prefs later */}
    </main>
  )
}
