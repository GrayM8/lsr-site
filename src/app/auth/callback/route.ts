// src/app/auth/callback/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { prisma } from '@/server/db';

export async function GET(request: Request) {
  console.log('Auth callback invoked.');
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    console.error('Callback invoked without a code.');
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No code provided`);
  }

  console.log('Code received, preparing to exchange for session.');
  const cookieStore = cookies();
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

  if (error) {
    console.error('Error exchanging code for session:', error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error.message}`);
  }

  if (!data.user) {
    console.error('Session exchange successful, but no user data returned.');
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No user data`);
  }

  console.log(`Supabase user ID: ${data.user.id}. Checking for existing user in our DB.`);

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
    });

    if (dbUser) {
      console.log(`User ${dbUser.id} found in DB. Status: ${dbUser.status}. Redirecting.`);
      // This handles both active and pending_verification users who already exist
      return NextResponse.redirect(`${origin}${next}`);
    }

    // If we reach here, the user does not exist in our database.
    console.log('User not found in DB. Proceeding to create a new user.');

    const { user } = data;
    if (!user.email) {
      console.error('Cannot create user: email is missing from Supabase user data.');
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=Email not available`);
    }

    const emailPrefix = user.email.split('@')[0];
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const handle = `${emailPrefix}-${randomSuffix}`;
    const displayName = user.user_metadata.full_name || user.email;

    const newUserPayload = {
      id: user.id,
      email: user.email,
      handle: handle,
      displayName: displayName,
      avatarUrl: user.user_metadata.avatar_url,
      status: 'pending_verification' as const,
    };

    console.log('Preparing to create user with payload:', JSON.stringify(newUserPayload, null, 2));

    const newUser = await prisma.user.create({
      data: newUserPayload,
    });

    console.log(`Successfully created new user with ID: ${newUser.id} and handle: ${newUser.handle}.`);
    const redirectUrl = `${origin}/drivers/${newUser.handle}`;
    console.log(`Redirecting to new user's page: ${redirectUrl}`);
    return NextResponse.redirect(redirectUrl);

  } catch (dbError) {
    console.error('A database error occurred:', dbError);
    const errorMessage = (dbError instanceof Error) ? dbError.message : 'Unknown DB error';
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=DB operation failed&details=${errorMessage}`);
  }
}