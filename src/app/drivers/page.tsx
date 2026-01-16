import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/server/db';
import { ROLE_LABEL, type RoleCode } from '@/lib/roles';
import { Separator } from '@/components/ui/separator';
import { DriversFilters } from '@/components/drivers-filters';
import { DriversSearch } from '@/components/drivers-search';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const dynamic = 'force-dynamic';

const ALL_ROLES = Object.keys(ROLE_LABEL) as RoleCode[];

export default async function DriversIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const roleParam = sp.role;
  const selectedRoles = (Array.isArray(roleParam) ? roleParam : roleParam ? [roleParam] : [])
    .map(r => r.toString().toLowerCase())
    .filter((r): r is RoleCode => ALL_ROLES.includes(r as RoleCode));

  // Fetch all matching drivers first
  const rawDrivers = await prisma.user.findMany({
    where: {
      status: { not: 'deleted' },
      ...(q
        ? {
            OR: [
              { displayName: { contains: q, mode: 'insensitive' } },
              { handle: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(selectedRoles.length
        ? { roles: { some: { role: { key: { in: selectedRoles } } } } }
        : {}),
    },
    include: { roles: { include: { role: true } } },
  });

  // Calculate All Time Points
  const driverIds = rawDrivers.map(d => d.id);
  const pointsData = await prisma.entry.groupBy({
      by: ['userId'],
      _sum: { totalPoints: true },
      where: { userId: { in: driverIds } }
  });
  
  const pointsMap = new Map(pointsData.map(p => [p.userId, p._sum.totalPoints || 0]));
  
  // Sort by All Time Points Descending
  const drivers = rawDrivers.map(d => ({
      ...d,
      allTimePoints: pointsMap.get(d.id) || 0
  })).sort((a, b) => {
      if (b.allTimePoints !== a.allTimePoints) return b.allTimePoints - a.allTimePoints;
      return a.displayName.localeCompare(b.displayName);
  });

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-14 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display font-black italic text-5xl md:text-6xl text-white uppercase tracking-normal">
              Driver <span className="text-lsr-orange">Roster</span>
            </h1>
            <p className="font-sans font-bold text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2">Official Entry List</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <DriversSearch q={q} />
            <DriversFilters selectedRoles={selectedRoles} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="border border-white/10 bg-white/[0.02] p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-black italic text-2xl text-white uppercase tracking-normal">Latest <span className="text-lsr-orange">Results</span></h2>
                <div className="h-px flex-1 bg-white/10 ml-4" />
              </div>
              
              <div className="aspect-video bg-black border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-sans font-black text-[10px] uppercase tracking-[0.2em] text-white/20">[Circuit Data Unavailable]</p>
                </div>
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-lsr-orange">Podium Finishers</h3>
                <ul className="space-y-3">
                  {['TBD', 'TBD', 'TBD'].map((driver, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className={`font-display font-black italic text-lg w-6 ${i === 0 ? 'text-lsr-orange' : 'text-white/30'}`}>
                        {i + 1}
                      </span>
                      <span className="font-sans font-bold text-white/70 uppercase tracking-wide text-xs">{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="border border-white/10 bg-lsr-charcoal overflow-hidden">
              <div className="overflow-x-auto">
                <TooltipProvider>
                <table className="w-full text-sm min-w-[500px] md:min-w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-4 text-left font-sans font-black uppercase tracking-widest text-[9px] text-white/40 w-12">Pos</th>
                  <th className="px-4 py-4 text-left font-sans font-black uppercase tracking-widest text-[9px] text-white/40">Driver</th>
                  <th className="px-4 py-4 text-center font-sans font-black uppercase tracking-widest text-[9px] text-white/40 w-24 md:w-32">
                    Points
                  </th>
                  <th className="px-4 py-4 text-center font-sans font-black uppercase tracking-widest text-[9px] text-white/40 w-24 md:w-32 hidden sm:table-cell">
                      <Tooltip>
                          <TooltipTrigger className="cursor-help decoration-dashed underline underline-offset-2">Events</TooltipTrigger>
                          <TooltipContent>
                              <p>Event attendance tracking coming soon</p>
                          </TooltipContent>
                      </Tooltip>
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {drivers.map((d, index) => {
                  const initials = d.displayName
                    .split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  const codes: RoleCode[] = d.roles.length
                    ? d.roles.map(ur => ur.role.key as RoleCode)
                    : [];

                  return (
                    <tr key={d.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-center">
                        <span className={`font-display font-black italic text-xl ${index < 3 ? 'text-lsr-orange' : 'text-white/20'}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/drivers/${d.handle}`} className="flex items-center gap-4 group/driver">
                          <div
                            className="h-10 w-10 flex-shrink-0 overflow-hidden border border-white/10 bg-black group-hover/driver:border-lsr-orange transition-colors">
                            {d.avatarUrl ? (
                              <Image
                                src={d.avatarUrl}
                                alt=""
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-sans font-bold text-[10px] text-white/30">
                                {initials || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <div className="truncate font-sans font-bold text-white uppercase tracking-tight group-hover/driver:text-lsr-orange transition-colors">
                                {d.displayName}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {d.status === 'pending_verification' && (
                                  <span className="bg-red-900/50 text-red-200 border border-red-900 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest">
                                    Unverified
                                  </span>
                                )}
                                {codes.map(c => (
                                  <span key={c} className="bg-white/5 text-white/60 border border-white/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest">
                                    {ROLE_LABEL[c]}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-[9px] font-medium text-white/40 uppercase tracking-widest mt-0.5">@{d.handle}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center font-display font-bold text-white text-lg sm:text-xl">
                          {d.allTimePoints > 0 ? d.allTimePoints : <span className="text-white/20">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="font-display font-bold italic text-white/20 text-lg tracking-tight">
                          —
                        </span>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  );
}