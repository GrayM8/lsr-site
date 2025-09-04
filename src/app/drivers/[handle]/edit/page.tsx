import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createSupabaseRSC } from "@/lib/supabase-rsc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { updateProfile } from "./actions"
import { AvatarUploader } from "@/components/avatar-uploader"

export const dynamic = "force-dynamic"

async function getMe() {
  const supabase = await createSupabaseRSC()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null
  const me = await prisma.profile.findUnique({ where: { userId: data.user.id } })
  return me
}

export default async function EditDriverPage({
                                               params,
                                             }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params

  const profile = await prisma.profile.findUnique({ where: { handle } })
  if (!profile || profile.status === "deleted") return notFound()

  const me = await getMe()
  if (!me) {
    // not signed in
    redirect("/login")
  }

  if (me!.id !== profile.id) {
    // signed in but not owner → go to *my* page instead of bouncing to index
    redirect(`/drivers/${me!.handle}`)
  }

  const socials = (profile.socials as Record<string, string> | null) ?? {}

  return (
    <main className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit your profile</h1>

      <section className="rounded-xl border p-4">
        <h2 className="mb-3 text-lg font-semibold">Profile photo</h2>
        <AvatarUploader initialUrl={profile.avatarUrl} />
      </section>

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
