import { type SvgStampConfig } from './types';
import { PIG_COLORS, EXPRESSIONS, POSE_CONFIGS } from './traits';
import { PigBody } from './pig-body';
import { PigFace } from './pig-face';
import { PigAccessory } from './pig-accessories';

interface StampSVGProps {
  config: SvgStampConfig;
  size?: number;
}

export function StampSVG({ config, size = 200 }: StampSVGProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="200" height="200" fill="#FFFDF7" />

      {/* Pig body (behind head) */}
      <PigBody color={config.color} pose={config.pose} />

      {/* Pig head and face */}
      <PigFace color={config.color} expression={config.expression} />

      {/* Accessory overlay */}
      <PigAccessory type={config.accessory} />
    </svg>
  );
}

/**
 * Renders an SvgStampConfig to a full SVG string (used for seed data URIs).
 * This runs outside React — builds the markup manually.
 */
export function renderSVGToString(config: SvgStampConfig): string {
  const palette = PIG_COLORS[config.color];
  const expr = EXPRESSIONS[config.expression];
  const poseConfig = POSE_CONFIGS[config.pose];

  // Build SVG string manually for use in data URIs
  // This mirrors the React components above

  const cx = 100;
  const hy = 78;
  const by = poseConfig.bodyY;

  // Helper to build expression-specific eyes
  const eyesSVG = buildEyes(cx, hy - 4, expr.eyes);
  const mouthSVG = buildMouth(cx, hy + 22, expr.mouth);
  const cheeksSVG = expr.cheeks
    ? `<ellipse cx="${cx - 25}" cy="${hy + 10}" rx="8" ry="5" fill="#FF9999" opacity="0.4"/><ellipse cx="${cx + 25}" cy="${hy + 10}" rx="8" ry="5" fill="#FF9999" opacity="0.4"/>`
    : '';

  const eyebrowSVG = expr.eyebrow === 'down'
    ? `<line x1="${cx - 20}" y1="${hy - 14}" x2="${cx - 8}" y2="${hy - 10}" stroke="#666" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx + 20}" y1="${hy - 14}" x2="${cx + 8}" y2="${hy - 10}" stroke="#666" stroke-width="2.5" stroke-linecap="round"/>`
    : '';

  const specialSVG = buildSpecial(cx, hy, expr.special);

  // Body
  const bodySVG = buildBody(cx, by, poseConfig, palette);

  // Accessory
  const accessorySVG = buildAccessory(config.accessory, cx);

  return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#FFFDF7"/>
  ${bodySVG}
  <circle cx="${cx}" cy="${hy}" r="42" fill="${palette.body}"/>
  ${buildEars(cx, hy, palette)}
  <ellipse cx="${cx}" cy="${hy + 14}" rx="16" ry="12" fill="${palette.snout}"/>
  <circle cx="${cx - 5}" cy="${hy + 13}" r="2.5" fill="${palette.earInner}"/>
  <circle cx="${cx + 5}" cy="${hy + 13}" r="2.5" fill="${palette.earInner}"/>
  ${cheeksSVG}
  ${eyesSVG}
  ${eyebrowSVG}
  ${mouthSVG}
  ${specialSVG}
  ${accessorySVG}
</svg>`.trim();
}

/* ---------- SVG String Builders ---------- */


function buildEars(cx: number, hy: number, palette: { body: string; earInner: string }): string {
  const leftEar = `polygon points="${cx - 28},${hy - 22} ${cx - 38},${hy - 42} ${cx - 14},${hy - 30}" fill="${palette.body}"`;
  const leftInner = `polygon points="${cx - 26},${hy - 26} ${cx - 32},${hy - 38} ${cx - 20},${hy - 30}" fill="${palette.earInner}"`;
  const rightEar = `polygon points="${cx + 28},${hy - 22} ${cx + 38},${hy - 42} ${cx + 14},${hy - 30}" fill="${palette.body}"`;
  const rightInner = `polygon points="${cx + 26},${hy - 26} ${cx + 32},${hy - 38} ${cx + 20},${hy - 30}" fill="${palette.earInner}"`;
  return `<${leftEar}/><${leftInner}/><${rightEar}/><${rightInner}/>`;
}

function buildEyes(cx: number, eyeY: number, eyes: string): string {
  const gap = 10;
  switch (eyes) {
    case 'arc':
      return `<path d="M ${cx - gap - 8} ${eyeY} Q ${cx - gap} ${eyeY - 6} ${cx - gap + 8} ${eyeY}" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><path d="M ${cx + gap - 8} ${eyeY} Q ${cx + gap} ${eyeY - 6} ${cx + gap + 8} ${eyeY}" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'slant':
      return `<line x1="${cx - gap - 6}" y1="${eyeY - 4}" x2="${cx - gap + 4}" y2="${eyeY + 2}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx + gap - 4}" y1="${eyeY + 2}" x2="${cx + gap + 6}" y2="${eyeY - 4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'half':
      return `<circle cx="${cx - gap}" cy="${eyeY - 1}" r="6" fill="#333"/><circle cx="${cx + gap}" cy="${eyeY - 1}" r="6" fill="#333"/>`;
    case 'wide':
      return `<circle cx="${cx - gap}" cy="${eyeY}" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="${cx - gap}" cy="${eyeY}" r="3.5" fill="#333"/><circle cx="${cx + gap}" cy="${eyeY}" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="${cx + gap}" cy="${eyeY}" r="3.5" fill="#333"/>`;
    case 'x':
      return `<line x1="${cx - gap - 4}" y1="${eyeY - 4}" x2="${cx - gap + 4}" y2="${eyeY + 4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx - gap + 4}" y1="${eyeY - 4}" x2="${cx - gap - 4}" y2="${eyeY + 4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx + gap - 4}" y1="${eyeY - 4}" x2="${cx + gap + 4}" y2="${eyeY + 4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx + gap + 4}" y1="${eyeY - 4}" x2="${cx + gap - 4}" y2="${eyeY + 4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'closed':
      return `<line x1="${cx - gap - 6}" y1="${eyeY}" x2="${cx - gap + 6}" y2="${eyeY}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx + gap - 6}" y1="${eyeY}" x2="${cx + gap + 6}" y2="${eyeY}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'uneven':
      return `<circle cx="${cx - gap}" cy="${eyeY - 1}" r="5" fill="#333"/><line x1="${cx + gap - 4}" y1="${eyeY}" x2="${cx + gap + 5}" y2="${eyeY}" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'dot':
      return `<circle cx="${cx - gap}" cy="${eyeY}" r="3" fill="#333"/><circle cx="${cx + gap}" cy="${eyeY}" r="3" fill="#333"/>`;
    case 'spiral':
      return `<circle cx="${cx - gap}" cy="${eyeY}" r="6" fill="white" stroke="#333" stroke-width="1"/><path d="M ${cx - gap - 2} ${eyeY - 2} Q ${cx - gap + 2} ${eyeY - 2} ${cx - gap + 2} ${eyeY} Q ${cx - gap + 2} ${eyeY + 2} ${cx - gap - 2} ${eyeY + 2}" fill="none" stroke="#333" stroke-width="1.2"/><circle cx="${cx + gap}" cy="${eyeY}" r="6" fill="white" stroke="#333" stroke-width="1"/><path d="M ${cx + gap - 2} ${eyeY - 2} Q ${cx + gap + 2} ${eyeY - 2} ${cx + gap + 2} ${eyeY} Q ${cx + gap + 2} ${eyeY + 2} ${cx + gap - 2} ${eyeY + 2}" fill="none" stroke="#333" stroke-width="1.2"/>`;
    case 'dotWide':
      return `<circle cx="${cx - gap}" cy="${eyeY}" r="3.5" fill="white" stroke="#333" stroke-width="1"/><circle cx="${cx - gap}" cy="${eyeY}" r="1.8" fill="#333"/><circle cx="${cx + gap}" cy="${eyeY}" r="3.5" fill="white" stroke="#333" stroke-width="1"/><circle cx="${cx + gap}" cy="${eyeY}" r="1.8" fill="#333"/>`;
    default:
      return `<circle cx="${cx - gap}" cy="${eyeY}" r="4" fill="#333"/><circle cx="${cx + gap}" cy="${eyeY}" r="4" fill="#333"/>`;
  }
}

