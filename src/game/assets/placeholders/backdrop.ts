import type Phaser from 'phaser';
import { GAME_WIDTH, PALETTE as C } from '../../config/constants';
import { px, type Painter } from './types';

/**
 * Parallax strips. All are GAME_WIDTH wide and wrap seamlessly, because they are
 * drawn as horizontally repeating tile sprites.
 */
const W = GAME_WIDTH;

/** Draws a ridge line column by column from a height function, in 2px steps. */
function paintRidge(
  g: Phaser.GameObjects.Graphics,
  height: number,
  color: number,
  heightAt: (x: number) => number,
  cap?: { color: number; minHeight: number; depth: number },
): void {
  for (let x = 0; x < W; x += 1) {
    const h = Math.max(0, Math.round(heightAt(x) / 2) * 2);
    px(g, color, x, height - h, 1, h);
    if (cap && h >= cap.minHeight) px(g, cap.color, x, height - h, 1, cap.depth);
  }
}

/** Distance between x and a peak, wrapping around the strip width. */
const wrapDistance = (x: number, peak: number) => {
  const d = Math.abs(x - peak) % W;
  return Math.min(d, W - d);
};

const mountainRange = (peaks: { x: number; h: number }[], slope: number) => (x: number) =>
  Math.max(...peaks.map((p) => p.h - wrapDistance(x, p.x) * slope));

export const paintMountainsFar: Painter = (g) => {
  const height = 96;
  paintRidge(
    g,
    height,
    C.mountainFar,
    mountainRange([{ x: 60, h: 80 }, { x: 170, h: 62 }, { x: 290, h: 92 }, { x: 400, h: 70 }], 1.1),
    // Only the two tallest peaks (80, 92) get snow; lower ones would show a 1px sliver.
    { color: C.snow, minHeight: 74, depth: 6 },
  );
  return { width: W, height };
};

export const paintMountainsNear: Painter = (g) => {
  const height = 64;
  paintRidge(
    g,
    height,
    C.mountainNear,
    mountainRange([{ x: 20, h: 50 }, { x: 130, h: 40 }, { x: 230, h: 56 }, { x: 350, h: 44 }, { x: 440, h: 36 }], 0.8),
  );
  return { width: W, height };
};

/** Rolling green hills; sine periods are integer fractions of W so the strip wraps. */
export const paintHills: Painter = (g) => {
  const height = 56;
  const wave = (x: number, periods: number, amp: number) => Math.sin((x / W) * Math.PI * 2 * periods) * amp;
  paintRidge(g, height, C.hillsDark, (x) => 34 + wave(x, 2, 10) + wave(x, 5, 4));
  paintRidge(g, height, C.hills, (x) => 22 + wave(x + 60, 3, 8) + wave(x, 7, 3));
  return { width: W, height };
};

export const paintClouds: Painter = (g) => {
  const height = 70;
  const cloud = (x: number, y: number, s: number) => {
    // Drawn twice (x and x - W) so a cloud crossing the right edge wraps cleanly.
    for (const ox of [x, x - W]) {
      px(g, C.cloudShade, ox, y + 6 * s, 42 * s, 6 * s);
      px(g, C.cloud, ox + 6 * s, y + 4 * s, 28 * s, 6 * s);
      px(g, C.cloud, ox + 12 * s, y, 14 * s, 10 * s);
      px(g, C.cloud, ox, y + 8 * s, 42 * s, 3 * s);
    }
  };
  cloud(20, 18, 1);
  cloud(150, 4, 1);
  cloud(250, 40, 1);
  cloud(360, 14, 1);
  cloud(450, 50, 1);
  return { width: W, height };
};
