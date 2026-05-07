import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // Workaround for `require_dist is not a function` error during Astro 6.2.2 +
    // @astrojs/cloudflare 13.3.1 SSR build. The `cookie` CJS package gets
    // mis-shimmed by Vite's ssrOptimizeDeps; bypassing optimization for it
    // restores normal CJS interop. Remove this when bumping to a paired
    // adapter+astro version that fixes the upstream interop issue.
    ssr: {
      noExternal: ['cookie'],
    },
    optimizeDeps: {
      exclude: ['cookie'],
    },
  },
  site: 'https://thebreakroom.blaketyndall.workers.dev',
});
