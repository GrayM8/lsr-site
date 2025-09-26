import { UserMenuClient } from './user-menu-client';
import { AuthDialog } from './auth-dialog';
import { getCachedSessionUser } from '@/server/auth/cached-session';

export default async function UserMenu() {
  const { user, roles } = await getCachedSessionUser();

  if (!user) return <AuthDialog />;

  return (
    <UserMenuClient
      displayName={user.displayName ?? user.email ?? 'User'}
      email={user.email}
      avatarUrl={user.avatarUrl ?? null}
      handle={user.handle ?? null}
      roles={roles}
    />
  );
}

