export const config = { runtime: 'edge' };

const MODEL = 'google/gemini-3.1-flash-image';

const NEGATIVE = `NO realistic pig, NO 3D rendering, NO gradients, NO shading, NO photorealistic textures.
NO rectangular stamp shape, NO perforated edges, NO postage stamp look.
NO border, NO ring border, NO circular border, NO frame, NO decorative ring around the image.
NO dark colors, NO harsh outlines, NO creepy or scary expressions.
NO complex backgrounds, NO landscapes, NO extra characters.
NO text, NO name banner, NO labels.
NO adult content, NO weapons, NO inappropriate themes.`;

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
${NEGATIVE}`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // process.env is available in Vercel Edge runtime
  const apiKey = (process as unknown as { env: Record<string, string | undefined> }).env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return json({ error: 'API key not configured on server' }, 503);
  }

  let description: string;
  try {
    const body = (await req.json()) as { description?: unknown };
    description = typeof body.description === 'string' ? body.description.trim() : '';
    if (!description) throw new Error();
  } catch {
    return json({ error: 'Invalid request: description is required' }, 400);
  }

  const userPrompt = `Create a kawaii pig character sticker illustration.

${description}

Follow ALL the design rules: borderless sticker, light pink pig (#FFE4E1), flat vector style, kawaii proportions, plain white background, NO borders or frames of any kind.`;

  let orResponse: Response;
  try {
    orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
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
  } catch (err) {
    return json({ error: `Network error reaching OpenRouter: ${String(err)}` }, 502);
  }

  if (!orResponse.ok) {
    const errText = await orResponse.text().catch(() => orResponse.statusText);
    return json({ error: `OpenRouter error (${orResponse.status}): ${errText}` }, 502);
  }

  const data = (await orResponse.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const message = data.choices?.[0]?.message;
  if (!message) {
    return json({ error: 'No message in OpenRouter response' }, 502);
  }

  let imageData: string | null = null;
  const content = message.content;

  if (typeof content === 'string') {
    const urlMatch = content.match(/(?:https?:|data:image\/)[^\s"')]+/i);
    if (urlMatch) imageData = await fetchAndBase64(urlMatch[0]);
  } else if (Array.isArray(content)) {
    for (const part of content as Array<Record<string, unknown>>) {
      if (part['type'] === 'image_url') {
        const imageUrl = (part['image_url'] as Record<string, string> | undefined)?.['url'];
        if (imageUrl) { imageData = await fetchAndBase64(imageUrl); break; }
      }
      if (part['type'] === 'image' && typeof part['data'] === 'string') {
        imageData = `data:image/png;base64,${part['data']}`; break;
      }
    }
  }

  if (!imageData) {
    const rawStr = JSON.stringify(data);
    const dataUriMatch = rawStr.match(/data:image\/[^"]+/);
    if (dataUriMatch) imageData = dataUriMatch[0];
  }

  if (!imageData) {
    return json({ error: 'No image data found in OpenRouter response' }, 502);
  }

  return json({ imageData });
}

async function fetchAndBase64(url: string): Promise<string> {
  if (url.startsWith('data:')) return url;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const mimeType = res.headers.get('content-type') ?? 'image/png';
  const arrayBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  // btoa requires a binary string; process in chunks to avoid stack overflow
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return `data:${mimeType};base64,${btoa(binary)}`;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
