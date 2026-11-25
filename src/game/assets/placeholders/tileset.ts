import type Phaser from 'phaser';
import { PALETTE as C, TILE_SIZE } from '../../config/constants';
import { TILE, TILESET_TILE_COUNT, type TileIndex } from '../../maps/tiles';
import { px, type Painter } from './types';

type G = Phaser.GameObjects.Graphics;
const T = TILE_SIZE;

/** Each function draws one 16x16 tile with its top-left at (ox, 0). */
const tilePainters: Record<Exclude<TileIndex, -1>, (g: G, ox: number) => void> = {
  [TILE.grass]: (g, ox) => {
    px(g, C.dirt, ox, 0, T, T);
    px(g, C.grass, ox, 0, T, 5);
    px(g, C.grassLight, ox, 0, T, 2);
    for (const x of [1, 4, 7, 10, 13]) px(g, C.grass, ox + x, 5, 2, 1);
    px(g, C.dirtDark, ox + 3, 10, 2, 1);
    px(g, C.dirtDark, ox + 11, 13);
    px(g, C.dirtDark, ox + 8, 8);
  },

  [TILE.dirt]: (g, ox) => {
    px(g, C.dirt, ox, 0, T, T);
    px(g, C.dirtDark, ox + 2, 3, 2, 1);
    px(g, C.dirtDark, ox + 9, 6);
    px(g, C.dirtDark, ox + 12, 11, 2, 1);
    px(g, C.dirtDark, ox + 5, 13);
  },

  [TILE.path]: (g, ox) => {
    px(g, C.mortar, ox, 0, T, T);
    const stones: [number, number, number, number][] = [
      [1, 0, 6, 5], [8, 0, 7, 5], [0, 6, 4, 5], [5, 6, 6, 5], [12, 6, 4, 5], [2, 12, 7, 4], [10, 12, 5, 4],
    ];
    for (const [x, y, w, h] of stones) {
      px(g, C.cobble, ox + x, y, w, h);
      px(g, C.cobbleLight, ox + x, y, w - 1, 1);
    }
  },

  [TILE.stoneTop]: (g, ox) => {
    paintStone(g, ox);
    px(g, C.grass, ox, 0, T, 3);
    px(g, C.grassLight, ox, 0, T, 1);
    for (const x of [2, 7, 12]) px(g, C.grass, ox + x, 3, 1, 2);
  },

  [TILE.stone]: (g, ox) => paintStone(g, ox),

  [TILE.bridge]: (g, ox) => {
    // Plank deck sits flush with the tile top (the collision surface).
    px(g, C.wood, ox, 0, T, 5);
    px(g, C.woodLight, ox, 0, T, 1);
    px(g, C.woodDark, ox + 5, 1, 1, 4);
    px(g, C.woodDark, ox + 11, 1, 1, 4);
    px(g, C.woodDark, ox, 5, T, 1);
    // Support post; the rest stays transparent so the river shows through.
    px(g, C.woodDark, ox + 7, 6, 2, 10);
  },

  [TILE.waterTop]: (g, ox) => {
    px(g, C.water, ox, 8, T, 8);
    px(g, C.waterFoam, ox, 6, 5, 2);
    px(g, C.waterFoam, ox + 8, 6, 6, 2);
    px(g, C.waterDeep, ox + 3, 12, 3, 1);
    px(g, C.waterDeep, ox + 10, 14, 4, 1);
  },

  [TILE.water]: (g, ox) => {
    px(g, C.waterDeep, ox, 0, T, T);
    px(g, C.water, ox + 2, 3, 4, 1);
    px(g, C.water, ox + 10, 9, 3, 1);
    px(g, C.waterDark, ox + 6, 13, 5, 1);
  },
};

function paintStone(g: G, ox: number): void {
  px(g, C.stone, ox, 0, T, T);
  px(g, C.stoneDark, ox, 7, T, 1);
  px(g, C.stoneDark, ox + 7, 0, 1, 7);
  px(g, C.stoneDark, ox + 3, 8, 1, 8);
  px(g, C.stoneDark, ox + 11, 8, 1, 8);
  px(g, C.stoneLight, ox + 1, 1, 5, 1);
  px(g, C.stoneLight, ox + 9, 1, 5, 1);
  px(g, C.stoneLight, ox + 5, 9, 5, 1);
}

/** Tileset strip: TILESET_TILE_COUNT tiles of 16x16, in TILE index order. */
export const paintTileset: Painter = (g) => {
  for (const [index, paint] of Object.entries(tilePainters)) {
    paint(g, Number(index) * T);
  }
  return { width: TILESET_TILE_COUNT * T, height: T };
};
