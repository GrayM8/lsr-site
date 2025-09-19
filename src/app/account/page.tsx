import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createSupabaseRSC } from "@/lib/supabase-rsc"
import { updateAccountDetails, updateMarketingOptIn, retireAccount, deleteAccount } from "./actions"
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
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-4xl px-6 md:px-8 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">Account Details</h1>
          <p className="text-white/80 mt-2">Manage your account and profile information.</p>
        </div>

        <Separator className="bg-white/10" />

        {/* ACCOUNT DETAILS */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-lsr-orange tracking-wide">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <Input value={user.email ?? ""} readOnly className="bg-white/5 border-white/10" />
            </div>
            <div className="grid gap-1.5">
              <Label>EID</Label>
              <Input value={profile.eid ?? ""} readOnly className="bg-white/5 border-white/10" />
            </div>
            <div className="grid gap-1.5">
              <Label>Display Name</Label>
              <Input value={profile.displayName} readOnly className="bg-white/5 border-white/10" />
            </div>
            <div className="grid gap-1.5">
              <Label>Handle</Label>
              <Input value={`@${profile.handle}`} readOnly className="bg-white/5 border-white/10" />
            </div>
          </div>
        </section>

        {/* MARKETING TOGGLE */}
        <form action={updateMarketingOptIn} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-lsr-orange tracking-wide">Marketing Opt-in</h2>
              <p className="text-sm text-white/70 mt-1">
                Receive news and event updates. You can change this anytime.
              </p>
            </div>
            <MarketingToggle
              name="marketingOptIn"
              defaultChecked={profile.marketingOptIn}
            />
          </div>
          <div className="pt-4">
            <Button type="submit" size="sm" className="bg-lsr-orange text-lsr-charcoal hover:bg-lsr-orange/90">
              Save Preferences
            </Button>
          </div>
        </form>

        <Separator className="bg-white/10" />

        {/* RETIRE */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-lsr-orange tracking-wide">Retire Account</h2>
          <p className="text-sm text-white/70 mt-1 mb-3">
            You’ll be signed out and marked as <span className="font-medium text-white">retired</span>. Your driver
            page
            and stats remain visible, but you won’t be able to use the site while retired.
          </p>
          <form action={retireAccount} className="inline-block">
            <Button type="submit" variant="secondary">Retire</Button>
          </form>
        </div>

        {/* DELETE */}
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-6">
          <h2 className="text-lg font-semibold text-red-400 tracking-wide">Permanently Delete Account</h2>
          <p className="text-sm text-red-400/80 mt-1 mb-3">
            This removes your profile and deletes your account. This action cannot be undone.
          </p>
          <form action={deleteAccount} className="inline-block">
            <ConfirmSubmitButton
              type="submit"
              variant="destructive"
              message="This will permanently delete your account. Are you sure?"
            >
              Permanently delete
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>
    </main>
  )
}
