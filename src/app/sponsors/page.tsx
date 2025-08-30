import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { tier: "asc" } })
  const tierOrder = ["title","gold","silver","bronze"] as const
  sponsors.sort((a,b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier))

  return (
    <main className="mx-auto max-w-6xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Sponsors</h1>
      {sponsors.length === 0 ? (
        <p className="text-muted-foreground">No sponsors yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((s) => (
            <li key={s.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{s.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div>Tier: {s.tier}</div>
                  {s.url && <a className="underline" href={s.url} target="_blank">Website</a>}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
