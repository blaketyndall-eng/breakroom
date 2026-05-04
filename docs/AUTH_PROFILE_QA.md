# Auth + Profile QA Checklist

Use this checklist before merging auth/profile work.

## Local preview mode

Run without Supabase env keys.

```txt
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

Expected behavior:

1. `/signup` loads.
2. User can enter email and optional alias.
3. Submit creates a local OmniShift profile.
4. User lands on `/portal`.
5. Portal clearly indicates local preview mode.
6. Clock Out works locally.
7. `/after-hours` opens after Clock Out.
8. Sign Out / Leave Badge clears local badge and returns to `/breakroom`.

## Supabase live mode

Run with live env keys.

```txt
PUBLIC_SUPABASE_URL=https://bfinjvvtornltgytsvai.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<browser publishable or anon key>
PUBLIC_SITE_URL=http://localhost:4321
```

Expected behavior:

1. `/signup` loads and says Supabase is configured.
2. Email/password signup works.
3. `user_profiles` row is created.
4. `/portal` shows employee file.
5. Refresh Employee File pulls remote profile when signed in.
6. Clock Out updates local state.
7. Clock Out updates `user_profiles.shift_status` to `clocked_out`.
8. Clock Out writes `clocked_out_at`.
9. `/after-hours` allows access after Clock Out.
10. Sign Out / Leave Badge clears local storage and Supabase session.

## Callback mode

Expected behavior:

1. Magic link sends to email.
2. Magic link returns to `/auth/callback`.
3. OAuth returns to `/auth/callback` when provider credentials are configured.
4. Callback validates the Supabase session.
5. Callback loads an existing employee profile or creates one.
6. Callback saves local profile cache.
7. Callback redirects to `/portal` by default.
8. Callback only accepts safe internal `next` paths.

## Required Supabase redirect URLs

```txt
http://localhost:4321/auth/callback
http://localhost:4322/auth/callback
https://thebreakroom.pages.dev/auth/callback
```

Optional direct fallback URLs:

```txt
http://localhost:4321/portal
http://localhost:4322/portal
https://thebreakroom.pages.dev/portal
```

## Regression checks

Run:

```bash
pnpm check
pnpm build
```

Watch for:

- Type errors from Supabase query inference.
- Cloudflare adapter asset binding errors.
- Dynamic route warnings are acceptable for now.

## Product truth

The auth flow is a story system, not a generic account flow.

The user should feel like they were accidentally hired by a fake AI-run company, then found the real world underneath by clocking out.
