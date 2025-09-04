import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createSupabaseRSC } from "@/lib/supabase-rsc"
import { updateMarketingOptIn, retireAccount, deleteAccount } from "./actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { MarketingToggle } from "@/components/marketing-toggle"
import { ConfirmSubmitButton } from "@/components/confirm-submit-button"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const supabase = await createSupabaseRSC()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!profile) redirect("/drivers/me")

  return (
    <main className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-2xl font-bold">Account details</h1>

      <section className="grid gap-4 rounded-xl border p-4">
        <div className="grid gap-1.5">
          <Label>Email</Label>
          <Input value={user.email ?? ""} readOnly />
        </div>
        <div className="grid gap-1.5">
          <Label>Display name</Label>
          <Input value={profile.displayName} readOnly />
        </div>
        <div className="grid gap-1.5">
          <Label>Handle</Label>
          <Input value={`@${profile.handle}`} readOnly />
        </div>
      </section>

      {/* MARKETING TOGGLE */}
      <form action={updateMarketingOptIn} className="rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Marketing opt-in</div>
            <p className="text-sm text-muted-foreground">
              Receive news and event updates. You can change this anytime.
            </p>
          </div>
          <MarketingToggle
            name="marketingOptIn"
            defaultChecked={profile.marketingOptIn}
          />
        </div>
        <div className="pt-3">
          <Button type="submit" size="sm">Save preferences</Button>
        </div>
      </form>

      <Separator />

      {/* RETIRE */}
      <form action={retireAccount} className="rounded-xl border p-4">
        <div className="mb-2 font-semibold">Retire account</div>
        <p className="text-sm text-muted-foreground mb-3">
          You’ll be signed out and marked as <span className="font-medium">retired</span>. Your driver page
          and stats remain visible, but you won’t be able to use the site while retired.
        </p>
        <Button type="submit" variant="secondary">Retire</Button>
      </form>

      {/* DELETE */}
      <form action={deleteAccount} className="rounded-xl border p-4">
        <div className="mb-2 font-semibold text-red-600">Permanently delete</div>
        <p className="text-sm text-muted-foreground mb-3">
          This removes your profile and deletes your account. This action cannot be undone.
        </p>
        <ConfirmSubmitButton
          type="submit"
          variant="destructive"
          message="This will permanently delete your account. Are you sure?"
        >
          Permanently delete
        </ConfirmSubmitButton>
      </form>
    </main>
  )
}
