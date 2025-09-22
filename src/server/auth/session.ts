// src/server/auth/session.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/server/db';
import { User } from '@prisma/client';
import { slugify } from '@/lib/slug';

export type SessionUser = {
  user: (User & { roles: { role: { key: string } }[] }) | null;
  roles: string[];
};

export async function getSessionUser(): Promise<SessionUser> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return { user: null, roles: [] };
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      roles: {
        include: {
          role: {
            select: { key: true },
          },
        },
      },
    },
  });

  // Just-in-time user provisioning
  if (!dbUser) {
    const meta = authUser.user_metadata ?? {};
    const displayName =
      meta.display_name || meta.full_name || authUser.email?.split('@')[0] || 'New Driver';

    const baseHandle = slugify(displayName);
    let handle = baseHandle;
    // Simple uniqueness check
    for (let i = 1; i < 10; i++) {
      const exists = await prisma.user.findUnique({ where: { handle } });
      if (!exists) break;
      handle = `${baseHandle}-${i}`;
    }

    const memberRole = await prisma.role.findUnique({ where: { key: 'member' } });

    dbUser = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        displayName,
        handle,
        status: 'active',
        roles: memberRole ? { create: [{ roleId: memberRole.id }] } : undefined,
      },
      include: {
        roles: {
          include: {
            role: {
              select: { key: true },
            },
          },
        },
      },
    });
  }

  return {
    user: dbUser,
    roles: dbUser.roles.map(r => r.role.key),
  };
}
