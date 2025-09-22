// src/server/auth/session.ts
import { User } from '@prisma/client';

export type SessionUser = {
  user: User | null;
  roles: string[];
};

export async function getSessionUser(): Promise<SessionUser> {
  // In a real app, you'd get the user from a session cookie, JWT, etc.
  // This is where you would implement your actual authentication logic.
  // For now, we return a guest user.
  return { user: null, roles: [] };
}

