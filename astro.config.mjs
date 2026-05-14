import { defineConfig } from 'astro/config';
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
    sitemap({
      filter: (page) =>
        !page.includes('/api/') &&
        !page.endsWith('/privacidad/') &&
        !page.endsWith('/terminos/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Priority hierarchy: home + investor money page = max; flagship verticals next.
        if (item.url === 'https://disartenergy.com/') return { ...item, priority: 1.0, changefreq: 'weekly' };
        if (item.url === 'https://disartenergy.com/inversion/') return { ...item, priority: 0.95, changefreq: 'weekly' };
        if (item.url === 'https://disartenergy.com/electrolineras/') return { ...item, priority: 0.95, changefreq: 'weekly' };
        if (
          item.url === 'https://disartenergy.com/solar/' ||
          item.url === 'https://disartenergy.com/movilidad/'
        ) return { ...item, priority: 0.85, changefreq: 'monthly' };
        if (item.url === 'https://disartenergy.com/nosotros/') return { ...item, priority: 0.7, changefreq: 'monthly' };
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
