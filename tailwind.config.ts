import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ash: '#12110f',
        nicotine: '#d8c9a6',
        felt: '#1f4a32',
        dashboard: '#38ff7a',
        beer: '#b62b24',
        motel: '#2c5f9e',
        chrome: '#c7c7be',
        stamp: '#b00020'
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
        serif: ['Georgia', 'Times New Roman', 'serif']
      }
    }
  },
  plugins: []
} satisfies Config;
