import { PALETTE as C } from '../../config/constants';
import { px, type Painter } from './types';

/** 18x22 wooden signpost, anchored bottom-centre. */
export const paintSignpost: Painter = (g) => {
  px(g, C.woodDark, 8, 10, 3, 12);
  px(g, C.woodDark, 0, 0, 18, 12);
  px(g, C.wood, 1, 1, 16, 10);
  px(g, C.woodLight, 1, 1, 16, 1);
  // "Writing"
  px(g, C.woodDark, 3, 4, 10, 1);
  px(g, C.woodDark, 3, 7, 12, 1);
  px(g, C.woodDark, 0, 12, 18, 1);
  return { width: 18, height: 22 };
};

/** 16x16 wooden crate (solid obstacle). */
export const paintCrate: Painter = (g) => {
  px(g, C.woodDark, 0, 0, 16, 16);
  px(g, C.wood, 1, 1, 14, 14);
  px(g, C.woodLight, 1, 1, 14, 1);
  px(g, C.woodDark, 1, 7, 14, 2);
  for (let i = 0; i < 12; i += 1) px(g, C.woodDark, 2 + i, 2 + i, 2, 1);
  return { width: 16, height: 16 };
};

/** 12x16 barrel (solid obstacle). */
export const paintBarrel: Painter = (g) => {
  px(g, C.wood, 1, 0, 10, 16);
  px(g, C.wood, 0, 2, 12, 12);
  px(g, C.woodLight, 3, 1, 2, 14);
  px(g, C.stoneDark, 0, 3, 12, 1);
  px(g, C.stoneDark, 0, 12, 12, 1);
  px(g, C.woodDark, 1, 0, 10, 1);
  px(g, C.woodDark, 1, 15, 10, 1);
  return { width: 12, height: 16 };
};

/** 11x12 "E" keycap shown above the focused interactable. */
export const paintPromptKey: Painter = (g) => {
  px(g, C.ink, 0, 0, 11, 12);
  px(g, C.plaster, 1, 1, 9, 9);
  px(g, C.plasterShade, 1, 10, 9, 1);
  // E glyph
  px(g, C.ink, 3, 2, 1, 6);
  px(g, C.ink, 3, 2, 5, 1);
  px(g, C.ink, 3, 4, 4, 1);
  px(g, C.ink, 3, 7, 5, 1);
  return { width: 11, height: 12 };
};
