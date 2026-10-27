/**
 * GRANMED.STORE — Génération des icônes PWA depuis la marque (favicon officiel).
 * Usage : bun scripts/generate-pwa-icons.ts
 * Sortie : public/icons/{icon-192,icon-512,icon-maskable-192,icon-maskable-512,apple-touch-icon}.png
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "icons");

/** Logo officiel Granmed (identique au favicon data-URI de layout.tsx). */
const ART = `
  <path d="M32 52c-12-5.8-20-14.8-20-25.4C12 18.6 20 12 27.2 12c2.7 0 4.8 1 4.8 1s2.1-1 4.8-1C44 12 52 18.6 52 26.6 52 37.2 44 46.2 32 52Z" fill="#fff7ed"/>
  <path d="M32 43v-13m0 0c0-4.8 4.2-8 9-8 0 5-4 8-9 8Zm0 3.2c0-4.2-3.6-7.4-8-7.4 0 4.6 3.6 7.4 8 7.4Z" stroke="#c2410c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
`;

/** Icône « any » : carré arrondi (coins transparents). */
const roundedSvg = (size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#e2725b"/>${ART}
  </svg>`;

/** Icône plein-cadre (maskable / apple) : fond terracotta plein, art centré en zone sûre. */
const fullBleedSvg = (size: number, scale: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="#e2725b"/>
    <g transform="translate(${64 * (1 - scale) / 2} ${64 * (1 - scale) / 2}) scale(${scale})">${ART}</g>
  </svg>`;

async function render(svg: string, file: string) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(join(OUT, file));
  console.log("✔", file);
}

await mkdir(OUT, { recursive: true });
await render(roundedSvg(192), "icon-192.png");
await render(roundedSvg(512), "icon-512.png");
await render(fullBleedSvg(192, 0.78), "icon-maskable-192.png");
await render(fullBleedSvg(512, 0.78), "icon-maskable-512.png");
await render(fullBleedSvg(180, 0.8), "apple-touch-icon.png");
console.log("Icônes PWA générées dans", OUT);
