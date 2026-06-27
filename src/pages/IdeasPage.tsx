import { useState, useEffect } from 'react';

interface Idea {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

function loadIdeas(): Idea[] {
  try {
    return JSON.parse(localStorage.getItem('zhu_ideas') ?? '[]') as Idea[];
  } catch {
    return [];
  }
}

function saveIdeas(ideas: Idea[]) {
  localStorage.setItem('zhu_ideas', JSON.stringify(ideas));
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(loadIdeas);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    saveIdeas(ideas);
  }, [ideas]);

  const handleAdd = () => {
    const trimName = name.trim();
    const trimDesc = description.trim();
    if (!trimName || !trimDesc) return;
    setIdeas((prev) => [
      { id: crypto.randomUUID(), name: trimName, description: trimDesc, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setName('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCopy = async (idea: Idea) => {
    const cmd = `node scripts/generate-stamp.mjs "${idea.name}" "${idea.description}"`;
    await navigator.clipboard.writeText(cmd);
    setCopied(idea.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col px-4 py-4 gap-5">
      {/* Add idea form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-bold text-zhu-text mb-3 flex items-center gap-2">
          <span>💡</span> New Idea
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name — e.g. "Chef Zhu"'
          className="w-full p-3 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:border-zhu-accent focus:ring-1 focus:ring-zhu-accent
            placeholder:text-gray-300 mb-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Description — e.g. "a chef pig wearing a tall white hat, holding a wooden spoon"'
          className="w-full h-20 p-3 text-sm border border-gray-200 rounded-lg resize-none
            focus:outline-none focus:border-zhu-accent focus:ring-1 focus:ring-zhu-accent
            placeholder:text-gray-300"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) handleAdd();
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim() || !description.trim()}
          className="tap-target mt-3 w-full py-2 bg-zhu-accent text-white text-sm font-semibold
            rounded-full disabled:opacity-40 active:bg-zhu-pink-dark transition-colors"
        >
          Save Idea
        </button>
      </div>

      {/* Ideas list */}
      <div>
        <h3 className="text-sm font-semibold text-zhu-text mb-3">
          Saved Ideas ({ideas.length})
        </h3>

        {ideas.length === 0 ? (
          <p className="text-xs text-zhu-muted text-center py-8">
            No ideas yet. Add one above and it'll show up here ready to generate.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-zhu-text">{idea.name}</p>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="tap-target text-gray-300 active:text-red-400 transition-colors shrink-0 -mr-1 -mt-1"
                    aria-label="Delete idea"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-zhu-muted mb-3 leading-snug">{idea.description}</p>
                <button
                  onClick={() => handleCopy(idea)}
                  className="tap-target w-full py-1.5 bg-gray-50 border border-gray-200 text-zhu-muted
                    text-[11px] font-medium rounded-lg active:bg-gray-100 transition-colors text-left px-2.5"
                >
                  {copied === idea.id
                    ? '✓ Copied!'
                    : `node scripts/generate-stamp.mjs "${idea.name}" "…"`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
