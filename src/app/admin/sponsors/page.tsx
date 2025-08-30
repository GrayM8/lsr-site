import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { SponsorTier } from "@prisma/client"

async function addSponsor(formData: FormData) {
  "use server"
  const name = String(formData.get("name") || "").trim()
  const url = String(formData.get("url") || "").trim() || null
  const tier = (String(formData.get("tier") || "bronze") as SponsorTier)

  if (!name) return
  await prisma.sponsor.create({ data: { name, url, tier } })
  revalidatePath("/sponsors")
  revalidatePath("/admin/sponsors")
}

export default async function AdminSponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { tier: "asc" } })

  return (
    <main className="mx-auto max-w-6xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Sponsors</h1>
        <Link className="underline" href="/admin">← Back to Admin</Link>
      </div>

      <form action={addSponsor} className="grid gap-3 max-w-lg">
        <input name="name" placeholder="Sponsor name" className="rounded-md border px-3 py-2" required />
        <input name="url" placeholder="https://sponsor.com (optional)" className="rounded-md border px-3 py-2" />
        <select name="tier" defaultValue="bronze" className="rounded-md border px-3 py-2">
          <option value="title">Title</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
        <button type="submit" className="rounded-md bg-black text-white px-3 py-2">Add sponsor</button>
      </form>

      <section className="space-y-2">
        <h2 className="font-semibold">Current sponsors</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map(s => (
            <li key={s.id} className="rounded-md border p-3">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-muted-foreground">
                Tier: {s.tier}{s.url ? <> • <a className="underline" href={s.url} target="_blank">site</a></> : null}
              </div>
            </li>
          ))}
        </ul>
        {sponsors.length === 0 && <p className="text-muted-foreground">None yet.</p>}
      </section>
    </main>
  )
}
