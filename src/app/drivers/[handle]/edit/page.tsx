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

function FormField({ id, label, children }: { id: string, label: string, children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-3 items-center gap-3">
      <Label htmlFor={id} className="md:text-right">{label}</Label>
      <div className="md:col-span-2">
        {children}
      </div>
    </div>
  )
}

export default async function EditDriverPage({
                                               params,
                                             }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params

  const profile = await prisma.profile.findUnique({ where: { handle } })
  if (!profile || profile.status === "deleted") return notFound()

  const me = await getMe()
  if (!me) {
    redirect("/login")
  }

  if (me!.id !== profile.id) {
    redirect(`/drivers/${me!.handle}`)
  }

  const socials = (profile.socials as Record<string, string> | null) ?? {}

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-4xl px-6 md:px-8 py-10">
        <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">Edit your profile</h1>
        <p className="text-white/80 mt-2">Update your public profile information.</p>

        <Separator className="my-6 bg-white/10" />

        <div className="space-y-8">
          {/* Avatar */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold mb-4 text-lsr-orange tracking-wide">Profile Photo</h2>
            <AvatarUploader initialUrl={profile.avatarUrl} />
          </div>

          {/* Form */}
          <form action={updateProfile} className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-lsr-orange tracking-wide">Driver Details</h2>
              <FormField id="displayName" label="Display Name">
                <Input id="displayName" name="displayName" defaultValue={profile.displayName} required
                       className="bg-white/5 border-white/10" />
              </FormField>
              <FormField id="iRating" label="iRating">
                <Input id="iRating" name="iRating" type="number" defaultValue={profile.iRating ?? ""}
                       className="bg-white/5 border-white/10" />
              </FormField>
              <FormField id="gradYear" label="Graduating Year">
                <Input id="gradYear" name="gradYear" type="number" defaultValue={profile.gradYear ?? ""}
                       className="bg-white/5 border-white/10" />
              </FormField>
              <FormField id="major" label="Major">
                <Input id="major" name="major" defaultValue={profile.major ?? ""}
                       className="bg-white/5 border-white/10" />
              </FormField>
              <FormField id="bio" label="Bio">
                <Textarea id="bio" name="bio" rows={5} defaultValue={profile.bio ?? ""}
                          className="bg-white/5 border-white/10" />
              </FormField>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-lsr-orange tracking-wide">Social Links</h2>
              <FormField id="website" label="Website">
                <Input id="website" name="website" type="url" placeholder="https://example.com"
                       defaultValue={socials.website ?? ""} className="bg-white/5 border-white/10" />
              </FormField>
              <FormField id="instagram" label="Instagram">
                <Input id="instagram" name="instagram" type="url" placeholder="https://instagram.com/handle"
                       defaultValue={socials.instagram ?? ""} className="bg-white/5 border-white/10" />
              </FormField>
              <FormField id="twitch" label="Twitch">
                <Input id="twitch" name="twitch" type="url" placeholder="https://twitch.tv/handle"
                       defaultValue={socials.twitch ?? ""} className="bg-white/5 border-white/10" />
              </FormField>
              <FormField id="youtube" label="YouTube">
                <Input id="youtube" name="youtube" type="url" placeholder="https://youtube.com/@channel"
                       defaultValue={socials.youtube ?? ""} className="bg-white/5 border-white/10" />
              </FormField>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-lsr-orange text-lsr-charcoal hover:bg-lsr-orange/90">
                Save changes
              </Button>
              <Button type="button" variant="outline" asChild className="border-white/20 hover:bg-white/10">
                <a href={`/drivers/${handle}`}>Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
