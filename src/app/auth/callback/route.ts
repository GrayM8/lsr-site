// src/app/auth/callback/route.ts
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // Create a response object that we can modify
    const response = NextResponse.redirect(new URL(next, origin));

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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Supabase auth error:', error.message);
      const errorUrl = new URL('/login', request.url);
      errorUrl.searchParams.set('error', 'Authentication failed. Please try again.');
      return NextResponse.redirect(errorUrl);
    }

    // The cookies are now set on the response object, so we can return it.
    return response;
  }

  // handle no code
  const errorUrl = new URL('/login', request.url);
  errorUrl.searchParams.set('error', 'Authentication code was missing.');
  return NextResponse.redirect(errorUrl);
}
