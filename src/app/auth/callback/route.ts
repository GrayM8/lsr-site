// app/auth/callback/route.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/server/db";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

function siteOriginFromEnvOrReq(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (envUrl) {
    return (envUrl.startsWith("http") ? envUrl : `https://${envUrl}`).replace(/\/$/, "");
  }
  return req.nextUrl.origin;
}

// Minimal cookie reader off the incoming Request headers
function getReqCookie(req: NextRequest, name: string): string | undefined {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";
  const origin = siteOriginFromEnvOrReq(request);

  // Prepare the redirect response up front; we'll mutate cookies on this object.
  const res = NextResponse.redirect(new URL(next, origin), { status: 302 });

  if (code) {
    // Supabase client that reads cookies from the request and WRITES to the response
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return getReqCookie(request, name);
          },
          set(name: string, value: string, options: CookieOptions) {
            // Persist auth cookies on the redirect response
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.delete({ name, ...options });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const sb = data.user;

      // --- First-login provisioning (idempotent) ---
      // Try by Supabase ID first (we use sb.id as our User.id), then by email
      let dbUser =
        (await prisma.user.findUnique({ where: { id: sb.id } })) ??
        (sb.email ? await prisma.user.findUnique({ where: { email: sb.email } }) : null);

      if (!dbUser) {
        type UserMetadata = {
          display_name?: string;
          full_name?: string;
        };
        const meta = sb.user_metadata as UserMetadata ?? {};
        const displayName =
          meta.display_name || meta.full_name || sb.email?.split('@')[0] || 'New Driver';
        const base = slugify(displayName) || "user";
        let handle = base;
        for (let i = 1; i <= 50; i++) {
          const exists = await prisma.user.findUnique({ where: { handle } });
          if (!exists) break;
          handle = `${base}-${i}`;
        }

        const memberRole = await prisma.role.findUnique({ where: { key: "member" } });

        dbUser = await prisma.user.create({
          data: {
            id: sb.id, // align our User.id with Supabase user id (UUID)
            email: sb.email!,
            displayName,
            handle,
            status: "active",
            authIdentities: {
              create: { provider: "supabase", providerUserId: sb.id },
            },
            roles: memberRole ? { create: [{ roleId: memberRole.id }] } : undefined,
          },
        });
      } else {
        // Ensure AuthIdentity link exists
        await prisma.authIdentity.upsert({
          where: {
            provider_providerUserId: { provider: "supabase", providerUserId: sb.id },
          },
          update: {},
          create: { userId: dbUser.id, provider: "supabase", providerUserId: sb.id },
        });
      }
      // --- End provisioning ---
    }
  }

  // Returning NextResponse is REQUIRED for Set-Cookie headers to commit.
  return res;
}
