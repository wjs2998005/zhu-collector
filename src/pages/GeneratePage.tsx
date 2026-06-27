import { useState } from 'react';
import { useAIGeneratedStamps } from '@/stores/useStamps';
import type { Stamp } from '@/db/database';
import { db } from '@/db/database';
import { HoldButton } from '@/components/ui/HoldButton';

export default function GeneratePage() {
  const aiStamps = useAIGeneratedStamps();
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewStamp, setPreviewStamp] = useState<Stamp | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    setError(null);
    setPreviewStamp(null);

    try {
      const { generateZhuStamp } = await import('@/lib/replicate');
      const base64Image = await generateZhuStamp(description.trim());

      // Build a name from the description
      const nameWords = description.trim().split(' ').slice(0, 3);
      const name = nameWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Zhu';

      // Store as pending (not in main collection yet)
      const id = await db.stamps.add({
        name,
        description: description.trim(),
        isBuiltIn: false,        // not on home yet
        imageData: base64Image,
        imageType: 'png',
        unlockedAt: null,         // locked
        encounterCount: 0,
        createdAt: new Date(),
      });

      // Show preview
      const stamp = await db.stamps.get(id);
      setPreviewStamp(stamp ?? null);
      setDescription('');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed. Please try again.';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCollection = async (stamp: Stamp) => {
    if (!stamp.id) return;
    await db.stamps.update(stamp.id, { isBuiltIn: true });
    setPreviewStamp(null);
  };

  const handleDismiss = async (stamp: Stamp) => {
    if (!stamp.id) return;
    await db.stamps.delete(stamp.id);
    // Clear preview if it's the same stamp, so Add to Collection can't fire on a deleted record
    setPreviewStamp((prev) => (prev?.id === stamp.id ? null : prev));
  };

  const hasToken = Boolean(import.meta.env.VITE_OPENROUTER_API_KEY);

  const pendingStamps = aiStamps ?? [];

  return (
    <div className="flex flex-col px-4 py-4 gap-5">
      {/* Generation form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-bold text-zhu-text mb-3 flex items-center gap-2">
          <span>✨</span> Generate New Zhu
        </h2>

        {!hasToken ? (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-700">
            <p className="font-medium mb-1">API key required</p>
            <p className="text-xs">
              Add <code className="bg-yellow-100 px-1 rounded">VITE_OPENROUTER_API_KEY</code> to your{' '}
              <code className="bg-yellow-100 px-1 rounded">.env</code> file to enable AI generation.
              Get a key at{' '}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" className="underline">openrouter.ai/keys</a>.
            </p>
          </div>
        ) : (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your Zhu... e.g., 'a chef pig wearing a tall white hat, holding a wooden spoon'"
              className="w-full h-20 p-3 text-sm border border-gray-200 rounded-lg resize-none
                focus:outline-none focus:border-zhu-accent focus:ring-1 focus:ring-zhu-accent
                placeholder:text-gray-300"
              disabled={isGenerating}
            />

            {error && (
              <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200 text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-zhu-muted">
                {description.length > 0
                  ? `${description.length} characters`
                  : 'Enter a description'}
              </span>

              {isGenerating ? (
                <div className="flex items-center gap-2 text-sm text-zhu-accent">
                  <div className="w-5 h-5 border-2 border-zhu-accent border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <HoldButton
                  onComplete={handleGenerate}
                  disabled={!description.trim() || isGenerating}
                  duration={2000}
                  label="Generate"
                  size={70}
                  color="#8B5CF6"
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Preview of just-generated stamp */}
      {previewStamp && (
        <div className="bg-gradient-to-b from-purple-50 to-white rounded-xl shadow-sm border border-purple-200 p-4">
          <h3 className="text-sm font-semibold text-purple-700 mb-3">🎉 New Stamp Generated!</h3>
          <div className="flex items-center gap-4">
            <img
              src={previewStamp.imageData}
              alt={previewStamp.name}
              className="w-24 h-24 object-contain rounded-xl bg-white border border-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-zhu-text truncate">{previewStamp.name}</p>
              <p className="text-xs text-zhu-muted mt-1 line-clamp-2">{previewStamp.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => handleAddToCollection(previewStamp)}
                  className="tap-target px-4 py-1.5 bg-zhu-accent text-white text-xs font-semibold rounded-full active:bg-zhu-pink-dark transition-colors"
                >
                  Add to Collection
                </button>
                <button
                  onClick={() => handleDismiss(previewStamp)}
                  className="tap-target px-4 py-1.5 bg-gray-100 text-zhu-muted text-xs font-semibold rounded-full active:bg-gray-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending generated stamps (not yet added to collection) */}
      <div>
        <h3 className="text-sm font-semibold text-zhu-text mb-3">
          Pending Review ({pendingStamps.length})
        </h3>

        {pendingStamps.length === 0 ? (
          <p className="text-xs text-zhu-muted text-center py-6">
            Generated stamps waiting for review will appear here.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {pendingStamps.map((stamp) => (
              <div
                key={stamp.id}
                className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-3"
              >
                <img
                  src={stamp.imageData}
                  alt={stamp.name}
                  className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zhu-text truncate">{stamp.name}</p>
                  <p className="text-[11px] text-zhu-muted mt-0.5 line-clamp-2">{stamp.description}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => handleAddToCollection(stamp)}
                    className="tap-target px-3 py-1 bg-zhu-accent text-white text-[11px] font-semibold rounded-full active:bg-zhu-pink-dark transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => handleDismiss(stamp)}
                    className="tap-target px-3 py-1 bg-gray-100 text-zhu-muted text-[11px] font-semibold rounded-full active:bg-gray-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}