import { User } from '@prisma/client';

export async function requireUser(): Promise<User> {
  // MOCK USER
  const mockUser: User = {
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
  };
  return mockUser;
}

type RoleKey = 'admin' | 'officer' | 'member';

export async function requireRole(role: RoleKey | RoleKey[]): Promise<User> {
  return requireUser();
}