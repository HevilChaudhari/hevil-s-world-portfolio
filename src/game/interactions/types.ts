import type { DialogueId } from '@/data/dialogues';

/**
 * Interaction model shared by the game and the React UI.
 *   sign     - small wooden signpost
 *   door     - generic cottage door (W/Up also works)
 *   building - portfolio building entrance (W/Up also works)
 *   npc      - villager
 */
export type InteractableKind = 'sign' | 'door' | 'building' | 'npc';

/** A sign or cottage door placed in a map definition. */
export interface InteractableDefinition {
  /** Unique within the map; used by the UI and, later, quests. */
  id: string;
  kind: 'sign' | 'door';
  /** Column the interactable stands on. */
  col: number;
  /** Short action shown in the prompt, e.g. "Read the sign". */
  label: string;
  dialogue: DialogueId;
}

/** Sent to React when the interactable in range changes (null = none in range). */
export interface InteractionFocus {
  id: string;
  kind: InteractableKind;
  label: string;
  /** Whether W / Up also triggers it, in addition to E. */
  acceptsUp: boolean;
}

/** Sent to React when the player interacts. */
export interface InteractionTriggered {
  id: string;
  kind: InteractableKind;
  dialogue: DialogueId;
  /** Data URL of the villager's sprite for the dialogue portrait, if any. */
  portrait: string | null;
  /** World x of the interactable, so the village can return the player here. */
  x: number;
}
