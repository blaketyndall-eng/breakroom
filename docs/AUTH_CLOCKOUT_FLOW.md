# Auth + Clock Out Flow

This sprint wires the first real identity loop.

## Goals

- Sign up from `/signup` or `/breakroom`.
- Support Supabase email/password, magic link, and Google OAuth once env keys/providers are configured.
- Fall back to local preview mode when Supabase env keys are missing.
- Create or retrieve an OmniShift employee profile.
- Write Clock Out state locally and to Supabase when signed in.
- Gate `/after-hours` behind Clock Out state.

## Required Supabase Setup

1. Create a Supabase project.
2. Add env values:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
3. Run migrations in `supabase/migrations`.
4. Enable Google provider if using Google OAuth.
5. Add local redirect URL: `http://localhost:4321/portal`.
6. Add production redirect URL once deployed.

## Notes

This is not final security. It is V1 product truth: the site can remember a user, assign identity, clock them out, and let them into the first after-hours layer.
