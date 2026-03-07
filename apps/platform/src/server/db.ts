// src/server/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations

  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
    datasourceUrl: appendTimeout(process.env.DATABASE_URL),
  });

/** Append connect_timeout and pool_timeout to the connection string if not already set */
function appendTimeout(url: string | undefined): string | undefined {
  if (!url) return url;
  let result = url;
  if (!result.includes('connect_timeout')) {
    result += (result.includes('?') ? '&' : '?') + 'connect_timeout=15';
  }
  if (!result.includes('pool_timeout')) {
    result += '&pool_timeout=15';
  }
  return result;
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
