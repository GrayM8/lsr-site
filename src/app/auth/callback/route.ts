import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { prisma } from '@/server/db';
import { slugify } from '@/lib/slug';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  try {
    const code = searchParams.get('code');

    if (!code) {
      throw new Error('No code provided in the callback URL.');
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: CookieOptions) => {
            cookieStore.set({ name, value, ...options });
          },
          remove: (name: string, options: CookieOptions) => {
            cookieStore.delete({ name, ...options });
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw new Error(`Supabase session exchange error: ${error.message}`);
    }
    if (!data.user) {
      throw new Error('No user data returned after session exchange.');
    }

    const { user } = data;

    const dbUser = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { id: user.id } });

      if (existingUser) {
        return existingUser;
      }

      if (!user.email) {
        throw new Error('User email is missing from Supabase data.');
      }

      const displayName = user.user_metadata.full_name || user.user_metadata.displayName || user.email.split('@')[0];
      const baseHandle = slugify(displayName);
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const handle = `${baseHandle}-${randomSuffix}`;

      const newUserPayload = {
        id: user.id,
        email: user.email,
        handle: handle,
        displayName: displayName,
        avatarUrl: user.user_metadata.avatar_url,
        status: 'active' as const,
        marketingOptIn: user.user_metadata.marketingOptIn ?? true,
      };
      
      return tx.user.create({ data: newUserPayload });
    });

    const redirectUrl = `${origin}/drivers/${dbUser.handle}`;
    return NextResponse.redirect(redirectUrl);

  } catch (e) {
    const error = e as Error;
    const errorMessage = error.message || 'An unknown error occurred.';
    const details = encodeURIComponent(JSON.stringify({
      message: errorMessage,
      stack: error.stack,
      cause: error.cause,
    }));
    console.error(`[Auth Callback] Critical Error: ${errorMessage}`, e);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(errorMessage)}&details=${details}`);
  }
}
