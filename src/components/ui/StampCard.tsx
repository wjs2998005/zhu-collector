import type { Stamp } from '@/db/database';

interface StampCardProps {
  stamp: Stamp;
  onClick: () => void;
}

export function StampCard({ stamp, onClick }: StampCardProps) {
  const isLocked = stamp.unlockedAt === null;

  // Strip " Zhu" suffix for a compact label
  const label = stamp.name.replace(/ Zhu$/i, '');

  return (
    <button
      onClick={onClick}
      className="tap-target no-select flex flex-col items-center gap-1.5 transition-transform active:scale-95 select-none"
    >
      {/* Circular image */}
      <div className="relative w-full rounded-full overflow-hidden" style={{ aspectRatio: '1' }}>
        <img
          src={stamp.imageData}
          alt={stamp.name}
          className="w-full h-full object-cover"
          style={{
            filter: isLocked ? 'grayscale(100%) brightness(0.7)' : undefined,
            opacity: isLocked ? 0.4 : 1,
          }}
        />

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        )}

        {!isLocked && stamp.encounterCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-zhu-accent text-white text-[9px] font-bold rounded-full px-1 py-0.5 min-w-[16px] text-center leading-none">
            {stamp.encounterCount}
          </span>
        )}
      </div>

      {/* Label */}
      <span className={`text-[10px] font-medium leading-tight text-center w-full truncate ${isLocked ? 'text-gray-400' : 'text-zhu-text'}`}>
        {label}
      </span>
    </button>
  );
}