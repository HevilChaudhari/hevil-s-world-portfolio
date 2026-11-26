import { describe, expect, it } from 'vitest';
import { BUILDINGS } from '@/data/buildings';
import { buildTerrain } from './buildTerrain';
import { TILE } from './tiles';
import type { MapDefinition } from './types';
import { validatePlacements } from './validateMap';
import { VILLAGE_MAP } from './villageMap';

describe('village map', () => {
  const terrain = buildTerrain(VILLAGE_MAP);

  it('builds layers of the declared size', () => {
    expect(terrain.ground).toHaveLength(VILLAGE_MAP.heightTiles);
    expect(terrain.ground[0]).toHaveLength(VILLAGE_MAP.widthTiles);
    expect(terrain.surfaceRow).toHaveLength(VILLAGE_MAP.widthTiles);
  });

  it('has walkable ground (or water) under every column', () => {
    terrain.surfaceRow.forEach((row, col) => {
      const tile = terrain.ground[row][col];
      const water = terrain.water[row]?.[col] ?? TILE.empty;
      expect(tile !== TILE.empty || water !== TILE.empty, `column ${col}`).toBe(true);
    });
  });

  it('places everything inside the map with unique interactable ids', () => {
    expect(() => validatePlacements(VILLAGE_MAP)).not.toThrow();
  });

  it('places every portfolio building exactly once', () => {
    const placed = VILLAGE_MAP.buildings.map((b) => b.building).sort();
    expect(placed).toEqual(Object.keys(BUILDINGS).sort());
  });
});

describe('terrain validation', () => {
  const base: MapDefinition = { ...VILLAGE_MAP, widthTiles: 10, terrain: [{ from: 0, to: 9, kind: 'grass' }], decorations: [], buildings: [], npcs: [], interactables: [], spawnCol: 1 };

  it('rejects gaps between segments', () => {
    expect(() => buildTerrain({ ...base, terrain: [{ from: 0, to: 3, kind: 'grass' }, { from: 5, to: 9, kind: 'grass' }] })).toThrow();
  });

  it('rejects overlapping segments', () => {
    expect(() => buildTerrain({ ...base, terrain: [{ from: 0, to: 5, kind: 'grass' }, { from: 5, to: 9, kind: 'grass' }] })).toThrow();
  });

  it('raises the surface with elevation', () => {
    const t = buildTerrain({ ...base, terrain: [{ from: 0, to: 4, kind: 'grass' }, { from: 5, to: 9, kind: 'grass', elevation: 2 }] });
    expect(t.surfaceRow[0] - t.surfaceRow[9]).toBe(2);
  });

  it('rejects placements outside the map and duplicate ids', () => {
    expect(() => validatePlacements({ ...base, spawnCol: 99 })).toThrow(/spawnCol/);
    const dup = { ...base, buildings: [{ building: 'castle' as const, col: 2, signCol: 1 }, { building: 'castle' as const, col: 6, signCol: 5 }] };
    expect(() => validatePlacements(dup)).toThrow(/duplicate/);
  });
});
