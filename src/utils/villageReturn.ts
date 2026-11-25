import type { BuildingId } from '@/data/buildings';

/**
 * Where the player should appear when the village (re)loads: the building whose
 * page the visitor is on, and optionally the exact x of the door/villager they
 * used to get there. Stored per browser tab.
 */
export interface ReturnPoint {
  building: BuildingId;
  /** Exact world x (door or villager used). Falls back to the building door. */
  x?: number;
}

const KEY = 'hevils-world:village-return';

export function saveReturnPoint(point: ReturnPoint): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(point));
  } catch {
    // Storage can be unavailable (private mode, disabled); returning to spawn is fine.
  }
}

export function readReturnPoint(): ReturnPoint | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (value && typeof value === 'object' && 'building' in value && typeof value.building === 'string') {
      const x = 'x' in value && typeof value.x === 'number' && Number.isFinite(value.x) ? value.x : undefined;
      return { building: value.building as BuildingId, x };
    }
  } catch {
    // Corrupt value: ignore.
  }
  return null;
}
