import type { BuildingId } from '@/data/buildings';
import type { NpcId } from '@/data/npcs';
import type { InteractableDefinition } from '../interactions/types';

/**
 * Data model for side-scrolling levels. A level is described as a run of
 * terrain segments (column ranges) plus scenery placements; buildTerrain()
 * turns it into tilemap layer data.
 */

/** What the walkable surface of a column range is made of. */
export type SurfaceKind =
  | 'grass'
  | 'path' // cobblestone
  | 'stone' // raised stone block
  | 'bridge' // wooden bridge over a river (river runs underneath)
  | 'stream'; // shallow water, walkable riverbed one tile lower

export interface TerrainSegment {
  /** First column (inclusive). */
  from: number;
  /** Last column (inclusive). */
  to: number;
  kind: SurfaceKind;
  /** Tiles above the base ground row. Default 0. */
  elevation?: number;
}

export type DecorationType =
  | 'tree'
  | 'pine'
  | 'bush'
  | 'rock'
  | 'fence'
  | 'tuft'
  | 'flowerRed'
  | 'flowerYellow'
  | 'cottage'
  | 'crate' // solid obstacle
  | 'barrel'; // solid obstacle

/** A scenery sprite standing on the surface of a column. */
export interface DecorationPlacement {
  type: DecorationType;
  col: number;
  /** Fine-tune horizontal position in pixels. */
  offsetX?: number;
}

/** A portfolio building; its door is at `col`, its name board at `signCol`. */
export interface BuildingPlacement {
  building: BuildingId;
  col: number;
  signCol: number;
}

export interface NpcPlacement {
  npc: NpcId;
  col: number;
}

/** Large background props that live in a parallax layer (x in layer pixels). */
export interface BackdropProp {
  type: 'windmill';
  x: number;
}

export interface MapDefinition {
  id: string;
  widthTiles: number;
  heightTiles: number;
  /** Row index of the base ground surface. */
  groundRow: number;
  /** Column where the player appears. */
  spawnCol: number;
  terrain: readonly TerrainSegment[];
  decorations: readonly DecorationPlacement[];
  backdropProps: readonly BackdropProp[];
  buildings: readonly BuildingPlacement[];
  npcs: readonly NpcPlacement[];
  /** Signposts and cottage doors. */
  interactables: readonly InteractableDefinition[];
}
