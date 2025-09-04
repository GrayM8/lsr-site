"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Schema shared by the action
const ProfileSchema = z.object({
  displayName: z.string().min(2).max(80),
  iRating: z.union([z.string(), z.number()]).optional().transform(v => {
    const n = typeof v === "string" ? parseInt(v, 10) : v
    return Number.isFinite(n as number) ? Number(n) : null
  }),
  bio: z.string().max(2000).optional().nullable(),
  gradYear: z.union([z.string(), z.number()]).optional().transform(v => {
    const n = typeof v === "string" ? parseInt(v, 10) : v
    return Number.isFinite(n as number) ? Number(n) : null
  }),
  website: z.string().url().optional().or(z.literal("")).transform(v => v || null),
  instagram: z.string().url().optional().or(z.literal("")).transform(v => v || null),
  twitch: z.string().url().optional().or(z.literal("")).transform(v => v || null),
  youtube: z.string().url().optional().or(z.literal("")).transform(v => v || null),
})

async function getOwnerUserIdAction() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

// ----- SERVER ACTION (single-arg shape for <form action={...}>) -----
export async function updateProfile(formData: FormData) {
  const userId = await getOwnerUserIdAction()
  if (!userId) redirect("/login")

  const parsed = ProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    iRating: formData.get("iRating"),
    bio: formData.get("bio"),
    gradYear: formData.get("gradYear"),
    website: formData.get("website"),
    instagram: formData.get("instagram"),
    twitch: formData.get("twitch"),
    youtube: formData.get("youtube"),
  })
  if (!parsed.success) {
    throw new Error(parsed.error.flatten().formErrors.join(", ") || "Invalid input.")
  }

  const me = await prisma.profile.findUnique({ where: { userId } })
  if (!me) redirect("/")

  const prevSocials = (me.socials as Record<string, string> | null) ?? {}
  await prisma.profile.update({
    where: { id: me.id },
    data: {
      displayName: parsed.data.displayName,
      iRating: parsed.data.iRating ?? undefined,
      bio: parsed.data.bio ?? undefined,
      gradYear: parsed.data.gradYear ?? undefined,
      socials: {
        ...prevSocials,
        website: parsed.data.website,
        instagram: parsed.data.instagram,
        twitch: parsed.data.twitch,
        youtube: parsed.data.youtube,
      },
    },
  })

  revalidatePath(`/drivers/${me.handle}`)
  redirect(`/drivers/${me.handle}`)
}

export async function saveAvatar(url: string) {
  const userId = await getOwnerUserIdAction()
  if (!userId) redirect("/login")

  const me = await prisma.profile.findUnique({ where: { userId } })
  if (!me) redirect("/")

  await prisma.profile.update({
    where: { id: me.id },
    data: { avatarUrl: url },
  })

  revalidatePath(`/drivers/${me.handle}`)
}

export async function clearAvatar() {
  const userId = await getOwnerUserIdAction()
  if (!userId) redirect("/login")

  const me = await prisma.profile.findUnique({ where: { userId } })
  if (!me) redirect("/")

  await prisma.profile.update({
    where: { id: me.id },
    data: { avatarUrl: null },
  })

  revalidatePath(`/drivers/${me.handle}`)
}
