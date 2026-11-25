import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/constants';
import { IMAGE_ASSETS, SPRITESHEET_ASSETS, resolveAssetPath } from '../config/assetKeys';
import { generatePlaceholderTextures } from '../assets/placeholders';
import { EventBus } from '../systems/EventBus';

/**
 * Loads every real asset, then fills any gaps with generated placeholders.
 * Progress is forwarded to React, which renders the loading screen.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.preload);
  }

  preload(): void {
    this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => {
      EventBus.emit('loading-progress', value);
    });

    // Missing files must not crash the game: the placeholder fills in instead.
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      console.warn(`[assets] Failed to load "${file.key}" from ${String(file.url)}; using placeholder.`);
    });

    for (const asset of IMAGE_ASSETS) {
      this.load.image(asset.key, resolveAssetPath(asset));
    }
    for (const sheet of SPRITESHEET_ASSETS) {
      this.load.spritesheet(sheet.key, resolveAssetPath(sheet), {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight,
      });
    }
  }

  create(): void {
    generatePlaceholderTextures(this);
    EventBus.emit('loading-progress', 1);
    this.scene.start(SCENE_KEYS.village);
  }
}
