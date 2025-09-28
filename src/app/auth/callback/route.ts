import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { prisma } from '@/server/db';
import { slugify } from '@/lib/slug';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No code provided`);
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

  if (error || !data.user) {
    console.error('[Auth Callback] Error exchanging code for session:', error);
    const errorMessage = error ? error.message : 'No user data';
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${errorMessage}`);
  }

  const { user } = data;

  try {
    const dbUser = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { id: user.id } });

      if (existingUser) {
        if (existingUser.status !== 'active') {
          return tx.user.update({
            where: { id: user.id },
            data: { status: 'active' },
          });
        }
        return existingUser;
      }

      if (!user.email) {
        throw new Error('User email is missing from Supabase data.');
      }

      const displayName = user.user_metadata.full_name || user.user_metadata.displayName || user.email.split('@')[0];
      
      // Create a unique handle, appending a number if necessary
      const baseHandle = slugify(displayName);
      let finalHandle = baseHandle;
      let counter = 1;
      while (await tx.user.findUnique({ where: { handle: finalHandle } })) {
        finalHandle = `${baseHandle}-${counter}`;
        counter++;
      }

      const newUserPayload = {
        id: user.id,
        email: user.email,
        handle: finalHandle,
        displayName: displayName,
        avatarUrl: user.user_metadata.avatar_url,
        status: 'active' as const,
        marketingOptIn: user.user_metadata.marketingOptIn ?? true,
      };
      
      return tx.user.create({ data: newUserPayload });
    });

    const redirectUrl = `${origin}/drivers/${dbUser.handle}`;
    return NextResponse.redirect(redirectUrl);

  } catch (dbError) {
    console.error('[Auth Callback] A database error occurred:', dbError);
    const errorMessage = (dbError instanceof Error) ? dbError.message : 'Unknown DB error';
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=DB operation failed&details=${errorMessage}`);
  }
}