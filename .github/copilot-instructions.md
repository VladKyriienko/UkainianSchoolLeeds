# Copilot Instructions for AI Agents

## Project Overview
This is a Next.js application using TypeScript, Tailwind CSS, Supabase for authentication, storage, and database management, and Drizzle ORM for migrations. The architecture is modular, with clear separation between UI components, authentication logic, admin features, and database schema management.

## Key Directories & Files
- `app/` – Next.js app router structure. Subfolders for admin, auth, and design-system flows.
- `components/` – UI and admin components. Use `components/ui/` for reusable UI elements.
- `supabase/` – Database schema (`schemas/`), migrations, and config. Buckets managed in `schemas/buckets/index.sql`.
- `utils/` – Utility functions, including Supabase client creation and helpers.
- `README.md` – Contains essential setup, migration, and workflow instructions.

## Database & Auth
- Database schema is defined in TypeScript (`supabase/schemas/index.ts`).
- All tables require Row Level Security (RLS) policies; see README for details.
- Auth is managed via Supabase. User roles are stored in the `roles` table and checked in components (e.g., see `/utils/route-protection.ts`).

## Developer Workflows
- **Start Dev Server:** `bun dev` or `npm run dev`
- **Run Tests:** Playwright specs in `tests/` (e.g., `bun run test` or `npx playwright test`)
- **Database Migration:**
  1. Edit schema in `supabase/schemas/index.ts`
  2. Generate migration: `bun db:diff`
  3. Apply migration: `bun db:migrate`
  4. Regenerate types: `bun supabase:generate-types`
- **Buckets:** Managed via SQL in `supabase/schemas/buckets/index.sql` (see README for workflow).

## Patterns & Conventions
- Use Drizzle ORM for all database migrations except Supabase buckets.
- Page-specific UI components should be stored in their respective `app/` subfolders.
- Complex RLS policies, especially for persist operations, should instead be performed by the admin client in server functions.
- All new tables must have explicit RLS policies to avoid public data exposure.
- Use TypeScript types generated from Supabase for all DB models.

## Integration Points
- Supabase: Auth, DB, storage buckets.
- Drizzle ORM: Schema definition and migrations.
- Playwright: End-to-end tests in `tests/`.

## Example: Server Role Check

```tsx
const { data: { user } } = await supabase.auth.getUser();
const { data: roleData } = await supabase.from('roles').select('role').eq('user_id', user.id).single();
const isAdmin = roleData?.role === 'admin';
```

## Example: Client Role Check

```tsx
import { useAuthContext } from '@/providers/auth-provider';
export function Client() {
  const { userData } = useAuthContext();
  const isAdmin = userData?.roles?.includes('admin');
  return <div>{isAdmin ? 'Admin View' : 'User View'}</div>;
}
```

## Additional Notes
- Always consult `README.md` for up-to-date workflow and migration steps.
- For bucket management, follow the SQL workflow in `supabase/schemas/buckets/index.sql`.
- Regenerate types after DB schema changes to keep models in sync.

---
For questions or unclear conventions, review `README.md` or ask for clarification.