function buildMouth(cx: number, cy: number, mouth: string): string {
  switch (mouth) {
    case 'smile':
      return `<path d="M ${cx - 7} ${cy - 1} Q ${cx} ${cy + 6} ${cx + 7} ${cy - 1}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'frown':
      return `<path d="M ${cx - 7} ${cy + 5} Q ${cx} ${cy - 2} ${cx + 7} ${cy + 5}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'smirk':
      return `<path d="M ${cx - 5} ${cy - 1} Q ${cx} ${cy + 4} ${cx + 10} ${cy - 1}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'frownSmall':
      return `<path d="M ${cx - 5} ${cy + 3} Q ${cx} ${cy} ${cx + 5} ${cy + 3}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'open':
      return `<ellipse cx="${cx}" cy="${cy + 1}" rx="6" ry="5" fill="#333"/>`;
    case 'openSmall':
      return `<ellipse cx="${cx}" cy="${cy + 1}" rx="4" ry="3" fill="#333"/>`;
    case 'openOval':
      return `<ellipse cx="${cx}" cy="${cy + 1}" rx="5" ry="7" fill="#333"/>`;
    case 'heart':
      return `<g transform="translate(${cx - 5}, ${cy - 2})"><path d="M 5 9 C 5 4 0 2 0 5 C 0 8 5 12 5 12 C 5 12 10 8 10 5 C 10 2 5 4 5 9 Z" fill="#FF69B4" transform="scale(0.8)"/></g>`;
    case 'wavy':
      return `<path d="M ${cx - 8} ${cy} Q ${cx - 3} ${cy + 4} ${cx} ${cy} Q ${cx + 3} ${cy - 4} ${cx + 8} ${cy}" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'chatter':
      return `<rect x="${cx - 5}" y="${cy - 2}" width="3" height="6" rx="0.5" fill="#FFF" stroke="#333" stroke-width="0.8"/><rect x="${cx + 2}" y="${cy - 2}" width="3" height="6" rx="0.5" fill="#FFF" stroke="#333" stroke-width="0.8"/><line x1="${cx - 5}" y1="${cy - 2}" x2="${cx - 2}" y2="${cy - 2}" stroke="#333" stroke-width="0.8"/><line x1="${cx + 2}" y1="${cy - 2}" x2="${cx + 5}" y2="${cy - 2}" stroke="#333" stroke-width="0.8"/><line x1="${cx - 12}" y1="${cy - 4}" x2="${cx - 8}" y2="${cy - 1}" stroke="#87CEEB" stroke-width="1" stroke-linecap="round"/><line x1="${cx + 8}" y1="${cy - 4}" x2="${cx + 12}" y2="${cy - 1}" stroke="#87CEEB" stroke-width="1" stroke-linecap="round"/>`;
    case 'flat':
      return `<line x1="${cx - 7}" y1="${cy + 1}" x2="${cx + 7}" y2="${cy + 1}" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    default:
      return '';
  }
}

