# Shared libraries

Application adapters and domain services (not React UI).

| Path | Purpose |
|------|---------|
| `lib/supabase/` | Supabase server, admin, middleware, browser client, hooks, generated DB types |
| `lib/auth/` | Auth helpers (server actions, roles, completion, settings) |
| `lib/data/` | Read-only data loaders (e.g. home page) |
| `lib/class-gallery/` | Shared class gallery server actions (admin + teacher) |

Pure helpers without I/O stay in `utils/` (e.g. `utils/cn.ts`, `utils/date-format.ts`).
