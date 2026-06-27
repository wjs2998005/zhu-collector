import type { PigColor, Expression } from './types';
import { PIG_COLORS, EXPRESSIONS } from './traits';

interface PigFaceProps {
  color: PigColor;
  expression: Expression;
}

export function PigFace({ color, expression }: PigFaceProps) {
  const palette = PIG_COLORS[color];
  const expr = EXPRESSIONS[expression];
  const cx = 100;
  const hy = 78; // head center Y

  return (
    <>
      {/* Head */}
      <circle cx={cx} cy={hy} r={42} fill={palette.body} />

      {/* Ears */}
      <Ear cx={cx - 28} cy={hy - 32} color={palette.body} earInner={palette.earInner} side="left" />
      <Ear cx={cx + 28} cy={hy - 32} color={palette.body} earInner={palette.earInner} side="right" />

      {/* Snout */}
      <ellipse cx={cx} cy={hy + 14} rx={16} ry={12} fill={palette.snout} />
      {/* Nostrils */}
      <circle cx={cx - 5} cy={hy + 13} r={2.5} fill={palette.earInner} />
      <circle cx={cx + 5} cy={hy + 13} r={2.5} fill={palette.earInner} />

      {/* Blush */}
      {expr.cheeks && (
        <>
          <ellipse cx={cx - 25} cy={hy + 10} rx={8} ry={5} fill="#FF9999" opacity="0.4" />
          <ellipse cx={cx + 25} cy={hy + 10} rx={8} ry={5} fill="#FF9999" opacity="0.4" />
        </>
      )}

      {/* Eyes */}
      <Eyes cx={cx} cy={hy - 4} config={expr} />

      {/* Eyebrows */}
      {expr.eyebrow === 'down' && (
        <>
          <line x1={cx - 20} y1={hy - 14} x2={cx - 8} y2={hy - 10} stroke="#666" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + 20} y1={hy - 14} x2={cx + 8} y2={hy - 10} stroke="#666" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Mouth */}
      <Mouth cx={cx} cy={hy + 22} config={expr} />

      {/* Special effects */}
      {expr.special === 'tear' && <Tear cx={cx - 30} cy={hy - 5} />}
      {expr.special === 'tongue' && <Tongue cx={cx} cy={hy + 28} />}
      {expr.special === 'hearts' && <HeartsEffect cx={cx} cy={hy - 35} />}
      {expr.special === 'sparkle' && <SparkleEffect cx={cx} cy={hy - 40} />}
      {expr.special === 'sweat' && <SweatDrop cx={cx + 28} cy={hy - 10} />}
      {expr.special === 'drip' && <DripEffect cx={cx} cy={hy - 20} />}
      {expr.special === 'zzz' && <ZzzEffect cx={cx} cy={hy - 30} />}
      {expr.special === 'bandaid' && <BandaidEffect cx={cx} cy={hy - 8} />}
    </>
  );
}

/* ---------- Ear ---------- */

function Ear({ cx, cy, color, earInner, side }: {
  cx: number; cy: number; color: string; earInner: string; side: 'left' | 'right';
}) {
  const flip = side === 'left' ? -1 : 1;
  const points = [
    `${cx},${cy + 10}`,
    `${cx - flip * 10},${cy - 12}`,
    `${cx + flip * 14},${cy + 2}`,
  ].join(' ');

  return (
    <g>
      <polygon points={points} fill={color} />
      <polygon
        points={`${cx + flip * 2},${cy + 5} ${cx - flip * 4},${cy - 6} ${cx + flip * 8},${cy + 3}`}
        fill={earInner}
      />
    </g>
  );
}

/* ---------- Eyes ---------- */

