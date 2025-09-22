import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/server/db';
import { ROLE_LABEL, type RoleCode } from '@/lib/roles';
import { Separator } from '@/components/ui/separator';
import { DriversFilters } from '@/components/drivers-filters';
import { DriversSearch } from '@/components/drivers-search';

export const dynamic = 'force-dynamic';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
      {children}
    </span>
  );
}

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

  const drivers = await prisma.user.findMany({
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
    orderBy: [{ iRating: 'desc' }, { displayName: 'asc' }],
    include: { roles: { include: { role: true } } },
  });

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">Drivers</h1>
          <div className="ms-auto flex items-center gap-2">
            <DriversSearch q={q} />
            <DriversFilters selectedRoles={selectedRoles} />
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-2xl text-lsr-orange tracking-wide">Last Race</h2>
              <div className="mt-4 aspect-video bg-lsr-charcoal-darker rounded-lg flex items-center justify-center">
                <p className="text-sm text-white/60">[Racetrack Image]</p>
              </div>
              <h3 className="mt-4 font-semibold">Podium Finishers:</h3>
              <ul className="mt-2 space-y-2 text-sm text-white/80">
                <li>1. [Driver Name]</li>
                <li>2. [Driver Name]</li>
                <li>3. [Driver Name]</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 text-white/60">
                <tr>
                  <th className="px-4 py-3 text-left font-normal w-16">Rank</th>
                  <th className="px-4 py-3 text-left font-normal">Driver</th>
                  <th className="px-4 py-3 text-center font-normal w-32">Season Points</th>
                  <th className="px-4 py-3 text-center font-normal w-32">iRating</th>
                </tr>
                </thead>
                <tbody>
                {drivers.map((d, index) => {
                  const initials = d.displayName
                    .split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  const codes: RoleCode[] = d.roles.length
                    ? d.roles.map(ur => ur.role.key as RoleCode)
                    : ['member'];

                  return (
                    <tr key={d.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-4 py-2 text-center text-lg font-bold text-white/60">{index + 1}</td>
                      <td className="px-4 py-2">
                        <Link href={`/drivers/${d.handle}`} className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-lsr-charcoal-darker">
                            {d.avatarUrl ? (
                              <Image
                                src={d.avatarUrl}
                                alt={d.displayName}
                                width={40}
                                height={40}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs">
                                {initials || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="truncate font-medium">{d.displayName}</div>
                              <div className="flex flex-wrap gap-1">
                                {codes.map(c => (
                                  <Badge key={c}>{ROLE_LABEL[c]}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-xs text-white/60">@{d.handle}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-center font-semibold">{'—'}</td>
                      <td className="px-4 py-2 text-center font-semibold">{d.iRating ?? '—'}</td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