function buildSpecial(cx: number, hy: number, special?: string): string {
  switch (special) {
    case 'tear':
      return `<path d="M ${cx - 30} ${hy - 5} Q ${cx - 32} ${hy + 1} ${cx - 30} ${hy + 5} Q ${cx - 28} ${hy + 1} ${cx - 30} ${hy - 5} Z" fill="#87CEEB"/>`;
    case 'tongue':
      return `<ellipse cx="${cx}" cy="${hy + 28}" rx="5" ry="4" fill="#FF8C94"/>`;
    case 'hearts':
      return `<path d="M 0 9 C 0 4 -5 2 -5 5 C -5 8 0 12 0 12 C 0 12 5 8 5 5 C 5 2 0 4 0 9 Z" fill="#FF69B4" transform="translate(${cx - 20}, ${hy - 35}) scale(0.6)"/><path d="M 0 9 C 0 4 -5 2 -5 5 C -5 8 0 12 0 12 C 0 12 5 8 5 5 C 5 2 0 4 0 9 Z" fill="#FF69B4" transform="translate(${cx + 15}, ${hy - 40}) scale(0.5)"/>`;
    case 'sparkle':
      return `<text x="${cx + 18}" y="${hy - 35}" font-size="16" fill="#FFD700">✦</text><text x="${cx + 28}" y="${hy - 45}" font-size="10" fill="#FFD700">✦</text>`;
    case 'sweat':
      return `<path d="M ${cx + 28} ${hy - 10} Q ${cx + 25} ${hy - 6} ${cx + 28} ${hy - 2} Q ${cx + 31} ${hy - 6} ${cx + 28} ${hy - 10} Z" fill="#87CEEB" opacity="0.8"/>`;
    case 'drip':
      return `<ellipse cx="${cx - 25}" cy="${hy - 22}" rx="3" ry="5" fill="#87CEEB" opacity="0.7"/><ellipse cx="${cx + 28}" cy="${hy - 26}" rx="2.5" ry="4" fill="#87CEEB" opacity="0.6"/><ellipse cx="${cx + 5}" cy="${hy - 32}" rx="2" ry="3" fill="#87CEEB" opacity="0.5"/>`;
    case 'zzz':
      return `<text x="${cx + 30}" y="${hy - 28}" font-size="12" fill="#999" font-family="sans-serif" font-weight="bold">z</text><text x="${cx + 38}" y="${hy - 38}" font-size="9" fill="#BBB" font-family="sans-serif" font-weight="bold">z</text><text x="${cx + 44}" y="${hy - 46}" font-size="7" fill="#DDD" font-family="sans-serif" font-weight="bold">z</text>`;
    case 'bandaid':
      return `<g transform="translate(${cx + 18}, ${hy - 8})"><rect x="-8" y="-3" width="16" height="6" rx="2" fill="#F5DEB3"/><rect x="-2" y="-4" width="4" height="8" rx="0.5" fill="#FFF"/></g>`;
    default:
      return '';
  }
}

