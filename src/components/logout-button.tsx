"use client"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

export function LogoutButton() {
  const supabase = createSupabaseBrowser()
  return (
    <button
      className="rounded-md border px-3 py-2"
      onClick={async () => { await supabase.auth.signOut(); location.href = "/" }}
    >
      Log out
    </button>
  )
}
