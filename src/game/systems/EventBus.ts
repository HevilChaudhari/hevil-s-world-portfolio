import type { BuildingId } from '@/data/buildings';
import type { SceneKey } from '../config/constants';
import type { InteractionFocus, InteractionTriggered } from '../interactions/types';
import type { VirtualButtons } from './VirtualInput';

/**
 * Typed contract for every message that crosses the Phaser <-> React boundary.
 * Add new events here; both sides get compile-time checking.
 */
export interface GameEventMap {
  // ---- Game -> React ----
  /** Asset loading progress, 0..1. */
  'loading-progress': number;
  /** A scene finished `create()` and is visible. */
  'scene-ready': { sceneKey: SceneKey };
  /** The interactable in range changed; null when nothing is in range. */
  'interaction-focus': InteractionFocus | null;
  /** The player interacted with something. */
  'interaction-triggered': InteractionTriggered;

  // ---- React -> Game ----
  /** A UI panel opened/closed; the game freezes player input while open. */
  'ui-modal-changed': { open: boolean };
  /** The visitor clicked/tapped the on-screen interaction prompt. */
  'ui-interact-request': null;
  /** Fast travel: move the player to a building's door. */
  'ui-travel': { building: BuildingId };
  /** On-screen touch buttons changed (sent on every change, released when hidden). */
  'ui-virtual-input': VirtualButtons;
}

export type GameEventName = keyof GameEventMap;

type Listener<E extends GameEventName> = (payload: GameEventMap[E]) => void;

/**
 * Minimal typed event emitter. Deliberately free of Phaser imports: the website
 * shell uses this bus too, and importing Phaser here would pull the whole engine
 * into every page's initial download.
 */
class TypedEventBus {
  private readonly listeners = new Map<GameEventName, Set<Listener<never>>>();

  emit<E extends GameEventName>(event: E, payload: GameEventMap[E]): void {
    // Copy so listeners may unsubscribe while being called.
    for (const listener of [...(this.listeners.get(event) ?? [])]) {
      (listener as Listener<E>)(payload);
    }
  }

  on<E extends GameEventName>(event: E, listener: Listener<E>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener as Listener<never>);
    return () => {
      set.delete(listener as Listener<never>);
    };
  }

  removeAll(): void {
    this.listeners.clear();
  }
}

/** Singleton bus shared by the game and the React UI. */
export const EventBus = new TypedEventBus();
