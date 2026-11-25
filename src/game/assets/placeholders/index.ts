import type Phaser from 'phaser';
import { TEXTURE_KEYS, type TextureKey } from '../../config/assetKeys';
import type { Painter } from './types';
import { paintTileset } from './tileset';
import { paintClouds, paintHills, paintMountainsFar, paintMountainsNear } from './backdrop';
import { paintBush, paintFence, paintFlowerRed, paintFlowerYellow, paintPine, paintRock, paintTree, paintTuft } from './scenery';
import { paintCottage, paintWindmill, paintWindmillBlades } from './buildings';
import { paintCastle, paintForge, paintHome, paintLab, paintLibrary, paintVlog, paintWorkshop } from './landmarks';
import { paintPlayer } from './player';
import { paintNpcGuide, paintNpcLibrarian, paintNpcQaEngineer, paintNpcVideoCreator, paintNpcWorkshopKeeper } from './npcs';
import { paintBarrel, paintCrate, paintPromptKey, paintSignpost } from './objects';

/**
 * TEMPORARY PLACEHOLDER ART
 * -------------------------
 * Every texture key has a painter here, so the game is fully playable before real
 * art exists. A painter is skipped when a real file with the same key was loaded
 * (see IMAGE_ASSETS / SPRITESHEET_ASSETS in config/assetKeys.ts).
 */
const PAINTERS: Record<TextureKey, Painter> = {
  [TEXTURE_KEYS.tileset]: paintTileset,
  [TEXTURE_KEYS.mountainsFar]: paintMountainsFar,
  [TEXTURE_KEYS.mountainsNear]: paintMountainsNear,
  [TEXTURE_KEYS.clouds]: paintClouds,
  [TEXTURE_KEYS.hills]: paintHills,
  [TEXTURE_KEYS.tree]: paintTree,
  [TEXTURE_KEYS.pine]: paintPine,
  [TEXTURE_KEYS.bush]: paintBush,
  [TEXTURE_KEYS.rock]: paintRock,
  [TEXTURE_KEYS.fence]: paintFence,
  [TEXTURE_KEYS.tuft]: paintTuft,
  [TEXTURE_KEYS.flowerRed]: paintFlowerRed,
  [TEXTURE_KEYS.flowerYellow]: paintFlowerYellow,
  [TEXTURE_KEYS.cottage]: paintCottage,
  [TEXTURE_KEYS.windmill]: paintWindmill,
  [TEXTURE_KEYS.windmillBlades]: paintWindmillBlades,
  [TEXTURE_KEYS.signpost]: paintSignpost,
  [TEXTURE_KEYS.crate]: paintCrate,
  [TEXTURE_KEYS.barrel]: paintBarrel,
  [TEXTURE_KEYS.promptKey]: paintPromptKey,
  [TEXTURE_KEYS.bldHome]: paintHome,
  [TEXTURE_KEYS.bldWorkshop]: paintWorkshop,
  [TEXTURE_KEYS.bldForge]: paintForge,
  [TEXTURE_KEYS.bldLab]: paintLab,
  [TEXTURE_KEYS.bldLibrary]: paintLibrary,
  [TEXTURE_KEYS.bldVlog]: paintVlog,
  [TEXTURE_KEYS.bldCastle]: paintCastle,
  [TEXTURE_KEYS.player]: paintPlayer,
  [TEXTURE_KEYS.npcGuide]: paintNpcGuide,
  [TEXTURE_KEYS.npcWorkshopKeeper]: paintNpcWorkshopKeeper,
  [TEXTURE_KEYS.npcQaEngineer]: paintNpcQaEngineer,
  [TEXTURE_KEYS.npcLibrarian]: paintNpcLibrarian,
  [TEXTURE_KEYS.npcVideoCreator]: paintNpcVideoCreator,
};

/** Paints a texture from a Painter (skipped if the key already exists) and slices frames. */
export function paintTexture(scene: Phaser.Scene, key: string, paint: Painter): void {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({}, false);
  const result = paint(g);
  g.generateTexture(key, result.width, result.height);
  g.destroy();

  if (result.frameWidth && result.frameHeight) {
    const texture = scene.textures.get(key);
    const columns = Math.floor(result.width / result.frameWidth);
    for (let i = 0; i < columns; i += 1) {
      texture.add(i, 0, i * result.frameWidth, 0, result.frameWidth, result.frameHeight);
    }
  }
}

export function generatePlaceholderTextures(scene: Phaser.Scene): void {
  for (const [key, paint] of Object.entries(PAINTERS)) paintTexture(scene, key, paint);
}
