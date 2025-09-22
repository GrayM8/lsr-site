// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const runtime = 'nodejs';

function siteOriginFromEnvOrReq(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (envUrl) {
    return (envUrl.startsWith('http') ? envUrl : `https://${envUrl}`).replace(/\/$/, '');
  }
  const u = new URL(req.url);
  return u.origin;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/';

  const origin = siteOriginFromEnvOrReq(req);
  // Prepare a response we will return and mutate cookies on
  const res = NextResponse.redirect(new URL(next, origin), { status: 302 });

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Persist auth cookies on the response
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.set({ name, value: '', ...options });
          },
        },
      },
    );

    // Exchange the code for a session; this will call cookies.set/remove above
    await supabase.auth.exchangeCodeForSession(code);
  }

  return res; // Must return NextResponse so cookies are committed
}
