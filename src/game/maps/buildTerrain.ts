import { TILE, type TileIndex } from './tiles';
import type { MapDefinition, TerrainSegment } from './types';

export interface TerrainData {
  /** Solid layer, [row][col] of tile indices (TILE.empty for none). */
  ground: TileIndex[][];
  /** Decorative water layer, drawn behind the ground layer. */
  water: TileIndex[][];
  /** For each column, the row of the tile the player stands on. */
  surfaceRow: number[];
}

/**
 * Converts a MapDefinition's terrain segments into tilemap layer data.
 * Pure function: no Phaser dependency, so it can be unit-tested.
 * Throws if segments overlap, leave gaps, or exceed the map bounds.
 */
export function buildTerrain(map: MapDefinition): TerrainData {
  validateSegments(map);

  const { widthTiles: width, heightTiles: height, groundRow } = map;
  const grid = (): TileIndex[][] => Array.from({ length: height }, () => Array<TileIndex>(width).fill(TILE.empty));
  const ground = grid();
  const water = grid();
  const surfaceRow = Array<number>(width).fill(groundRow);
  const bottom = height - 1;

  const fill = (layer: TileIndex[][], col: number, fromRow: number, toRow: number, tile: TileIndex) => {
    for (let row = fromRow; row <= toRow; row += 1) layer[row][col] = tile;
  };

  for (const seg of map.terrain) {
    const top = groundRow - (seg.elevation ?? 0);

    for (let col = seg.from; col <= seg.to; col += 1) {
      surfaceRow[col] = top;

      switch (seg.kind) {
        case 'grass':
          ground[top][col] = TILE.grass;
          fill(ground, col, top + 1, bottom, TILE.dirt);
          break;
        case 'path':
          ground[top][col] = TILE.path;
          fill(ground, col, top + 1, bottom, TILE.dirt);
          break;
        case 'stone':
          ground[top][col] = TILE.stoneTop;
          fill(ground, col, top + 1, groundRow, TILE.stone);
          fill(ground, col, groundRow + 1, bottom, TILE.dirt);
          break;
        case 'bridge':
          ground[groundRow][col] = TILE.bridge;
          ground[bottom][col] = TILE.dirt; // riverbed
          water[groundRow][col] = TILE.waterTop;
          fill(water, col, groundRow + 1, bottom - 1, TILE.water);
          surfaceRow[col] = groundRow;
          break;
        case 'stream':
          water[groundRow][col] = TILE.waterTop;
          fill(ground, col, groundRow + 1, bottom, TILE.dirt);
          surfaceRow[col] = groundRow + 1;
          break;
      }
    }
  }

  return { ground, water, surfaceRow };
}

function validateSegments(map: MapDefinition): void {
  const sorted: TerrainSegment[] = [...map.terrain].sort((a, b) => a.from - b.from);
  let expected = 0;
  for (const seg of sorted) {
    const label = `${map.id} terrain [${seg.from}-${seg.to}] ${seg.kind}`;
    if (seg.from !== expected) {
      throw new Error(`${label}: expected to start at column ${expected} (gap or overlap).`);
    }
    if (seg.to < seg.from) throw new Error(`${label}: 'to' is before 'from'.`);
    const elevation = seg.elevation ?? 0;
    if (elevation < 0 || elevation > map.groundRow) throw new Error(`${label}: elevation out of range.`);
    if ((seg.kind === 'bridge' || seg.kind === 'stream') && elevation !== 0) {
      throw new Error(`${label}: water features cannot be elevated.`);
    }
    expected = seg.to + 1;
  }
  if (expected !== map.widthTiles) {
    throw new Error(`${map.id} terrain covers ${expected} columns but the map is ${map.widthTiles} wide.`);
  }
}