function Eyes({ cx, cy, config }: { cx: number; cy: number; config: { eyes: string } }) {
  const eyeY = cy;
  const gap = 10;

  switch (config.eyes) {
    case 'arc':
      return (
        <>
          <path d={`M ${cx - gap - 8} ${eyeY} Q ${cx - gap} ${eyeY - 6} ${cx - gap + 8} ${eyeY}`}
            fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <path d={`M ${cx + gap - 8} ${eyeY} Q ${cx + gap} ${eyeY - 6} ${cx + gap + 8} ${eyeY}`}
            fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    case 'slant':
      return (
        <>
          <line x1={cx - gap - 6} y1={eyeY - 4} x2={cx - gap + 4} y2={eyeY + 2}
            stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + gap - 4} y1={eyeY + 2} x2={cx + gap + 6} y2={eyeY - 4}
            stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    case 'half':
      return (
        <>
          {/* Bottom half of circle */}
          <circle cx={cx - gap} cy={eyeY - 1} r="6" fill="#333" />
          <circle cx={cx + gap} cy={eyeY - 1} r="6" fill="#333" />
        </>
      );
    case 'wide':
      return (
        <>
          <circle cx={cx - gap} cy={eyeY} r="7" fill="white" stroke="#333" strokeWidth="1.5" />
          <circle cx={cx - gap} cy={eyeY} r="3.5" fill="#333" />
          <circle cx={cx + gap} cy={eyeY} r="7" fill="white" stroke="#333" strokeWidth="1.5" />
          <circle cx={cx + gap} cy={eyeY} r="3.5" fill="#333" />
        </>
      );
    case 'x':
      return (
        <>
          <line x1={cx - gap - 4} y1={eyeY - 4} x2={cx - gap + 4} y2={eyeY + 4}
            stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx - gap + 4} y1={eyeY - 4} x2={cx - gap - 4} y2={eyeY + 4}
            stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + gap - 4} y1={eyeY - 4} x2={cx + gap + 4} y2={eyeY + 4}
            stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + gap + 4} y1={eyeY - 4} x2={cx + gap - 4} y2={eyeY + 4}
            stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    case 'closed':
      return (
        <>
          <line x1={cx - gap - 6} y1={eyeY} x2={cx - gap + 6} y2={eyeY}
            stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + gap - 6} y1={eyeY} x2={cx + gap + 6} y2={eyeY}
            stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    case 'uneven':
      return (
        <>
          <circle cx={cx - gap} cy={eyeY - 1} r="5" fill="#333" />
          <line x1={cx + gap - 4} y1={eyeY} x2={cx + gap + 5} y2={eyeY}
            stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'dot':
      return (
        <>
          <circle cx={cx - gap} cy={eyeY} r="3" fill="#333" />
          <circle cx={cx + gap} cy={eyeY} r="3" fill="#333" />
        </>
      );
    case 'spiral':
      return (
        <>
          <circle cx={cx - gap} cy={eyeY} r="6" fill="white" stroke="#333" strokeWidth="1" />
          <path d={`M ${cx - gap - 2} ${eyeY - 2} Q ${cx - gap + 2} ${eyeY - 2} ${cx - gap + 2} ${eyeY} Q ${cx - gap + 2} ${eyeY + 2} ${cx - gap - 2} ${eyeY + 2}`}
            fill="none" stroke="#333" strokeWidth="1.2" />
          <circle cx={cx + gap} cy={eyeY} r="6" fill="white" stroke="#333" strokeWidth="1" />
          <path d={`M ${cx + gap - 2} ${eyeY - 2} Q ${cx + gap + 2} ${eyeY - 2} ${cx + gap + 2} ${eyeY} Q ${cx + gap + 2} ${eyeY + 2} ${cx + gap - 2} ${eyeY + 2}`}
            fill="none" stroke="#333" strokeWidth="1.2" />
        </>
      );
    case 'dotWide':
      return (
        <>
          <circle cx={cx - gap} cy={eyeY} r="3.5" fill="white" stroke="#333" strokeWidth="1" />
          <circle cx={cx - gap} cy={eyeY} r="1.8" fill="#333" />
          <circle cx={cx + gap} cy={eyeY} r="3.5" fill="white" stroke="#333" strokeWidth="1" />
          <circle cx={cx + gap} cy={eyeY} r="1.8" fill="#333" />
        </>
      );
    default:
      return (
        <>
          <circle cx={cx - gap} cy={eyeY} r="4" fill="#333" />
          <circle cx={cx + gap} cy={eyeY} r="4" fill="#333" />
        </>
      );
  }
}

/* ---------- Mouth ---------- */

