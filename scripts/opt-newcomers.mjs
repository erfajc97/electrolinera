import { readFile, writeFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

const files = [
  'public/img/electrolinera/station-real.jpg',
  'public/img/electrolinera/station-real-2.jpg',
];

for (const f of files) {
  const buf = await readFile(f);
  const before = (await stat(f)).size;
  const meta = await sharp(buf).metadata();
  const long = Math.max(meta.width ?? 0, meta.height ?? 0);
  const max = 1600;
  let pipe = sharp(buf, { failOn: 'none' });
  if (long > max) {
    pipe = pipe.resize({
      width:  meta.width  >= meta.height ? max : null,
      height: meta.height >  meta.width  ? max : null,
      fit: 'inside',
    });
  }
  const out = await pipe.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  await writeFile(f, out);
  const webp = await sharp(buf, { failOn: 'none' })
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toBuffer();
  await writeFile(f.replace(/\.jpg$/, '.webp'), webp);
  const after = (await stat(f)).size;
  console.log(`${f}: ${(before/1024).toFixed(1)} KB -> ${(after/1024).toFixed(1)} KB | webp ${(webp.length/1024).toFixed(1)} KB`);
}
