# Middleware → Proxy migration (Next.js 16)

## Status

| Step | Status |
|------|--------|
| Rename root `middleware.ts` → `proxy.ts` | Done |
| Rename exported `middleware()` → `proxy()` | Done |
| Keep `lib/supabase/middleware.ts` helper (Supabase SSR naming) | Deferred — optional rename |
| Verify auth redirects for `/admin` and `/teacher` | Manual QA |

## What changed

Next.js 16 deprecates the `middleware` file convention in favor of [`proxy`](https://nextjs.org/docs/app/api-reference/file-conventions/proxy). Behavior is unchanged: session refresh via Supabase cookies and role-based redirects for admin/teacher routes.

## Follow-up (optional)

1. **Rename Supabase helper** (cosmetic): `lib/supabase/middleware.ts` → `lib/supabase/proxy.ts`, `createMiddlewareSupabaseClient` → `createProxySupabaseClient`. Update import in `proxy.ts` only.
2. **Other `<img>` in admin tables**: `NewsManagementTable.tsx` still uses `<img>` with an eslint-disable — migrate when touching that file.
3. **Long-term**: Next.js recommends avoiding proxy for app logic where possible; consider moving auth checks to layout Server Components + `redirect()` for `/admin` and `/teacher` route groups, keeping proxy only for cookie refresh if needed.

## Verification

```bash
bun run lint
bun run build
```

Manual checks:

- Unauthenticated user → `/admin` redirects to `/auth/login?redirectTo=...`
- Teacher → `/admin` redirects to `/teacher`
- Admin → `/teacher` redirects to `/admin`
- Gallery admin tables show thumbnails (Supabase `remotePatterns` in `next.config.mjs`)

## Codemod reference

If starting from scratch on another branch:

```bash
npx @next/codemod@canary middleware-to-proxy .
```
