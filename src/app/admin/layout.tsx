import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/authz"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const res = await requireAdmin()
  if (!res.ok) {
    // optionally redirect unauthenticated → /login, forbidden → / (or a 403 page)
    if (res.reason === "unauthenticated") redirect("/login")
    redirect("/") // or redirect("/403")
  }
  return <>{children}</>
}
