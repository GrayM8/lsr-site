import { prisma } from '@/server/db';
import { getSessionUser } from '@/server/auth/session';

function emailIsAllowlisted(email?: string | null) {
  const env = process.env.ADMIN_EMAILS || '';
  if (!email || !env) return false;
  const list = env.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function isAdmin() {
  const { user } = await getSessionUser();
  if (!user) return false;

  // Email allow-list short-circuit
  if (emailIsAllowlisted(user.email)) return true;

  // DB role check
  const count = await prisma.userRole.count({
    where: {
      userId: user.id,
      role: { key: { in: ['admin', 'officer'] } },
    },
  });
  return count > 0;
}

export async function requireAdmin() {
  const { user } = await getSessionUser();
  if (!user) return { ok: false as const, reason: 'unauthenticated' as const };

  if (emailIsAllowlisted(user.email)) return { ok: true as const, user };

  const hasRole = await prisma.userRole.count({
    where: { userId: user.id, role: { key: { in: ['admin', 'officer'] } } },
  });
  return hasRole ? { ok: true as const, user } : { ok: false as const, reason: 'forbidden' as const };
}

