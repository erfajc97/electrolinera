import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// `output: 'static'` keeps the landing fully prerendered.
// Routes that opt out via `export const prerender = false`
// (currently `/api/contact`) deploy as Netlify Functions through the adapter.
export default defineConfig({
  output: 'static',
  adapter: netlify(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
