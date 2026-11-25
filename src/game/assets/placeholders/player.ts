import { PLAYER_FRAME } from '../../entities/playerAnimations';
import { CHARACTER_FRAME, IDLE_POSES, drawCharacter, type CharacterLook, type Pose } from './character';
import type { Painter } from './types';

/**
 * TEMPORARY PLAYER SPRITESHEET
 * 8 frames of 16x24, facing right (the game mirrors it for left):
 *   0-1 idle, 2-5 walk, 6 jump (rising), 7 fall
 * A replacement sheet must keep this frame order and size (see PLAYER_FRAME).
 */
const PLAYER_LOOK: CharacterLook = {
  hair: 0x4a2f1b,
  skin: 0xf1c27d,
  skinShade: 0xd9a066,
  shirt: 0x4f7cac,
  shirtDark: 0x3b5f86,
  pants: 0x5c4033,
  pantsDark: 0x45301f,
  boots: 0x2e1d12,
  eye: 0x1f2a24,
  scarf: 0xe76f51,
};

const POSES: readonly Pose[] = [
  ...IDLE_POSES,
  { bob: 0, backLegX: 5, frontLegX: 9, backLegLen: 4, frontLegLen: 4, armDX: -1 }, // walk 0
  { bob: 1, backLegX: 6, frontLegX: 8, backLegLen: 4, frontLegLen: 4, armDX: 0 }, // walk 1
  { bob: 0, backLegX: 9, frontLegX: 5, backLegLen: 4, frontLegLen: 4, armDX: 1 }, // walk 2
  { bob: 1, backLegX: 8, frontLegX: 6, backLegLen: 4, frontLegLen: 4, armDX: 0 }, // walk 3
  { bob: 0, backLegX: 6, frontLegX: 9, backLegLen: 3, frontLegLen: 2, armDX: 1, armUp: true }, // jump
  { bob: 0, backLegX: 5, frontLegX: 9, backLegLen: 4, frontLegLen: 4, armDX: 0, armUp: true }, // fall
];

export const paintPlayer: Painter = (g) => {
  POSES.forEach((pose, i) => drawCharacter(g, i * CHARACTER_FRAME.width, PLAYER_LOOK, pose));
  return {
    width: POSES.length * PLAYER_FRAME.width,
    height: PLAYER_FRAME.height,
    frameWidth: PLAYER_FRAME.width,
    frameHeight: PLAYER_FRAME.height,
  };
};
