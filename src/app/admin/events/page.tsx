import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function addEvent(formData: FormData) {
  "use server"
  const title = String(formData.get("title") || "").trim()
  const startAtStr = String(formData.get("startAt") || "")
  const endAtStr = String(formData.get("endAt") || "")
  const location = String(formData.get("location") || "").trim() || null
  const description = String(formData.get("description") || "").trim() || null
  const externalUrl = String(formData.get("externalUrl") || "").trim() || null

  if (!title || !startAtStr) return
  const startAt = new Date(startAtStr)              // datetime-local → local time
  const endAt = endAtStr ? new Date(endAtStr) : null

  await prisma.event.create({ data: { title, startAt, endAt, location, description, externalUrl } })
  revalidatePath("/events")
  revalidatePath("/admin/events")
}

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startAt: "desc" } })

  return (
    <main className="mx-auto max-w-6xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Link className="underline" href="/admin">← Back to Admin</Link>
      </div>

      <form action={addEvent} className="grid gap-3 max-w-xl">
        <input name="title" placeholder="Event title" className="rounded-md border px-3 py-2" required />
        <label className="text-sm">Start
          <input type="datetime-local" name="startAt" className="mt-1 block w-full rounded-md border px-3 py-2" required />
        </label>
        <label className="text-sm">End (optional)
          <input type="datetime-local" name="endAt" className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>
        <input name="location" placeholder="Location (optional)" className="rounded-md border px-3 py-2" />
        <input name="externalUrl" placeholder="External link (optional)" className="rounded-md border px-3 py-2" />
        <textarea name="description" placeholder="Description (optional)" className="rounded-md border px-3 py-2" rows={3} />
        <button type="submit" className="rounded-md bg-black text-white px-3 py-2">Add event</button>
      </form>

      <section className="space-y-2">
        <h2 className="font-semibold">Upcoming & recent</h2>
        <ul className="space-y-3">
          {events.map(e => (
            <li key={e.id} className="rounded-md border p-3">
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(e.startAt).toLocaleString()}
                {e.location ? ` • ${e.location}` : ""}
              </div>
              {e.description && <p className="text-sm mt-1">{e.description}</p>}
              {e.externalUrl && <a className="underline text-sm" href={e.externalUrl} target="_blank">More</a>}
            </li>
          ))}
        </ul>
        {events.length === 0 && <p className="text-muted-foreground">No events yet.</p>}
      </section>
    </main>
  )
}
