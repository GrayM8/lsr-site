// src/app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { prisma } from "@/server/db";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
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
      }
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const dbUser = await prisma.user.findUnique({
        where: { id: data.user.id },
      });

      if (dbUser && dbUser.status === 'pending_verification') {
        // User exists and is pending, update their status to active
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            status: 'active',
            roles: {
              create: {
                role: {
                  connect: { key: 'member' },
                },
              },
            },
          },
        });
        // Redirect to their driver page after verification
        return NextResponse.redirect(
          `${origin}/drivers/${dbUser.handle}?verified=true`,
        );
      } else if (dbUser) {
        // User already exists and is active, send to original destination
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        // User does not exist, create a new user
        const { user } = data;
        if (!user.email) {
          // Cannot create a user without an email
          return NextResponse.redirect(
            `${origin}/auth/auth-code-error?error=Email not available`,
          );
        }

        const handle = user.email.split('@')[0];
        const displayName = user.user_metadata.full_name || user.email;

        const newUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            handle: handle,
            displayName: displayName,
            avatarUrl: user.user_metadata.avatar_url,
            status: 'pending_verification',
          },
        });
        // Redirect to their driver page
        return NextResponse.redirect(`${origin}/drivers/${newUser.handle}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
