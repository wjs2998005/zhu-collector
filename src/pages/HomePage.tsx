import { useNavigate } from 'react-router-dom';
import { useAllStamps, useStats } from '@/stores/useStamps';
import { StampCard } from '@/components/ui/StampCard';

export default function HomePage() {
  const navigate = useNavigate();
  const stamps = useAllStamps();
  const stats = useStats();

  if (!stamps) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 border-3 border-zhu-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (stamps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 px-4">
        <span className="text-4xl mb-3">🐷</span>
        <p className="text-zhu-muted text-sm text-center">
          Loading your Zhu stamps...
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 pb-4">
      {/* Stats banner */}
      {stats && (
        <div className="my-4 p-3 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-zhu-accent">{stats.unlocked}</div>
              <div className="text-[11px] text-zhu-muted">Unlocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zhu-text">{stats.total}</div>
              <div className="text-[11px] text-zhu-muted">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zhu-pink-dark">{stats.totalEncounters}</div>
              <div className="text-[11px] text-zhu-muted">Encounters</div>
            </div>
          </div>
        </div>
      )}

      {/* Stamp grid — 4 columns */}
      <div className="grid grid-cols-4 gap-x-3 gap-y-4">
        {stamps.map((stamp) => (
          <StampCard
            key={stamp.id}
            stamp={stamp}
            onClick={() => navigate(`/stamp/${stamp.id}`)}
          />
        ))}
      </div>
    </div>
  );
}