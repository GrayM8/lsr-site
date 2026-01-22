import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOwnerStatus } from '@/lib/owner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandIcon, type SimpleIcon } from '@/components/brand-icon';
import { siInstagram, siYoutube, siTwitch } from 'simple-icons/icons';
import { Globe, type LucideIcon, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDriverStats } from "@/server/queries/drivers";
import { DriverHistoryTable } from "@/components/driver-history-table";
import { getCachedSessionUser } from "@/server/auth/cached-session";
import { getUpcomingRegistrations } from "@/server/queries/events";
import { MyUpcomingEvents } from "@/components/my-upcoming-events";

export const revalidate = 60;

function StatCard({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between h-full group hover:border-lsr-orange/50 transition-colors">
      <div className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">{label}</div>
      <div className="font-display font-black italic text-2xl text-white tracking-tight group-hover:text-lsr-orange transition-colors">{value}</div>
    </div>
  );
}

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

  const validSocials = Object.entries(socials).filter(([_, val]) => !!val);

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-14 md:py-20">
        
        <div className="mb-8">
          <Link href="/drivers" className="group inline-flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-lsr-orange hover:text-white transition-colors">
            <div className="h-px w-8 bg-lsr-orange/30 group-hover:bg-white group-hover:w-12 transition-all" />
            Back to Drivers
          </Link>
        </div>

        {/* Driver License Header */}
        <div className="border-t-4 border-lsr-orange bg-lsr-charcoal border-b border-l border-r border-white/10 p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex gap-2">
             <div className="h-2 w-2 bg-lsr-orange animate-pulse" />
             <div className="h-2 w-2 bg-white/10" />
             <div className="h-2 w-2 bg-white/10" />
          </div>
          
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 relative z-10">
            <div className="h-32 w-32 md:h-40 md:w-40 border border-white/20 bg-black flex-shrink-0 relative">
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={user.avatarUrl ?? undefined} className="object-cover" />
                <AvatarFallback className="text-3xl font-black bg-white/5 text-white/20 rounded-none">{initials || 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-lsr-orange" />
            </div>
            
            <div className="flex-grow pt-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-white/10 text-white/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                  Driver Profile
                </span>
                {user.status === 'pending_verification' && (
                  <span className="bg-red-900/50 text-red-200 border border-red-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                    Verification Pending
                  </span>
                )}
              </div>
              
              <h1 className="font-display font-black italic text-5xl md:text-7xl text-white uppercase tracking-normal leading-[0.85] mb-2">
                {user.displayName}
              </h1>
              <p className="font-mono text-lsr-orange text-sm md:text-base tracking-widest">@{user.handle}</p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.length > 0 ? (
                  tags.map(t => (
                    <span key={t.key} className="border border-white/20 px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-widest text-white/70">
                      {t.description}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Rookie Class</span>
                )}
              </div>
            </div>

            {isOwner && (
              <div className="absolute top-0 right-0 p-8">
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    "rounded-none border-white/20 hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest text-[10px]",
                    !user.bio && "border-lsr-orange/50 shadow-[0_0_15px_rgba(255,128,0,0.3)] animate-pulse"
                  )}
                >
                  <Link href={`/drivers/${handle}/edit`}>Edit Profile</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Stats & Socials */}
          <div className="lg:col-span-1 space-y-12">
            
            {/* 0. My Upcoming Events (Private) */}
            {isMe && (
                <div>
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                        <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal">
                            My <span className="text-lsr-orange">Registrations</span>
                        </h3>
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white/30" title="Visible only to you">
                            <EyeOff className="h-3 w-3" />
                            <span>Private</span>
                        </div>
                    </div>
                    <MyUpcomingEvents registrations={upcomingRegistrations} />
                </div>
            )}

            {/* 1. Comms Links (Top) */}
            <div>
              <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
                Comms <span className="text-lsr-orange">Links</span>
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {validSocials.length > 0 ? (
                  validSocials.map(([key, value]) => {
                    if (!value) return null;
                    const IconData = simpleIconSocials[key];
                    const IconComponent = componentIconSocials[key];
                    
                    return (
                      <a 
                        key={key} 
                        href={value} 
                        target="_blank" 
                        rel="noreferrer"
                        className="aspect-square border border-white/10 bg-white/[0.02] flex items-center justify-center hover:bg-lsr-orange hover:border-lsr-orange hover:text-white transition-all group"
                      >
                        {IconData ? (
                          <BrandIcon icon={IconData} className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : IconComponent ? (
                          <IconComponent className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : null}
                      </a>
                    );
                  })
                ) : (
                  <div className="col-span-4 border border-white/10 bg-white/[0.02] p-8 text-center">
                    <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/30 block mb-1">No Links Yet</span>
                    <p className="font-sans text-[8px] text-white/10 uppercase tracking-widest">Communications silence</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Driver Info (Below Comms) */}
            <div>
              <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
                Driver <span className="text-lsr-orange">Info</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="iRating" value={user.iRating ?? 'N/A'} />
                <StatCard label="Class" value={user.gradYear ? `'${user.gradYear.toString().slice(-2)}` : 'N/A'} />
                <div className="col-span-2">
                  <StatCard label="Major" value={<span className="text-lg not-italic font-sans font-bold uppercase tracking-tight">{user.major ?? 'Undeclared'}</span>} />
                </div>
              </div>
            </div>

            {/* 3. Stats (Current & Career) */}
            <div className="space-y-12">
                {/* Current Season Stats (if active) */}
                {currentSeason && (
                <div>
                    <h3 className="font-display font-black italic text-xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
                    {currentSeason.name} <span className="text-lsr-orange">Stats</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Points" value={currentSeason.points} />
                    <StatCard label="Top 10s" value={currentSeason.top10} />
                    </div>
                </div>
                )}

                {/* Career Stats */}
                <div>
                <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
                    Career <span className="text-lsr-orange">Stats</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Starts" value={allTime.starts} />
                    <StatCard label="Wins" value={allTime.wins} />
                    <StatCard label="Podiums" value={allTime.podiums} />
                    <StatCard label="Top 10s" value={allTime.top10} />
                    <div className="col-span-2">
                        <StatCard label="Total Points" value={allTime.points} />
                    </div>
                </div>
                </div>
            </div>

          </div>

          {/* Right Column: Bio & History */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
                Driver <span className="text-lsr-orange">Biography</span>
              </h3>
              <div className="prose prose-invert prose-p:font-sans prose-p:text-white/70 prose-p:leading-relaxed max-w-none">
                <p className="whitespace-pre-wrap">{user.bio || 'No driver history available.'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
                Race <span className="text-lsr-orange">History</span>
              </h3>
              {history.length > 0 ? (
                  <DriverHistoryTable history={history} />
              ) : (
                  <div className="border border-white/10 bg-white/[0.02] p-8 text-center">
                    <p className="font-sans font-bold text-white/40 uppercase tracking-widest text-xs">No race history available</p>
                  </div>
              )}
            </div>

            {/* Event History */}
            <div>
              <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
                Event <span className="text-lsr-orange">History</span>
              </h3>
              {eventHistory.length > 0 ? (
                  <div className="border border-white/10 bg-white/[0.02]">
                      {eventHistory.map((attendance) => (
                          <div key={attendance.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                              <div>
                                  <div className="font-sans font-bold text-sm text-white uppercase tracking-tight">{attendance.event.title}</div>
                                  <div className="font-mono text-[10px] text-white/40">{new Date(attendance.event.startsAtUtc).toLocaleDateString()}</div>
                              </div>
                              <div className="text-right">
                                  <span className="inline-block border border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white/60">
                                      Attended
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="border border-white/10 bg-white/[0.02] p-8 text-center">
                    <p className="font-sans font-bold text-white/40 uppercase tracking-widest text-xs">No event attendance recorded</p>
                  </div>
              )}
            </div>

            {/* Coming Soon */}
            <div className="border border-dashed border-white/10 bg-white/[0.01] p-12 text-center opacity-50 hover:opacity-100 transition-opacity">
                <h4 className="font-display font-black italic text-xl text-white/40 uppercase tracking-normal mb-2">More Stats Coming Soon</h4>
                <p className="font-sans text-[10px] text-white/20 uppercase tracking-widest">Analysis modules under development</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}