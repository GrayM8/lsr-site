import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

// export const revalidate = 30
// If you want *always* fresh (great while building), use this instead:
export const dynamic = "force-dynamic"

export default async function DriversIndexPage() {
  const drivers = await prisma.profile.findMany({
    where: { status: { not: "deleted" } },        // hide hard-deleted
    orderBy: [{ iRating: "desc" }, { displayName: "asc" }],
    select: {
      id: true,
      handle: true,
      displayName: true,
      avatarUrl: true,
      iRating: true,
      status: true,
    },
  })

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Drivers</h1>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
        {drivers.map((d) => {
          const initials = d.displayName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()

          return (
            <li key={d.id} className="rounded-xl border p-4 transition hover:shadow-sm">
              <Link href={`/drivers/${d.handle}`} className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border bg-muted">
                  {d.avatarUrl ? (
                    <Image
                      src={d.avatarUrl}
                      alt={d.displayName}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm">
                      {initials || "U"}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="truncate font-medium">{d.displayName}</div>
                  <div className="text-xs text-muted-foreground">@{d.handle}</div>
                </div>
              </Link>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">iRating</span>
                <span className="font-semibold">{d.iRating ?? "—"}</span>
              </div>

              {d.status === "retired" && (
                <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  Retired
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
