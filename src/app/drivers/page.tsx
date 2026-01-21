import Link from 'next/link';
import { prisma } from '@/server/db';
import { ROLE_LABEL, type RoleCode } from '@/lib/roles';
import { DriversFilters } from '@/components/drivers-filters';
import { DriversSearch } from '@/components/drivers-search';
import { DriversTable } from '@/components/drivers-table';

export const dynamic = 'force-dynamic';

const ALL_ROLES = Object.keys(ROLE_LABEL) as RoleCode[];

export default async function DriversIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : '';
  const roleParam = sp.role;
  const selectedRoles = (Array.isArray(roleParam) ? roleParam : roleParam ? [roleParam] : [])
    .map(r => r.toString().toLowerCase())
    .filter((r): r is RoleCode => ALL_ROLES.includes(r as RoleCode));

  // Fetch ALL drivers to calculate global rank
  const allDrivers = await prisma.user.findMany({
    where: {
      status: { not: 'deleted' },
    },
    include: { roles: { include: { role: true } } },
  });

  // Calculate All Time Points
  const driverIds = allDrivers.map(d => d.id);
  const pointsData = await prisma.entry.groupBy({
      by: ['userId'],
      _sum: { totalPoints: true },
      where: { userId: { in: driverIds } }
  });
  
  const pointsMap = new Map(pointsData.map(p => [p.userId, p._sum.totalPoints || 0]));
  
  // Sort by All Time Points Descending to assign Rank
  const rankedDrivers = allDrivers.map(d => ({
      ...d,
      allTimePoints: pointsMap.get(d.id) || 0
  })).sort((a, b) => {
      if (b.allTimePoints !== a.allTimePoints) return b.allTimePoints - a.allTimePoints;
      return a.displayName.localeCompare(b.displayName);
  }).map((d, index) => ({
      ...d,
      rank: index + 1
  }));

  // Apply Filters (Search & Roles) on the Ranked List
  const filteredDrivers = rankedDrivers.filter(d => {
      // Search Filter
      if (q) {
          const matchesName = d.displayName.toLowerCase().includes(q);
          const matchesHandle = d.handle.toLowerCase().includes(q);
          if (!matchesName && !matchesHandle) return false;
      }

      // Role Filter
      if (selectedRoles.length > 0) {
          const hasRole = d.roles.some(r => selectedRoles.includes(r.role.key as RoleCode));
          if (!hasRole) return false;
      }

      return true;
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
            <DriversTable drivers={filteredDrivers} />
          </div>
        </div>
      </div>
    </main>
  );
}