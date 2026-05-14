#!/usr/bin/env node
// Image optimization for /public/img — converts large JPG/PNG to webp,
// resizes to sane max dimensions, and writes alongside the original.
// Keeps the original file as a fallback (the HTML still references .jpg/.png),
// but emits a .webp twin so a future <picture> migration is one step away.
//
// Usage:
//   node scripts/optimize-images.mjs                  # process everything
//   node scripts/optimize-images.mjs --replace        # also overwrite the original .jpg/.png with the optimized resized version
//
// Notes:
//   - Hero images get max 1920px on the long edge.
//   - Card / thumb images get max 1280px on the long edge.
//   - Quality target: 82.

import { readdir, stat, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const ROOTS = ['public/img/solar', 'public/img/electrolinera', 'public/img/vehiculos'];
const HERO_MAX = 1920;
const CARD_MAX = 1280;
const QUALITY  = 82;
const HERO_PATTERNS = [
  'utility-farm', 'solar-wind-farm', 'mountain-house', 'panel-skyview',
  'station-hero', 'station-ev-fast', 'charger-rain-suv', 'rooftop-village',
  'toyota-white-front', 'toyota-silver-front', 'toyota-black-port',
];

const REPLACE = process.argv.includes('--replace');

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (/\.(jpe?g|png)$/i.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

function isHero(path) {
  const name = basename(path).toLowerCase();
  return HERO_PATTERNS.some((p) => name.includes(p));
}

async function processFile(path) {
  const ext = extname(path).toLowerCase();
  const base = path.slice(0, -ext.length);
  const webpOut = base + '.webp';
  const max = isHero(path) ? HERO_MAX : CARD_MAX;

  const before = (await stat(path)).size;

  const img = sharp(path, { failOn: 'none' });
  const meta = await img.metadata();
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
  const resizeOpts = longEdge > max
    ? { width: meta.width >= meta.height ? max : null, height: meta.height > meta.width ? max : null, fit: 'inside' }
    : null;

  // 1) Emit a webp twin (always)
  let pipeline = sharp(path, { failOn: 'none' });
  if (resizeOpts) pipeline = pipeline.resize(resizeOpts);
  await pipeline.webp({ quality: QUALITY, effort: 5 }).toFile(webpOut);
  const webpSize = (await stat(webpOut)).size;

  // 2) Optionally re-encode the original (resize if oversized, re-compress always)
  let originalAfter = before;
  if (REPLACE) {
    let pipe2 = sharp(path, { failOn: 'none' });
    if (resizeOpts) pipe2 = pipe2.resize(resizeOpts);
    if (ext === '.png') {
      pipe2 = pipe2.png({ quality: 88, compressionLevel: 9, palette: true });
    } else {
      pipe2 = pipe2.jpeg({ quality: QUALITY, mozjpeg: true });
    }
    const buf = await pipe2.toBuffer();
    if (buf.length < before) {
      const { writeFile } = await import('node:fs/promises');
      await writeFile(path, buf);
      originalAfter = buf.length;
    }
  }

  return {
    path: path.replace(/\\/g, '/'),
    hero: isHero(path),
    before,
    originalAfter,
    webpSize,
    webpOut: webpOut.replace(/\\/g, '/'),
  };
}

const fmt = (n) => (n / 1024).toFixed(1) + ' KB';

(async () => {
  let totalBefore = 0;
  let totalAfter = 0;
  const results = [];

  for (const root of ROOTS) {
    const files = await walk(root);
    for (const f of files) {
      try {
        const r = await processFile(f);
        results.push(r);
        totalBefore += r.before;
        totalAfter += REPLACE ? r.originalAfter + r.webpSize : r.before + r.webpSize;
      } catch (err) {
        console.error('SKIP', f, err.message);
      }
    }
  }

  results.sort((a, b) => b.before - a.before);
  console.log('\nImage optimization report\n--------------------------');
  for (const r of results) {
    const tag = r.hero ? 'HERO' : 'CARD';
    const orig = REPLACE && r.originalAfter !== r.before
      ? `${fmt(r.before)} → ${fmt(r.originalAfter)} (resized)`
      : fmt(r.before);
    console.log(`[${tag}] ${r.path}`);
    console.log(`        original: ${orig}`);
    console.log(`        webp twin: ${fmt(r.webpSize)}  → ${r.webpOut}`);
  }
  console.log('--------------------------');
  console.log('Originals total before:', fmt(totalBefore));
  console.log('After (originals + webp twins):', fmt(totalAfter));
  console.log('Files processed:', results.length);
  if (!REPLACE) {
    console.log('\nRe-run with --replace to also shrink the originals (only if the resized version is smaller).');
  }
})();
