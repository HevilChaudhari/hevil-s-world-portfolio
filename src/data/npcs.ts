/** Villagers. Their look is defined in the game (src/game/assets/placeholders/npcs.ts). */
export const NPCS = {
  guide: { name: 'Village Guide', role: 'Knows every path in the village' },
  'workshop-keeper': { name: 'Workshop Keeper', role: 'Looks after the Projects Workshop' },
  'qa-engineer': { name: 'QA Engineer', role: 'Keeps the Testing Laboratory records' },
  librarian: { name: 'Village Librarian', role: 'Tends the Knowledge Library' },
  'video-creator': { name: 'Video Creator', role: 'Films the development journey' },
} as const satisfies Record<string, { name: string; role: string }>;

export type NpcId = keyof typeof NPCS;
