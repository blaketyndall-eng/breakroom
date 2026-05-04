# Cloudflare Pages Deployment

The Breakroom deploys to Cloudflare Pages from GitHub.

## Cloudflare Pages settings

Use these settings in the Cloudflare Pages dashboard:

Framework preset: Astro  
Build command: pnpm build  
Build output directory: dist  
Root directory: /  
Node version: 22.16.0  
Package manager: pnpm  

## Environment variables

Set these in Cloudflare Pages for Preview and Production:

PUBLIC_SUPABASE_URL=https://bfinjvvtornltgytsvai.supabase.co  
PUBLIC_SUPABASE_ANON_KEY=<Supabase browser publishable or anon key>  
PUBLIC_SITE_URL=https://thebreakroom.pages.dev  
PUBLIC_RADIO_STREAM_URL=  

Do not add the Supabase service role key to Cloudflare Pages frontend env vars.

## Supabase redirect URLs required for deployed auth

Supabase Authentication URL Configuration must allow:

https://thebreakroom.pages.dev/auth/callback  
https://thebreakroom.pages.dev/portal  

When a custom domain is connected, also add:

https://YOUR_CUSTOM_DOMAIN/auth/callback  
https://YOUR_CUSTOM_DOMAIN/portal  

## Wrangler config

wrangler.toml is included for Pages project configuration and local compatibility.

Current approach:

- Use pages_build_output_dir = "./dist".
- Keep SSR enabled through the Astro Cloudflare adapter.
- Do not manually configure an ASSETS binding for Pages.
- Leave dynamic route prerendering for a future deploy-config pass.

## Deploy flow

1. Merge feature branch into main.
2. Cloudflare Pages builds from GitHub.
3. Preview deployments are created for PRs.
4. Production deployment happens from main.
5. Auth redirects return through `/auth/callback`.
6. `/auth/callback` restores or creates the employee profile, then sends the user to `/portal`.

## Local validation

Run:

cd ~/breakroom  
source ~/.zshrc  
nvm use 22.16.0  
pnpm install  
pnpm check  
pnpm build  
pnpm dev  

## Automation status

Already automated through connectors:

- GitHub branches, PRs, merges, docs, and code commits.
- Supabase project creation.
- Supabase schema migrations.
- Supabase seed data.
- Supabase security advisor fix for mutable function search path.

Still manual unless a Cloudflare connector/API is enabled:

- Connecting Cloudflare Pages to GitHub.
- Adding Cloudflare environment variables.
- Adding custom domain settings.
- Checking production deployment logs in Cloudflare.
