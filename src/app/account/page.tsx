import { redirect } from 'next/navigation';
import { getCachedSessionUser } from '@/server/auth/cached-session';
import { updateMarketingOptIn, retireAccount, deleteAccount } from './actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { MarketingToggle } from '@/components/marketing-toggle';
import { ConfirmSubmitButton } from '@/components/confirm-submit-button';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const { user } = await getCachedSessionUser();
  if (!user) redirect('/login');

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen pt-20 pb-20">
      <div className="mx-auto max-w-4xl px-6 md:px-8 space-y-12">
        <div>
          <h1 className="font-display font-black italic text-4xl md:text-6xl text-white uppercase tracking-tighter">
            Account <span className="text-lsr-orange">Details</span>
          </h1>
          <p className="font-sans font-medium text-white/60 mt-4 max-w-2xl leading-relaxed">
            Manage your driver profile, preferences, and account settings.
          </p>
        </div>

        <div className="w-full h-px bg-white/5" />

        {/* ACCOUNT DETAILS */}
        <section className="space-y-6">
          <h2 className="font-sans font-bold text-xs text-lsr-orange uppercase tracking-[0.2em]">Profile Information</h2>
          <div className="rounded-none border border-white/5 bg-white/[0.03] p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="grid gap-2">
                <Label className="font-sans font-bold text-[10px] text-white/40 uppercase tracking-[0.2em] pl-1">Email</Label>
                <Input value={user.email ?? ''} readOnly className="rounded-none bg-white/5 border-white/10 text-white h-12 font-medium" />
              </div>
              <div className="grid gap-2">
                <Label className="font-sans font-bold text-[10px] text-white/40 uppercase tracking-[0.2em] pl-1">EID</Label>
                <Input value={user.eid ?? ''} readOnly className="rounded-none bg-white/5 border-white/10 text-white h-12 font-medium" />
              </div>
              <div className="grid gap-2">
                <Label className="font-sans font-bold text-[10px] text-white/40 uppercase tracking-[0.2em] pl-1">Display Name</Label>
                <Input value={user.displayName} readOnly className="rounded-none bg-white/5 border-white/10 text-white h-12 font-medium" />
              </div>
              <div className="grid gap-2">
                <Label className="font-sans font-bold text-[10px] text-white/40 uppercase tracking-[0.2em] pl-1">Handle</Label>
                <Input value={`@${user.handle}`} readOnly className="rounded-none bg-white/5 border-white/10 text-white h-12 font-medium" />
              </div>
            </div>
          </div>
        </section>

        {/* MARKETING TOGGLE */}
        <section className="space-y-6">
          <h2 className="font-sans font-bold text-xs text-lsr-orange uppercase tracking-[0.2em]">Preferences</h2>
          <form action={updateMarketingOptIn} className="rounded-none border border-white/5 bg-white/[0.03] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold italic text-xl text-white uppercase tracking-tight">Marketing Opt-in</h3>
              <p className="font-sans text-sm text-white/50 mt-2 max-w-md">
                Receive news and event updates. You can change this anytime.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <MarketingToggle
                name="marketingOptIn"
                defaultChecked={user.marketingOptIn}
              />
              <Button type="submit" size="sm" className="rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest text-[10px] h-10 transition-all px-6">
                Save
              </Button>
            </div>
          </form>
        </section>

        <div className="w-full h-px bg-white/5" />

        {/* DANGER ZONE */}
        <section className="space-y-6">
          <h2 className="font-sans font-bold text-xs text-red-500 uppercase tracking-[0.2em]">Danger Zone</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* RETIRE */}
            <div className="rounded-none border border-white/5 bg-white/[0.03] p-8 flex flex-col h-full">
              <h3 className="font-display font-bold italic text-xl text-white uppercase tracking-tight">Retire Account</h3>
              <p className="font-sans text-sm text-white/50 mt-4 mb-8 flex-grow leading-relaxed">
                You’ll be signed out and marked as <span className="text-white font-bold">retired</span>. Your driver
                page and stats remain visible, but you won’t be able to use the site.
              </p>
              <form action={retireAccount}>
                <Button type="submit" variant="outline" className="w-full rounded-none border-white/10 text-white hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest text-[10px] h-12">
                  Retire
                </Button>
              </form>
            </div>

            {/* DELETE */}
            <div className="rounded-none border border-red-500/20 bg-red-500/[0.05] p-8 flex flex-col h-full">
              <h3 className="font-display font-bold italic text-xl text-red-500 uppercase tracking-tight">Delete Account</h3>
              <p className="font-sans text-sm text-red-500/70 mt-4 mb-8 flex-grow leading-relaxed">
                Permanently remove your profile and all associated data. This action cannot be undone.
              </p>
              <form action={deleteAccount}>
                <ConfirmSubmitButton
                  type="submit"
                  variant="destructive"
                  message="This will permanently delete your account. Are you sure?"
                  className="w-full rounded-none bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-[10px] h-12"
                >
                  Permanently Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

