import { UserMenuClient } from './user-menu-client';
import { getCachedSessionUser } from '@/server/auth/cached-session';

export default async function UserMenu() {
  const { user, roles } = await getCachedSessionUser();

  return (
    <UserMenuClient
      user={user}
      roles={roles}
    />
  );
}

