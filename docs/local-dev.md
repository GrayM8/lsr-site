# Local Development

Step-by-step instructions for running the LSR Platform on your machine.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 10+ | `npm install -g pnpm` |
| Git | any recent | [git-scm.com](https://git-scm.com) |

You do **not** need to install PostgreSQL locally. The app connects to a hosted Supabase database.

## 1. Clone and install

```bash
git clone https://github.com/longhorn-sim-racing/lsr-monorepo.git
cd lsr-monorepo
pnpm install
```

## 2. Environment variables

Copy the template and fill in credentials:

```bash
cp apps/platform/.env.example apps/platform/.env.local
```

Edit `apps/platform/.env.local` with the following values (get these from the team lead):

```env
# Supabase project URL
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"

# Supabase public anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# PostgreSQL connection string (use port 6543 for PgBouncer session mode)
DATABASE_URL="postgresql://postgres:PASSWORD@db.your-project.supabase.co:6543/postgres"

# Direct connection for migrations (bypasses PgBouncer)
DIRECT_URL="postgresql://postgres:PASSWORD@db.your-project.supabase.co:5432/postgres"

# Admin email allowlist (comma-separated, grants admin access without a database role)
ADMIN_EMAILS="your-email@utexas.edu"
```

## 3. Generate the Prisma client

This must be done before the first build or whenever the schema changes:

```bash
pnpm --filter @lsr/platform db:generate
```

## 4. Start the dev server

From the repo root:

```bash
pnpm dev
```

Or from the app directory:

```bash
cd apps/platform
pnpm dev
```

The app will be available at **http://localhost:3000**.

## Available scripts

Run these from the repo root using `pnpm --filter @lsr/platform <script>`, or from `apps/platform/` directly with `pnpm <script>`.

| Script | Purpose |
|---|---|
| `dev` | Start the development server |
| `build` | Production build (runs `prisma generate` automatically) |
| `lint` | Run ESLint |
| `typecheck` | Run TypeScript type checking |
| `db:generate` | Regenerate the Prisma client |
| `db:migrate` | Create and apply a new migration |
| `db:deploy` | Apply pending migrations (production) |
| `db:reset` | Reset the database and re-seed |
| `set-role <userId> <role>` | Assign a role to a user |

## Troubleshooting

### `EPERM: operation not permitted` during Prisma generate (Windows)

The Prisma query engine DLL can get locked by a running Node process. Fix:

```bash
# Kill all node processes, then retry
taskkill /F /IM node.exe
pnpm --filter @lsr/platform db:generate
```

### Missing environment variables

If the app crashes on startup with errors about `NEXT_PUBLIC_SUPABASE_URL` or similar, make sure your `.env.local` file is in `apps/platform/` (not the repo root).

### Prisma client out of date

If you see errors about missing Prisma models or fields after pulling new changes:

```bash
pnpm --filter @lsr/platform db:generate
```

If there are new migrations to apply:

```bash
pnpm --filter @lsr/platform db:migrate
```

### Port 3000 already in use

Another process is using port 3000. Either stop it or start Next.js on a different port:

```bash
pnpm --filter @lsr/platform dev -- --port 3001
```

### `pnpm install` warns about ignored build scripts

On first install, pnpm may warn about ignored build scripts for packages like `@prisma/client`, `esbuild`, and `sharp`. These are already approved in the root `package.json` under `pnpm.onlyBuiltDependencies`. If the warning persists, run:

```bash
rm -rf node_modules apps/platform/node_modules
pnpm install
```
