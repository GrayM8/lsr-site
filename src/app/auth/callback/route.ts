import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { prisma } from '@/server/db';
import { slugify } from '@/lib/slug';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/'; // Default to home page

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=No auth code', url.origin));
  }

  const res = NextResponse.redirect(new URL(next, url.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  // Establish the session cookies
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(new URL(`/login?error=${exchangeError.message}`, url.origin));
  }

  // Fetch the signed-in user and metadata
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login?error=User not found after auth', url.origin));
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!existingUser) {
    // User metadata from signup form or OAuth profile
    const meta = (user.user_metadata ?? {}) as {
      displayName?: string;
      marketingOptIn?: boolean;
      eid?: string;
      gradYear?: number | string;
    };

    const displayName =
      (meta.displayName?.trim() ||
        (user.user_metadata?.full_name as string | undefined)?.trim() ||
        user.email?.split('@')[0] ||
        'New Driver');

    // Create a unique handle suggestion
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

    // ensure member role exists (seeded already, but safe)
    const memberRole = await prisma.role.findUnique({ where: { key: 'member' } });

    // Create new user in our DB
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
    // clear session and send to retired page
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/account/retired', url.origin));
  }

  return res;
}

