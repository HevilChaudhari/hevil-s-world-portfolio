import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/constants';

/**
 * Minimal first scene. Later phases can load the tiny assets the loading
 * screen itself needs here, before PreloadScene loads everything else.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.boot);
  }

  create(): void {
    this.scene.start(SCENE_KEYS.preload);
  }
}
