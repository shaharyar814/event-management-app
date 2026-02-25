# AGENTS.md

## Cursor Cloud specific instructions

### Overview

EventHub is a single Next.js 15 application (not a monorepo) that uses Supabase (cloud-hosted PostgreSQL + Auth) as its backend. There is no local database or Docker setup.

### Running the dev server

```
npm run dev
```

Starts Next.js with Turbopack on port 3000. See `package.json` for all available scripts.

### Environment variables

The app requires three Supabase secrets in `.env.local` (see `env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Without valid Supabase credentials, the app will render UI pages but all Supabase API calls (auth, database) will fail with "Failed to fetch". The middleware and auth context handle missing/invalid credentials gracefully — unauthenticated users are redirected to `/auth/login`.

### Pre-existing code issues

- `npm run lint` reports 1 error: a `require()` import in `next.config.ts`. This is pre-existing and does not block builds (ESLint is disabled during builds via `next.config.ts`).
- `npm run type-check` reports multiple TypeScript errors (Supabase SSR cookie types, implicit `any` types). These are pre-existing and do not block builds (TypeScript checking is disabled during builds via `next.config.ts`).

### Build

`npm run build` succeeds despite lint/type errors because `next.config.ts` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`.

### Key gotchas

- The `supabase` singleton export in `src/lib/supabase/client.ts` is an IIFE that throws immediately if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set. Always ensure `.env.local` exists with at least placeholder values before starting the dev server.
- `NEXT_PUBLIC_` env vars are inlined at compile time by Turbopack. After changing `.env.local`, you must fully restart the dev server (kill the process and run `npm run dev` again). A stale `.next` cache from a previous run with different env vars can cause 500 errors — delete `.next` if this happens.
- Supabase requires email confirmation by default. To create a test user and bypass email confirmation, use the admin API: `PUT /auth/v1/admin/users/{id}` with `{"email_confirm":true}` and `Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY`.
- The database schema (`src/lib/supabase/schema.sql` and `functions.sql`) must be run against your Supabase project before database-dependent features (events, profiles) will work. Auth works independently of the schema.
