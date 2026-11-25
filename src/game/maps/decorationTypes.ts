import { DEPTH } from '../config/constants';
import { TEXTURE_KEYS, type TextureKey } from '../config/assetKeys';
import type { DecorationType } from './types';

interface DecorationStyle {
  texture: TextureKey;
  depth: number;
  /** Pixels the sprite sinks into the ground so it looks planted. */
  sink: number;
  /** Blocks the player (gets a static physics body). Default: walk in front of it. */
  solid?: boolean;
}

/** How each decoration type is drawn. All decorations are anchored bottom-centre. */
export const DECORATION_STYLES: Record<DecorationType, DecorationStyle> = {
  cottage: { texture: TEXTURE_KEYS.cottage, depth: DEPTH.buildings, sink: 0 },
  tree: { texture: TEXTURE_KEYS.tree, depth: DEPTH.decorBack, sink: 1 },
  pine: { texture: TEXTURE_KEYS.pine, depth: DEPTH.decorBack, sink: 1 },
  bush: { texture: TEXTURE_KEYS.bush, depth: DEPTH.decorBack, sink: 1 },
  rock: { texture: TEXTURE_KEYS.rock, depth: DEPTH.decorBack, sink: 1 },
  fence: { texture: TEXTURE_KEYS.fence, depth: DEPTH.decorBack, sink: 0 },
  flowerRed: { texture: TEXTURE_KEYS.flowerRed, depth: DEPTH.decorBack, sink: 1 },
  flowerYellow: { texture: TEXTURE_KEYS.flowerYellow, depth: DEPTH.decorBack, sink: 1 },
  tuft: { texture: TEXTURE_KEYS.tuft, depth: DEPTH.decorFront, sink: 1 },
  crate: { texture: TEXTURE_KEYS.crate, depth: DEPTH.obstacles, sink: 0, solid: true },
  barrel: { texture: TEXTURE_KEYS.barrel, depth: DEPTH.obstacles, sink: 0, solid: true },
};
