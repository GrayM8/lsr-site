import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DriversPage() {
  const drivers = await prisma.driver.findMany({ orderBy: { fullName: "asc" } })
  return (
    <main className="mx-auto max-w-6xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Drivers</h1>
      {drivers.length === 0 ? (
        <p className="text-muted-foreground">No drivers yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((d) => (
            <li key={d.id}>
              <Link href={`/drivers/${d.handle}`} className="block hover:opacity-95 focus:outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={d.headshotUrl ?? undefined} />
                        <AvatarFallback>
                          {d.fullName.split(" ").map(n => n[0]).slice(0,2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{d.fullName}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <div>@{d.handle}</div>
                    {typeof d.iRating === "number" && <div>iRating: {d.iRating}</div>}
                    <div>Total wins: {d.totalWins}</div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
