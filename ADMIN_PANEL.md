# Admin Panel

CMS and operations dashboard for **Ukrainia School**. Admins manage public-site content, users, teachers, donations, and inbound messages.

## Access

A user must:

1. Be signed in (Supabase session cookie).
2. Have the `admin` role in the `roles` table.

### Request flow

```
Browser → proxy.ts          Session required for /admin/*
       → app/admin/layout.tsx   Admin role check; teachers → /teacher, others → /
       → page / server action     verifyAdminAccess() on mutations
```

| Layer   | File                      | Responsibility                                  |
| ------- | ------------------------- | ----------------------------------------------- |
| Proxy   | `proxy.ts`                | Redirect unauthenticated users to `/auth/login` |
| Layout  | `app/admin/layout.tsx`    | Enforce `admin` role; render sidebar shell      |
| Actions | `app/admin/**/actions.ts` | `verifyAdminAccess()` before writes             |

Teachers with a non-admin session who open `/admin` are redirected to `/teacher`.

## Navigation

Admin UI uses the **sidebar** (`AuthenticatedLayout` + `AppSidebar`), not the public site navbar. Items are defined in `utils/route-protection.ts` (`navigationRoutes`).

| Route                  | Section                               |
| ---------------------- | ------------------------------------- |
| `/admin`               | Dashboard (entity counts)             |
| `/admin/users`         | User accounts                         |
| `/admin/teachers`      | Teacher profiles (public “Who’s who”) |
| `/admin/events`        | School calendar events                |
| `/admin/donations`     | Stripe donation records               |
| `/admin/messages`      | Contact form submissions              |
| `/admin/documents`     | Key-info / policy documents           |
| `/admin/news`          | News articles                         |
| `/admin/reviews`       | Parent testimonials                   |
| `/admin/classes`       | Class pages                           |
| `/admin/gallery`       | School photo gallery                  |
| `/admin/class-gallery` | Per-class photo galleries             |
| `/admin/schedule`      | PDF schedule uploads                  |
| `/admin/profile`       | Admin’s own profile                   |

Standard CRUD pattern per section:

```
/admin/<section>              List (+ search / pagination)
/admin/<section>/create       Create form
/admin/<section>/[id]         Detail view
/admin/<section>/[id]/edit    Edit form
```

## Features by area

### Dashboard (`/admin`)

- Welcome message with admin name.
- Counts for users, teachers, events, messages, donations, documents, news, reviews, classes, class-gallery items, and school gallery items.
- Aggregated in `app/admin/actions.ts` → `getAdminDashboardStats()`.

### User management (`/admin/users`)

- Paginated list with search and role filter (`list_admin_users` RPC).
- Create user via email invite (`inviteUserByEmail`).
- Edit email, name, role, and teacher class assignment.
- Roles: `admin`, `teacher`, `user`.
- Deactivate / reactivate accounts (`users.is_active`).
- Delete user (auth + related public rows).
- Send password reset (verified users) or re-invite (unverified users) — `sendPasswordResetOrInvite()`.

