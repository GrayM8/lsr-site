# Longhorn Sim Racing

This is the official website for the Longhorn Sim Racing club at UT Austin.

Built with Next.js, TypeScript, Tailwind CSS, Prisma, and Supabase.

## Getting Started

### Prerequisites

- Node.js (v20.x or later)
- npm
- A Supabase project for database and authentication.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/lsr-site.git
    cd lsr-site
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create `.env.local` and `.env` files by copying the examples and add your Supabase credentials. You can get these from your Supabase project dashboard. Also fill in keys for the other providers.

    ```bash
    cp .env.example .env.local
    ```

    Now, open `.env.local` and fill in the values:

    ```env
    # Get these from your Supabase project's "API" settings
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key

    # Get this from your Supabase project's "Database" settings
    # Use the "Connection string" URI and make sure to use the Session Replay port (6543)
    DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:6543/postgres"
    ```

4.  **Run database migrations:**
    This will sync your database schema with the Prisma schema defined in the project.
    ```bash
    npm run db:migrate
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The site will be available at [http://localhost:3000](http://localhost:3000).

## Key Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Creates a production build of the site.
-   `npm run lint`: Lints the codebase for errors.
-   `npm run db:migrate`: Applies database migrations.
-   `npm run db:reset`: Resets and re-seeds the database (for development only).
-   `npm run set-role <userId> <role>`: Assigns a role (`admin`, `officer`) to a user.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
-   **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [Supabase Auth](https://supabase.com/auth)
-   **Deployment**: [Vercel](https://vercel.com/)
