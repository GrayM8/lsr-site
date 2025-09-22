// src/server/auth/session.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/server/db';
import { User } from '@prisma/client';

export type SessionUser = {
  user: (User & { roles: { role: { key: string } }[] }) | null;
  roles: string[];
};

/**
 * Reads the session from cookies and retrieves the corresponding application user.
 * This is a read-only operation. User creation is handled in the auth callback.
 */
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
    // This can happen if the user was deleted from our DB but not from Supabase.
    // The callback route is responsible for creating the user.
    return { user: null, roles: [] };
  }

  return {
    user: dbUser,
    roles: dbUser.roles.map(r => r.role.key),
  };
}