import { PALETTE as C } from '../../config/constants';
import { px, type Painter } from './types';

/** 32x48 broadleaf tree, anchored bottom-centre. */
export const paintTree: Painter = (g) => {
  px(g, C.bark, 13, 28, 6, 20);
  px(g, C.dirtDark, 13, 28, 2, 20);
  px(g, C.leaves, 4, 8, 24, 22);
  px(g, C.leaves, 8, 4, 16, 28);
  px(g, C.leaves, 0, 14, 32, 12);
  px(g, C.leavesLight, 8, 6, 8, 6);
  px(g, C.leavesLight, 4, 12, 6, 6);
  px(g, C.leavesLight, 18, 10, 4, 4);
  px(g, C.grassDark, 20, 24, 8, 4);
  return { width: 32, height: 48 };
};

/** 24x48 pine tree, anchored bottom-centre. */
export const paintPine: Painter = (g) => {
  px(g, C.bark, 10, 40, 4, 8);
  const tiers = [
    { top: 0, rows: 14, base: 2 },
    { top: 10, rows: 16, base: 3 },
    { top: 22, rows: 18, base: 4 },
  ];
  for (const { top, rows, base } of tiers) {
    for (let r = 0; r < rows; r += 2) {
      const half = Math.min(12, base + Math.floor(r * 0.6));
      px(g, C.pine, 12 - half, top + r, half * 2, 2);
      px(g, C.pineLight, 12 - half, top + r, Math.max(1, half - 2), 1);
    }
  }
  return { width: 24, height: 48 };
};

/** 20x12 bush. */
export const paintBush: Painter = (g) => {
  px(g, C.leaves, 2, 3, 16, 9);
  px(g, C.leaves, 0, 6, 20, 6);
  px(g, C.leaves, 5, 0, 10, 4);
  px(g, C.leavesLight, 5, 1, 5, 3);
  px(g, C.leavesLight, 2, 5, 3, 2);
  px(g, C.grassDark, 12, 8, 6, 3);
  px(g, C.flowerRed, 8, 6);
  px(g, C.flowerRed, 14, 4);
  return { width: 20, height: 12 };
};

/** 12x8 rock. */
export const paintRock: Painter = (g) => {
  px(g, C.stone, 1, 2, 10, 6);
  px(g, C.stone, 3, 0, 6, 2);
  px(g, C.stoneLight, 3, 1, 4, 2);
  px(g, C.stoneDark, 1, 6, 10, 2);
  return { width: 12, height: 8 };
};

/** 16x14 fence section; tiles seamlessly when placed on adjacent columns. */
export const paintFence: Painter = (g) => {
  px(g, C.wood, 0, 4, 16, 2);
  px(g, C.wood, 0, 9, 16, 2);
  px(g, C.woodDark, 0, 6, 16, 1);
  px(g, C.woodDark, 0, 11, 16, 1);
  for (const x of [2, 12]) {
    px(g, C.woodDark, x, 1, 3, 13);
    px(g, C.woodLight, x, 1, 2, 1);
  }
  return { width: 16, height: 14 };
};

/** 8x5 grass tuft drawn in front of the player. */
export const paintTuft: Painter = (g) => {
  px(g, C.grass, 1, 2, 1, 3);
  px(g, C.grassLight, 3, 0, 1, 5);
  px(g, C.grass, 5, 1, 1, 4);
  px(g, C.grassDark, 6, 3, 1, 2);
  return { width: 8, height: 5 };
};

const flower = (petal: number): Painter => (g) => {
  px(g, C.grassDark, 3, 4, 1, 4);
  px(g, C.grass, 4, 5, 2, 1);
  px(g, petal, 2, 1, 3, 3);
  px(g, petal, 3, 0);
  px(g, C.flowerYellow === petal ? C.flowerRed : C.flowerYellow, 3, 2);
  return { width: 7, height: 8 };
};

export const paintFlowerRed = flower(C.flowerRed);
export const paintFlowerYellow = flower(C.flowerYellow);
