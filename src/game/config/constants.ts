/**
 * Core game constants. The game renders at a small "virtual" resolution and is
 * scaled up by integer multiples for crisp pixel art (see utils/pixelZoom.ts).
 */
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;
export const TILE_SIZE = 16;

export const SCENE_KEYS = {
  boot: 'BootScene',
  preload: 'PreloadScene',
  village: 'VillageScene',
} as const;

export type SceneKey = (typeof SCENE_KEYS)[keyof typeof SCENE_KEYS];

/** Render order, back to front. */
export const DEPTH = {
  sky: 0,
  mountainsFar: 1,
  mountainsNear: 2,
  clouds: 3,
  windmills: 4,
  hills: 5,
  water: 8,
  buildings: 10,
  decorBack: 15,
  ground: 20,
  obstacles: 25,
  player: 30,
  decorFront: 35,
  prompt: 40,
} as const;

/** Registry keys used to pass settings from React into the game. */
export const REGISTRY_KEYS = {
  reducedMotion: 'reducedMotion',
  /** ReturnPoint | null: where the player appears when the village loads. */
  spawn: 'spawn',
} as const;

/**
 * Countryside palette shared by placeholder art and scene backgrounds.
 * Keep in sync with the Tailwind theme in src/styles/index.css.
 */
export const PALETTE = {
  skyTop: 0x8ecae6,
  skyBottom: 0xf6e7c1,
  mountainFar: 0x9bb7c9,
  mountainNear: 0x7a9e8e,
  snow: 0xeef3f6,
  hills: 0x6fa35a,
  hillsDark: 0x5a8f4a,
  grassLight: 0x7cc35f,
  grass: 0x5a9e4b,
  grassDark: 0x3f6b3a,
  dirt: 0x8b5e3c,
  dirtDark: 0x6b4226,
  wood: 0xa0703f,
  woodLight: 0xc08a52,
  woodDark: 0x6b4226,
  stone: 0x8d8d8d,
  stoneLight: 0xa8a8a8,
  stoneDark: 0x5f5f5f,
  cobble: 0xa8977c,
  cobbleLight: 0xc2b394,
  mortar: 0x6f6352,
  water: 0x4f9bd1,
  waterDeep: 0x3d86bf,
  waterDark: 0x2f6f9f,
  waterFoam: 0xa7d8f0,
  bark: 0x6b4226,
  leaves: 0x4f8f3f,
  leavesLight: 0x6fb352,
  pine: 0x2f6b45,
  pineLight: 0x3f8657,
  cloud: 0xfdfaf2,
  cloudShade: 0xe3ecf2,
  plaster: 0xe9d8a6,
  plasterShade: 0xcdb98a,
  roof: 0xb5523b,
  roofDark: 0x8e3b2a,
  glass: 0x8ecae6,
  flowerRed: 0xe76f51,
  flowerYellow: 0xf4d35e,
  ink: 0x1f2a24,
} as const;
