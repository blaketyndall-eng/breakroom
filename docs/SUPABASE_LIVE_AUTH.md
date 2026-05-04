# Supabase Live Auth Setup

This document is the operational checklist for turning The Breakroom auth loop from local preview mode into real persisted Supabase auth.

## Goal

The user should be able to:

1. Visit `/signup`.
2. Create an account with email/password or magic link.
3. Receive an OmniShift employee profile in `public.user_profiles`.
4. Visit `/portal` and see the stored profile.
5. Click **Clock Out**.
6. Persist `shift_status = 'clocked_out'` in Supabase.
7. Refresh `/after-hours` and stay admitted.

## 1. Project

```txt
the-breakroom
Project ref: bfinjvvtornltgytsvai
Project URL: https://bfinjvvtornltgytsvai.supabase.co
```

Save these values from Supabase Project Settings > API:

```txt
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

Do not use or expose the service role key in the frontend.

## 2. Local environment

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Add:

```txt
PUBLIC_SUPABASE_URL=https://bfinjvvtornltgytsvai.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR_BROWSER_KEY
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_RADIO_STREAM_URL=
```

Restart Astro after changing env values:

```bash
pnpm dev
```

## 3. Database migrations

The live project has these migrations applied:

```txt
initial_breakroom_schema
rls_policies
seed_v1_content
fix_set_updated_at_search_path
add_clocked_out_at_to_user_profiles
```

Repo migration files:

```txt
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_rls_policies.sql
supabase/migrations/0003_seed_v1_content.sql
supabase/migrations/0004_add_clocked_out_at_to_user_profiles.sql
```

## 4. Auth providers

In Supabase Dashboard > Authentication > Providers:

### Email

Enable email provider.

For early testing, either:

- Keep email confirmation enabled and test confirmation emails, or
- Temporarily disable confirmation for faster local testing.

### Google

Enable Google provider only when ready.

You will need OAuth credentials from Google Cloud and the redirect URL shown by Supabase.

## 5. Redirect URLs

The app now routes magic link and OAuth redirects through:

```txt
/auth/callback
```

In Supabase Dashboard > Authentication > URL Configuration, add these redirect URLs:

```txt
http://localhost:4321/auth/callback
http://localhost:4322/auth/callback
https://thebreakroom.pages.dev/auth/callback
```

For direct fallback support, these are also acceptable:

```txt
http://localhost:4321/portal
http://localhost:4322/portal
https://thebreakroom.pages.dev/portal
```

When a custom domain is connected, add:

```txt
https://YOUR_CUSTOM_DOMAIN/auth/callback
https://YOUR_CUSTOM_DOMAIN/portal
```

Site URL for local testing:

```txt
http://localhost:4321
```

Site URL for production:

```txt
https://thebreakroom.pages.dev
```

## 6. Cloudflare Pages environment variables

In Cloudflare Pages > The Breakroom project > Settings > Environment variables, set:

```txt
PUBLIC_SUPABASE_URL=https://bfinjvvtornltgytsvai.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR_BROWSER_KEY
PUBLIC_SITE_URL=https://thebreakroom.pages.dev
PUBLIC_RADIO_STREAM_URL=
```

Set the same values for Preview and Production unless there is a separate Supabase project for staging.

## 7. Test checklist

Run locally:

```bash
source ~/.zshrc
nvm use 22.16.0
pnpm install
pnpm check
pnpm build
pnpm dev
```

Then test:

1. `/signup` loads.
2. Email/password signup succeeds.
3. `/portal` shows the created profile.
4. Supabase `user_profiles` has a row for the user.
5. Magic link sends to email.
6. Magic link lands on `/auth/callback`.
7. Callback restores/creates the employee profile and redirects to `/portal`.
8. `/after-hours` blocks before Clock Out.
9. `/clock-out` completes.
10. Supabase `user_profiles.shift_status` changes to `clocked_out`.
11. Supabase `user_profiles.clocked_out_at` is populated.
12. `/after-hours` allows entry after Clock Out.
13. Refresh still preserves access.
14. Sign out / new browser should require login again.

## 8. Known V1 limitations

- Local preview mode still works when env keys are absent.
- Employee generation is deterministic from email/alias, not manually editable yet.
- After Hours persona is still generated locally until Idle Hands registration is wired to Supabase.
- Google OAuth needs provider credentials before it can work.
- Production email templates are not yet branded.

## Product truth

For V1, auth is not just account creation. It is the first narrative ritual: the user is accidentally hired by OmniShift, given an employee file, then invited to Clock Out into the real room underneath.
