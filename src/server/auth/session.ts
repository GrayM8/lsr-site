// src/server/auth/session.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/server/db';
import { User } from '@prisma/client';

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

  const dbUser = await prisma.user.findUnique({
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

  if (!dbUser) {
    return { user: null, roles: [] };
  }

  return {
    user: dbUser,
    roles: dbUser.roles.map(r => r.role.key),
  };
}