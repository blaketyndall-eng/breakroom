# Local Dev

Use Node 22.16.0.

```bash
cd ~/breakroom
source ~/.zshrc
nvm use 22.16.0
pnpm install
pnpm check
pnpm build
pnpm dev
```

If port 4321 is busy, Astro will use the next open port, usually 4322.
