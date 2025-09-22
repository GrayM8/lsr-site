// src/app/auth/callback/route.ts
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { slugify } from '@/lib/slug';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'Authentication code was missing.');
    return NextResponse.redirect(errorUrl);
  }

  const response = NextResponse.redirect(new URL(next, origin));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase auth error:', error.message);
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'Authentication failed. Please try again.');
    return NextResponse.redirect(errorUrl);
  }

  if (!user) {
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'User not found after authentication.');
    return NextResponse.redirect(errorUrl);
  }

  // --- USER PROVISIONING LOGIC ---
  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!existingUser) {
    const meta = (user.user_metadata ?? {}) as {
      display_name?: string;
      full_name?: string;
      marketingOptIn?: boolean;
      eid?: string;
      gradYear?: number | string;
    };

    const displayName =
      meta.display_name?.trim() ||
      meta.full_name?.trim() ||
      user.email?.split('@')[0] ||
      'New Driver';

    const baseHandle = slugify(displayName || 'driver');
    let handle = baseHandle;
    for (let i = 1; i <= 5; i++) {
      const exists = await prisma.user.findUnique({ where: { handle } });
      if (!exists) break;
      handle = `${baseHandle}-${i}`;
    }

    const marketing = typeof meta.marketingOptIn === 'boolean' ? meta.marketingOptIn : true;
    const eid = (meta.eid || '').trim() || null;
    const gradYearParsed =
      typeof meta.gradYear === 'string' ? parseInt(meta.gradYear, 10) :
      typeof meta.gradYear === 'number' ? meta.gradYear : null;

    const memberRole = await prisma.role.findUnique({ where: { key: 'member' } });

    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        displayName,
        handle,
        marketingOptIn: marketing,
        eid: eid || undefined,
        gradYear: gradYearParsed || undefined,
        signedUpAt: new Date(),
        roles: memberRole ? { create: [{ roleId: memberRole.id }] } : undefined,
      },
    });
  } else if (existingUser.status === 'retired') {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/account/retired', origin));
  }
  // --- END PROVISIONING ---

  return response;
}