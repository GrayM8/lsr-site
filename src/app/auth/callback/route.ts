import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { prisma } from '@/server/db';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No code provided`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    const errorMessage = error ? error.message : 'No user data';
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${errorMessage}`);
  }

  const { user } = data;

  try {
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (dbUser) {
      if (dbUser.status !== 'active') {
        dbUser = await prisma.user.update({
          where: { id: user.id },
          data: { status: 'active' },
        });
      }
    } else {
      const emailPrefix = user.email!.split('@')[0];
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const handle = `${emailPrefix}-${randomSuffix}`;
      const displayName = user.user_metadata.full_name || user.email;

      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          handle: handle,
          displayName: displayName,
          avatarUrl: user.user_metadata.avatar_url,
          status: 'active',
        },
      });
    }

    const redirectUrl = `${origin}/drivers/${dbUser.handle}`;
    return NextResponse.redirect(redirectUrl);

  } catch (dbError) {
    const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown DB error';
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=DB operation failed&details=${errorMessage}`);
  }
}