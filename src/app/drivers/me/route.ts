import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase-server"
import { slugify } from "@/lib/slug"
import type { RoleCode } from "@/lib/roles"

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer(); // <-- await here
  const { data } = await supabase.auth.getUser()
  const user = data.user

  const url = new URL(req.url)

  if (!user) {
    return NextResponse.redirect(new URL("/login", url.origin))
  }

  // Find or provision profile
  let profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!profile) {
    const displayName =
      (user.user_metadata?.display_name as string | undefined) ||
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "New Driver"

    const base = slugify(displayName || "driver")
    let handle = base
    for (let i = 1; i <= 5; i++) {
      const exists = await prisma.profile.findUnique({ where: { handle } })
      if (!exists) break
      handle = `${base}-${i}`
    }

    const member = await prisma.role.findUnique({ where: { code: "member" } })
    profile = await prisma.profile.create({
      data: {
        userId: user.id,
        displayName,
        handle,
        marketingOptIn:
          typeof user.user_metadata?.marketingOptIn === "boolean"
            ? user.user_metadata.marketingOptIn
            : true,
        eid: (user.user_metadata?.eid as string | undefined) || undefined,
        gradYear:
          typeof user.user_metadata?.gradYear === "number"
            ? (user.user_metadata.gradYear as number)
            : undefined,
        signedUpAt: new Date(),
        roles: member ? { create: [{ roleId: member.id }] } : undefined,
      },
    })
  }

  return NextResponse.redirect(new URL(`/drivers/${profile.handle}`, url.origin))
}
