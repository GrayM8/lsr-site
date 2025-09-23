import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function createSupabaseRSC() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // RSC: read cookies only; do NOT modify them here
        getAll() {
          return cookieStore.getAll().map(c => ({ name: c.name, value: c.value }))
        },
        setAll() {
          // no-op by design (Next 15 disallows cookie writes in RSC)
        },
      },
    }
  )
}
