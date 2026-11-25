import type Phaser from 'phaser';
import { DEPTH, TILE_SIZE } from '../config/constants';
import { TEXTURE_KEYS } from '../config/assetKeys';
import { SOLID_TILES, TILE, type TileIndex } from './tiles';
import type { TerrainData } from './buildTerrain';

export interface TerrainLayers {
  map: Phaser.Tilemaps.Tilemap;
  ground: Phaser.Tilemaps.TilemapLayer;
  water: Phaser.Tilemaps.TilemapLayer;
}

/** Builds Phaser tilemap layers from terrain data and enables collision on solid tiles. */
export function createTerrainLayers(scene: Phaser.Scene, terrain: TerrainData): TerrainLayers {
  const height = terrain.ground.length;
  const width = terrain.ground[0]?.length ?? 0;

  const map = scene.make.tilemap({ tileWidth: TILE_SIZE, tileHeight: TILE_SIZE, width, height });
  const tileset = map.addTilesetImage('village', TEXTURE_KEYS.tileset, TILE_SIZE, TILE_SIZE, 0, 0);
  if (!tileset) throw new Error('Failed to create the village tileset.');

  const water = createLayer(map, 'water', tileset, terrain.water).setDepth(DEPTH.water);
  const ground = createLayer(map, 'ground', tileset, terrain.ground).setDepth(DEPTH.ground);
  ground.setCollision([...SOLID_TILES]);

  return { map, ground, water };
}

function createLayer(
  map: Phaser.Tilemaps.Tilemap,
  name: string,
  tileset: Phaser.Tilemaps.Tileset,
  data: TileIndex[][],
): Phaser.Tilemaps.TilemapLayer {
  const layer = map.createBlankLayer(name, tileset);
  if (!layer) throw new Error(`Failed to create tilemap layer "${name}".`);
  data.forEach((row, y) =>
    row.forEach((index, x) => {
      if (index !== TILE.empty) layer.putTileAt(index, x, y);
    }),
  );
  return layer;
}
