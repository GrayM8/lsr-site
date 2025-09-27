import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { prisma } from '@/server/db';
import { slugify } from '@/lib/slug';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('[Auth Callback] Error: No code provided.');
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
  console.log(`[Auth Callback] Supabase user retrieved:`, JSON.stringify(user, null, 2));

  try {
    const dbUser = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { id: user.id } });

      if (existingUser) {
        console.log(`[Auth Callback] User ${existingUser.id} found in DB.`);
        return existingUser;
      }

      console.log('[Auth Callback] User not found in DB. Creating new user.');
      if (!user.email) {
        throw new Error('User email is missing from Supabase data.');
      }

      const displayName = user.user_metadata.full_name || user.user_metadata.displayName || user.email.split('@')[0];
      const baseHandle = slugify(displayName);
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const handle = `${baseHandle}-${randomSuffix}`;
      console.log(`[Auth Callback] Generated handle: ${handle}`);

      const newUserPayload = {
        id: user.id,
        email: user.email,
        handle: handle,
        displayName: displayName,
        avatarUrl: user.user_metadata.avatar_url,
        status: 'active' as const,
        marketingOptIn: user.user_metadata.marketingOptIn ?? true,
      };
      
      console.log('[Auth Callback] Creating user with payload:', JSON.stringify(newUserPayload, null, 2));
      
      try {
        const createdUser = await tx.user.create({ data: newUserPayload });
        console.log('[Auth Callback] Successfully created user in DB:', createdUser.id);
        return createdUser;
      } catch (creationError) {
        console.error('[Auth Callback] Error creating user in transaction:', creationError);
        throw creationError; // Re-throw to abort the transaction
      }
    });

    const redirectUrl = `${origin}/drivers/${dbUser.handle}`;
    console.log(`[Auth Callback] Redirecting to: ${redirectUrl}`);
    return NextResponse.redirect(redirectUrl);

  } catch (dbError) {
    console.error('[Auth Callback] A database error occurred:', dbError);
    const errorMessage = (dbError instanceof Error) ? dbError.message : 'Unknown DB error';
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=DB operation failed&details=${errorMessage}`);
  }
}