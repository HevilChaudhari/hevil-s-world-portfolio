import { assetUrl } from '@/utils/assetUrl';

/**
 * Texture keys used throughout the game. Scenes reference textures ONLY by these keys.
 *
 * Every key has a runtime-generated placeholder (see game/assets/placeholders/).
 * To replace a placeholder with real pixel art, add an entry with the same key to
 * IMAGE_ASSETS or SPRITESHEET_ASSETS below; the placeholder is then skipped.
 * Keep the placeholder's dimensions / frame layout (documented on each painter).
 */
export const TEXTURE_KEYS = {
  // Terrain tileset: one 16px-tall strip, tile order defined in game/maps/tiles.ts
  tileset: 'env-tileset',
  // Parallax backdrop strips (480px wide, tile horizontally)
  mountainsFar: 'env-mountains-far',
  mountainsNear: 'env-mountains-near',
  clouds: 'env-clouds',
  hills: 'env-hills',
  // Scenery sprites
  tree: 'env-tree',
  pine: 'env-pine',
  bush: 'env-bush',
  rock: 'env-rock',
  fence: 'env-fence',
  tuft: 'env-grass-tuft',
  flowerRed: 'env-flower-red',
  flowerYellow: 'env-flower-yellow',
  cottage: 'bld-cottage',
  windmill: 'bld-windmill',
  windmillBlades: 'bld-windmill-blades',
  // Interactable / obstacle objects
  signpost: 'obj-signpost',
  crate: 'obj-crate',
  barrel: 'obj-barrel',
  // UI drawn inside the game world
  promptKey: 'ui-prompt-key',
  // Portfolio buildings (door must be horizontally centred)
  bldHome: 'bld-my-home',
  bldWorkshop: 'bld-projects-workshop',
  bldForge: 'bld-developers-forge',
  bldLab: 'bld-testing-lab',
  bldLibrary: 'bld-knowledge-library',
  bldVlog: 'bld-vlog-house',
  bldCastle: 'bld-castle',
  // Characters (16x24 frames; NPC sheets: 2 idle frames)
  player: 'chr-player',
  npcGuide: 'npc-guide',
  npcWorkshopKeeper: 'npc-workshop-keeper',
  npcQaEngineer: 'npc-qa-engineer',
  npcLibrarian: 'npc-librarian',
  npcVideoCreator: 'npc-video-creator',
} as const;

export type TextureKey = (typeof TEXTURE_KEYS)[keyof typeof TEXTURE_KEYS];

export interface ImageAsset {
  key: TextureKey;
  /** Path relative to /public, e.g. 'assets/environment/tileset.png'. */
  path: string;
}

export interface SpritesheetAsset extends ImageAsset {
  frameWidth: number;
  frameHeight: number;
}

/**
 * Real image files to load. Empty while everything is a placeholder.
 * Example: { key: TEXTURE_KEYS.tileset, path: 'assets/environment/tileset.png' }
 */
export const IMAGE_ASSETS: readonly ImageAsset[] = [];

/**
 * Real spritesheets to load.
 * Example: { key: TEXTURE_KEYS.player, path: 'assets/characters/player.png', frameWidth: 16, frameHeight: 24 }
 */
export const SPRITESHEET_ASSETS: readonly SpritesheetAsset[] = [];

export const resolveAssetPath = (asset: ImageAsset): string => assetUrl(asset.path);
