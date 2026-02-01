# Project Context: Longhorn Sim Racing Website (`lsr-site`)

## Overview
This is the official web application for **Longhorn Sim Racing** at UT Austin. It manages club operations including event scheduling, race result tracking, membership management, and content publishing.

## Tech Stack
*   **Framework:** Next.js 16.1.1 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4, shadcn/ui (Radix Primitives), Framer Motion
*   **Database:** PostgreSQL (via Supabase)
*   **ORM:** Prisma 6.15.0
*   **Authentication:** Supabase Auth (SSR & Client)
*   **Validation:** Zod, React Hook Form
*   **Date Handling:** date-fns

## Key Directories
*   `src/app`: Next.js App Router pages, layouts, and API routes.
*   `src/components`: React components.
    *   `src/components/ui`: Reusable UI components (likely shadcn/ui).
*   `src/lib`: Shared utilities, configuration, and business logic.
    *   `src/lib/prisma.ts`: Prisma client instance.
    *   `src/lib/supabase-*.ts`: Supabase client initialization (client/server/rsc).
*   `src/server`: Server-side specific logic (Actions, Queries).
*   `prisma`: Database schema, migrations, and seed scripts.
*   `public`: Static assets.
*   `scripts`: Maintenance and utility scripts (e.g., `set-role.ts`).

## Database Schema (Prisma)
The database is extensive, covering several domains:
*   **Identity & Access:** `User`, `Role`, `UserRole`, `AuthIdentity`.
    *   Roles: `admin`, `officer`, `member`.
*   **Events:** `Event`, `EventSeries`, `Venue`, `EventRegistration`, `EventAttendance`.
    *   Supports check-ins via QR or manual entry.
*   **Racing Data (Leagues):** `League`, `Season`, `Round`, `Session`, `Result`, `Entry`.
    *   Tracks traditional season standings and individual race results.
*   **Ingestion (Sim Data):** `RawResultUpload`, `RaceSession`, `RaceParticipant`, `RaceResult`.
    *   Handles raw JSON uploads from sim racing games (likely Assetto Corsa via the schema structure).
*   **Commerce & Membership:** `Product`, `Payment`, `Entitlement`, `MembershipTier`.
*   **Content:** `Post`, `Page`, `Media`, `GalleryImage`.

## Development Workflow

### Prerequisites
*   Node.js (v20+)
*   PostgreSQL Database (Supabase recommended)
*   Env vars set in `.env` (copy from `.env.example` if available, see `src/env.mjs`).

### Key Commands
*   **Start Dev Server:** `npm run dev`
*   **Build:** `npm run build`
*   **Lint:** `npm run lint`
*   **Database Migrations:** `npm run db:migrate` (runs `prisma migrate dev`)
*   **Generate Prisma Client:** `npm run db:generate`
*   **Set User Role:** `npm run set-role <userId> <role>`
*   **Seed Database:** `npx prisma db seed`

## Environment Variables
Defined in `src/env.mjs`:
*   `DATABASE_URL`: Connection string for Prisma.
*   `DIRECT_URL`: Direct connection string for migrations (bypassing poolers).
*   Additional public/private keys for Supabase are likely required but not explicitly validated in the snippet read.

## Architecture & Conventions
*   **React Server Components (RSC):** The app uses the App Router. default to Server Components unless interactivity is needed (`"use client"`).
*   **Data Fetching:** Fetch data directly in Server Components using Prisma or cached server actions.
*   **Mutations:** Use Server Actions for form submissions and data mutations.
*   **Type Safety:** Heavy use of Zod for schema validation (forms, env vars, API inputs).
*   **Styling:** Utility-first CSS with Tailwind. Components are often built on top of Radix UI primitives.
