import { getSessionUser } from '@/server/auth/session';

// Returns { isOwner, userId } for current session
export async function getOwnerStatus(targetUserId: string) {
  const { user } = await getSessionUser();
  const userId = user?.id ?? null;
  return { isOwner: !!userId && userId === targetUserId, userId };
}

// Resolve current user's handle (for /drivers/me)
export async function getMyHandle() {
  const { user } = await getSessionUser();
  if (!user) return null;
  // The handle is directly on the user object now
  return user.handle;
}

