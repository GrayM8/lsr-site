import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"

async function addDriver(formData: FormData) {
  "use server"
  const fullName = String(formData.get("fullName") || "").trim()
  const handle = String(formData.get("handle") || "").trim().toLowerCase()
  if (!fullName || !handle) return
  await prisma.driver.create({ data: { fullName, handle } })
  revalidatePath("/drivers")
}

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin</h1>
      <nav className="flex gap-4 text-sm">
        <Link className="underline" href="/admin/sponsors">Manage Sponsors</Link>
        <Link className="underline" href="/admin/events">Manage Events</Link>
      </nav>
      {/* Add Driver form below */}
      <h1 className="text-3xl font-bold">Admin</h1>
      <form action={addDriver} className="mt-4 grid gap-3 max-w-md">
        <input name="fullName" placeholder="Full name" className="rounded-md border px-3 py-2" />
        <input name="handle" placeholder="Handle (unique)" className="rounded-md border px-3 py-2" />
        <button type="submit" className="rounded-md bg-black text-white px-3 py-2">Add Driver</button>
      </form>
    </main>
  )
}
