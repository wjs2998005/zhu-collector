import type { PigColor, Expression, Accessory, Pose } from './types';

/* ---------- Pig Color Palette ---------- */

export const PIG_COLORS: Record<PigColor, { body: string; snout: string; earInner: string }> = {
  pink:     { body: '#FFB6C1', snout: '#FF9AA2', earInner: '#E88A95' },
  peach:    { body: '#FFDAB9', snout: '#FFBFA0', earInner: '#E8A87C' },
  lavender: { body: '#E6E6FA', snout: '#D8BFD8', earInner: '#BFA0BF' },
  mint:     { body: '#B2EBF2', snout: '#80DEEA', earInner: '#4DD0E1' },
  cream:    { body: '#FFFDD0', snout: '#FFF5BA', earInner: '#F0E68C' },
  coral:    { body: '#FFA07A', snout: '#F08080', earInner: '#CD5C5C' },
  sky:      { body: '#B3D9FF', snout: '#99C2E6', earInner: '#7BA8CC' },
  lime:     { body: '#C1E6B4', snout: '#A8D49A', earInner: '#8CBF7F' },
};

/* ---------- Expressions ---------- */

export interface ExpressionConfig {
  eyes: 'arc' | 'slant' | 'half' | 'wide' | 'x' | 'closed' | 'uneven' | 'dot' | 'spiral' | 'dotWide';
  mouth: 'smile' | 'frown' | 'smirk' | 'frownSmall' | 'open' | 'openSmall' | 'openOval' | 'heart' | 'wavy' | 'chatter' | 'flat';
  cheeks: boolean;
  eyebrow?: 'down' | 'up' | 'none';
  special?: 'tear' | 'tongue' | 'hearts' | 'sparkle' | 'sweat' | 'drip' | 'zzz' | 'bandaid';
}

export const EXPRESSIONS: Record<Expression, ExpressionConfig> = {
  happy:     { eyes: 'arc',     mouth: 'smile',     cheeks: true },
  angry:     { eyes: 'slant',   mouth: 'frown',     cheeks: false, eyebrow: 'down' },
  cool:      { eyes: 'half',    mouth: 'smirk',     cheeks: false },
  sad:       { eyes: 'wide',    mouth: 'frownSmall', cheeks: false, special: 'tear' },
  silly:     { eyes: 'x',       mouth: 'open',      cheeks: true,  special: 'tongue' },
  sleepy:    { eyes: 'closed',  mouth: 'openSmall',  cheeks: true,  special: 'zzz' },
  surprised: { eyes: 'wide',    mouth: 'openOval',  cheeks: true },
  loving:    { eyes: 'closed',  mouth: 'heart',     cheeks: true,  special: 'hearts' },
  confused:  { eyes: 'uneven',  mouth: 'wavy',      cheeks: false },
  proud:     { eyes: 'closed',  mouth: 'smirk',     cheeks: true,  special: 'sparkle' },
  cold:      { eyes: 'dotWide', mouth: 'chatter',   cheeks: false, special: 'drip' },
  sick:      { eyes: 'dotWide', mouth: 'flat',      cheeks: false, special: 'sweat' },
  focused:   { eyes: 'dot',     mouth: 'openSmall', cheeks: false, special: 'tongue' },
  scared:    { eyes: 'dotWide', mouth: 'openOval',  cheeks: false, special: 'sweat' },
  dizzy:     { eyes: 'spiral',  mouth: 'wavy',      cheeks: true },
};

/* ---------- Accessories ---------- */

export const ACCESSORIES: Accessory[] = [
  'none', 'chef_hat', 'scarf', 'sunglasses', 'flower_crown',
  'party_hat', 'headphones', 'bow_tie', 'crown', 'witch_hat', 'santa_hat',
  'thermometer', 'umbrella', 'coffee_cup', 'bandage', 'guitar',
  'pillow', 'hard_hat', 'laptop', 'mud_splat',
];

/* ---------- Poses ---------- */

export interface PoseConfig {
  bodyY: number;
  showLimbs: boolean;
  armLeftAngle: number;
  armRightAngle: number;
}

export const POSES: Pose[] = [
  'standing', 'waving', 'cooking', 'reading', 'dancing',
  'sleeping', 'running', 'eating', 'painting', 'thinking',
  'sitting', 'shivering',
];

export const POSE_CONFIGS: Record<Pose, PoseConfig> = {
  standing:  { bodyY: 120, showLimbs: true,  armLeftAngle: -10, armRightAngle: 10 },
  waving:    { bodyY: 120, showLimbs: true,  armLeftAngle: -30, armRightAngle: 60 },
  cooking:   { bodyY: 120, showLimbs: true,  armLeftAngle: -20, armRightAngle: 40 },
  reading:   { bodyY: 130, showLimbs: true,  armLeftAngle: -40, armRightAngle: -40 },
  dancing:   { bodyY: 115, showLimbs: true,  armLeftAngle: 50,  armRightAngle: -50 },
  sleeping:  { bodyY: 145, showLimbs: false, armLeftAngle: 0,   armRightAngle: 0 },
  running:   { bodyY: 120, showLimbs: true,  armLeftAngle: 40,  armRightAngle: -40 },
  eating:    { bodyY: 125, showLimbs: true,  armLeftAngle: -30, armRightAngle: 20 },
  painting:  { bodyY: 120, showLimbs: true,  armLeftAngle: -15, armRightAngle: 30 },
  thinking:  { bodyY: 120, showLimbs: true,  armLeftAngle: -15, armRightAngle: -15 },
  sitting:   { bodyY: 135, showLimbs: true,  armLeftAngle: -10, armRightAngle: -10 },
  shivering: { bodyY: 120, showLimbs: true,  armLeftAngle: -5,  armRightAngle: -5 },
};