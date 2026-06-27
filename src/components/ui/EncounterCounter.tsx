import { db } from '@/db/database';

interface EncounterCounterProps {
  stampId: number;
  count: number;
}

export function EncounterCounter({ stampId, count }: EncounterCounterProps) {
  const decrement = () => {
    if (count > 0) {
      db.stamps.update(stampId, { encounterCount: count - 1 });
    }
  };

  const increment = () => {
    db.stamps.update(stampId, { encounterCount: count + 1 });
  };

  return (
    <div className="flex items-center gap-5 select-none">
      {/* Decrement */}
      <button
        onClick={decrement}
        disabled={count === 0}
        className="tap-target w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center
          text-xl font-bold text-gray-500 active:bg-gray-200 transition-colors
          disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease encounters"
      >
        −
      </button>

      {/* Count */}
      <span className="text-3xl font-bold text-zhu-text min-w-[3ch] text-center tabular-nums">
        {count}
      </span>

      {/* Increment */}
      <button
        onClick={increment}
        className="tap-target w-12 h-12 rounded-full bg-zhu-pink flex items-center justify-center
          text-xl font-bold text-white active:bg-zhu-pink-dark transition-colors"
        aria-label="Increase encounters"
      >
        +
      </button>
    </div>
  );
}