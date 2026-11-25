import type { DecorationPlacement, DecorationType, MapDefinition } from './types';

/** Shorthand: the same decoration type at several columns. */
const at = (type: DecorationType, cols: number[]): DecorationPlacement[] => cols.map((col) => ({ type, col }));

/**
 * THE VILLAGE (Phase 4 layout, 200 columns = 3200 px)
 *
 *   0-35    meadow: spawn, Village Guide, My Home, a cottage
 *  36-65    cobblestone square: Projects Workshop + Keeper, Developer's Forge
 *  66-73    grassy hill
 *  74-95    meadow: Testing Laboratory + QA Engineer
 *  96-103   wooden bridge over the river
 * 104-129   meadow: Knowledge Library + Librarian
 * 130-163   market lane: Vlog House + Video Creator, raised stone platform (152-155), crates
 * 164-175   meadow with a shallow stream (166-168)
 * 176-199   castle hill: Resume & Contact Castle
 *
 * Building footprints (cols, keep scenery clear of them):
 *   home 22-27, workshop 41-47, forge 58-63, lab 82-87, library 113-119, vlog 140-145, castle 183-193
 */
export const VILLAGE_MAP: MapDefinition = {
  id: 'village',
  widthTiles: 200,
  heightTiles: 17,
  groundRow: 13,
  spawnCol: 6,

  terrain: [
    { from: 0, to: 35, kind: 'grass' },
    { from: 36, to: 65, kind: 'path' },
    { from: 66, to: 67, kind: 'grass', elevation: 1 },
    { from: 68, to: 71, kind: 'grass', elevation: 2 },
    { from: 72, to: 73, kind: 'grass', elevation: 1 },
    { from: 74, to: 95, kind: 'grass' },
    { from: 96, to: 103, kind: 'bridge' },
    { from: 104, to: 129, kind: 'grass' },
    { from: 130, to: 151, kind: 'path' },
    { from: 152, to: 155, kind: 'stone', elevation: 2 },
    { from: 156, to: 163, kind: 'path' },
    { from: 164, to: 165, kind: 'grass' },
    { from: 166, to: 168, kind: 'stream' },
    { from: 169, to: 175, kind: 'grass' },
    { from: 176, to: 199, kind: 'grass', elevation: 1 },
  ],

  buildings: [
    { building: 'my-home', col: 24, signCol: 19 },
    { building: 'projects-workshop', col: 44, signCol: 38 },
    { building: 'developers-forge', col: 60, signCol: 55 },
    { building: 'testing-lab', col: 84, signCol: 79 },
    { building: 'knowledge-library', col: 116, signCol: 109 },
    { building: 'vlog-house', col: 142, signCol: 136 },
    { building: 'castle', col: 188, signCol: 180 },
  ],

  npcs: [
    { npc: 'guide', col: 14 },
    { npc: 'workshop-keeper', col: 50 },
    { npc: 'qa-engineer', col: 90 },
    { npc: 'librarian', col: 123 },
    { npc: 'video-creator', col: 148 },
  ],

  interactables: [
    { id: 'sign-welcome', kind: 'sign', col: 9, label: 'Read the sign', dialogue: 'sign-welcome' },
    { id: 'sign-bridge', kind: 'sign', col: 94, label: 'Read the sign', dialogue: 'sign-bridge' },
    { id: 'sign-east', kind: 'sign', col: 197, label: 'Read the sign', dialogue: 'sign-east' },
    { id: 'door-cottage', kind: 'door', col: 31, label: 'Knock on the door', dialogue: 'door-cottage' },
  ],

  decorations: [
    ...at('cottage', [31]),
    ...at('tree', [2, 16, 34, 76, 106, 126, 165, 172]),
    ...at('pine', [7, 65, 104, 128, 175]),
    ...at('bush', [5, 12, 28, 74, 93, 105, 121, 129, 164, 174]),
    ...at('rock', [11, 75, 107, 171]),
    ...at('fence', [131, 132, 133, 134, 156, 157]),
    ...at('flowerRed', [4, 10, 15, 29, 70, 77, 91, 108, 125, 173, 178, 196]),
    ...at('flowerYellow', [6, 21, 69, 89, 110, 124, 177, 198]),
    // Solid obstacles: jump over or stand on them.
    ...at('crate', [158, 159]),
    ...at('barrel', [127]),
    ...at('tuft', [3, 8, 15, 29, 67, 71, 75, 81, 89, 93, 105, 111, 122, 165, 172, 179, 195]),
  ],

  backdropProps: [
    { type: 'windmill', x: 420 },
    { type: 'windmill', x: 1180 },
    { type: 'windmill', x: 1700 },
  ],
};
