import Phaser from 'phaser';
import type { DialogueId } from '@/data/dialogues';
import { DEPTH } from '../config/constants';
import { TEXTURE_KEYS } from '../config/assetKeys';
import { EventBus } from '../systems/EventBus';
import type { InteractableKind, InteractionFocus } from './types';

/** An interactable resolved to world coordinates and behaviour. */
export interface PlacedInteractable {
  id: string;
  kind: InteractableKind;
  label: string;
  dialogue: DialogueId;
  x: number;
  /** y of the surface it stands on. */
  surfaceY: number;
  range: number;
  promptHeight: number;
  acceptsUp: boolean;
  /** Sprite frame shown as the dialogue portrait (villagers). */
  portrait?: { texture: string; frame: number };
}

export interface InteractionFrameInput {
  /** Player centre x and feet y. */
  playerX: number;
  playerFeetY: number;
  interactPressed: boolean;
  upPressed: boolean;
  /** A UI panel is open; interactions are suspended. */
  locked: boolean;
  time: number;
  animate: boolean;
}

/** Max vertical gap between the player's feet and the interactable's surface. */
const VERTICAL_TOLERANCE = 12;
/** Ignore presses right after a panel closes, so the closing key doesn't re-open it. */
const REOPEN_COOLDOWN_MS = 250;

/**
 * Finds the interactable nearest the player, shows a prompt above it, tells
 * React about focus changes, and fires 'interaction-triggered' on E (or W/Up
 * where allowed) or when the visitor taps the on-screen prompt.
 */
export class InteractionSystem {
  private readonly prompt: Phaser.GameObjects.Image;
  private focus: PlacedInteractable | null = null;
  private pendingRequest = false;
  private wasLocked = false;
  private unlockedAt = -Infinity;
  private readonly portraits = new Map<string, string>();
  private readonly unsubscribe: () => void;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly interactables: readonly PlacedInteractable[],
  ) {
    this.prompt = scene.add.image(0, 0, TEXTURE_KEYS.promptKey).setOrigin(0.5, 1).setDepth(DEPTH.prompt).setVisible(false);
    this.unsubscribe = EventBus.on('ui-interact-request', () => {
      this.pendingRequest = true;
    });
    const cleanup = () => this.destroy();
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    scene.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
  }

  /**
   * Runs once per frame. Returns true when W/Up was used to interact, so the
   * caller can suppress the jump it would otherwise cause.
   */
  update(input: InteractionFrameInput): { consumedUp: boolean } {
    if (this.wasLocked && !input.locked) this.unlockedAt = input.time;
    this.wasLocked = input.locked;

    if (input.locked) {
      this.pendingRequest = false;
      this.prompt.setVisible(false);
      return { consumedUp: false };
    }

    this.setFocus(this.findNearest(input.playerX, input.playerFeetY));
    const focus = this.focus;
    const request = this.pendingRequest;
    this.pendingRequest = false;

    if (!focus) return { consumedUp: false };

    const bob = input.animate ? Math.round(Math.sin(input.time / 220)) : 0;
    this.prompt.setPosition(focus.x, focus.surfaceY - focus.promptHeight + bob).setVisible(true);

    const viaUp = focus.acceptsUp && input.upPressed;
    const wantsInteract = input.interactPressed || request || viaUp;
    if (!wantsInteract || input.time - this.unlockedAt < REOPEN_COOLDOWN_MS) return { consumedUp: false };

    EventBus.emit('interaction-triggered', {
      id: focus.id,
      kind: focus.kind,
      dialogue: focus.dialogue,
      portrait: this.portraitFor(focus),
      x: focus.x,
    });
    return { consumedUp: viaUp };
  }

  private findNearest(x: number, feetY: number): PlacedInteractable | null {
    let best: PlacedInteractable | null = null;
    let bestDistance = Infinity;
    for (const item of this.interactables) {
      const dx = Math.abs(item.x - x);
      if (dx > item.range) continue;
      if (Math.abs(item.surfaceY - feetY) > VERTICAL_TOLERANCE) continue;
      if (dx < bestDistance) {
        best = item;
        bestDistance = dx;
      }
    }
    return best;
  }

  private setFocus(next: PlacedInteractable | null): void {
    if (next === this.focus) return;
    this.focus = next;
    if (!next) this.prompt.setVisible(false);
    const payload: InteractionFocus | null = next
      ? { id: next.id, kind: next.kind, label: next.label, acceptsUp: next.acceptsUp }
      : null;
    EventBus.emit('interaction-focus', payload);
  }

  /** Renders the villager's frame to a data URL once, then reuses it. */
  private portraitFor(item: PlacedInteractable): string | null {
    if (!item.portrait) return null;
    const cacheKey = `${item.portrait.texture}:${item.portrait.frame}`;
    let url = this.portraits.get(cacheKey);
    if (!url) {
      const result = this.scene.textures.getBase64(item.portrait.texture, item.portrait.frame);
      url = typeof result === 'string' ? result : undefined;
      if (url) this.portraits.set(cacheKey, url);
    }
    return url ?? null;
  }

  private destroy(): void {
    this.unsubscribe();
    // Make sure React doesn't keep showing a prompt for a scene that is gone.
    if (this.focus) EventBus.emit('interaction-focus', null);
    this.focus = null;
  }
}
