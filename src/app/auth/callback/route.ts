import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slug"
import type { CookieOptions } from "@supabase/ssr"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/admin" // you can change default

  if (!code) return NextResponse.redirect(new URL("/login", url.origin))

  const res = NextResponse.redirect(new URL(next, url.origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll().map(c => ({ name: c.name, value: c.value })) },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...(options as CookieOptions | undefined) })
          })
        },
      },
    }
  )

  // Establish the session cookies
  await supabase.auth.exchangeCodeForSession(code)

  // Fetch the signed-in user and metadata
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) return res

  // User metadata from signup form or OAuth profile
  const meta = (user.user_metadata ?? {}) as {
    displayName?: string
    marketingOptIn?: boolean
    eid?: string
    gradYear?: number | string
  }

  const displayName =
    (meta.displayName?.trim() ||
      (user.user_metadata?.full_name as string | undefined)?.trim() ||
      user.email?.split("@")[0] ||
      "New Driver")

  // Create a unique handle suggestion
  const baseHandle = slugify(displayName || "driver")
  let handle = baseHandle
  for (let i = 1; i <= 5; i++) {
    const exists = await prisma.profile.findUnique({ where: { handle } })
    if (!exists) break
    handle = `${baseHandle}-${i}`
  }

  const marketing = typeof meta.marketingOptIn === "boolean" ? meta.marketingOptIn : true
  const eid = (meta.eid || "").trim() || null
  const gradYearParsed =
    typeof meta.gradYear === "string" ? parseInt(meta.gradYear, 10) :
      typeof meta.gradYear === "number" ? meta.gradYear : null

  // Upsert profile (first time = create; otherwise leave existing intact)
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      displayName,
      handle,
      marketingOptIn: marketing,
      eid: eid || undefined,
      gradYear: gradYearParsed || undefined,
      signedUpAt: new Date(),
    },
  })

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (profile?.status === "retired") {
    // clear session and send to retired page
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL("/account/retired", url.origin))
  }

  return res
}
