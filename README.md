# Ukrainia School

Web platform for a Ukrainian school in the UK: bilingual public site (EN/UK), admin CMS, and a teacher portal for class galleries.

## Features

| Area                     | Description                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------- |
| **Public site**          | Home, news, calendar, gallery, classes, contact, donations                              |
| **Admin** (`/admin`)     | Users, teachers, events, news, documents, reviews, classes, gallery, schedule, messages |
| **Teacher** (`/teacher`) | Profile, class, class gallery                                                           |
| **Auth**                 | Email/password, Google OAuth, password reset                                            |
| **Payments**             | Stripe Checkout for donations + webhooks                                                |

## Stack

- **Runtime:** [Bun](https://bun.sh) + [Next.js 16](https://nextjs.org) (App Router)
- **UI:** React 19, [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com)
- **Backend:** [Supabase](https://supabase.com) (Postgres, Auth, Storage)
- **ORM / migrations:** [Drizzle](https://orm.drizzle.team) + Supabase CLI SQL migrations
- **Testing:** [Playwright](https://playwright.dev)
- **Payments:** [Stripe](https://stripe.com)

## Prerequisites

- Bun ≥ 1.2
- Docker (for local Supabase)
- Supabase CLI (invoked via `bunx` in npm scripts)

## Quick start

```bash
# 1. Dependencies
bun install

# 2. Environment variables
cp .env.local.example .env.local
# Fill in keys after db:start (see CLI output)

# 3. Local database + seed
bun run db:start

# 4. Dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed accounts (after `db:start`)

| Email            | Password           | Role  |
| ---------------- | ------------------ | ----- |
| `admin@admin.uk` | `mHMGB1uzkdfQ16xU` | admin |
| `user@user.uk`   | `TestPassword123`  | user  |

> These credentials are for local development only. Use dedicated accounts in production.

## Project structure

```
app/
  (public)/          # Public pages (about, parents, donate, contact…)
  admin/             # Admin panel + server actions
  teacher/           # Teacher portal
  auth/              # Login, sign-up, callback
  api/               # Webhooks (Stripe), cron
components/
  features/          # Domain UI (admin forms, calendar, home…)
  common/            # Shared components (layout, lightbox, sidebar…)
  ui/                # shadcn primitives
lib/
  auth/              # Session, roles, profile completion
  supabase/          # Clients, types, middleware helper
  data/              # Cached public data (home page)
providers/           # Auth, language (EN/UK), theme
supabase/
  migrations/        # SQL migrations (source of truth for remote)
  schemas/           # Drizzle schema + bucket policies
  seed.sql           # Local test users
tests/               # Playwright E2E
proxy.ts             # Auth gate for /admin and /teacher (Next.js 16 proxy)
```

See [lib/README.md](./lib/README.md) for details on `lib/`.

## Architecture (overview)

- **Pages** — Server Components; interactivity in `'use client'` components.
- **Mutations** — Server Actions in `app/**/actions.ts`.
- **Auth:** `proxy.ts` only checks for an active session on `/admin` and `/teacher`; role checks (`admin` / `teacher`) run in `app/admin/layout.tsx` and `app/teacher/layout.tsx` via `getCurrentUser()`.
- **Public data** — `unstable_cache` + `updateTag()` for cache invalidation after admin changes (see `lib/data/home.ts`, `lib/cache/public-revalidate.ts`).
- **Heavy client modules** — dynamic imports (`RichTextEditorDynamic`, `SortableTableDynamic`).

## Environment variables

Copy `.env.local.example` → `.env.local`.

| Variable                                    | Purpose                                 |
| ------------------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                      | Site URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL`                  | Supabase API URL                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`             | Public anon key                         |
| `SUPABASE_SERVICE_ROLE_KEY`                 | Service role key (server-side only)     |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`        | Stripe publishable key                  |
| `STRIPE_SECRET_KEY`                         | Stripe secret key                       |
| `STRIPE_WEBHOOK_SECRET`                     | Webhook signing secret                  |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth                            |
| `CRON_SECRET`                               | Vercel Cron auth (`/api/cron`)          |

After `bun run db:start`, Supabase keys are printed by the CLI or available via `bun run db:status`.

## Database

Schema is defined in `supabase/schemas/index.ts` (Drizzle). Applied migrations live in `supabase/migrations/`.

### Local

```bash
bun run db:start          # Start Supabase (Docker)
bun run db:migrate        # Apply migrations locally
bun run db:generate-types # Regenerate lib/supabase/types.ts
bun run db:reset          # Reset DB + re-seed
bun run db:stop           # Stop containers
```

### Schema changes

1. Edit `supabase/schemas/index.ts`
2. `bun run db:diff` — generate a migration
3. `bun run db:migrate` — apply locally
4. `bun run db:generate-types` — update TypeScript types

### Remote (staging / production)

```bash
bun run supabase:link   # One-time: link to supabase.com project
bun run supabase:push   # Apply new migrations to remote
```

Verify in Supabase Dashboard → **Database** → **Migrations**.

### RLS & Storage

- All `public` tables have RLS policies in the Drizzle schema (`crudPolicy`). Without policies, data may be exposed to anonymous users.
- Buckets and storage policies are managed in `supabase/schemas/buckets/index.sql` (separate workflow; see [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)).

## Scripts

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `bun dev`               | Dev server                         |
| `bun run build`         | Production build                   |
| `bun run start`         | Run production build               |
| `bun run lint`          | ESLint                             |
| `bun run typecheck`     | `tsc --noEmit`                     |
| `bun run knip`          | Dead code detection                |
| `bun run analyze`       | Bundle analyzer (`.next/analyze/`) |
| `bun run format`        | Prettier                           |
| `bun run test`          | Playwright (all browsers)          |
| `bun run test:chromium` | Chromium only                      |
| `bun run test:ui`       | Playwright UI mode                 |

## Testing

E2E tests live in `tests/`. First-time setup:

```bash
bun run test:install
bun run db:start   # separate terminal
bun dev            # separate terminal
bun run test
```

Recommendation: for each CRUD operation, add a test for allowed access and one for denied access.

## Stripe (donations)

1. Enable **Test Mode** in the [Stripe Dashboard](https://dashboard.stripe.com).
2. Add keys to `.env.local`.
3. Webhook endpoint: `https://<your-domain>/api/webhooks` (checkout events).
4. Locally:

```bash
bun run stripe:login
bun run stripe:listen   # forwards to localhost:3000/api/webhooks
```

Copy the `whsec_…` value from the CLI output into `STRIPE_WEBHOOK_SECRET`.

## Deployment

### Vercel

1. Connect the repository to Vercel.
2. Add environment variables from `.env.local.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
4. Cron is configured in `vercel.json` (`/api/cron` every 5 days); requires `CRON_SECRET`.

### Supabase (production)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `bun run supabase:link` → `bun run supabase:push`.
3. **Auth → URL configuration:** set Site URL to your production domain; add redirect URLs for `/auth/callback`.
4. Configure Google OAuth if needed.

## UI & theming

- Components: `components/ui/` (shadcn).
- Design tokens: `styles/main.css`.
- Fonts: Inter + Manrope (Latin + Cyrillic).
- UI contribution guidelines: `.cursor/rules/ui-design-consistency.mdc`.

[tweakcn](https://tweakcn.com) is loaded in development only (`NODE_ENV=development`) for theme experiments.

## Further reading

| File                                                         | Contents                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| [lib/README.md](./lib/README.md)                             | Module overview for `lib/`                                    |
| [lib/supabase/README.md](./lib/supabase/README.md)           | `executeWithMetadata` / `useSupabaseStore` pattern (optional) |
| [docs/middleware-to-proxy.md](./docs/middleware-to-proxy.md) | Middleware → proxy migration (Next.js 16)                     |

## License

Private project. All rights reserved.
