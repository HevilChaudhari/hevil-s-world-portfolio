import type Phaser from 'phaser';
import { px } from './placeholders/types';

/**
 * Tiny 5px-tall pixel font for in-world signboards (A-Z, space, apostrophe, &).
 * Drawn with rectangles, so it stays perfectly crisp at any integer zoom.
 */
const GLYPHS: Record<string, readonly string[]> = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  B: ['##.', '#.#', '##.', '#.#', '##.'],
  C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '##.', '#..', '###'],
  F: ['###', '#..', '##.', '#..', '#..'],
  G: ['.##', '#..', '#.#', '#.#', '.##'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'],
  K: ['#.#', '#.#', '##.', '#.#', '#.#'],
  L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#'],
  O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..', '#..'],
  Q: ['.#.', '#.#', '#.#', '##.', '.##'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['.##', '#..', '.#.', '..#', '##.'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
  W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'],
  Z: ['###', '..#', '.#.', '#..', '###'],
  "'": ['#', '#', '.', '.', '.'],
  '&': ['.#..', '#.#.', '.#..', '#.##', '.##.'],
  ' ': ['..', '..', '..', '..', '..'],
};

export const FONT_HEIGHT = 5;
const LETTER_SPACING = 1;

function glyph(char: string): readonly string[] {
  const g = GLYPHS[char];
  if (!g) throw new Error(`pixelFont: unsupported character '${char}'. Use A-Z, space, ' or &.`);
  return g;
}

export function measureText(text: string): number {
  const chars = [...text.toUpperCase()];
  return chars.reduce((w, c) => w + glyph(c)[0].length, 0) + Math.max(0, chars.length - 1) * LETTER_SPACING;
}

export function drawText(g: Phaser.GameObjects.Graphics, text: string, x: number, y: number, color: number): void {
  let cursor = x;
  for (const char of text.toUpperCase()) {
    const rows = glyph(char);
    rows.forEach((row, ry) => {
      [...row].forEach((cell, rx) => {
        if (cell === '#') px(g, color, cursor + rx, y + ry);
      });
    });
    cursor += rows[0].length + LETTER_SPACING;
  }
}
