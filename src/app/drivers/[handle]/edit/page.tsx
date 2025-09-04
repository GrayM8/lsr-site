import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createSupabaseRSC } from "@/lib/supabase-rsc"     // read-only in RSC
import { createSupabaseServer } from "@/lib/supabase-server" // write-enabled for actions
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic" // fresh owner checks

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

// ---- helpers: owner id in RSC vs Action ----
async function getOwnerUserIdRSC() {
  const supabase = await createSupabaseRSC()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}
async function getOwnerUserIdAction() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

// ---- SERVER ACTION (single-arg shape) ----
export async function updateProfile(formData: FormData) {
  "use server"

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
    // keep it simple: throw → Next shows error overlay; we can add form-state later
    throw new Error(parsed.error.flatten().formErrors.join(", ") || "Invalid input.")
  }

  const me = await prisma.profile.findUnique({ where: { userId } })
  if (!me) redirect("/")

  const prevSocials = (me.socials as Record<string, string> | null) ?? {}
  await prisma.profile.update({
    where: { id: me.id }, // ensures only our own row is updated
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

export default async function EditDriverPage({
                                               params,
                                             }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const profile = await prisma.profile.findUnique({ where: { handle } })
  if (!profile || profile.status === "deleted") return notFound()

  // owner check in RSC (read-only client)
  const userId = await getOwnerUserIdRSC()
  if (!userId || userId !== profile.userId) {
    redirect(`/drivers/${handle}`)
  }

  const socials = (profile.socials as Record<string, string> | null) ?? {}

  return (
    <main className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit your profile</h1>

      <form action={updateProfile} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="displayName">Display name</Label>
          <Input id="displayName" name="displayName" defaultValue={profile.displayName} required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="iRating">iRating</Label>
          <Input id="iRating" name="iRating" type="number" defaultValue={profile.iRating ?? ""} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="gradYear">Graduating year</Label>
          <Input id="gradYear" name="gradYear" type="number" defaultValue={profile.gradYear ?? ""} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" rows={5} defaultValue={profile.bio ?? ""} />
        </div>

        <Separator />

        <div className="grid gap-1.5">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="url" placeholder="https://example.com" defaultValue={socials.website ?? ""} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" name="instagram" type="url" placeholder="https://instagram.com/handle" defaultValue={socials.instagram ?? ""} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="twitch">Twitch</Label>
          <Input id="twitch" name="twitch" type="url" placeholder="https://twitch.tv/handle" defaultValue={socials.twitch ?? ""} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="youtube">YouTube</Label>
          <Input id="youtube" name="youtube" type="url" placeholder="https://youtube.com/@channel" defaultValue={socials.youtube ?? ""} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="outline" asChild>
            <a href={`/drivers/${handle}`}>Cancel</a>
          </Button>
        </div>
      </form>
    </main>
  )
}
