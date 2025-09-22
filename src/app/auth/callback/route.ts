// src/app/auth/callback/route.ts
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { slugify } from '@/lib/slug';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);
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

    if (error || !user) {
      console.error('Supabase auth error:', error?.message);
      const redirectUrl = new URL('/?auth-error=true', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // --- USER PROVISIONING ---
    const existingUser = await prisma.user.findUnique({ where: { id: user.id } });

    if (!existingUser) {
      const meta = user.user_metadata ?? {};
      const displayName =
        meta.display_name || meta.full_name || user.email?.split('@')[0] || 'New Driver';

      const baseHandle = slugify(displayName);
      let handle = baseHandle;
      for (let i = 1; i <= 5; i++) {
        const exists = await prisma.user.findUnique({ where: { handle } });
        if (!exists) break;
        handle = `${baseHandle}-${i}`;
      }

      const memberRole = await prisma.role.findUnique({ where: { key: 'member' } });

      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          displayName,
          handle,
          marketingOptIn: meta.marketingOptIn ?? true,
          eid: meta.eid,
          gradYear: meta.gradYear ? Number(meta.gradYear) : undefined,
          signedUpAt: new Date(),
          roles: memberRole ? { create: [{ roleId: memberRole.id }] } : undefined,
        },
      });
    }
    // --- END PROVISIONING ---

    return response;
  }

  // return the user to an error page with instructions
  const redirectUrl = new URL('/?auth-error=true', request.url);
  return NextResponse.redirect(redirectUrl);
}
