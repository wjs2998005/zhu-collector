import { useStats } from '@/stores/useStamps';

export function TopBar() {
  const stats = useStats();

  return (
    <header
      className="bg-white border-b border-gray-100 px-4 pb-3"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl leading-none">🐷</span>
          <div>
            <h1 className="text-base font-bold text-zhu-text leading-tight">Stamp Book</h1>
            {stats && (
              <p className="text-[11px] text-zhu-muted leading-none">
                {stats.unlocked} / {stats.total} unlocked
              </p>
            )}
          </div>
        </div>

        {stats && (
          <div className="bg-zhu-bg rounded-xl px-3 py-1.5 text-center">
            <div className="text-lg font-bold text-zhu-accent leading-none">{stats.totalEncounters}</div>
            <div className="text-[10px] text-zhu-muted leading-tight">encounters</div>
          </div>
        )}
      </div>
    </header>
  );
}
