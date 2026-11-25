import type Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants';
import type { TextureKey } from '../config/assetKeys';

export interface ParallaxLayerConfig {
  key: TextureKey;
  /** Screen y of the layer's top edge. */
  y: number;
  /** 0 = fixed to the screen, 1 = moves with the world. */
  scrollFactor: number;
  depth: number;
  /** Constant horizontal drift in px/s (e.g. clouds). Disabled under reduced motion. */
  driftSpeed?: number;
}

interface Layer {
  sprite: Phaser.GameObjects.TileSprite;
  config: ParallaxLayerConfig;
  drift: number;
}

/**
 * Screen-fixed, horizontally repeating strips whose texture offset follows the
 * camera at a fraction of its speed, giving depth without huge images.
 */
export class ParallaxBackground {
  private readonly layers: Layer[];

  constructor(scene: Phaser.Scene, configs: readonly ParallaxLayerConfig[]) {
    this.layers = configs.map((config) => {
      const frame = scene.textures.getFrame(config.key);
      const sprite = scene.add
        .tileSprite(0, config.y, GAME_WIDTH, frame.height, config.key)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(config.depth);
      return { sprite, config, drift: 0 };
    });
  }

  update(cameraScrollX: number, deltaMs: number, animate: boolean): void {
    for (const layer of this.layers) {
      if (animate && layer.config.driftSpeed) {
        layer.drift = (layer.drift + (layer.config.driftSpeed * deltaMs) / 1000) % GAME_WIDTH;
      }
      // Whole pixels only, so strips never shimmer between pixels.
      layer.sprite.tilePositionX = Math.round(cameraScrollX * layer.config.scrollFactor - layer.drift);
    }
  }
}
