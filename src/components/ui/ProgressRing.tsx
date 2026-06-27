interface ProgressRingProps {
  progress: number; // 0–1
  size: number;
  strokeWidth: number;
  color?: string;
}

export function ProgressRing({ progress, size, strokeWidth, color = '#FF69B4' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      aria-valuenow={Math.round(progress * 100)}
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#EEE"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 50ms linear' }}
      />
    </svg>
  );
}