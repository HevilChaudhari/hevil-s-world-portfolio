import type Phaser from 'phaser';
import { px } from './types';

/**
 * Shared 16x24 side-view character painter used by the player and every NPC.
 * Characters face right; the game mirrors them to face left.
 */
export const CHARACTER_FRAME = { width: 16, height: 24 } as const;

export interface CharacterLook {
  hair: number;
  skin: number;
  skinShade: number;
  shirt: number;
  shirtDark: number;
  pants: number;
  pantsDark: number;
  boots: number;
  eye: number;
  /** Optional neckwear accent (the player's scarf). */
  scarf?: number;
  hat?: { style: 'straw' | 'cap'; color: number; band?: number };
  bun?: boolean;
  glasses?: boolean;
  beard?: number;
  apron?: number;
  headphones?: number;
  /** Shirt extends into a coat/robe covering the upper legs. */
  longCoat?: boolean;
}

export interface Pose {
  /** Upper body shifts down by this many pixels (breathing / step bob). */
  bob: 0 | 1;
  backLegX: number;
  frontLegX: number;
  backLegLen: number;
  frontLegLen: number;
  /** Horizontal arm swing offset. */
  armDX: number;
  armUp?: boolean;
}

export const IDLE_POSES: readonly Pose[] = [
  { bob: 0, backLegX: 6, frontLegX: 8, backLegLen: 4, frontLegLen: 4, armDX: 0 },
  { bob: 1, backLegX: 6, frontLegX: 8, backLegLen: 4, frontLegLen: 4, armDX: 0 },
];

export function drawCharacter(g: Phaser.GameObjects.Graphics, ox: number, look: CharacterLook, p: Pose): void {
  const b = p.bob;

  // Legs + boots (drawn first; they don't bob)
  px(g, look.pantsDark, ox + p.backLegX, 18, 2, p.backLegLen);
  px(g, look.boots, ox + p.backLegX, 18 + p.backLegLen, 3, 2);

  // Torso and belt
  px(g, look.shirt, ox + 5, 11 + b, 6, 7 - b);
  px(g, look.shirtDark, ox + 5, 11 + b, 1, 7 - b);
  px(g, look.pants, ox + 5, 17, 6, 1);

  px(g, look.pants, ox + p.frontLegX, 18, 2, p.frontLegLen);
  px(g, look.boots, ox + p.frontLegX, 18 + p.frontLegLen, 3, 2);

  if (look.longCoat) {
    px(g, look.shirt, ox + 5, 17, 6, 3);
    px(g, look.shirtDark, ox + 5, 17, 1, 3);
  }
  if (look.apron !== undefined) px(g, look.apron, ox + 7, 13 + b, 4, 6 - b);
  if (look.scarf !== undefined) {
    px(g, look.scarf, ox + 5, 11 + b, 6, 1);
    px(g, look.scarf, ox + 4, 12 + b, 1, 2);
  }

  // Head
  px(g, look.skin, ox + 5, 4 + b, 6, 7);
  px(g, look.hair, ox + 4, 2 + b, 7, 3);
  px(g, look.hair, ox + 4, 5 + b, 2, 4);
  px(g, look.hair, ox + 10, 4 + b, 1, 1);
  px(g, look.skinShade, ox + 6, 7 + b);
  px(g, look.eye, ox + 9, 7 + b, 1, 2);

  if (look.bun) px(g, look.hair, ox + 2, 2 + b, 3, 3);
  if (look.beard !== undefined) {
    px(g, look.beard, ox + 6, 9 + b, 5, 2);
    px(g, look.beard, ox + 7, 11 + b, 3, 1);
  }
  if (look.glasses) {
    px(g, look.eye, ox + 8, 6 + b, 3, 1);
    px(g, 0xa7d8f0, ox + 10, 7 + b, 1, 1);
  }
  if (look.hat?.style === 'straw') {
    px(g, look.hat.color, ox + 2, 3 + b, 12, 1);
    px(g, look.hat.color, ox + 5, 0 + b, 6, 3);
    if (look.hat.band !== undefined) px(g, look.hat.band, ox + 5, 2 + b, 6, 1);
  } else if (look.hat?.style === 'cap') {
    px(g, look.hat.color, ox + 4, 1 + b, 7, 2);
    px(g, look.hat.color, ox + 10, 3 + b, 3, 1);
  }
  if (look.headphones !== undefined) {
    px(g, look.headphones, ox + 5, 1 + b, 6, 1);
    px(g, look.headphones, ox + 5, 5 + b, 2, 3);
  }

  // Front arm + hand
  const armX = ox + 7 + p.armDX;
  const armTop = (p.armUp ? 9 : 12) + b;
  px(g, look.shirtDark, armX, armTop, 2, 4);
  px(g, look.skin, armX, p.armUp ? armTop - 1 : armTop + 4, 2, 1);
}
