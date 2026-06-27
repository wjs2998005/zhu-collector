// Generates AI images for all 105 Zhu stamps via OpenRouter.
// Saves progress to seed-images.json after each stamp so it can resume on failure.
// Run with: node scripts/generate-ai-seeds.mjs

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
if (!API_KEY) { console.error('Set VITE_OPENROUTER_API_KEY or OPENROUTER_API_KEY env var'); process.exit(1); }
const MODEL   = 'google/gemini-3.1-flash-image';
const OUT_PATH = join(__dirname, '../src/db/seed-images.json');

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

const STAMPS = [
  { name: 'Cold Zhu',        description: 'Brrr! Shivering in the freezing weather, wrapped up tight.' },
  { name: 'Hot Zhu',         description: 'Sweating buckets under the blazing sun, desperately seeking shade.' },
  { name: 'Sweaty Zhu',      description: 'Just finished a marathon — dripping with sweat and feeling accomplished.' },
  { name: 'Wet Zhu',         description: 'Caught in a downpour without an umbrella. Completely soaked!' },
  { name: 'Sick Zhu',        description: 'Running a fever, thermometer in mouth, wrapped in blankets.' },
  { name: 'Sneezy Zhu',      description: 'Allergy season is here — tissue at the ready for the next achoo!' },
  { name: 'Hurt Zhu',        description: 'Ouch! Tripped and bumped his head — sporting a bandage with pride.' },
  { name: 'Tired Zhu',       description: 'Exhausted after a long day. Barely keeping those eyes open.' },
  { name: 'Poop Zhu',        description: 'Occupied! Currently doing important business and not to be disturbed.' },
  { name: 'Fart Zhu',        description: 'Silent but deadly. Pretending like nothing happened.' },
  { name: 'Pee Zhu',         description: 'When you really gotta go and the bathroom is finally in sight!' },
  { name: 'Constipated Zhu', description: 'Straining and struggling. This might take a while...' },
  { name: 'Stinky Zhu',      description: "Haven't showered in days. The flies are starting to circle." },
  { name: 'Happy Zhu',       description: 'Pure joy radiating from this cheerful little pig! Everything is wonderful.' },
  { name: 'Sad Zhu',         description: 'Feeling blue. Sometimes you just need a good cry and a hug.' },
  { name: 'Angry Zhu',       description: "Absolutely furious! Steam coming out of those ears. Don't mess with this pig." },
  { name: 'Scared Zhu',      description: 'Wide-eyed and trembling after watching a horror movie. Every shadow is a monster!' },
  { name: 'Nervous Zhu',     description: 'Sweating bullets before a big presentation. Palms are clammy, heart is racing.' },
  { name: 'Proud Zhu',       description: 'Just won first place! Chest puffed out, basking in glory.' },
  { name: 'Jealous Zhu',     description: "Looking at someone else's plate with envy. Why does theirs look better?" },
  { name: 'Shy Zhu',         description: 'Hiding behind those ears. Too embarrassed to say hello to their crush.' },
  { name: 'Confused Zhu',    description: 'Wait... what? Nothing makes sense right now. Head is spinning.' },
  { name: 'Surprised Zhu',   description: 'Did NOT see that coming! Jaw dropped, eyes wide open in disbelief.' },
  { name: 'Bored Zhu',       description: 'Staring at the clock watching seconds tick by. When will this meeting end?' },
  { name: 'Excited Zhu',     description: "Can't contain the energy! Bouncing up and down with pure excitement!" },
  { name: 'In Love Zhu',     description: 'Hearts floating all around. Head over hooves for someone special.' },
  { name: 'Heartbroken Zhu', description: 'Crying into a tub of ice cream after a rough breakup. It hurts so bad.' },
  { name: 'Flirty Zhu',      description: 'Winking and looking sharp in a bow tie. Ready for date night!' },
  { name: 'Romantic Zhu',    description: 'Roses and candlelight. Setting the mood for a perfect evening.' },
  { name: 'Chef Zhu',        description: 'Master of the kitchen! Whipping up delicious dishes with flair.' },
  { name: 'Doctor Zhu',      description: 'Stethoscope ready! Time for your checkup. Say "oink!"' },
  { name: 'Builder Zhu',     description: 'Hard hat on, ready to construct! Building the future one brick at a time.' },
  { name: 'Artist Zhu',      description: 'Beret on, paintbrush in hand. Creating a masterpiece on canvas.' },
  { name: 'Musician Zhu',    description: 'Strumming sweet melodies on the guitar. Music is life!' },
  { name: 'Firefighter Zhu', description: 'Brave and bold! Rushing into danger to save the day.' },
  { name: 'Police Zhu',      description: 'Protecting and serving the community with honor. You have the right to remain oinking.' },
  { name: 'Teacher Zhu',     description: 'Standing at the whiteboard, sharing knowledge with the next generation.' },
  { name: 'Pilot Zhu',       description: 'Cleared for takeoff! Flying high above the clouds. Fasten your seatbelts!' },
  { name: 'Astronaut Zhu',   description: 'One small step for pig, one giant leap for pig-kind. Exploring the cosmos!' },
  { name: 'Gamer Zhu',       description: 'Eyes glued to the screen, controller in hand. Just one more level!' },
  { name: 'Gardener Zhu',    description: 'Green hoof! Tending to beautiful flowers and fresh vegetables in the garden.' },
  { name: 'Fisher Zhu',      description: "Patiently waiting by the pond. Today's catch is gonna be huge!" },
  { name: 'Swimmer Zhu',     description: 'Splashing through the water! Doing laps like an Olympic champion.' },
  { name: 'Runner Zhu',      description: 'Pounding the pavement! Training for the big race, feeling the burn.' },
  { name: 'Yogi Zhu',        description: 'Finding inner peace on the yoga mat. Namaste, little piggy.' },
  { name: 'Cyclist Zhu',     description: 'Pedaling through the countryside, wind in the ears. Freedom on two wheels!' },
  { name: 'Camper Zhu',      description: 'Pitching a tent under the stars. Roasting marshmallows by the campfire.' },
  { name: 'Baker Zhu',       description: 'Flour everywhere! Pulling fresh bread out of the oven. The kitchen smells amazing.' },
  { name: 'Painter Zhu',     description: 'Brush in hand, creating a colorful landscape. Every painting tells a story.' },
  { name: 'Busy Zhu',        description: 'Typing furiously on the laptop, coffee in hand. Deadlines are piling up!' },
  { name: 'Lazy Zhu',        description: 'Netflix and chill? More like Netflix and nap. Not moving from this couch.' },
  { name: 'Broke Zhu',       description: 'Empty pockets and a sad wallet. Ramen for dinner... again.' },
  { name: 'Rich Zhu',        description: 'Living the high life! Designer clothes, fancy dinners, gold everything.' },
  { name: 'Famous Zhu',      description: 'Paparazzi everywhere! Signing autographs and walking the red carpet.' },
  { name: 'Tourist Zhu',     description: 'Camera around the neck, map in hand. Getting lost in a new city is half the fun!' },
  { name: 'Student Zhu',     description: "Cramming for finals with coffee and a laptop. Why didn't I start earlier?!" },
  { name: 'Parent Zhu',      description: 'Juggling a baby, groceries, and a career. Superpig in action!' },
  { name: 'Baby Zhu',        description: 'Tiny, adorable, and wearing a diaper. Goo goo ga ga!' },
  { name: 'Grandpa Zhu',     description: 'Rocking in the chair, telling stories of the good old days. Wise and wrinkly.' },
  { name: 'Coffee Zhu',      description: "Don't talk to me before my morning coffee. Running on caffeine and determination." },
  { name: 'Tea Zhu',         description: 'Pinky up! Sipping Earl Grey with the finest biscuits. How sophisticated!' },
  { name: 'Pizza Zhu',       description: 'Face buried in a giant slice of pepperoni pizza. This is heaven.' },
  { name: 'Sushi Zhu',       description: 'Chopsticks ready! Perfectly arranged nigiri and rolls. Itadakimasu!' },
  { name: 'Ice Cream Zhu',   description: 'Licking a giant scoop of strawberry ice cream before it melts. Brain freeze!' },
  { name: 'Hungry Zhu',      description: 'Stomach growling so loud the neighbors can hear. Must... find... food...' },
  { name: 'Full Zhu',        description: "Stuffed to the brim after a giant feast. Can't move, might explode." },
  { name: 'Thirsty Zhu',     description: 'Crawling through the desert. A mirage of a water fountain in the distance...' },
  { name: 'Rainy Zhu',       description: "Splashing in puddles with a bright umbrella. Rain, rain, don't go away!" },
  { name: 'Snowy Zhu',       description: 'Building a snowpig! Frosty ears and a carrot nose. Winter wonderland!' },
  { name: 'Windy Zhu',       description: 'Holding on for dear life! This gust of wind is trying to blow the pig away!' },
  { name: 'Sunny Zhu',       description: 'Basking in golden sunshine. Perfect weather for a picnic and good vibes.' },
  { name: 'Stormy Zhu',      description: 'Thunder and lightning! Running for cover as the sky opens up.' },
  { name: 'Birthday Zhu',    description: 'Party hat on, candles lit! Make a wish and blow them out. Happy birthday!' },
  { name: 'Halloween Zhu',   description: 'Trick or treat! Dressed as a spooky witch, collecting candy all night long.' },
  { name: 'Christmas Zhu',   description: 'Ho ho ho! Wearing a Santa hat and spreading holiday cheer. Presents for everyone!' },
  { name: 'New Year Zhu',    description: 'Counting down to midnight! Fireworks, champagne, and resolutions to break.' },
  { name: 'Easter Zhu',      description: 'Hopping around hiding colorful eggs. Can you find them all?' },
  { name: 'Ninja Zhu',       description: 'Silent but deadly. Moves through the shadows unseen. Hi-yah!' },
  { name: 'Pirate Zhu',      description: 'Arrr matey! Sailing the seven seas looking for treasure. Where be the gold?' },
  { name: 'Zombie Zhu',      description: 'Braaaaains... Shuffling around looking for a snack. A little green around the edges.' },
  { name: 'Alien Zhu',       description: 'Greetings from another planet! Comes in peace and comes for snacks.' },
  { name: 'Superhero Zhu',   description: 'Cape flowing in the wind! Here to save the day with superpig powers!' },
  { name: 'Robot Zhu',       description: 'Beep boop! Programmed for maximum cuteness. Does not compute... emotions.' },
  { name: 'Ghost Zhu',       description: 'Boo! Floating through walls and haunting the snack cabinet. Spooky but adorable!' },
  { name: 'Wizard Zhu',      description: "Wingardium levio-SWINE! Casting spells with a magical wand. You're a wizard, Zhu!" },
  { name: 'Sleepy Zhu',      description: 'Head bobbing, eyes heavy. Fighting to stay awake but losing the battle.' },
  { name: 'Snoring Zhu',     description: 'ZZZZZZZZ. Loud enough to wake the whole neighborhood. Someone get earplugs!' },
  { name: 'Drooling Zhu',    description: 'Fast asleep and dreaming of food. A little puddle forming on the pillow.' },
  { name: 'Night Owl Zhu',   description: 'Wide awake at 3 AM. The best ideas come in the middle of the night!' },
  { name: 'Early Bird Zhu',  description: 'Up before the sun! Chirping and ready to seize the day. Good morning world!' },
  { name: 'Stuck Zhu',       description: "Wedged in a tight spot. Tried to squeeze through and now can't get out! Help!" },
  { name: 'Lost Zhu',        description: 'Map is upside down, phone is dead. Completely and utterly lost.' },
  { name: 'Falling Zhu',     description: 'Tripped on a banana peel! Arms flailing, gravity taking over. Going down!' },
  { name: 'Bumped Zhu',      description: 'Walked straight into a glass door. Nose is sore but dignity is more wounded.' },
  { name: 'Dirty Zhu',       description: 'Rolled in the mud and loving it. Bath time is going to be a battle!' },
  { name: 'Party Zhu',       description: 'Dancing on the tables! The life of the party with a hat and moves.' },
  { name: 'Drunk Zhu',       description: 'Had one too many! Stumbling around, slurring words, but having the time of their life.' },
  { name: 'Hungover Zhu',    description: 'Never drinking again... Head pounding, sunglasses on, desperately seeking water.' },
  { name: 'Dancing Zhu',     description: 'Hitting the dance floor with killer moves! No rhythm but maximum enthusiasm.' },
  { name: 'Karaoke Zhu',     description: 'Belting out a power ballad on stage. Tone deaf but passion is off the charts!' },
  { name: 'Working Zhu',     description: 'Deep in the zone, headphones on, crushing the to-do list. Productivity mode activated!' },
  { name: 'Shopping Zhu',    description: 'Arms full of bags! Swipe that card — retail therapy at its finest.' },
  { name: 'Cooking Zhu',     description: 'Sizzling pans and flying ingredients! Something delicious is coming together.' },
  { name: 'Traveling Zhu',   description: 'Suitcase packed, passport ready! Adventure awaits in far-off lands.' },
  { name: 'Reading Zhu',     description: "Curled up with a good book, lost in another world. Shh, they're at the good part!" },
];

