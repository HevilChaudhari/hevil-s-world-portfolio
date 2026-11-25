import type { BuildingId } from '@/data/buildings';
import type { NpcId } from '@/data/npcs';
import { TEXTURE_KEYS, type TextureKey } from '../config/assetKeys';

/** Game-only presentation of each portfolio building. */
export interface BuildingArt {
  texture: TextureKey;
  /** Height (px) above the ground where the door's prompt icon sits: just above the door. */
  promptHeight: number;
}

export const BUILDING_ART: Record<BuildingId, BuildingArt> = {
  'my-home': { texture: TEXTURE_KEYS.bldHome, promptHeight: 23 },
  'projects-workshop': { texture: TEXTURE_KEYS.bldWorkshop, promptHeight: 27 },
  'developers-forge': { texture: TEXTURE_KEYS.bldForge, promptHeight: 23 },
  'testing-lab': { texture: TEXTURE_KEYS.bldLab, promptHeight: 23 },
  'knowledge-library': { texture: TEXTURE_KEYS.bldLibrary, promptHeight: 25 },
  'vlog-house': { texture: TEXTURE_KEYS.bldVlog, promptHeight: 23 },
  castle: { texture: TEXTURE_KEYS.bldCastle, promptHeight: 45 },
};

export const NPC_ART: Record<NpcId, { texture: TextureKey }> = {
  guide: { texture: TEXTURE_KEYS.npcGuide },
  'workshop-keeper': { texture: TEXTURE_KEYS.npcWorkshopKeeper },
  'qa-engineer': { texture: TEXTURE_KEYS.npcQaEngineer },
  librarian: { texture: TEXTURE_KEYS.npcLibrarian },
  'video-creator': { texture: TEXTURE_KEYS.npcVideoCreator },
};
