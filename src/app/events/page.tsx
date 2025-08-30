import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startAt: "desc" } })
  return (
    <main className="mx-auto max-w-6xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Events</h1>
      {events.length === 0 ? (
        <p className="text-muted-foreground">No events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((e) => (
            <li key={e.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{e.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <div>{new Date(e.startAt).toLocaleString()}</div>
                  {e.location && <div>📍 {e.location}</div>}
                  {e.description && <p>{e.description}</p>}
                  {e.externalUrl && <a className="underline" href={e.externalUrl} target="_blank">More</a>}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
