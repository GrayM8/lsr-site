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

function emailIsAllowlisted(email?: string | null): boolean {
  const env = process.env.ADMIN_EMAILS || '';
  if (!email || !env) return false;
  const list = env.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function requireUser(): Promise<User> {
  const { user } = await getSessionUser();
  if (!user) {
    throw new NotAuthenticatedError();
  }
  return user;
}

type RoleKey = 'admin' | 'officer' | 'lsc_driver' | 'collegiate_driver';

export async function requireRole(role: RoleKey | RoleKey[]): Promise<User> {
  const { user, roles } = await getSessionUser();
  if (!user) {
    throw new NotAuthenticatedError();
  }

  // Email allowlist grants admin-level access
  if (emailIsAllowlisted(user.email)) {
    return user;
  }

  const requiredRoles = Array.isArray(role) ? role : [role];
  const hasRole = requiredRoles.some((r) => roles.includes(r));

  if (!hasRole) {
    throw new NotAuthorizedError(`Requires one of the following roles: ${requiredRoles.join(', ')}`);
  }

  return user;
}

export async function requireOfficer(): Promise<User> {
  return requireRole(['admin', 'officer']);
}

export async function requireSystemAdmin(): Promise<User> {
  return requireRole('admin');
}
