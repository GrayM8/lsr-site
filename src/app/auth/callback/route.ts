import { NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/admin"

  if (!code) return NextResponse.redirect(new URL("/login", url.origin))

  // We'll set cookies on this response
  const res = NextResponse.redirect(new URL(next, url.origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // ✅ New API: provide getAll/setAll
      cookies: {
        getAll() {
          // NextRequest cookies are read-only; just read from req
          return req.cookies.getAll().map((c) => ({ name: c.name, value: c.value }))
        },
        setAll(cookiesToSet) {
          // Apply cookie writes to the response
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...(options as CookieOptions | undefined) })
          })
        },
      },
    }
  )

  await supabase.auth.exchangeCodeForSession(code)
  return res
}
