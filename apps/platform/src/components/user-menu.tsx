import { UserMenuClient } from './user-menu-client';
import { getCachedSessionUser } from '@/server/auth/cached-session';
import { prisma } from '@/server/db';

export default async function UserMenu() {
  const { user, roles } = await getCachedSessionUser();

  let activeTierKey: string | null = null;
  if (user) {
    const activeMembership = await prisma.userMembership.findFirst({
      where: {
        userId: user.id,
        OR: [{ validTo: null }, { validTo: { gt: new Date() } }],
      },
      include: { tier: { select: { key: true } } },
    });
    activeTierKey = activeMembership?.tier.key ?? null;
  }

  return (
    <UserMenuClient
      user={user}
      roles={roles}
      activeTierKey={activeTierKey}
    />
  );
}
