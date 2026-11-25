import type { InteractableKind } from './types';

export interface InteractableKindConfig {
  /** Max horizontal distance (px) between player centre and the interactable. */
  range: number;
  /** Default height (px) above the surface where the prompt icon floats. */
  promptHeight: number;
  /** W / Up triggers it as well as E. */
  acceptsUp: boolean;
}

export const INTERACTABLE_KINDS: Record<InteractableKind, InteractableKindConfig> = {
  sign: { range: 16, promptHeight: 32, acceptsUp: false },
  door: { range: 10, promptHeight: 30, acceptsUp: true },
  building: { range: 12, promptHeight: 30, acceptsUp: true },
  npc: { range: 16, promptHeight: 34, acceptsUp: false },
};
