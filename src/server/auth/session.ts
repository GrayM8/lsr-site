import { User } from '@prisma/client';

export type SessionUser = {
  user: (User & { roles: { role: { key: string } }[] }) | null;
  roles: string[];
};

export async function getSessionUser(): Promise<SessionUser> {
  // MOCK USER
  const mockUser: User & { roles: { role: { key: string } }[] } = {
    id: 'mock-user-id',
    email: 'mock@example.com',
    handle: 'mockuser',
    displayName: 'Mock User',
    avatarUrl: null,
    bio: null,
    iRating: null,
    socials: null,
    marketingOptIn: true,
    status: 'active',
    major: null,
    gradYear: null,
    eid: null,
    signedUpAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [{ role: { key: 'user' } }],
  };

  return {
    user: mockUser,
    roles: ['user'],
  };
}