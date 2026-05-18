import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const outDir = path.join(root, "public", "img");
const faviconSvgPath = path.join(root, "public", "favicon.svg");

const svgBuf = await fs.readFile(faviconSvgPath);

const renderFavicon = (size, outPath) =>
  sharp(svgBuf, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outPath);

await renderFavicon(16, path.join(outDir, "favicon-16x16.png"));
await renderFavicon(32, path.join(outDir, "favicon-32x32.png"));
await renderFavicon(48, path.join(outDir, "favicon-48x48.png"));
await renderFavicon(180, path.join(outDir, "apple-touch-icon.png"));
await renderFavicon(64, path.join(root, "public", "favicon.png"));

console.log("favicons rendered from", faviconSvgPath);
