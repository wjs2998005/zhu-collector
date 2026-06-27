#!/usr/bin/env node
/**
 * Generate a single Zhu stamp image and append it to seed-images.json.
 *
 * Usage:
 *   OPENROUTER_API_KEY=sk-or-... node scripts/generate-stamp.mjs "Chef Zhu" "a chef pig wearing a tall white hat"
 *
 * After running, bump the seed version in src/db/seed.ts so the app re-seeds.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, '../src/db/seed-images.json');

const API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error('Set OPENROUTER_API_KEY env var');
  process.exit(1);
}

const [, , name, description] = process.argv;
if (!name || !description) {
  console.error('Usage: node scripts/generate-stamp.mjs "<Name Zhu>" "<description>"');
  process.exit(1);
}

const MODEL = 'google/gemini-3.1-flash-image';

const SYSTEM_PROMPT = `You are a professional illustrator who creates consistent, adorable kawaii pig character stickers.

DESIGN RULES (follow exactly for every generation):
- The image is a borderless sticker — NO circular border, NO ring, NO frame, NO seal border of any kind
- The pig character is centered on a plain white or very light pastel background
- Nothing else in the image besides the pig character and a clean simple background

PIG CHARACTER RULES (always the same pig design, only outfit/expression changes):
- The pig has soft LIGHT PINK skin (#FFE4E1 or similar pale pink)
- Large round head (disproportionately big — kawaii proportions)
- Small triangular ears with slightly darker pink inner ear
- Tiny oval snout in a slightly peachy pink with two small nostril dots
- Small black dot eyes, widely spaced
- Very small curved smile or expression-appropriate mouth
- Stubby rounded body below the head, same light pink
- Short stubby limbs with tiny hooves
- Small curly tail

ART STYLE RULES:
- Flat vector illustration style with no gradients, no shading, no 3D effects
- Clean thin black outlines around all shapes
- Solid pastel flat colors only
- Children's picture book / kawaii sticker aesthetic
- No realistic textures, no photorealistic elements
- Plain white or very light pastel background, nothing else

CRITICAL CONSTRAINTS — NEVER do any of the following:
NO realistic pig, NO 3D rendering, NO gradients, NO shading, NO photorealistic textures.
NO rectangular stamp shape, NO perforated edges, NO postage stamp look.
NO border, NO ring border, NO circular border, NO frame, NO decorative ring around the image.
NO dark colors, NO harsh outlines, NO creepy or scary expressions.
NO complex backgrounds, NO landscapes, NO extra characters.
NO text, NO name banner, NO labels.
NO adult content, NO weapons, NO inappropriate themes.`;

async function fetchAndBase64(url) {
  if (url.startsWith('data:')) return url;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const mimeType = res.headers.get('content-type') || 'image/png';
  const buffer = await res.arrayBuffer();
  return `data:${mimeType};base64,${Buffer.from(buffer).toString('base64')}`;
}

async function generate(stampName, stampDescription) {
  const userPrompt = `Create a kawaii pig character sticker illustration.

${stampDescription}

Follow ALL the design rules: borderless sticker, light pink pig (#FFE4E1), flat vector style, kawaii proportions, plain white background, NO borders or frames of any kind.`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      modalities: ['image', 'text'],
      image_config: { aspect_ratio: '1:1', image_size: '1K' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message;
  if (!message) throw new Error('No message in response');

  const content = message.content;
  let imageData = null;

  if (typeof content === 'string') {
    const m = content.match(/(?:https?:|data:image\/)[^\s"')]+/i);
    if (m) imageData = await fetchAndBase64(m[0]);
  } else if (Array.isArray(content)) {
    for (const part of content) {
      if (part.type === 'image_url' && part.image_url?.url) {
        imageData = await fetchAndBase64(part.image_url.url); break;
      }
      if (part.type === 'image' && part.data) {
        imageData = `data:image/png;base64,${part.data}`; break;
      }
    }
  }

  if (!imageData) {
    const raw = JSON.stringify(data);
    const m = raw.match(/data:image\/[^"]+/);
    if (m) imageData = m[0];
  }

  if (!imageData) throw new Error('No image data in response');

  const seeds = fs.existsSync(SEED_PATH)
    ? JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'))
    : [];

  // Replace if name already exists, otherwise append
  const idx = seeds.findIndex((s) => s.name === stampName);
  const entry = { name: stampName, description: stampDescription, imageData };
  if (idx >= 0) {
    seeds[idx] = entry;
    console.log(`Updated existing entry: ${stampName}`);
  } else {
    seeds.push(entry);
    console.log(`Appended new entry: ${stampName} (total: ${seeds.length})`);
  }

  fs.writeFileSync(SEED_PATH, JSON.stringify(seeds, null, 2));
  console.log('Saved to src/db/seed-images.json');
  console.log('Remember to bump the seed version in src/db/seed.ts');
}

generate(name, description).catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