async function fetchAndBase64(url) {
  if (url.startsWith('data:')) return url;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const buf = await res.arrayBuffer();
  const b64 = Buffer.from(buf).toString('base64');
  const mime = res.headers.get('content-type') || 'image/png';
  return `data:${mime};base64,${b64}`;
}

async function generateOne(stamp) {
  const userPrompt = `Create a kawaii pig character sticker illustration.

The pig is: ${stamp.name}
Scene: ${stamp.description}

The pig should clearly show this scenario through its expression, pose, and any props/accessories.
Follow ALL design rules: borderless sticker, light pink pig (#FFE4E1), flat vector style, kawaii proportions, plain background, NO borders or frames.`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      modalities: ['image', 'text'],
      image_config: { aspect_ratio: '1:1', image_size: '1K' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message;
  if (!message) throw new Error('No message in response');

  const content = message.content;

  if (typeof content === 'string') {
    const urlMatch = content.match(/(?:https?:|data:image\/)[^\s"')]+/i);
    if (urlMatch) return fetchAndBase64(urlMatch[0]);
    throw new Error('No image in text response');
  }

  if (Array.isArray(content)) {
    for (const part of content) {
      if (part.type === 'image_url' && part.image_url?.url) return fetchAndBase64(part.image_url.url);
      if (part.type === 'image' && part.data) return `data:image/png;base64,${part.data}`;
    }
  }

  const raw = JSON.stringify(data);
  const match = raw.match(/data:image\/[^"]+/);
  if (match) return match[0];

  throw new Error('No image data found in response');
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Load existing progress
let results = [];
if (existsSync(OUT_PATH)) {
  try {
    results = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
    console.log(`Resuming from ${results.length} existing entries`);
  } catch { results = []; }
}

const done = new Set(results.filter(r => r.imageData).map(r => r.name));
// Remove failed entries so they get retried
results = results.filter(r => r.imageData);
const todo = STAMPS.filter(s => !done.has(s.name));

console.log(`Generating ${todo.length} stamps (${done.size} already done)...\n`);

for (let i = 0; i < todo.length; i++) {
  const stamp = todo[i];
  const overall = done.size + i + 1;
  process.stdout.write(`[${overall}/${STAMPS.length}] ${stamp.name}... `);

  let attempts = 0;
  while (attempts < 3) {
    try {
      const imageData = await generateOne(stamp);
      results.push({ name: stamp.name, description: stamp.description, imageData });
      writeFileSync(OUT_PATH, JSON.stringify(results, null, 2), 'utf8');
      console.log('✓');
      break;
    } catch (err) {
      attempts++;
      if (attempts >= 3) {
        console.log(`✗ FAILED after 3 attempts: ${err.message}`);
        // Write a placeholder so we know it failed
        results.push({ name: stamp.name, description: stamp.description, imageData: '', failed: true });
        writeFileSync(OUT_PATH, JSON.stringify(results, null, 2), 'utf8');
      } else {
        console.log(`  retrying (${attempts}/3)...`);
        await sleep(3000 * attempts);
      }
    }
  }

  // Small delay between calls to avoid rate limiting
  if (i < todo.length - 1) await sleep(1000);
}

const failed = results.filter(r => r.failed);
console.log(`\nDone! ${results.length - failed.length} succeeded, ${failed.length} failed.`);
if (failed.length > 0) {
  console.log('Failed:', failed.map(r => r.name).join(', '));
  console.log('Re-run the script to retry failed stamps.');
}
