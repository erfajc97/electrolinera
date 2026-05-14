// Crop watermark from bottom-right of electrolinerasdisart.jpg + regenerate webp.
import { readFile, writeFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

const src = 'public/img/electrolinera/electrolinerasdisart.jpg';
const buf = await readFile(src);
const meta = await sharp(buf).metadata();
console.log('Original:', meta.width, 'x', meta.height);

// Crop right + bottom margins to remove watermark area
const cropRight = 90;
const cropBottom = 55;
const newW = meta.width - cropRight;
const newH = meta.height - cropBottom;

const cropped = await sharp(buf, { failOn: 'none' })
  .extract({ left: 0, top: 0, width: newW, height: newH })
  .jpeg({ quality: 84, mozjpeg: true })
  .toBuffer();
await writeFile(src, cropped);

// Regenerate webp twin from cropped
const webp = await sharp(cropped, { failOn: 'none' })
  .webp({ quality: 82, effort: 6 })
  .toBuffer();
await writeFile(src.replace(/\.jpg$/, '.webp'), webp);

// Regenerate PNG twin (same source name expected by some places)
const png = await sharp(cropped, { failOn: 'none' })
  .png({ quality: 88, compressionLevel: 9, palette: true })
  .toBuffer();
await writeFile(src.replace(/\.jpg$/, '.png'), png);

const after = (await stat(src)).size;
console.log('Cropped:', newW, 'x', newH, '·', (after/1024).toFixed(1), 'KB');
console.log('Webp:', (webp.length/1024).toFixed(1), 'KB');
console.log('Png:', (png.length/1024).toFixed(1), 'KB');
