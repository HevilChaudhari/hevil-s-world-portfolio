import type Phaser from 'phaser';
import { PALETTE as C } from '../../config/constants';
import { px, type Painter } from './types';

/**
 * TEMPORARY PORTFOLIO BUILDINGS
 * All anchored bottom-centre with the door centred, because the door
 * interaction sits at the building's centre column. Replacement art must keep
 * the door in the horizontal centre.
 */
type G = Phaser.GameObjects.Graphics;

const X = {
  brick: 0xa4553a,
  brickDark: 0x7f3f2b,
  slate: 0x4f5d6b,
  slateDark: 0x3d4853,
  glow: 0xf4a259,
  glowBright: 0xffd27a,
  labWall: 0xf2f0e6,
  labShade: 0xd5d2c4,
  blueRoof: 0x4f7cac,
  blueRoofDark: 0x3b5f86,
  greenRoof: 0x3f7a4a,
  greenRoofDark: 0x2f5f3a,
  tealRoof: 0x3f8f8a,
  tealRoofDark: 0x2f6f6b,
  yellowWall: 0xf0d48a,
  yellowShade: 0xd6b86c,
  castle: 0x9a9a92,
  castleDark: 0x6f6f68,
  castleLight: 0xb8b8ae,
  flag: 0xc8423a,
} as const;

interface Rect { x: number; y: number; w: number; h: number }

interface HouseSpec {
  width: number;
  height: number;
  roofHeight: number;
  roof: number;
  roofDark: number;
  wall: number;
  wallShade: number;
  pattern: 'plaster' | 'planks' | 'stone' | 'brick';
  door: { w: number; h: number; color: number; double?: boolean };
  windows: Rect[];
  glass?: number;
  chimney?: { x: number; w: number; h: number; color: number };
  /** Draws emblems and details after the base house. */
  details?: (g: G, s: HouseSpec) => void;
}

function paintHouse(s: HouseSpec): Painter {
  return (g) => {
    const { width: W, height: H, roofHeight: R } = s;
    const cx = W / 2;

    if (s.chimney) {
      px(g, s.chimney.color, s.chimney.x, 0, s.chimney.w, s.chimney.h);
      px(g, C.ink, s.chimney.x, 0, s.chimney.w, 2);
    }

    // Walls
    const wallTop = R - 2;
    px(g, s.wall, 4, wallTop, W - 8, H - wallTop);
    paintWallPattern(g, s, 4, wallTop, W - 8, H - wallTop);
    px(g, s.wallShade, 4, wallTop, W - 8, 2);

    // Gable roof with overhang, stepped two pixels at a time
    for (let r = 0; r < R; r += 1) {
      const half = Math.round(6 + (cx - 6 + 2) * (r / (R - 1)));
      px(g, r % 4 === 3 ? s.roofDark : s.roof, cx - half, r + 2, half * 2, 1);
    }
    px(g, s.roofDark, 0, R + 1, W, 1);

    // Stone base
    px(g, C.stone, 4, H - 4, W - 8, 4);
    px(g, C.stoneDark, 4, H - 4, W - 8, 1);

    // Windows
    for (const w of s.windows) {
      px(g, C.woodDark, w.x, w.y, w.w, w.h);
      px(g, s.glass ?? C.glass, w.x + 1, w.y + 1, w.w - 2, w.h - 2);
      px(g, C.woodDark, w.x + Math.floor(w.w / 2), w.y + 1, 1, w.h - 2);
      px(g, C.woodDark, w.x + 1, w.y + Math.floor(w.h / 2), w.w - 2, 1);
    }

    // Door (centred)
    const d = s.door;
    const dx = Math.round(cx - d.w / 2);
    px(g, C.woodDark, dx - 1, H - d.h - 1, d.w + 2, d.h + 1);
    px(g, d.color, dx, H - d.h, d.w, d.h);
    if (d.double) px(g, C.woodDark, Math.round(cx) - 1, H - d.h, 1, d.h);
    px(g, C.flowerYellow, d.double ? Math.round(cx) + 1 : dx + d.w - 3, H - Math.round(d.h / 2));

    s.details?.(g, s);
    return { width: W, height: H };
  };
}

function paintWallPattern(g: G, s: HouseSpec, x: number, y: number, w: number, h: number): void {
  switch (s.pattern) {
    case 'planks':
      for (let i = x + 5; i < x + w; i += 6) px(g, s.wallShade, i, y, 1, h);
      break;
    case 'stone':
      for (let row = 0; row * 6 < h; row += 1) {
        px(g, s.wallShade, x, y + row * 6, w, 1);
        for (let i = x + (row % 2 ? 4 : 0); i < x + w; i += 9) px(g, s.wallShade, i, y + row * 6, 1, 6);
      }
      break;
    case 'brick':
      for (let row = 0; row * 4 < h; row += 1) {
        px(g, s.wallShade, x, y + row * 4, w, 1);
        for (let i = x + (row % 2 ? 3 : 0); i < x + w; i += 7) px(g, s.wallShade, i, y + row * 4, 1, 4);
      }
      break;
    case 'plaster':
      px(g, C.woodDark, x, y, 2, h);
      px(g, C.woodDark, x + w - 2, y, 2, h);
      px(g, C.woodDark, x, y + 2, w, 2);
      break;
  }
}

