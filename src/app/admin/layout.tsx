import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import { LogoutButton } from "@/components/logout-button"

export default async function AdminLayout({
                                            children,
                                          }: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const allowed = (process.env.ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .includes((user.email ?? "").toLowerCase())

  if (!allowed) redirect("/")

  return (
    <section className="mx-auto max-w-6xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
        <LogoutButton />
      </div>
      {children}
    </section>
  )
}
