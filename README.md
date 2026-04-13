# Portfolio Webpage v5

Personal portfolio website built with the T3 Stack, showcasing projects, experience, certifications, and tech stack.

## Tech Stack

- [Next.js](https://nextjs.org) — React framework with App Router
- [tRPC](https://trpc.io) — End-to-end type-safe APIs
- [Drizzle ORM](https://orm.drizzle.team) — Type-safe database ORM with PostgreSQL
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com) — Radix UI-based component library
- [UploadThing](https://uploadthing.com) — File uploads (resume/CV)
- [Zustand](https://zustand-demo.pmnd.rs) — Client state management
- [Zod](https://zod.dev) — Schema validation

## Features

- Public portfolio page with projects, experience, certifications, and tech stack sections
- CV/resume viewer and upload
- Admin dashboard to manage all content (protected by auth)
- Dark mode support
- Fully type-safe from database to UI

## Getting Started

Install dependencies:

```bash
pnpm install
```

Copy the environment file and fill in the required values:

```bash
cp .env.example .env
```

Run database migrations:

```bash
pnpm db:migrate
```

Start the dev server:

```bash
pnpm dev
```

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm check` | Run Biome linter/formatter |
| `pnpm check:write` | Run Biome and auto-fix |
| `pnpm db:generate` | Generate Drizzle migration files |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:push` | Push schema changes directly |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed the database |
| `pnpm db:reset` | Reset the database |
| `pnpm db:clean` | Clean the database |
