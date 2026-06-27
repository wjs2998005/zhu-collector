/**
 * OpenRouter API client for generating Zhu stamps using Gemini 2.5 Flash Image ("Nano Banana").
 *
 * Requires VITE_OPENROUTER_API_KEY in .env file.
 * Get a key at: https://openrouter.ai/keys
 */

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

export async function generateZhuStamp(description: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_OPENROUTER_API_KEY environment variable');
  }

  const userPrompt = `Create a round seal illustration of a kawaii pig character.

${description}

Follow ALL the design rules: circular seal format, light pink pig, flat vector style, kawaii proportions.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      modalities: ['image', 'text'],
      image_config: {
        aspect_ratio: '1:1',
        image_size: '1K',
      },
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${err}`);
  }

  const data = await response.json();

  // Gemini returns images embedded in the message content
  const message = data.choices?.[0]?.message;
  if (!message) {
    throw new Error('No message in response');
  }

  // Check for image in content parts
  const content = message.content;
  if (typeof content === 'string') {
    // Sometimes the image is a data URI or URL embedded in text
    const urlMatch = content.match(/(?:https?:|data:image\/)[^\s"')]+/i);
    if (urlMatch) {
      return fetchAndBase64(urlMatch[0]);
    }
    throw new Error('No image found in response content');
  }

  // Content might be an array of parts
  if (Array.isArray(content)) {
    for (const part of content) {
      if (part.type === 'image_url' && part.image_url?.url) {
        return fetchAndBase64(part.image_url.url);
      }
      if (part.type === 'image' && part.data) {
        return `data:image/png;base64,${part.data}`;
      }
    }
  }

  // Fallback: check if the whole content has an image
  const rawStr = JSON.stringify(data);
  const dataUriMatch = rawStr.match(/data:image\/[^"]+/);
  if (dataUriMatch) {
    return dataUriMatch[0];
  }

  throw new Error('No image data found in response');
}

async function fetchAndBase64(url: string): Promise<string> {
  // If already a data URI, return as-is
  if (url.startsWith('data:')) return url;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}