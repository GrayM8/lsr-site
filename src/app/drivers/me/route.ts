import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/server/auth/session';

export async function GET(req: NextRequest) {
  const { user } = await getSessionUser();
  const url = new URL(req.url);

  if (!user) {
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  return NextResponse.redirect(new URL(`/drivers/${user.handle}`, url.origin));
}


