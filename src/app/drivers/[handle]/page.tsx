import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOwnerStatus } from '@/lib/owner';
import { getDriverStats } from "@/server/queries/drivers";
import { getCachedSessionUser } from "@/server/auth/cached-session";
import { getUpcomingRegistrations } from "@/server/queries/events";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// New Components
import { DriverHero } from '@/components/drivers/profile/driver-hero';
import { DriverIdentityStrip } from '@/components/drivers/profile/driver-identity-strip';
import { DriverParticipation } from '@/components/drivers/profile/driver-participation';
import { DriverPerformance } from '@/components/drivers/profile/driver-performance';
import { DriverEventHistory } from '@/components/drivers/profile/driver-event-history';
import { DriverMetadata } from '@/components/drivers/profile/driver-metadata';

export const revalidate = 60;

export default async function DriverProfilePage({
  params,
}: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  const stats = await getDriverStats(handle);
  if (!stats) return notFound();

  const { user, currentSeason, allTime, history, eventHistory } = stats;
  if (user.status === 'deleted') return notFound();

  const { isOwner } = await getOwnerStatus(user.id);
  
  // Check if viewing own profile
  const { user: sessionUser } = await getCachedSessionUser();
  const isMe = sessionUser?.id === user.id;
  
  const upcomingRegistrations = isMe ? await getUpcomingRegistrations(user.id) : [];
  const socials = (user.socials as Record<string, string> | null) ?? {};

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-14 md:py-20">
        
        <div className="flex items-center justify-between mb-8">
          <Link href="/drivers" className="group inline-flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-lsr-orange hover:text-white transition-colors">
            <div className="h-px w-8 bg-lsr-orange/30 group-hover:bg-white group-hover:w-12 transition-all" />
            Back to Drivers
          </Link>
          
          {isOwner && (
            <div className="md:hidden">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-none border-white/20 hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest text-[10px] h-8",
                    !user.bio && "border-lsr-orange/50 shadow-[0_0_15px_rgba(255,128,0,0.3)] animate-pulse"
                  )}
                >
                  <Link href={`/drivers/${user.handle}/edit`}>Edit Profile</Link>
                </Button>
            </div>
          )}
        </div>

        {/* 1. HERO: IDENTITY */}
        <DriverHero user={user} isOwner={isOwner} totalRegistrations={stats.totalRegistrations} />

        {/* 2. HUMAN IDENTITY STRIP */}
        <DriverIdentityStrip user={user} />

        {/* 3. PARTICIPATION (Private / Owner Only) */}
        <DriverParticipation isMe={isMe} upcomingRegistrations={upcomingRegistrations} />

        {/* 4. PERFORMANCE CORE */}
        <DriverPerformance 
            history={history} 
            allTime={allTime} 
            currentSeason={currentSeason} 
        />

        {/* 5. EVENT HISTORY */}
        <DriverEventHistory eventHistory={eventHistory} />

        {/* 6. METADATA / LINKS */}
        <DriverMetadata socials={socials} iRating={user.iRating} />

      </div>
    </main>
  );
}