const flowerBoxes = (g: G, s: HouseSpec) => {
  for (const w of s.windows) px(g, C.flowerRed, w.x, w.y + w.h, w.w, 2);
};

// -------------------------------------------------------------- My Home (80x64)
export const paintHome = paintHouse({
  width: 80, height: 64, roofHeight: 26,
  roof: C.roof, roofDark: C.roofDark, wall: C.plaster, wallShade: C.plasterShade, pattern: 'plaster',
  door: { w: 12, h: 20, color: C.wood },
  windows: [{ x: 13, y: 34, w: 12, h: 11 }, { x: 55, y: 34, w: 12, h: 11 }],
  chimney: { x: 56, w: 7, h: 16, color: C.stone },
  details: (g, s) => {
    flowerBoxes(g, s);
    // Heart over the door
    px(g, C.flowerRed, 37, 31, 2, 2);
    px(g, C.flowerRed, 41, 31, 2, 2);
    px(g, C.flowerRed, 37, 33, 6, 1);
    px(g, C.flowerRed, 38, 34, 4, 1);
    px(g, C.flowerRed, 39, 35, 2, 1);
  },
});

// ---------------------------------------------------- Projects Workshop (96x68)
export const paintWorkshop = paintHouse({
  width: 96, height: 68, roofHeight: 28,
  roof: C.roofDark, roofDark: C.woodDark, wall: C.wood, wallShade: C.woodDark, pattern: 'planks',
  door: { w: 22, h: 24, color: C.woodLight, double: true },
  windows: [{ x: 12, y: 38, w: 14, h: 12 }, { x: 70, y: 38, w: 14, h: 12 }],
  details: (g) => {
    // Gear emblem in the gable
    const cx = 48;
    const cy = 18;
    px(g, C.stoneLight, cx - 4, cy - 4, 8, 8);
    px(g, C.stoneLight, cx - 1, cy - 6, 2, 12);
    px(g, C.stoneLight, cx - 6, cy - 1, 12, 2);
    px(g, C.stoneDark, cx - 1, cy - 1, 2, 2);
    // Saw on the wall
    px(g, C.stoneLight, 30, 44, 8, 2);
    px(g, C.woodDark, 38, 44, 3, 2);
  },
});

// ---------------------------------------------------- Developer's Forge (80x64)
export const paintForge = paintHouse({
  width: 80, height: 64, roofHeight: 24,
  roof: X.slate, roofDark: X.slateDark, wall: C.stone, wallShade: C.stoneDark, pattern: 'stone',
  door: { w: 14, h: 20, color: C.woodDark },
  windows: [{ x: 56, y: 34, w: 12, h: 10 }],
  glass: X.glow,
  chimney: { x: 10, w: 10, h: 24, color: X.brick },
  details: (g) => {
    // Glowing furnace mouth
    px(g, C.ink, 10, 40, 16, 14);
    px(g, X.glow, 12, 44, 12, 10);
    px(g, X.glowBright, 15, 48, 6, 6);
    // Anvil emblem in the gable
    px(g, C.ink, 34, 14, 12, 3);
    px(g, C.ink, 37, 17, 6, 3);
    px(g, C.ink, 35, 20, 10, 2);
  },
});

// --------------------------------------------------- Testing Laboratory (80x64)
export const paintLab = paintHouse({
  width: 80, height: 64, roofHeight: 24,
  roof: X.blueRoof, roofDark: X.blueRoofDark, wall: X.labWall, wallShade: X.labShade, pattern: 'brick',
  door: { w: 12, h: 20, color: X.blueRoofDark },
  windows: [{ x: 12, y: 34, w: 12, h: 12 }, { x: 56, y: 34, w: 12, h: 12 }],
  glass: 0x9fd8b8,
  details: (g) => {
    // Flask emblem in the gable
    px(g, C.ink, 38, 9, 4, 5);
    px(g, C.ink, 35, 14, 10, 8);
    px(g, 0x7cc35f, 36, 17, 8, 4);
    px(g, C.glass, 36, 15, 8, 2);
  },
});

