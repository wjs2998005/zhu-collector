import type { PigColor, Pose } from './types';
import { PIG_COLORS, POSE_CONFIGS } from './traits';

interface PigBodyProps {
  color: PigColor;
  pose: Pose;
}

export function PigBody({ color, pose }: PigBodyProps) {
  const palette = PIG_COLORS[color];
  const config = POSE_CONFIGS[pose];
  const cx = 100;
  const by = config.bodyY;

  if (pose === 'sleeping') {
    return (
      <>
        {/* Sleeping body — horizontal oval */}
        <ellipse cx={cx} cy={by + 15} rx={55} ry={30} fill={palette.body} />
        {/* Zzz indicator */}
        <text x={cx + 45} y={by - 10} fontSize={14} fill="#999" fontFamily="sans-serif" fontWeight="bold">z</text>
        <text x={cx + 55} y={by - 24} fontSize={11} fill="#BBB" fontFamily="sans-serif" fontWeight="bold">z</text>
        <text x={cx + 62} y={by - 35} fontSize={9} fill="#DDD" fontFamily="sans-serif" fontWeight="bold">z</text>
      </>
    );
  }

  return (
    <>
      {/* Main body — rounded oval */}
      <ellipse cx={cx} cy={by} rx={42} ry={38} fill={palette.body} />

      {/* Curly tail */}
      <Tail cx={cx - 42} cy={by - 15} color={palette.body} />

      {/* Arms */}
      {config.showLimbs && (
        <>
          <Limb
            cx={cx - 30} cy={by - 10}
            length={22} angle={config.armLeftAngle}
            color={palette.body}
          />
          <Limb
            cx={cx + 30} cy={by - 10}
            length={22} angle={config.armRightAngle}
            color={palette.body}
          />
        </>
      )}

      {/* Legs */}
      <ellipse cx={cx - 16} cy={by + 38} rx={12} ry={8} fill={palette.body} />
      <ellipse cx={cx + 16} cy={by + 38} rx={12} ry={8} fill={palette.body} />

      {/* Hooves */}
      <ellipse cx={cx - 16} cy={by + 44} rx={10} ry={5} fill={palette.earInner} opacity="0.6" />
      <ellipse cx={cx + 16} cy={by + 44} rx={10} ry={5} fill={palette.earInner} opacity="0.6" />
    </>
  );
}

/* ---------- Sub-components ---------- */

function Tail({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <path
      d={`M ${cx} ${cy} Q ${cx - 15} ${cy - 18} ${cx - 10} ${cy - 8} Q ${cx - 5} ${cy + 2} ${cx - 15} ${cy - 5}`}
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
    />
  );
}

function Limb({ cx, cy, length, angle, color }: {
  cx: number; cy: number; length: number; angle: number; color: string;
}) {
  const rad = (angle * Math.PI) / 180;
  const ex = cx + Math.cos(rad) * length;
  const ey = cy + Math.sin(rad) * length;

  return (
    <>
      <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={color} strokeWidth="10" strokeLinecap="round" />
      {/* Hoof */}
      <circle cx={ex} cy={ey} r="5" fill={color} opacity="0.7" />
    </>
  );
}