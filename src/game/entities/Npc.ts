import Phaser from 'phaser';
import type { TextureKey } from '../config/assetKeys';
import { DEPTH } from '../config/constants';

/** Players closer than this (px) make the NPC turn to face them. */
const NOTICE_DISTANCE = 72;

/**
 * A villager: plays a 2-frame idle animation and turns to face the player when
 * they come close. Not solid; the player walks past villagers.
 */
export class Npc extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, feetY: number, texture: TextureKey, idleOffset: number) {
    super(scene, x, feetY, texture, 0);
    scene.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(DEPTH.player - 1);

    const key = `${texture}-idle`;
    if (!scene.anims.exists(key)) {
      scene.anims.create({ key, frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }), frameRate: 2, repeat: -1 });
    }
    // Offset start frames so villagers don't breathe in perfect sync.
    this.play({ key, startFrame: idleOffset % 2 });
  }

  /** Face the player when nearby; otherwise keep the current facing. */
  watch(playerX: number): void {
    const dx = playerX - this.x;
    if (Math.abs(dx) < NOTICE_DISTANCE && Math.abs(dx) > 2) this.setFlipX(dx < 0);
  }
}
