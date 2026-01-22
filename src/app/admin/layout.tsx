import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/authz"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const res = await requireAdmin()
  if (!res.ok) {
    redirect("/403") // or
  }
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
