import Dexie, { type EntityTable } from 'dexie';

/* ---------- Types ---------- */

export type PigColor = 'pink' | 'peach' | 'lavender' | 'mint' | 'cream' | 'coral' | 'sky' | 'lime';

export type Expression =
  | 'happy' | 'angry' | 'cool' | 'sad' | 'silly'
  | 'sleepy' | 'surprised' | 'loving' | 'confused' | 'proud'
  | 'cold' | 'sick' | 'focused' | 'scared' | 'dizzy';

export type Accessory =
  | 'none' | 'chef_hat' | 'scarf' | 'sunglasses' | 'flower_crown'
  | 'party_hat' | 'headphones' | 'bow_tie' | 'crown' | 'witch_hat' | 'santa_hat'
  | 'thermometer' | 'umbrella' | 'coffee_cup' | 'bandage' | 'guitar'
  | 'pillow' | 'hard_hat' | 'laptop' | 'mud_splat';

export type Pose =
  | 'standing' | 'waving' | 'cooking' | 'reading' | 'dancing'
  | 'sleeping' | 'running' | 'eating' | 'painting' | 'thinking'
  | 'sitting' | 'shivering';

export interface SvgStampConfig {
  color: PigColor;
  expression: Expression;
  accessory: Accessory;
  pose: Pose;
  name: string;
  description: string;
}

export interface Stamp {
  id?: number;
  name: string;
  description: string;
  isBuiltIn: boolean;
  imageData: string;
  imageType: 'svg' | 'png';
  unlockedAt: Date | null;
  encounterCount: number;
  createdAt: Date;
}

/* ---------- Database ---------- */

class ZhuCollectorDB extends Dexie {
  stamps!: EntityTable<Stamp, 'id'>;

  constructor() {
    super('ZhuCollectorDB');
    this.version(1).stores({
      stamps: '++id, isBuiltIn, unlockedAt, encounterCount, createdAt',
    });
  }
}

export const db = new ZhuCollectorDB();