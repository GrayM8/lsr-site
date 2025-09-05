import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/authz"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const res = await requireAdmin()
  if (!res.ok) {
    redirect("/403") // or
  }
  return <>{children}</>
}
