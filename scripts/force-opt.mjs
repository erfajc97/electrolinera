// One-shot: copy each problematic file via Node fs to a buffer, process via sharp from buffer,
// write back. Avoids whatever lock sharp's libvips is hitting on direct path open.

import { readFile, writeFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

const TARGETS = [
  { path: 'public/img/solar/mountain-house.jpg', maxLong: 1920, q: 78 },
  { path: 'public/img/solar/solar-wind-farm.jpg', maxLong: 1920, q: 82 },
  { path: 'public/img/solar/utility-farm.jpg',    maxLong: 1920, q: 82 },
];

const fmt = (n) => (n / 1024).toFixed(1) + ' KB';

for (const t of TARGETS) {
  try {
    const before = (await stat(t.path)).size;
    const buf = await readFile(t.path);
    const img = sharp(buf, { failOn: 'none' });
    const meta = await img.metadata();
    const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
    let pipe = sharp(buf, { failOn: 'none' });
    if (longEdge > t.maxLong) {
      pipe = pipe.resize({
        width:  meta.width  >= meta.height ? t.maxLong : null,
        height: meta.height >  meta.width  ? t.maxLong : null,
        fit: 'inside',
      });
    }
    const out = await pipe.jpeg({ quality: t.q, mozjpeg: true }).toBuffer();
    await writeFile(t.path, out);
    // webp twin
    const webpOut = t.path.replace(/\.jpe?g$/i, '.webp');
    const w = await sharp(buf, { failOn: 'none' })
      .resize({ width: t.maxLong, height: t.maxLong, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    await writeFile(webpOut, w);
    const after = (await stat(t.path)).size;
    const webpSize = (await stat(webpOut)).size;
    console.log(`${t.path}\n  jpg: ${fmt(before)} -> ${fmt(after)}\n  webp: ${fmt(webpSize)} -> ${webpOut}`);
  } catch (err) {
    console.error(`FAIL ${t.path}:`, err.message);
  }
}
