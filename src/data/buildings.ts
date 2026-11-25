import type { DialogueId } from './dialogues';
import type { BuildingId, PageId } from './ids';

export type { BuildingId };

/**
 * The seven portfolio locations. Shared by the village (signboards, doors) and
 * the website (building selection menu, from Phase 5).
 */
export interface BuildingInfo {
  name: string;
  /** Signboard text, one entry per line. Letters A-Z, space, ' and & only. */
  signLines: readonly string[];
  /** Dialogue shown when the player enters through the door. */
  dialogue: DialogueId;
  /** Pages reachable from this building. */
  pages: readonly PageId[];
}

export const BUILDINGS = {
  'my-home': {
    name: 'My Home',
    signLines: ['MY HOME'],
    dialogue: 'building-my-home',
    pages: ['about'],
  },
  'projects-workshop': {
    name: 'Projects Workshop',
    signLines: ['PROJECTS', 'WORKSHOP'],
    dialogue: 'building-projects-workshop',
    pages: ['projects', 'architecture'],
  },
  'developers-forge': {
    name: "Developer's Forge",
    signLines: ["DEVELOPER'S", 'FORGE'],
    dialogue: 'building-developers-forge',
    pages: ['architecture'],
  },
  'testing-lab': {
    name: 'Testing Laboratory',
    signLines: ['TESTING', 'LABORATORY'],
    dialogue: 'building-testing-lab',
    pages: ['test-cases'],
  },
  'knowledge-library': {
    name: 'Knowledge Library',
    signLines: ['KNOWLEDGE', 'LIBRARY'],
    dialogue: 'building-knowledge-library',
    pages: ['notes'],
  },
  'vlog-house': {
    name: 'Vlog House',
    signLines: ['VLOG HOUSE'],
    dialogue: 'building-vlog-house',
    pages: ['vlogs'],
  },
  castle: {
    name: 'Resume & Contact Castle',
    signLines: ['RESUME &', 'CONTACT'],
    dialogue: 'building-castle',
    pages: ['resume', 'experience'],
  },
} as const satisfies Record<BuildingId, BuildingInfo>;
