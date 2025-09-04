import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createSupabaseRSC } from "@/lib/supabase-rsc"
import { updateMarketingOptIn, retireAccount, deleteAccount } from "./actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const supabase = await createSupabaseRSC()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!profile) redirect("/drivers/me") // will provision if needed

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

      <form action={updateMarketingOptIn} className="rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Marketing opt-in</div>
            <p className="text-sm text-muted-foreground">
              Receive news and event updates. You can change this anytime.
            </p>
          </div>
          {/* The Switch submits as "on" when checked; the form posts on button click */}
          <input type="hidden" name="marketingOptIn" value={profile.marketingOptIn ? "on" : ""} />
          <Switch
            checked={profile.marketingOptIn}
            onCheckedChange={(checked) => {
              // mirror to hidden field so server action reads it
              const el = document.querySelector<HTMLInputElement>('input[name="marketingOptIn"]')
              if (el) el.value = checked ? "on" : ""
            }}
          />
        </div>
        <div className="pt-3">
          <Button type="submit" size="sm">Save preferences</Button>
        </div>
      </form>

      <Separator />

      <section className="space-y-3">
        <form action={retireAccount} className="rounded-xl border p-4">
          <div className="mb-2 font-semibold">Retire account</div>
          <p className="text-sm text-muted-foreground mb-3">
            You’ll be signed out and marked as <span className="font-medium">retired</span>. Your driver page
            and stats remain visible, but you won’t be able to use the site while retired.
          </p>
          <Button type="submit" variant="secondary">Retire</Button>
        </form>

        <form action={deleteAccount} className="rounded-xl border p-4">
          <div className="mb-2 font-semibold text-red-600">Permanently delete</div>
          <p className="text-sm text-muted-foreground mb-3">
            This removes your profile and deletes your account. This action cannot be undone.
          </p>
          <Button
            type="submit"
            variant="destructive"
            onClick={(e) => {
              if (!confirm("This will permanently delete your account. Are you sure?")) {
                e.preventDefault()
              }
            }}
          >
            Permanently delete
          </Button>
        </form>
      </section>
    </main>
  )
}
