import type Phaser from 'phaser';
import { TEXTURE_KEYS } from '../config/assetKeys';

/** Frame size and layout of the player spritesheet. */
export const PLAYER_FRAME = { width: 16, height: 24 } as const;

export const PLAYER_ANIMS = {
  idle: 'player-idle',
  walk: 'player-walk',
  jump: 'player-jump',
  fall: 'player-fall',
} as const;

export type PlayerAnimKey = (typeof PLAYER_ANIMS)[keyof typeof PLAYER_ANIMS];

/** Registers player animations once per game (animations are global in Phaser). */
export function registerPlayerAnimations(anims: Phaser.Animations.AnimationManager): void {
  const key = TEXTURE_KEYS.player;
  const defs: Phaser.Types.Animations.Animation[] = [
    { key: PLAYER_ANIMS.idle, frames: anims.generateFrameNumbers(key, { start: 0, end: 1 }), frameRate: 2, repeat: -1 },
    { key: PLAYER_ANIMS.walk, frames: anims.generateFrameNumbers(key, { start: 2, end: 5 }), frameRate: 10, repeat: -1 },
    { key: PLAYER_ANIMS.jump, frames: anims.generateFrameNumbers(key, { start: 6, end: 6 }), frameRate: 1 },
    { key: PLAYER_ANIMS.fall, frames: anims.generateFrameNumbers(key, { start: 7, end: 7 }), frameRate: 1 },
  ];
  for (const def of defs) {
    if (def.key && !anims.exists(def.key)) anims.create(def);
  }
}
