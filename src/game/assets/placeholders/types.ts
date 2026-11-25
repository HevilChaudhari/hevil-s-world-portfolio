import type Phaser from 'phaser';

export interface PainterResult {
  width: number;
  height: number;
  /** When set, the texture is sliced into numbered frames of this size (left to right). */
  frameWidth?: number;
  frameHeight?: number;
}

/** Draws one placeholder texture into a Graphics object at (0, 0). */
export type Painter = (g: Phaser.GameObjects.Graphics) => PainterResult;

/** Fills a single rectangle; shorthand that keeps pixel-art painters compact. */
export function px(g: Phaser.GameObjects.Graphics, color: number, x: number, y: number, w = 1, h = 1): void {
  g.fillStyle(color).fillRect(x, y, w, h);
}
