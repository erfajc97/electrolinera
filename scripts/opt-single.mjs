import { readFile, writeFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

const f = 'public/img/electrolinera/electrolinerasdisart.png';
const before = (await stat(f)).size;
const buf = await readFile(f);
const meta = await sharp(buf).metadata();
const max = 1600;
const long = Math.max(meta.width ?? 0, meta.height ?? 0);

// Re-encode as JPG (smaller for photographs) + keep .png as alias
let pipe = sharp(buf, { failOn: 'none' });
if (long > max) {
  pipe = pipe.resize({
    width:  meta.width  >= meta.height ? max : null,
    height: meta.height >  meta.width  ? max : null,
    fit: 'inside',
  });
}
const jpg = await pipe.jpeg({ quality: 84, mozjpeg: true }).toBuffer();
const jpgPath = f.replace(/\.png$/, '.jpg');
await writeFile(jpgPath, jpg);

const webp = await sharp(buf, { failOn: 'none' })
  .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toBuffer();
await writeFile(f.replace(/\.png$/, '.webp'), webp);

// Re-encode PNG smaller too
const pngOut = await sharp(buf, { failOn: 'none' })
  .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
  .png({ quality: 88, compressionLevel: 9, palette: true })
  .toBuffer();
if (pngOut.length < before) await writeFile(f, pngOut);

console.log(`${f}`);
console.log(`  png: ${(before/1024).toFixed(1)} KB → ${(pngOut.length/1024).toFixed(1)} KB`);
console.log(`  jpg twin: ${(jpg.length/1024).toFixed(1)} KB → ${jpgPath}`);
console.log(`  webp: ${(webp.length/1024).toFixed(1)} KB`);
