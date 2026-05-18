import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const src = path.join(root, "assets", "Logo Jpg-01.jpg");
const outDir = path.join(root, "public", "img");

const meta = await sharp(src).metadata();
const w = meta.width;
const h = meta.height;

const left = Math.round(w * 0.155);
const top = Math.round(h * 0.39);
const cw = Math.round(w * 0.71);
const ch = Math.round(h * 0.20);

const base = sharp(src).extract({ left, top, width: cw, height: ch }).flatten({ background: "#ffffff" });

await base.clone().webp({ quality: 92 }).toFile(path.join(outDir, "logo.webp"));
await base.clone().png({ compressionLevel: 9 }).toFile(path.join(outDir, "logo.png"));

const faviconSrc = path.join(root, "assets", "favicon.png");
const fav = sharp(faviconSrc).trim({ threshold: 240 });
await fav.clone().resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, "favicon-16x16.png"));
await fav.clone().resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, "favicon-32x32.png"));
await fav.clone().resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, "favicon-48x48.png"));
await fav.clone().resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(outDir, "apple-touch-icon.png"));
await fav.clone().resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(root, "public", "favicon.png"));

console.log("logo cropped", { left, top, cw, ch });
