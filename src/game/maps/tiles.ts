/**
 * Tile indices inside the terrain tileset (TEXTURE_KEYS.tileset).
 * The tileset is a single row of 16x16 tiles in exactly this order. A replacement
 * tileset image MUST keep the same order so map data stays valid.
 */
export const TILE = {
  empty: -1,
  grass: 0,
  dirt: 1,
  path: 2,
  stoneTop: 3,
  stone: 4,
  bridge: 5,
  waterTop: 6,
  water: 7,
} as const;

export type TileIndex = (typeof TILE)[keyof typeof TILE];

/** Number of tiles in the tileset strip. */
export const TILESET_TILE_COUNT = 8;

/** Tiles the player stands on / cannot pass through. */
export const SOLID_TILES: readonly TileIndex[] = [TILE.grass, TILE.dirt, TILE.path, TILE.stoneTop, TILE.stone, TILE.bridge];
