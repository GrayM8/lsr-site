import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createSupabaseRSC } from "@/lib/supabase-rsc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { updateProfile } from "./actions"      // <-- import only

export const dynamic = "force-dynamic"         // allowed named export

async function getOwnerUserIdRSC() {
  const supabase = await createSupabaseRSC()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export default async function EditDriverPage({
                                               params,
                                             }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const profile = await prisma.profile.findUnique({ where: { handle } })
  if (!profile || profile.status === "deleted") return notFound()

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
          <Input id="website" name="website" type="url" defaultValue={socials.website ?? ""} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" name="instagram" type="url" defaultValue={socials.instagram ?? ""} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="twitch">Twitch</Label>
          <Input id="twitch" name="twitch" type="url" defaultValue={socials.twitch ?? ""} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="youtube">YouTube</Label>
          <Input id="youtube" name="youtube" type="url" defaultValue={socials.youtube ?? ""} />
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