interface PoseConfigSimple {
  bodyY: number;
  showLimbs: boolean;
  armLeftAngle: number;
  armRightAngle: number;
}

function buildBody(
  cx: number, by: number, poseConfig: PoseConfigSimple,
  palette: { body: string; earInner: string }
): string {
  if (!poseConfig.showLimbs) {
    // Sleeping pose
    return `
      <ellipse cx="${cx}" cy="${by + 15}" rx="55" ry="30" fill="${palette.body}"/>
      <text x="${cx + 45}" y="${by - 10}" font-size="14" fill="#999" font-family="sans-serif" font-weight="bold">z</text>
      <text x="${cx + 55}" y="${by - 24}" font-size="11" fill="#BBB" font-family="sans-serif" font-weight="bold">z</text>
      <text x="${cx + 62}" y="${by - 35}" font-size="9" fill="#DDD" font-family="sans-serif" font-weight="bold">z</text>
    `;
  }

  const tailSVG = `
    <path d="M ${cx - 42} ${by - 15} Q ${cx - 57} ${by - 33} ${cx - 52} ${by - 23} Q ${cx - 47} ${by - 13} ${cx - 57} ${by - 20}"
      fill="none" stroke="${palette.body}" stroke-width="4" stroke-linecap="round"/>`;

  const leftArmRad = (poseConfig.armLeftAngle * Math.PI) / 180;
  const rightArmRad = (poseConfig.armRightAngle * Math.PI) / 180;
  const armLen = 22;
  const lx = cx - 30 + Math.cos(leftArmRad) * armLen;
  const ly = by - 10 + Math.sin(leftArmRad) * armLen;
  const rx = cx + 30 + Math.cos(rightArmRad) * armLen;
  const ry = by - 10 + Math.sin(rightArmRad) * armLen;

  return `
    <ellipse cx="${cx}" cy="${by}" rx="42" ry="38" fill="${palette.body}"/>
    ${tailSVG}
    <line x1="${cx - 30}" y1="${by - 10}" x2="${lx}" y2="${ly}" stroke="${palette.body}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="${lx}" cy="${ly}" r="5" fill="${palette.body}" opacity="0.7"/>
    <line x1="${cx + 30}" y1="${by - 10}" x2="${rx}" y2="${ry}" stroke="${palette.body}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="${rx}" cy="${ry}" r="5" fill="${palette.body}" opacity="0.7"/>
    <ellipse cx="${cx - 16}" cy="${by + 38}" rx="12" ry="8" fill="${palette.body}"/>
    <ellipse cx="${cx + 16}" cy="${by + 38}" rx="12" ry="8" fill="${palette.body}"/>
    <ellipse cx="${cx - 16}" cy="${by + 44}" rx="10" ry="5" fill="${palette.earInner}" opacity="0.6"/>
    <ellipse cx="${cx + 16}" cy="${by + 44}" rx="10" ry="5" fill="${palette.earInner}" opacity="0.6"/>
  `;
}

