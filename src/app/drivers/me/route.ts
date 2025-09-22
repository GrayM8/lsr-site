// src/app/drivers/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/server/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    },
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    // Not logged in, send to home page.
    return NextResponse.redirect(origin);
  }

  // User is logged in, find their handle in our DB.
  const dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { handle: true },
  });

  if (!dbUser?.handle) {
    // This case is unlikely if provisioning works, but as a fallback,
    // redirect to the account page where they can see their details.
    return NextResponse.redirect(`${origin}/account`);
  }

  // Redirect to their permanent driver page.
  return NextResponse.redirect(`${origin}/drivers/${dbUser.handle}`);
}