import type { MapDefinition } from './types';

/**
 * Checks placements that reference map columns. Terrain segments are validated
 * by buildTerrain(). Throws with a message naming the bad entry.
 */
export function validatePlacements(map: MapDefinition): void {
  const inBounds = (col: number) => Number.isInteger(col) && col >= 0 && col < map.widthTiles;
  const fail = (message: string): never => {
    throw new Error(`${map.id}: ${message}`);
  };

  if (!inBounds(map.spawnCol)) fail(`spawnCol ${map.spawnCol} is outside the map.`);

  for (const deco of map.decorations) {
    if (!inBounds(deco.col)) fail(`decoration '${deco.type}' at column ${deco.col} is outside the map.`);
  }

  const ids = new Set<string>();
  const claim = (id: string) => {
    if (ids.has(id)) fail(`duplicate interactable id '${id}'.`);
    ids.add(id);
  };

  for (const b of map.buildings) {
    if (!inBounds(b.col) || !inBounds(b.signCol)) fail(`building '${b.building}' is outside the map.`);
    claim(`building-${b.building}`);
  }
  for (const n of map.npcs) {
    if (!inBounds(n.col)) fail(`NPC '${n.npc}' at column ${n.col} is outside the map.`);
    claim(`npc-${n.npc}`);
  }
  for (const item of map.interactables) {
    if (!inBounds(item.col)) fail(`interactable '${item.id}' at column ${item.col} is outside the map.`);
    claim(item.id);
  }
}
