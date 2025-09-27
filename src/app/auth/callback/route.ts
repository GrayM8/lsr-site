import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { prisma } from '@/server/db';
import { slugify } from '@/lib/slug';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('Callback invoked without a code.');
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
    console.error('Error exchanging code for session:', error);
    const errorMessage = error ? error.message : 'No user data';
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${errorMessage}`);
  }

  const { user } = data;
  console.log(`Successfully exchanged code. Supabase user ID: ${user.id}.`);

  try {
    // Use a transaction to find or create the user
    const dbUser = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: user.id },
      });

      if (existingUser) {
        console.log(`User ${existingUser.id} found in DB. Status: ${existingUser.status}.`);
        // If user exists but isn't active, update them.
        if (existingUser.status !== 'active') {
          return tx.user.update({
            where: { id: user.id },
            data: { status: 'active' },
          });
        }
        return existingUser;
      }

      // --- User does not exist, so create them ---
      console.log('User not found in DB. Creating new user.');
      if (!user.email) {
        throw new Error('Cannot create user: email is missing from Supabase user data.');
      }

      // For Google OAuth, name comes from 'full_name'. For email, it's 'displayName'
      const displayName = user.user_metadata.displayName || user.user_metadata.full_name || user.email.split('@')[0];
      const avatarUrl = user.user_metadata.avatar_url;
      const handle = slugify(displayName);

      const newUserPayload = {
        id: user.id,
        email: user.email,
        handle: handle,
        displayName: displayName,
        avatarUrl: avatarUrl,
        status: 'active' as const,
        // EID and gradYear are only available for email signups
        eid: user.user_metadata.eid,
        gradYear: user.user_metadata.gradYear,
        marketingOptIn: user.user_metadata.marketingOptIn ?? true,
      };

      console.log('Creating user with payload:', JSON.stringify(newUserPayload, null, 2));
      return tx.user.create({ data: newUserPayload });
    });

    const redirectUrl = `${origin}/drivers/${dbUser.handle}`;
    console.log(`Redirecting to user's page: ${redirectUrl}`);
    return NextResponse.redirect(redirectUrl);

  } catch (dbError) {
    console.error('A database error occurred:', dbError);
    const errorMessage = (dbError instanceof Error) ? dbError.message : 'Unknown DB error';
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=DB operation failed&details=${errorMessage}`);
  }
}