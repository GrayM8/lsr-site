# Project Context: Longhorn Sim Racing Website (`lsr-site`)

## Overview
This is the official website for the **Longhorn Sim Racing** club at UT Austin. It is a modern web application built to manage club activities, events, race results, and membership.

## Tech Stack
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4, shadcn/ui components
*   **Fonts:** Montserrat (Sans), Kanit (Display)
*   **Database:** PostgreSQL (via Supabase)
*   **ORM:** Prisma
*   **Authentication:** Supabase Auth
*   **Deployment:** Vercel

## Key Directories
*   `src/app`: Next.js App Router pages and layouts.
*   `src/components`: React components (UI, specific features).
*   `src/lib`: Utility functions, configuration, and shared logic (auth, dates, db clients).
*   `src/server`: Server-side logic, database access, and actions.
*   `src/schemas`: Zod schemas for validation.
*   `prisma`: Database schema and migration files.
*   `public`: Static assets (images, logos).

## Development Workflow

### Prerequisites
*   Node.js (v20+)
*   Supabase project (for DB and Auth)
*   Environment variables configured in `.env.local`

### Key Commands
*   **Start Dev Server:** `npm run dev`
*   **Build for Production:** `npm run build`
*   **Lint Code:** `npm run lint`
*   **Database Migrations:** `npm run db:migrate`
*   **Reset Database:** `npm run db:reset` (Dev only)
*   **Generate Prisma Client:** `npm run db:generate`
*   **Set User Role:** `npm run set-role <userId> <role>`

## Architecture & Conventions
*   **Rendering:** Heavily utilizes **React Server Components (RSC)**. Client components are used only when interactivity is required (`"use client"`).
*   **Data Fetching:** Direct database access in Server Components via Prisma.
*   **Authentication:** Supabase Auth is integrated. User sessions are cached for performance (`src/server/auth/cached-session`).
*   **Roles:** defined in `src/lib/roles.ts` (`member`, `officer`, `admin`, etc.).
*   **Environment:** Verified using `zod` in `src/env.mjs`.
*   **Theming:** Dark mode by default, managed via `next-themes`.

## Database Schema (Key Models)
*   **User:** Extends Supabase Auth user with application-specific profiles.
*   **Event:** Club events (meetings, races, practices).
*   **Result:** Race results linked to events and drivers.
*   **News:** Blog/News posts.
*   **Gallery:** Image collections.
