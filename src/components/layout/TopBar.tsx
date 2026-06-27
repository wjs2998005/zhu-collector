import { useStats } from '@/stores/useStamps';

export function TopBar() {
  const stats = useStats();

  return (
    <header className="pt-safe px-4 pb-2 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Pig emoji logo */}
          <span className="text-2xl" role="img" aria-label="Zhu">🐷</span>
          <h1 className="text-lg font-bold text-zhu-text">Zhu Collector</h1>
        </div>

        {/* Stats badge */}
        {stats && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-zhu-muted">
              <span className="w-2 h-2 rounded-full bg-zhu-accent inline-block" />
              <span>{stats.unlocked}</span>
              <span>/</span>
              <span>{stats.total}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}