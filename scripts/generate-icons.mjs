#!/usr/bin/env node
/**
 * Generates PWA icons (192, 512, apple-touch 180) and favicon SVG
 * from an inline SVG pig face. Run: node scripts/generate-icons.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '../public');

// Pig face SVG — designed to look good at 192px and 512px
// Pink circle background, round pig head, ears, snout, dot eyes, blush cheeks
const pigSVG = (size) => {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.48; // outer circle radius

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <!-- Background circle -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFB6C1"/>

  <!-- Ears (behind head) -->
  <ellipse cx="${cx - s * 0.27}" cy="${cy - s * 0.18}" rx="${s * 0.12}" ry="${s * 0.10}" fill="#FF8FAB"/>
  <ellipse cx="${cx + s * 0.27}" cy="${cy - s * 0.18}" rx="${s * 0.12}" ry="${s * 0.10}" fill="#FF8FAB"/>
  <!-- Inner ear -->
  <ellipse cx="${cx - s * 0.27}" cy="${cy - s * 0.18}" rx="${s * 0.07}" ry="${s * 0.06}" fill="#FF69B4"/>
  <ellipse cx="${cx + s * 0.27}" cy="${cy - s * 0.18}" rx="${s * 0.07}" ry="${s * 0.06}" fill="#FF69B4"/>

  <!-- Head -->
  <circle cx="${cx}" cy="${cy + s * 0.02}" r="${s * 0.34}" fill="#FFE4E1"/>

  <!-- Eyes -->
  <circle cx="${cx - s * 0.10}" cy="${cy - s * 0.06}" r="${s * 0.035}" fill="#3D2B1F"/>
  <circle cx="${cx + s * 0.10}" cy="${cy - s * 0.06}" r="${s * 0.035}" fill="#3D2B1F"/>
  <!-- Eye shine -->
  <circle cx="${cx - s * 0.085}" cy="${cy - s * 0.075}" r="${s * 0.012}" fill="white"/>
  <circle cx="${cx + s * 0.115}" cy="${cy - s * 0.075}" r="${s * 0.012}" fill="white"/>

  <!-- Blush cheeks -->
  <ellipse cx="${cx - s * 0.16}" cy="${cy + s * 0.04}" rx="${s * 0.07}" ry="${s * 0.045}" fill="#FF8FAB" opacity="0.5"/>
  <ellipse cx="${cx + s * 0.16}" cy="${cy + s * 0.04}" rx="${s * 0.07}" ry="${s * 0.045}" fill="#FF8FAB" opacity="0.5"/>

  <!-- Snout -->
  <ellipse cx="${cx}" cy="${cy + s * 0.10}" rx="${s * 0.13}" ry="${s * 0.09}" fill="#FFB6C1"/>
  <!-- Nostrils -->
  <ellipse cx="${cx - s * 0.05}" cy="${cy + s * 0.10}" rx="${s * 0.03}" ry="${s * 0.025}" fill="#FF8FAB"/>
  <ellipse cx="${cx + s * 0.05}" cy="${cy + s * 0.10}" rx="${s * 0.03}" ry="${s * 0.025}" fill="#FF8FAB"/>

  <!-- Smile -->
  <path d="M ${cx - s * 0.07} ${cy + s * 0.18} Q ${cx} ${cy + s * 0.23} ${cx + s * 0.07} ${cy + s * 0.18}"
    stroke="#D4607A" stroke-width="${s * 0.018}" fill="none" stroke-linecap="round"/>
</svg>`;
};

// Favicon SVG (vector, stays as SVG file)
const faviconSVG = pigSVG(64);

async function run() {
  // Write favicon.svg
  fs.writeFileSync(path.join(PUBLIC, 'favicon.svg'), faviconSVG);
  console.log('✓ favicon.svg');

  // Generate raster icons from SVG
  const sizes = [
    { file: 'pwa-192x192.png', size: 192 },
    { file: 'pwa-512x512.png', size: 512 },
    { file: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { file, size } of sizes) {
    const svg = Buffer.from(pigSVG(size));
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(PUBLIC, file));
    console.log(`✓ ${file} (${size}x${size})`);
  }

  console.log('\nDone! Icons generated in public/');
}

run().catch((err) => { console.error(err); process.exit(1); });
