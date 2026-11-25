import { CHARACTER_FRAME, IDLE_POSES, drawCharacter, type CharacterLook } from './character';
import type { Painter } from './types';

/**
 * TEMPORARY NPC SPRITESHEETS
 * Each: 2 idle frames of 16x24, facing right. A replacement sheet must keep
 * that layout (frames 0-1 = idle).
 */
const base = {
  skin: 0xf1c27d,
  skinShade: 0xd9a066,
  pants: 0x5c4033,
  pantsDark: 0x45301f,
  boots: 0x2e1d12,
  eye: 0x1f2a24,
} as const;

const LOOKS = {
  guide: {
    ...base,
    hair: 0xd8d8d0,
    shirt: 0x5a9e4b,
    shirtDark: 0x3f6b3a,
    beard: 0xeeeeea,
    hat: { style: 'straw', color: 0xe9c46a, band: 0xb5523b },
  },
  workshopKeeper: {
    ...base,
    skin: 0xc68e5b,
    skinShade: 0xa8744a,
    hair: 0x2e1d12,
    shirt: 0xb5523b,
    shirtDark: 0x8e3b2a,
    apron: 0x8b5e3c,
    beard: 0x2e1d12,
    hat: { style: 'cap', color: 0x4a2f1b },
  },
  qaEngineer: {
    ...base,
    hair: 0x1f1a17,
    shirt: 0xf2f0e6,
    shirtDark: 0xc9c6b8,
    pants: 0x3b5f86,
    pantsDark: 0x2c4866,
    glasses: true,
    longCoat: true,
  },
  librarian: {
    ...base,
    skin: 0xe8b896,
    hair: 0x9a9a92,
    shirt: 0x7a4f7f,
    shirtDark: 0x5c3a60,
    pants: 0x5c3a60,
    pantsDark: 0x452b48,
    bun: true,
    glasses: true,
    longCoat: true,
  },
  videoCreator: {
    ...base,
    skin: 0x8d5a3b,
    skinShade: 0x744a30,
    hair: 0x1f1a17,
    shirt: 0xe9a03b,
    shirtDark: 0xc07f25,
    pants: 0x3f5f6b,
    pantsDark: 0x2f4852,
    headphones: 0x2e2e2e,
  },
} as const satisfies Record<string, CharacterLook>;

const npcPainter = (look: CharacterLook): Painter => (g) => {
  IDLE_POSES.forEach((pose, i) => drawCharacter(g, i * CHARACTER_FRAME.width, look, pose));
  return {
    width: IDLE_POSES.length * CHARACTER_FRAME.width,
    height: CHARACTER_FRAME.height,
    frameWidth: CHARACTER_FRAME.width,
    frameHeight: CHARACTER_FRAME.height,
  };
};

export const paintNpcGuide = npcPainter(LOOKS.guide);
export const paintNpcWorkshopKeeper = npcPainter(LOOKS.workshopKeeper);
export const paintNpcQaEngineer = npcPainter(LOOKS.qaEngineer);
export const paintNpcLibrarian = npcPainter(LOOKS.librarian);
export const paintNpcVideoCreator = npcPainter(LOOKS.videoCreator);
