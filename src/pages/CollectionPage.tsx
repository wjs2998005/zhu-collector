import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnlockedStamps } from '@/stores/useStamps';
import { StampCard } from '@/components/ui/StampCard';
import { FilterBar } from '@/components/ui/FilterBar';

export default function CollectionPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('unlockedAt');
  const stamps = useUnlockedStamps(sortBy);

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      {stamps && stamps.length > 0 && (
        <FilterBar sortBy={sortBy} onSortChange={setSortBy} />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {!stamps ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-3 border-zhu-pink border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stamps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 px-4 gap-3">
            <span className="text-4xl">🔒</span>
            <p className="text-zhu-muted text-sm text-center">
              No stamps unlocked yet!
            </p>
            <p className="text-zhu-muted text-xs text-center">
              Go to a stamp and press & hold to unlock it.
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-zhu-accent text-sm underline tap-target"
            >
              Browse stamps
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-x-3 gap-y-4 mt-3">
            {stamps.map((stamp) => (
              <StampCard
                key={stamp.id}
                stamp={stamp}
                onClick={() => navigate(`/stamp/${stamp.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}