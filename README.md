# Longhorn Sim Racing — Website

Next.js 15 + TypeScript, Tailwind, shadcn/ui. Data via Prisma → Postgres (Supabase). Auth via Supabase Magic Link. Deployed on Vercel.

## Tech Stack
- **App**: Next.js (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion, next-themes
- **Data**: Prisma ORM → Supabase Postgres
- **Auth**: Supabase (magic link)
- **Deploy**: Vercel (Preview + Prod)

---

## Prerequisites
- Node **≥ 20** (recommended 22.x)
- npm **≥ 10**
- A Supabase project (URL, anon key, Postgres credentials)

---

## Local Setup

1. **Install deps**
   ```bash
   npm install
Environment variables

Create .env (server-only; Prisma uses this):

# Supabase Postgres (server-only)
# Use pooler for Prisma Client at runtime
DATABASE_URL=postgresql://postgres:ENCODED_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require

# Use direct port for migrations/introspection
DIRECT_URL=postgresql://postgres:ENCODED_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres?sslmode=require
If your DB password contains @:/#&?= , URL-encode it:

node -e "console.log(encodeURIComponent('raw_password'))"

Create .env.local (browser + server):

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
ALLOWED_ADMIN_EMAILS=you@utexas.edu
Never commit .env / .env.local. Keep .env.example with placeholders.

Database & Prisma

# Apply migrations (schema is already in repo)
npx prisma migrate dev --name init

# Optional: open Prisma Studio
npx prisma studio

# Optional: seed data (if seed is configured)
npm run db:seed
Run dev server

npm run dev
http://localhost:3000

http://localhost:3000/drivers (SSR list)

http://localhost:3000/login → magic link flow → /admin

Auth Configuration (Supabase)
Supabase → Auth → URL Configuration → Redirect URLs:

http://localhost:3000/auth/callback
(Add your Vercel Preview/Prod URLs later.)

Admin access is gated by ALLOWED_ADMIN_EMAILS (comma-separated).

Scripts
{
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "eslint",
"postinstall": "prisma generate",     // ensure Prisma client on Vercel
"db:seed": "prisma db seed"           // optional convenience
}
Handy extras:

npx prisma generate
npx prisma studio

Project Structure
src/
app/
(routes)
admin/
layout.tsx     # protected layout (requires auth + allowed email)
page.tsx       # admin home (add driver)
sponsors/page.tsx
events/page.tsx
auth/callback/route.ts  # Supabase session exchange
components/
(ui components, header, logout-button, etc.)
lib/
prisma.ts              # Prisma client (singleton)
supabase-browser.ts    # Supabase client for client components
supabase-server.ts     # Supabase client for server components
prisma/
schema.prisma
migrations/
seed.ts                  # optional
Deployment (Vercel)
Connect GitHub repo → New Project.

Environment Variables (set for both Preview and Production):

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

DATABASE_URL (pooler 6543, include pgbouncer=true&connection_limit=1&sslmode=require)

DIRECT_URL (direct 5432, include sslmode=require)

ALLOWED_ADMIN_EMAILS

In Vercel, do not wrap values in quotes.

Prisma on build: postinstall runs prisma generate automatically.

Auth redirect: add your Preview/Prod domain to Supabase Auth Redirect URLs:

https://<preview-domain>/auth/callback
https://<prod-domain>/auth/callback
If using a separate prod DB, run migrations:

npx prisma migrate deploy
Common Troubleshooting
Node version error: Next.js requires ^18.18 || ^19.8 || >=20. Use Node 20/22.

Prisma P1001 (can’t reach DB):

Check DIRECT_URL/DATABASE_URL values.

Some networks block 5432; use mobile hotspot for migration or set DIRECT_URL temporarily to 6543.

“URL must start with postgresql://” on Vercel:

Missing/empty DATABASE_URL or DIRECT_URL, or they contain quotes. Fix envs in Vercel UI (no quotes).

Invalid connection string / “invalid port number”:

Password not URL-encoded → encode and update both URLs.

Login 404 at /auth/callback:

Ensure file path: src/app/auth/callback/route.ts.

Add redirect URL in Supabase dashboard.

Client components must import createSupabaseBrowser (not server helper).

Server code uses createSupabaseServer with Next 15 cookie API (getAll/setAll).

Contributing
Branches: feat/*, fix/*, chore/*

Commits: short, imperative (e.g., feat(drivers): add card grid)

Format on save; run npm run lint before PRs.

Roadmap (near-term)
Public polish: hero, About content, Sponsors grid by tier, Events formatting.

Cloudinary uploads (driver headshots, sponsor logos) with unsigned presets.

Transactional email via Resend for contact/confirmations.

License
MIT © Longhorn Sim Racing
