export async function generateZhuStamp(description: string): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });

  const data = (await response.json()) as { imageData?: string; error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? `Generation failed (${response.status})`);
  }
  if (!data.imageData) {
    throw new Error('No image data in response');
  }
  return data.imageData;
}