function Mouth({ cx, cy, config }: { cx: number; cy: number; config: { mouth: string } }) {
  switch (config.mouth) {
    case 'smile':
      return (
        <path d={`M ${cx - 7} ${cy - 1} Q ${cx} ${cy + 6} ${cx + 7} ${cy - 1}`}
          fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      );
    case 'frown':
      return (
        <path d={`M ${cx - 7} ${cy + 5} Q ${cx} ${cy - 2} ${cx + 7} ${cy + 5}`}
          fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      );
    case 'smirk':
      return (
        <path d={`M ${cx - 5} ${cy - 1} Q ${cx} ${cy + 4} ${cx + 10} ${cy - 1}`}
          fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      );
    case 'frownSmall':
      return (
        <path d={`M ${cx - 5} ${cy + 3} Q ${cx} ${cy} ${cx + 5} ${cy + 3}`}
          fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      );
    case 'open':
      return (
        <ellipse cx={cx} cy={cy + 1} rx="6" ry="5" fill="#333" />
      );
    case 'openSmall':
      return (
        <ellipse cx={cx} cy={cy + 1} rx="4" ry="3" fill="#333" />
      );
    case 'openOval':
      return (
        <ellipse cx={cx} cy={cy + 1} rx="5" ry="7" fill="#333" />
      );
    case 'heart':
      return (
        <g transform={`translate(${cx - 5}, ${cy - 2})`}>
          <path d="M 5 9 C 5 4 0 2 0 5 C 0 8 5 12 5 12 C 5 12 10 8 10 5 C 10 2 5 4 5 9 Z"
            fill="#FF69B4" transform="scale(0.8)" />
        </g>
      );
    case 'wavy':
      return (
        <path d={`M ${cx - 8} ${cy} Q ${cx - 3} ${cy + 4} ${cx} ${cy} Q ${cx + 3} ${cy - 4} ${cx + 8} ${cy}`}
          fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      );
    case 'chatter':
      return (
        <>
          {/* Chattering teeth */}
          <rect x={cx - 5} y={cy - 2} width="3" height="6" rx="0.5" fill="#FFF" stroke="#333" strokeWidth="0.8" />
          <rect x={cx + 2} y={cy - 2} width="3" height="6" rx="0.5" fill="#FFF" stroke="#333" strokeWidth="0.8" />
          <line x1={cx - 5} y1={cy - 2} x2={cx - 2} y2={cy - 2} stroke="#333" strokeWidth="0.8" />
          <line x1={cx + 2} y1={cy - 2} x2={cx + 5} y2={cy - 2} stroke="#333" strokeWidth="0.8" />
          {/* Shiver lines around mouth */}
          <line x1={cx - 12} y1={cy - 4} x2={cx - 8} y2={cy - 1} stroke="#87CEEB" strokeWidth="1" strokeLinecap="round" />
          <line x1={cx + 8} y1={cy - 4} x2={cx + 12} y2={cy - 1} stroke="#87CEEB" strokeWidth="1" strokeLinecap="round" />
        </>
      );
    case 'flat':
      return (
        <line x1={cx - 7} y1={cy + 1} x2={cx + 7} y2={cy + 1}
          stroke="#333" strokeWidth="2" strokeLinecap="round" />
      );
    default:
      return null;
  }
}

/* ---------- Special Effects ---------- */

function Tear({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path d={`M ${cx} ${cy} Q ${cx - 2} ${cy + 6} ${cx} ${cy + 10} Q ${cx + 2} ${cy + 6} ${cx} ${cy} Z`}
      fill="#87CEEB" />
  );
}

function Tongue({ cx, cy }: { cx: number; cy: number }) {
  return (
    <ellipse cx={cx} cy={cy} rx="5" ry="4" fill="#FF8C94" />
  );
}

function HeartsEffect({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <path d="M 0 9 C 0 4 -5 2 -5 5 C -5 8 0 12 0 12 C 0 12 5 8 5 5 C 5 2 0 4 0 9 Z"
        fill="#FF69B4" transform={`translate(${cx - 20}, ${cy}) scale(0.6)`} />
      <path d="M 0 9 C 0 4 -5 2 -5 5 C -5 8 0 12 0 12 C 0 12 5 8 5 5 C 5 2 0 4 0 9 Z"
        fill="#FF69B4" transform={`translate(${cx + 15}, ${cy - 5}) scale(0.5)`} />
    </>
  );
}

function SparkleEffect({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <text x={cx + 18} y={cy + 5} fontSize="16" fill="#FFD700">✦</text>
      <text x={cx + 28} y={cy - 5} fontSize="10" fill="#FFD700">✦</text>
    </>
  );
}

function SweatDrop({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path d={`M ${cx} ${cy} Q ${cx - 3} ${cy + 4} ${cx} ${cy + 8} Q ${cx + 3} ${cy + 4} ${cx} ${cy} Z`}
      fill="#87CEEB" opacity="0.8" />
  );
}

function DripEffect({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <ellipse cx={cx - 25} cy={cy - 2} rx="3" ry="5" fill="#87CEEB" opacity="0.7" />
      <ellipse cx={cx + 28} cy={cy - 6} rx="2.5" ry="4" fill="#87CEEB" opacity="0.6" />
      <ellipse cx={cx + 5} cy={cy - 12} rx="2" ry="3" fill="#87CEEB" opacity="0.5" />
    </>
  );
}

function ZzzEffect({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <text x={cx + 30} y={cy + 2} fontSize="12" fill="#999" fontFamily="sans-serif" fontWeight="bold">z</text>
      <text x={cx + 38} y={cy - 8} fontSize="9" fill="#BBB" fontFamily="sans-serif" fontWeight="bold">z</text>
      <text x={cx + 44} y={cy - 16} fontSize="7" fill="#DDD" fontFamily="sans-serif" fontWeight="bold">z</text>
    </>
  );
}

function BandaidEffect({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx + 18}, ${cy - 8})`}>
      <rect x="-8" y="-3" width="16" height="6" rx="2" fill="#F5DEB3" />
      <rect x="-2" y="-4" width="4" height="8" rx="0.5" fill="#FFF" />
    </g>
  );
}