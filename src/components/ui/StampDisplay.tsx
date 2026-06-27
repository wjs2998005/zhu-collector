import type { Stamp } from '@/db/database';

interface StampDisplayProps {
  stamp: Stamp;
  size?: number;
}

export function StampDisplay({ stamp, size = 260 }: StampDisplayProps) {
  const isLocked = stamp.unlockedAt === null;

  return (
    <img
      src={stamp.imageData}
      alt={stamp.name}
      width={size}
      height={size}
      className={`object-contain rounded-2xl ${isLocked ? 'opacity-30' : ''}`}
      style={{
        filter: isLocked ? 'grayscale(100%) brightness(0.7)' : undefined,
      }}
    />
  );
}