# Disart Energy — Electrolineras

Landing page for Disart Energy electric vehicle charging franchise (Colombia).

Built with Astro 5, React 19, Tailwind CSS v4. Single page in Spanish, eco-green palette in OKLCH, fully responsive.

## Stack

- Astro 5 (static + island architecture)
- React 19 (component islands when needed)
- Tailwind CSS v4 via `@tailwindcss/vite`
- Inter + Manrope (Google Fonts)

## Sections

Nav · Hero · TrustBar · Solución · Stats · Franquicia (paquetes) · Tecnología (App + Dashboard mock) · Beneficios · Productos · Proceso · FAQ · CTA + Form · Footer.

## Run locally

```bash
npm install
npm run dev      # http://127.0.0.1:4321
npm run build    # static output to dist/
npm run preview  # serve dist/
```

## Project layout

```
src/
  components/    # Astro components (Hero, Nav, etc.)
  layouts/       # BaseLayout
  pages/         # index.astro
  styles/        # global.css with @theme tokens
public/
  img/           # photos used in Hero, Productos
  favicon.svg
```

## Brand tokens

Palette defined in `src/styles/global.css` under `@theme` — OKLCH for predictable lightness across the green ramp (`brand-50…950`) plus a `lime-glow` accent and an `ink` neutral scale.
