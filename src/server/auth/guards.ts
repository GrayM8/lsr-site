// src/server/auth/guards.ts
import { getSessionUser } from './session';
import { User } from '@prisma/client';

class NotAuthenticatedError extends Error {
  constructor(message = 'You must be logged in to perform this action.') {
    super(message);
    this.name = 'NotAuthenticatedError';
  }
}

class NotAuthorizedError extends Error {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message);
    this.name = 'NotAuthorizedError';
  }
}

export async function requireUser(): Promise<User> {
  const { user } = await getSessionUser();
  if (!user) {
    throw new NotAuthenticatedError();
  }
  return user;
}

type RoleKey = 'admin' | 'officer' | 'member';

export async function requireRole(role: RoleKey | RoleKey[]): Promise<User> {
  const { user, roles } = await getSessionUser();
  if (!user) {
    throw new NotAuthenticatedError();
  }

  const requiredRoles = Array.isArray(role) ? role : [role];
  const hasRole = requiredRoles.some((r) => roles.includes(r));

  if (!hasRole) {
    throw new NotAuthorizedError(`Requires one of the following roles: ${requiredRoles.join(', ')}`);
  }

  return user;
}
