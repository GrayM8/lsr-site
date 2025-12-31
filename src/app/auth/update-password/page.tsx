import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase-server"
import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export default async function UpdatePasswordPage() {
  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  // 1. Must have a session
  if (!session) {
    redirect("/")
  }

  // 2. Must be a recovery session (clicked "Forgot Password" link)
  const isRecovery = session.user?.app_metadata?.provider === 'email' && 
                     session.user?.aud === 'authenticated' &&
                     (session as any).amr?.find((m: any) => m.method === 'recovery' || m.method === 'otp');

  // If strict check is needed:
  // Supabase sets `amr: [{ method: 'recovery', timestamp: ... }]` for password reset links.
  const amr = (session as any).amr || []
  const hasRecovery = amr.some((x: any) => x.method === 'recovery')

  if (!hasRecovery) {
    // If user is logged in but NOT via recovery, redirect them to home or settings.
    // This prevents random access to this page.
    redirect("/")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <UpdatePasswordForm />
    </div>
  )
}