function buildAccessory(accessory: string, cx: number): string {
  switch (accessory) {
    case 'chef_hat':
      return `
        <g transform="translate(${cx}, 28)">
          <rect x="-22" y="-4" width="44" height="10" rx="3" fill="white" stroke="#DDD" stroke-width="1"/>
          <ellipse cx="-8" cy="-15" rx="16" ry="12" fill="white" stroke="#DDD" stroke-width="1"/>
          <ellipse cx="8" cy="-16" rx="14" ry="11" fill="white" stroke="#DDD" stroke-width="1"/>
        </g>`;
    case 'scarf':
      return `
        <rect x="${cx - 28}" y="108" width="56" height="14" rx="5" fill="#FF6347"/>
        <path d="M ${cx + 8} 115 C ${cx + 15} 115 ${cx + 18} 130 ${cx + 15} 140 L ${cx + 5} 140 C ${cx + 8} 132 ${cx + 7} 122 ${cx + 2} 118 Z" fill="#FF6347"/>
        <line x1="${cx - 20}" y1="110" x2="${cx - 20}" y2="120" stroke="#FFD700" stroke-width="2"/>
        <line x1="${cx - 10}" y1="110" x2="${cx - 10}" y2="120" stroke="#FFD700" stroke-width="2"/>
        <line x1="${cx}" y1="110" x2="${cx}" y2="120" stroke="#FFD700" stroke-width="2"/>`;
    case 'sunglasses':
      return `
        <rect x="${cx - 25}" y="71" width="20" height="12" rx="4" fill="#222"/>
        <rect x="${cx + 5}" y="71" width="20" height="12" rx="4" fill="#222"/>
        <line x1="${cx - 5}" y1="77" x2="${cx + 5}" y2="77" stroke="#222" stroke-width="2"/>
        <rect x="${cx - 24}" y="72" width="18" height="10" rx="3" fill="#444" opacity="0.6"/>
        <rect x="${cx + 6}" y="72" width="18" height="10" rx="3" fill="#444" opacity="0.6"/>`;
    case 'flower_crown': {
      let flowers = '';
      [78, 100, 122].forEach((fx) => {
        [0, 72, 144, 216, 288].forEach((angle) => {
          const rad = (angle * Math.PI) / 180;
          flowers += `<ellipse cx="${fx + 3 * Math.cos(rad)}" cy="${34 + 3 * Math.sin(rad)}" rx="4" ry="3" fill="#FF69B4" opacity="0.8"/>`;
        });
        flowers += `<circle cx="${fx}" cy="34" r="2.5" fill="#FFD700"/>`;
      });
      flowers += `<path d="M 65 42 Q 100 30 135 42" fill="none" stroke="#90EE90" stroke-width="2"/>`;
      return flowers;
    }
    case 'party_hat':
      return `
        <g transform="translate(${cx}, 25)">
          <polygon points="-16,14 0,-20 16,14" fill="#FF69B4"/>
          <line x1="-10" y1="8" x2="10" y2="8" stroke="#FFD700" stroke-width="2"/>
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#FFD700" stroke-width="2"/>
          <line x1="-2" y1="-8" x2="2" y2="-8" stroke="#FFD700" stroke-width="2"/>
          <circle cx="0" cy="-20" r="5" fill="#FFD700"/>
        </g>`;
    case 'headphones':
      return `
        <path d="M 75 38 Q 100 25 125 38" fill="none" stroke="#555" stroke-width="5" stroke-linecap="round"/>
        <rect x="68" y="42" width="10" height="18" rx="5" fill="#444"/>
        <rect x="122" y="42" width="10" height="18" rx="5" fill="#444"/>`;
    case 'bow_tie':
      return `
        <g transform="translate(${cx}, 112)">
          <path d="M -14 -6 L 0 0 L -14 6 Z" fill="#4169E1"/>
          <path d="M 14 -6 L 0 0 L 14 6 Z" fill="#4169E1"/>
          <circle cx="0" cy="0" r="3" fill="#3158C8"/>
        </g>`;
    case 'crown':
      return `
        <g transform="translate(${cx}, 28)">
          <rect x="-18" y="4" width="36" height="12" rx="2" fill="#FFD700"/>
          <polygon points="-18,4 -14,-8 -8,4" fill="#FFD700"/>
          <polygon points="-6,4 0,-12 6,4" fill="#FFD700"/>
          <polygon points="8,4 14,-8 18,4" fill="#FFD700"/>
          <circle cx="-11" cy="-2" r="2" fill="#FF0000"/>
          <circle cx="0" cy="-5" r="2.5" fill="#4169E1"/>
          <circle cx="11" cy="-2" r="2" fill="#FF0000"/>
        </g>`;
    case 'witch_hat':
      return `
        <g transform="translate(${cx}, 25)">
          <ellipse cx="0" cy="10" rx="26" ry="6" fill="#4B0082"/>
          <polygon points="-14,10 0,-24 14,10" fill="#4B0082"/>
          <rect x="-4" y="6" width="8" height="8" rx="1" fill="none" stroke="#FFD700" stroke-width="1.5"/>
        </g>`;
    case 'santa_hat':
      return `
        <g transform="translate(${cx}, 25)">
          <polygon points="-18,10 0,-30 18,10" fill="#FF0000"/>
          <ellipse cx="0" cy="10" rx="19" ry="5" fill="white"/>
          <circle cx="0" cy="-30" r="5" fill="white"/>
          <path d="M 2 -20 Q 10 -18 16 -10 Q 12 -14 2 -16 Z" fill="#CC0000"/>
        </g>`;
    case 'thermometer':
      return `
        <g transform="translate(120, 95)">
          <rect x="-3" y="-22" width="6" height="28" rx="3" fill="white" stroke="#DDD" stroke-width="1"/>
          <circle cx="0" cy="8" r="6" fill="#FF4444" stroke="#DDD" stroke-width="1"/>
          <rect x="-1.5" y="-2" width="3" height="14" rx="1.5" fill="#FF4444"/>
          <line x1="4" y1="-15" x2="8" y2="-15" stroke="#999" stroke-width="0.8"/>
          <line x1="4" y1="-8" x2="8" y2="-8" stroke="#999" stroke-width="0.8"/>
          <line x1="4" y1="-1" x2="8" y2="-1" stroke="#999" stroke-width="0.8"/>
        </g>`;
    case 'umbrella':
      return `
        <g transform="translate(130, 30)">
          <path d="M -5 50 Q -10 40 0 35" fill="none" stroke="#8B4513" stroke-width="3" stroke-linecap="round"/>
          <path d="M -30 35 Q -15 0 0 35 Q 15 0 30 35 Z" fill="#4488FF"/>
          <line x1="0" y1="5" x2="-15" y2="35" stroke="#3366CC" stroke-width="1"/>
          <line x1="0" y1="5" x2="0" y2="35" stroke="#3366CC" stroke-width="1"/>
          <line x1="0" y1="5" x2="15" y2="35" stroke="#3366CC" stroke-width="1"/>
          <circle cx="0" cy="5" r="3" fill="#3366CC"/>
        </g>`;
    case 'coffee_cup':
      return `
        <g transform="translate(120, 120)">
          <rect x="-14" y="-10" width="28" height="18" rx="3" fill="#FFF" stroke="#DDD" stroke-width="1.5"/>
          <path d="M 14 -4 Q 22 -4 22 4 Q 22 10 14 8" fill="none" stroke="#DDD" stroke-width="3" stroke-linecap="round"/>
          <rect x="-11" y="-4" width="22" height="8" rx="2" fill="#6B3A2E"/>
          <path d="M -4 -12 Q -2 -16 -4 -20" fill="none" stroke="#CCC" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M 4 -14 Q 6 -18 4 -22" fill="none" stroke="#CCC" stroke-width="1.5" stroke-linecap="round"/>
        </g>`;
    case 'bandage':
      return `
        <g transform="translate(75, 65)">
          <rect x="-3" y="-10" width="6" height="20" rx="2" fill="#F5DEB3"/>
          <rect x="-10" y="-3" width="20" height="6" rx="2" fill="#F5DEB3"/>
          <rect x="-1" y="-1" width="2" height="2" fill="#FFF"/>
        </g>`;
    case 'guitar':
      return `
        <g transform="translate(125, 85)">
          <rect x="4" y="-40" width="6" height="35" rx="2" fill="#8B4513"/>
          <rect x="2" y="-50" width="10" height="12" rx="2" fill="#6B3410"/>
          <circle cx="0" cy="-48" r="1.5" fill="#DDD"/>
          <circle cx="14" cy="-48" r="1.5" fill="#DDD"/>
          <circle cx="0" cy="-42" r="1.5" fill="#DDD"/>
          <circle cx="14" cy="-42" r="1.5" fill="#DDD"/>
          <ellipse cx="7" cy="10" rx="16" ry="12" fill="#DEB887" stroke="#8B4513" stroke-width="1.5"/>
          <ellipse cx="7" cy="15" rx="13" ry="8" fill="#DEB887" stroke="#8B4513" stroke-width="1.5"/>
          <circle cx="7" cy="10" r="6" fill="#6B3410"/>
          <line x1="5" y1="-40" x2="5" y2="12" stroke="#DDD" stroke-width="0.5"/>
          <line x1="7" y1="-40" x2="7" y2="12" stroke="#DDD" stroke-width="0.5"/>
          <line x1="9" y1="-40" x2="9" y2="12" stroke="#DDD" stroke-width="0.5"/>
        </g>`;
    case 'pillow':
      return `
        <g transform="translate(100, 155)">
          <rect x="-40" y="-12" width="80" height="22" rx="8" fill="white" stroke="#DDD" stroke-width="1"/>
          <line x1="-30" y1="-6" x2="30" y2="-6" stroke="#EEE" stroke-width="1"/>
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#EEE" stroke-width="1"/>
          <line x1="-30" y1="6" x2="30" y2="6" stroke="#EEE" stroke-width="1"/>
        </g>`;
    case 'hard_hat':
      return `
        <g transform="translate(${cx}, 28)">
          <ellipse cx="0" cy="12" rx="24" ry="5" fill="#FFA500"/>
          <path d="M -22 12 Q -20 -8 0 -12 Q 20 -8 22 12 Z" fill="#FFA500" stroke="#E89600" stroke-width="1"/>
          <rect x="-1.5" y="-10" width="3" height="22" rx="1" fill="#E89600"/>
        </g>`;
    case 'laptop':
      return `
        <g transform="translate(100, 130)">
          <rect x="-30" y="8" width="60" height="6" rx="1" fill="#CCC" stroke="#AAA" stroke-width="1"/>
          <rect x="-22" y="-22" width="44" height="30" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <rect x="-20" y="-20" width="40" height="20" rx="1" fill="#4488FF" opacity="0.6"/>
          <line x1="-16" y1="-16" x2="-4" y2="-16" stroke="#FFF" stroke-width="1.5" opacity="0.4"/>
          <line x1="-16" y1="-12" x2="2" y2="-12" stroke="#FFF" stroke-width="1.5" opacity="0.4"/>
          <line x1="-16" y1="-8" x2="-8" y2="-8" stroke="#FFF" stroke-width="1.5" opacity="0.4"/>
          <line x1="-22" y1="8" x2="22" y2="8" stroke="#999" stroke-width="1.5"/>
        </g>`;
    case 'mud_splat':
      return `
        <ellipse cx="80" cy="145" rx="12" ry="6" fill="#8B6914" opacity="0.7"/>
        <ellipse cx="125" cy="150" rx="8" ry="4" fill="#8B6914" opacity="0.5"/>
        <ellipse cx="110" cy="140" rx="6" ry="3" fill="#8B6914" opacity="0.6"/>
        <ellipse cx="90" cy="38" rx="5" ry="3" fill="#8B6914" opacity="0.4"/>`;
    default:
      return '';
  }
}