Organisation assignment is supported at the **database/API** level (`getAllOrganisations()`, triggers on user create) but **organisation UI is disabled** — see [Configuration](#configuration).

### Content management

| Section       | Public impact            | Storage bucket (if any) |
| ------------- | ------------------------ | ----------------------- |
| Teachers      | `/about/whos-who`        | `teachers-photos`       |
| Events        | Calendar, home page      | `events-photos`         |
| News          | `/parents/news`, home    | `news-photos`           |
| Documents     | Key info, policies       | —                       |
| Reviews       | Home parent voices       | —                       |
| Classes       | `/parents/class-pages`   | `classes-photos`        |
| Gallery       | `/parents/gallery`, home | `gallery-photos`        |
| Class gallery | Class detail pages       | `class-gallery`         |
| Schedule      | Calendar PDF preview     | `schedule-files`        |

Most list endpoints support **offset pagination** and **ILIKE search** (trigram indexes on common text columns). News, gallery, and classes support **drag-and-drop reorder**.

### Donations (`/admin/donations`)

Read-only list of Stripe checkout sessions (created via `/api/donate` webhook flow). No manual create/edit in admin.

### Messages (`/admin/messages`)

View contact submissions; mark as read; delete.

### Admin profile (`/admin/profile`)

Self-service: name, avatar, email change, password change (`ChangeEmailDialog`, `ChangePasswordDialog`). Optional post-signup completion flow at `/admin/profile/complete` when enabled in settings.

## Server actions

Each domain keeps actions colocated with routes:

```
app/admin/
  actions.ts              # Dashboard stats
  users/actions.ts
  teachers/actions.ts
  events/actions.ts
  news/actions.ts
  documents/actions.ts
  reviews/actions.ts
  classes/actions.ts
  gallery/actions.ts
  schedule/actions.ts
  messages/actions.ts
  donations/actions.ts
  profile/actions.ts
```

Shared gallery logic for admin + teacher lives in `lib/class-gallery/actions.ts`.

### Conventions

- `'use server'` at top of action files.
- `await verifyAdminAccess()` (or role-aware helpers in class-gallery) before mutations.
- `createAdminClient()` from `lib/supabase/admin` for service-role operations.
- `revalidatePath()` + `revalidatePublicHomeData()` from `lib/cache/public-revalidate.ts` when public pages must refresh.

### Key user actions (`app/admin/users/actions.ts`)

| Function                                     | Purpose                            |
| -------------------------------------------- | ---------------------------------- |
| `getAllUsers({ page, limit, search, role })` | Paginated user list                |
| `getAllOrganisations()`                      | Fetch orgs (API only; UI disabled) |
| `createUser(data)`                           | Invite user by email               |
| `updateUser(userId, data)`                   | Profile, role, teacher class       |
| `deleteUser(userId)`                         | Remove user                        |
| `deactivateUser` / `reactivateUser`          | Toggle `is_active`                 |
| `sendPasswordResetOrInvite(userId)`          | Reset or invite email              |

## UI components

Admin-specific UI lives under `components/features/admin/`:

- `*ManagementTable` — list views with pagination links.
- `*Form` — create/edit forms (often with `RichTextEditorDynamic` for rich text).
- `*SearchForm` — URL-based filters.
- `SortableTableDynamic` — reorderable rows (news, gallery, classes).

Shared shells: `components/common/admin/` (`EntityTableShell`, `AdminDetailPhoto`, etc.).

## Configuration

Auth and feature toggles: `lib/auth/settings.ts`

```typescript
// Auth methods
allowOauth = true;
allowEmail = true;
allowPassword = true;
allowSignUp = false; // Public self-registration off

// Organisations (schema exists; admin UI not exposed)
allowOrganisations = false;
allowUserCreateOrganisations = false;
allowOrganisationInvites = false;
allowOrganisationRoleManagement = false;

// Optional forced profile completion after invite
requirePostSignupCompletion = false;
postSignupCompletionPath = '/admin/profile/complete';
```

### Required environment variables

| Variable                        | Used for                                      |
| ------------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase client                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser / SSR client                          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Admin server actions (never expose to client) |
| `NEXT_PUBLIC_SITE_URL`          | Email redirect URLs                           |
| `STRIPE_*`                      | Donations list (webhook-populated data)       |

## Database

### Roles

```sql
-- rolesEnum: 'admin' | 'teacher' | 'user'
CREATE TYPE rolesEnum AS ENUM ('admin', 'teacher', 'user');
```

A user can have one row in `roles` (upserted on admin update). Teachers may have a row in `teacher_class` linking them to a class.

### Promoting a user to admin (manual)

```sql
INSERT INTO roles (user_id, role)
VALUES ('<user-uuid>', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

Local seed admin: `admin@admin.uk` (see root [README.md](./README.md)).

### Organisations (optional / dormant)

Tables `organisations` and `organisation_memberships` exist in `supabase/schemas/index.ts`. With `allowOrganisations = false`, there are **no** `/admin/organisations` routes. Data may still appear on user detail pages if memberships exist.

## Security

- **Service role key** — server-only via `lib/supabase/admin.ts` singleton.
- **Authorization** — every admin action calls `verifyAdminAccess()`; RLS still applies to anon/authenticated clients on public routes.
- **Input validation** — Zod schemas in forms/utils; email and password rules in `utils/password-validation.ts`.
- **Inactive users** — cannot receive reset/invite emails until reactivated.
- **Proxy scope** — only `/admin/*` and `/teacher/*`; public routes stay open.

## Public cache invalidation

After admin edits to home-visible content, actions call:

```typescript
import { revalidatePublicHomeData } from '@/lib/cache/public-revalidate';

revalidatePath('/parents/news'); // route-specific
revalidatePublicHomeData('news'); // bust unstable_cache tags
```

Tags: `public-home`, `news`, `gallery`, `review`, `events`.

## Troubleshooting

| Symptom                         | Check                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------- |
| Redirect to login               | Session expired; sign in again                                               |
| Redirect to `/` or `/teacher`   | User lacks `admin` role                                                      |
| “Failed to fetch users”         | `list_admin_users` migration applied; service role key set                   |
| Emails not sent                 | `NEXT_PUBLIC_SITE_URL`; user `is_active`; Supabase Auth URL config           |
| Public site shows stale content | Admin save should call `revalidatePublicHomeData`; 5‑min cache TTL otherwise |
| Permission denied on storage    | Bucket policies in `supabase/schemas/buckets/index.sql`                      |

## Extending the admin panel

1. Add Drizzle schema + migration in `supabase/schemas/index.ts` → `bun run db:diff` → `bun run db:migrate`.
2. Regenerate types: `bun run db:generate-types`.
3. Create `app/admin/<section>/actions.ts` with `verifyAdminAccess()`.
4. Add pages under `app/admin/<section>/`.
5. Add UI in `components/features/admin/`.
6. Register route in `utils/route-protection.ts` (`navigationRoutes`).
7. If content appears on the public home page, wire `revalidatePublicHomeData()` in write actions.

## Related docs

- [README.md](./README.md) — setup, migrations, deployment
- [lib/README.md](./lib/README.md) — shared libraries
- [docs/middleware-to-proxy.md](./docs/middleware-to-proxy.md) — `proxy.ts` conventions
