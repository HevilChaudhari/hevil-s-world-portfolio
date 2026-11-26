import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, PALETTE } from './constants';
import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { VillageScene } from '../scenes/VillageScene';

/**
 * Phaser configuration. Scale mode is NONE because the React host sets an
 * integer zoom itself (see utils/pixelZoom.ts) to keep pixels perfectly square.
 */
export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: PALETTE.skyTop,
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
    physics: {
      default: 'arcade',
      // Dev only: open http://localhost:5173/?debug to draw physics bodies.
      arcade: { gravity: { x: 0, y: 900 }, debug: import.meta.env.DEV && new URLSearchParams(window.location.search).has('debug') },
    },
    // React owns the page; Phaser should not grab keyboard focus from other UI.
    input: { keyboard: { target: window } },
    // No sound yet: skip creating a Web Audio context on every mount (~70 ms, plus
    // Chrome's "AudioContext was not allowed to start" warning before a click).
    // Remove this when audio files are added to public/assets/audio/.
    audio: { noAudio: true },
    banner: false,
    scene: [BootScene, PreloadScene, VillageScene],
  };
}
