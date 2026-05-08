import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// `output: 'static'` keeps the landing fully prerendered.
// Only routes that opt out via `export const prerender = false`
// (currently `/api/contact`) run on-demand through the Node adapter.
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
