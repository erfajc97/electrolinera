import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `output: 'static'` keeps the landing fully prerendered.
// Routes that opt out via `export const prerender = false`
// (currently `/api/contact`) deploy as Netlify Functions through the adapter.
export default defineConfig({
  site: 'https://disartenergy.com',
  output: 'static',
  adapter: netlify(),
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/api/') &&
        !page.endsWith('/privacidad/') &&
        !page.endsWith('/terminos/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Boost priority for the home + flagship landings.
        if (item.url === 'https://disartenergy.com/') return { ...item, priority: 1.0 };
        if (
          item.url === 'https://disartenergy.com/solar/' ||
          item.url === 'https://disartenergy.com/movilidad/' ||
          item.url === 'https://disartenergy.com/electrolineras/'
        ) return { ...item, priority: 0.9 };
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
