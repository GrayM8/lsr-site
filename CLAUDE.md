# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Longhorn Sim Racing website for UT Austin. A club management application handling events, race results, membership, and content.

## Tech Stack

- **Framework**: Next.js 16 (App Router with React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui (new-york style)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Auth**: Supabase Auth
- **Fonts**: Montserrat (body), Kanit (display headings)

## Commands

```bash
npm run dev           # Start dev server (localhost:3000)
npm run build         # Production build (runs prisma generate first)
npm run lint          # ESLint
npm run db:migrate    # Apply Prisma migrations
npm run db:reset      # Reset and re-seed database
npm run db:generate   # Regenerate Prisma client
npm run set-role <userId> <role>  # Assign role to user
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (feature-specific and shared)
- `src/components/ui/` - shadcn/ui primitives
- `src/lib/` - Utilities (auth clients, dates, validation helpers)
- `src/server/` - Server-side code (queries, repos, services, actions)
- `src/schemas/` - Zod validation schemas
- `prisma/` - Database schema and migrations

### Server Code Organization (`src/server/`)

- `queries/` - Read-only database queries for data fetching
- `repos/` - Repository pattern for entity CRUD operations
- `services/` - Business logic (e.g., registration, attendance workflows)
- `actions/` - Server Actions for mutations
- `auth/` - Session management (`getSessionUser`, `getCachedSessionUser`)

### Path Alias

`@/*` maps to `./src/*`

### Data Fetching Pattern

Server Components fetch data directly via Prisma. Use `getSessionUser()` or `getCachedSessionUser()` for auth context in server code.

### Authorization

- Roles defined in `src/lib/roles.ts`: `member`, `competition`, `officer`, `president`, `alumni`, `admin`
- `isAdmin()` and `requireAdmin()` in `src/lib/authz.ts` check for admin/officer roles
- `ADMIN_EMAILS` env var provides email allowlist bypass

### Key Database Models (Prisma)

- **User** - Club members with roles, entitlements, registrations
- **Event** - Club events with registration/attendance tracking
- **League/Season/Round/Session** - Racing competition structure
- **Entry/Result** - Season entries and race results
- **Post/Page** - CMS content

### Client Components

Use `"use client"` directive only when interactivity is required. The codebase favors RSC by default.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (Supabase connection string, port 6543 for session mode)
- `DIRECT_URL` (optional, for migrations)
- `ADMIN_EMAILS` (comma-separated admin email allowlist)
