/**
 * Regenerate PWA icons from public/logo.png (transparent bg, no black matte).
 * Run: bun scripts/generate-pwa-icons.mjs
 */
import sharp from 'sharp';
import { join } from 'path';

const LOGO_PATH = 'public/logo.png';
const OUT_DIR = 'public/icons';
const LOGO_SCALE = 0.68;
const MASKABLE_SCALE = 0.52;

async function logoWithoutBlack() {
  const { data, info } = await sharp(LOGO_PATH)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 24 && g < 24 && b < 24) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
    .trim()
    .png()
    .toBuffer();
}

async function makePwaIcon(size, filename, scale) {
  const trimmed = await logoWithoutBlack();
  const meta = await sharp(trimmed).metadata();
  const inner = Math.round(size * scale);
  const maxSide = Math.max(meta.width ?? inner, meta.height ?? inner);
  const s = inner / maxSide;
  const w = Math.round((meta.width ?? inner) * s);
  const h = Math.round((meta.height ?? inner) * s);

  await sharp(trimmed)
    .resize(w, h, { fit: 'inside' })
    .extend({
      top: Math.floor((size - h) / 2),
      bottom: Math.ceil((size - h) / 2),
      left: Math.floor((size - w) / 2),
      right: Math.ceil((size - w) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(join(OUT_DIR, filename));
}

await makePwaIcon(180, 'apple-touch-icon.png', LOGO_SCALE);
await makePwaIcon(192, 'icon-192.png', LOGO_SCALE);
await makePwaIcon(512, 'icon-512.png', LOGO_SCALE);
await makePwaIcon(512, 'icon-512-maskable.png', MASKABLE_SCALE);

console.log('PWA icons written to', OUT_DIR);
