import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ROLE_LABEL, type RoleCode } from "@/lib/roles"
import { Separator } from "@/components/ui/separator"
import { DriversFilters } from "@/components/drivers-filters"
import { DriversSearch } from "@/components/drivers-search"

export const dynamic = "force-dynamic"

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs">
      {children}
    </span>
  )
}

const ALL_ROLES = Object.keys(ROLE_LABEL) as RoleCode[]

export default async function DriversIndexPage({
                                                 searchParams,
                                               }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q.trim() : ""
  const roleParam = sp.role
  const selectedRoles = (Array.isArray(roleParam) ? roleParam : roleParam ? [roleParam] : [])
    .map((r) => r.toString().toLowerCase())
    .filter((r): r is RoleCode => ALL_ROLES.includes(r as RoleCode))

  const drivers = await prisma.profile.findMany({
    where: {
      status: { not: "deleted" },
      ...(q
        ? {
          OR: [
            { displayName: { contains: q, mode: "insensitive" } },
            { handle: { contains: q, mode: "insensitive" } },
          ],
        }
        : {}),
      ...(selectedRoles.length
        ? { roles: { some: { role: { code: { in: selectedRoles } } } } }
        : {}),
    },
    orderBy: [{ iRating: "desc" }, { displayName: "asc" }],
    include: { roles: { include: { role: true } } },
  })

  return (
    <main className="mx-auto max-w-6xl p-8 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">Drivers</h1>

        <div className="ms-auto flex items-center gap-2">
          {/* Slim search panel */}
          <DriversSearch q={q} />
          {/* Filter icon + dropdown */}
          <DriversFilters selectedRoles={selectedRoles} />
        </div>
      </div>

      <Separator />

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
        {drivers.map((d) => {
          const initials = d.displayName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
          const codes: RoleCode[] = d.roles.length
            ? d.roles.map((pr) => pr.role.code as RoleCode)
            : ["member"]

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

              <div className="mt-3 flex flex-wrap gap-1">
                {codes.map((c) => (
                  <Badge key={c}>{ROLE_LABEL[c]}</Badge>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
