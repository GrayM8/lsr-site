import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/server/db';
import { getOwnerStatus } from '@/lib/owner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandIcon, type SimpleIcon } from '@/components/brand-icon';
import { siInstagram, siYoutube, siTwitch } from 'simple-icons/icons';
import { Globe, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const revalidate = 60;

function StatCard({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-white/60">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

export default async function DriverProfilePage({
  params,
}: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  const user = await prisma.user.findUnique({
    where: { handle },
    include: { roles: { include: { role: true } } },
  });
  if (!user || user.status === 'deleted') return notFound();

  const { isOwner } = await getOwnerStatus(user.id);

  const initials = user.displayName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const tags = user.roles.map(ur => ur.role);
  const socials = (user.socials as Record<string, string> | null) ?? {};
  const simpleIconSocials: Record<string, SimpleIcon> = {
    instagram: siInstagram,
    twitch: siTwitch,
    youtube: siYoutube,
  };
  const componentIconSocials: Record<string, LucideIcon> = {
    website: Globe,
  };

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-white/10">
              <AvatarImage src={user.avatarUrl ?? undefined} className="object-cover" />
              <AvatarFallback className="text-2xl">{initials || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">
                {user.displayName}
              </h1>
              <p className="text-white/60">@{user.handle}</p>
            </div>
          </div>

          {isOwner && (
            <Button
              asChild
              className="bg-lsr-orange text-lsr-charcoal hover:bg-lsr-orange/90"
            >
              <Link href={`/drivers/${handle}/edit`}>Edit details</Link>
            </Button>
          )}
        </div>

        <Separator className="my-6 bg-white/10" />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm mb-2 text-white/60">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {user.status === 'pending_verification' && (
                  <Badge variant="destructive">Unverified</Badge>
                )}
                {tags.length > 0 ? (
                  tags.map(t => <Badge key={t.key}>{t.description}</Badge>)
                ) : (
                  <p className="text-sm text-white/60">No tags yet.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="iRating" value={user.iRating ?? '—'} />
              <StatCard label="Grad Year" value={user.gradYear ?? '—'} />            </div>
            <StatCard label="Major" value={user.major ?? '—'} />


            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm mb-2 text-white/60">Socials</h3>
              <div className="flex items-center gap-3">
                {Object.entries(socials).length > 0
                  ? Object.entries(socials).map(([key, value]) => {
                    if (!value) return null;

                    if (key in simpleIconSocials) {
                      const IconData = simpleIconSocials[key];
                      return (
                        <a key={key} href={value} target="_blank" rel="noreferrer"
                           className="text-white/60 hover:text-white transition-colors">
                          <BrandIcon icon={IconData} className="h-5 w-5" />
                        </a>
                      );
                    }

                    if (key in componentIconSocials) {
                      const IconComponent = componentIconSocials[key];
                      return (
                        <a key={key} href={value} target="_blank" rel="noreferrer"
                           className="text-white/60 hover:text-white transition-colors">
                          <IconComponent className="h-5 w-5" />
                        </a>
                      );
                    }

                    return null;
                  })
                  : <p className="text-sm text-white/60">No links yet.</p>
                }
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-lsr-orange tracking-wide">Bio</h2>
            <p className="text-white/80 whitespace-pre-wrap">{user.bio || 'No bio yet.'}</p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* My Events */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-lsr-orange tracking-wide">My Events</h2>
          <p className="text-white/60">
            This feature is coming soon! You&apos;ll be able to see and manage your upcoming events, RSVPs, and carpooling, as well as see past events and performance statistics.
          </p>
        </div>
      </div>
    </main>
  );
}