// -------------------------------------------------- Knowledge Library (96x80)
export const paintLibrary = paintHouse({
  width: 96, height: 80, roofHeight: 26,
  roof: X.greenRoof, roofDark: X.greenRoofDark, wall: X.brick, wallShade: X.brickDark, pattern: 'brick',
  door: { w: 16, h: 22, color: C.woodDark, double: true },
  windows: [
    { x: 12, y: 32, w: 14, h: 14 }, { x: 41, y: 32, w: 14, h: 12 }, { x: 70, y: 32, w: 14, h: 14 },
    { x: 12, y: 54, w: 14, h: 14 }, { x: 70, y: 54, w: 14, h: 14 },
  ],
  glass: C.plaster,
  details: (g) => {
    // Book spines visible through the windows
    const spines = [C.flowerRed, X.blueRoof, C.flowerYellow, X.greenRoof, 0x7a4f7f];
    for (const [wx, wy] of [[12, 32], [70, 32], [12, 54], [70, 54]]) {
      spines.forEach((color, i) => px(g, color, wx + 2 + i * 2, wy + 8, 1, 5));
    }
    // Open-book emblem
    px(g, C.plaster, 40, 12, 7, 6);
    px(g, C.plaster, 49, 12, 7, 6);
    px(g, C.ink, 47, 12, 2, 7);
    px(g, C.ink, 42, 14, 3, 1);
    px(g, C.ink, 51, 14, 3, 1);
  },
});

// ----------------------------------------------------------- Vlog House (80x64)
export const paintVlog = paintHouse({
  width: 80, height: 64, roofHeight: 24,
  roof: X.tealRoof, roofDark: X.tealRoofDark, wall: X.yellowWall, wallShade: X.yellowShade, pattern: 'plaster',
  door: { w: 12, h: 20, color: X.tealRoofDark },
  windows: [{ x: 12, y: 34, w: 12, h: 11 }, { x: 56, y: 34, w: 12, h: 11 }],
  details: (g, s) => {
    flowerBoxes(g, s);
    // Camera emblem with a red "recording" light
    px(g, C.ink, 33, 12, 14, 9);
    px(g, C.ink, 47, 14, 4, 5);
    px(g, C.stoneLight, 37, 14, 5, 5);
    px(g, C.ink, 38, 15, 3, 3);
    px(g, C.flowerRed, 44, 13, 2, 2);
  },
});

// ------------------------------------------------ Resume & Contact Castle (160x112)
export const paintCastle: Painter = (g) => {
  const W = 160;
  const H = 112;

  const stoneBlock = (x: number, y: number, w: number, h: number) => {
    px(g, X.castle, x, y, w, h);
    for (let row = 0; row * 6 < h; row += 1) {
      px(g, X.castleDark, x, y + row * 6, w, 1);
      for (let i = x + (row % 2 ? 5 : 0); i < x + w; i += 10) px(g, X.castleDark, i, y + row * 6, 1, 6);
    }
    px(g, X.castleLight, x, y, w, 1);
  };
  const crenels = (x: number, y: number, w: number) => {
    for (let i = x; i < x + w; i += 6) px(g, X.castle, i, y - 4, 4, 4);
  };
  const flag = (x: number, y: number) => {
    px(g, C.woodDark, x, y, 1, 14);
    px(g, X.flag, x + 1, y, 8, 5);
    px(g, X.flag, x + 1, y + 5, 5, 1);
  };
  const slit = (x: number, y: number) => px(g, C.ink, x, y, 2, 7);

  // Central keep
  stoneBlock(30, 40, 100, 72);
  crenels(30, 40, 100);
  // Side towers
  stoneBlock(0, 22, 32, 90);
  crenels(0, 22, 32);
  stoneBlock(128, 22, 32, 90);
  crenels(128, 22, 32);
  // Middle tower
  stoneBlock(64, 14, 32, 30);
  crenels(64, 14, 32);
  flag(15, 4);
  flag(143, 4);
  flag(79, 0);

  // Windows
  for (const [x, y] of [[14, 36], [14, 62], [144, 36], [144, 62], [78, 24]]) slit(x, y);
  for (const x of [46, 106]) {
    px(g, C.ink, x, 56, 8, 12);
    px(g, X.glowBright, x + 1, 58, 6, 9);
    px(g, C.ink, x + 3, 58, 1, 9);
  }

  // Arched gate with portcullis
  px(g, C.ink, 66, 74, 28, 38);
  px(g, C.ink, 68, 72, 24, 2);
  px(g, C.ink, 70, 70, 20, 2);
  px(g, C.woodDark, 68, 76, 24, 36);
  for (let i = 70; i < 92; i += 5) px(g, C.stoneDark, i, 76, 1, 36);
  for (let j = 80; j < 112; j += 6) px(g, C.stoneDark, 68, j, 24, 1);

  // Banner over the gate
  px(g, X.flag, 74, 48, 12, 16);
  px(g, C.flowerYellow, 78, 52, 4, 4);
  return { width: W, height: H };
};
