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

Set these later when Supabase is live:

PUBLIC_SUPABASE_URL=  
PUBLIC_SUPABASE_ANON_KEY=  
PUBLIC_SITE_URL=https://thebreakroom.pages.dev  

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

## Local validation

Run:

cd ~/breakroom  
source ~/.zshrc  
nvm use 22.16.0  
pnpm install  
pnpm check  
pnpm build  
pnpm dev  
