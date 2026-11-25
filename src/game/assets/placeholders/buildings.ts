import { PALETTE as C } from '../../config/constants';
import { px, type Painter } from './types';

/** 64x56 generic timber-frame cottage, anchored bottom-centre. */
export const paintCottage: Painter = (g) => {
  // Chimney (behind roof)
  px(g, C.stone, 44, 2, 6, 14);
  px(g, C.stoneDark, 44, 2, 6, 2);

  // Stepped roof
  for (let r = 0; r < 20; r += 1) {
    const half = 8 + Math.floor(r * 1.25);
    const color = r % 4 === 3 ? C.roofDark : C.roof;
    px(g, color, 32 - half, 4 + r, half * 2, 1);
  }

  // Walls and timber frame
  px(g, C.plaster, 6, 24, 52, 32);
  px(g, C.plasterShade, 6, 24, 52, 2);
  px(g, C.woodDark, 6, 24, 2, 32);
  px(g, C.woodDark, 56, 24, 2, 32);
  px(g, C.woodDark, 6, 26, 52, 2);

  // Stone base
  px(g, C.stone, 6, 51, 52, 5);
  px(g, C.stoneDark, 6, 51, 52, 1);

  // Door
  px(g, C.woodDark, 26, 36, 12, 20);
  px(g, C.wood, 28, 38, 8, 18);
  px(g, C.flowerYellow, 34, 46);

  // Windows
  for (const x of [12, 42]) {
    px(g, C.woodDark, x, 32, 10, 10);
    px(g, C.glass, x + 1, 33, 8, 8);
    px(g, C.woodDark, x + 4, 33, 2, 8);
    px(g, C.woodDark, x + 1, 36, 8, 1);
    px(g, C.flowerRed, x, 42, 10, 2);
  }
  return { width: 64, height: 56 };
};

/** 32x72 windmill tower, anchored bottom-centre. Blades are a separate sprite. */
export const paintWindmill: Painter = (g) => {
  for (let r = 12; r < 72; r += 1) {
    const half = 6 + Math.floor((r - 12) / 12);
    px(g, C.plaster, 16 - half, r, half * 2, 1);
    px(g, C.plasterShade, 16 + half - 3, r, 3, 1);
  }
  for (let r = 2; r < 14; r += 1) {
    const half = Math.min(9, 1 + Math.floor((r - 2) * 0.8));
    px(g, r % 3 === 2 ? C.roofDark : C.roof, 16 - half, r, half * 2, 1);
  }
  px(g, C.woodDark, 13, 60, 6, 12);
  px(g, C.ink, 14, 30, 4, 6);
  px(g, C.ink, 14, 44, 4, 5);
  return { width: 32, height: 72 };
};

/** 56x56 windmill sails, rotated around their centre at runtime. */
export const paintWindmillBlades: Painter = (g) => {
  const sail = (x: number, y: number, w: number, h: number, horizontal: boolean) => {
    px(g, C.plaster, x, y, w, h);
    const step = 4;
    if (horizontal) for (let i = x; i < x + w; i += step) px(g, C.plasterShade, i, y, 1, h);
    else for (let i = y; i < y + h; i += step) px(g, C.plasterShade, x, i, w, 1);
  };
  px(g, C.woodDark, 27, 0, 2, 56);
  px(g, C.woodDark, 0, 27, 56, 2);
  sail(29, 2, 5, 23, false);
  sail(22, 31, 5, 23, false);
  sail(2, 29, 23, 5, true);
  sail(31, 22, 23, 5, true);
  px(g, C.ink, 25, 25, 6, 6);
  px(g, C.woodLight, 27, 27, 2, 2);
  return { width: 56, height: 56 };
};
