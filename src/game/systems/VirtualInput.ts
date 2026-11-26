import { EventBus } from './EventBus';
import type { InputState } from './KeyboardInput';

/** Which on-screen (touch) buttons are held. Sent by React's TouchControls. */
export interface VirtualButtons {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export const RELEASED_BUTTONS: Readonly<VirtualButtons> = { left: false, right: false, jump: false };

/**
 * Turns on-screen button state from React into the same InputState the
 * keyboard produces. Deliberately Phaser-free: it only listens on the EventBus.
 *
 * A jump tap shorter than one frame still counts: the press is queued until
 * the next read().
 */
export class VirtualInput {
  private buttons: VirtualButtons = RELEASED_BUTTONS;
  private jumpQueued = false;
  private readonly unsubscribe: () => void;

  constructor() {
    this.unsubscribe = EventBus.on('ui-virtual-input', (next) => {
      if (next.jump && !this.buttons.jump) this.jumpQueued = true;
      this.buttons = next;
    });
  }

  /** Merges the on-screen buttons into a keyboard InputState (either source can move the player). */
  mergeInto(keyboard: InputState): InputState {
    const b = this.buttons;
    const jumpPressed = this.jumpQueued;
    this.jumpQueued = false;
    return {
      ...keyboard,
      left: keyboard.left || b.left,
      right: keyboard.right || b.right,
      jumpHeld: keyboard.jumpHeld || b.jump,
      jumpPressed: keyboard.jumpPressed || jumpPressed,
    };
  }

  destroy(): void {
    this.unsubscribe();
    this.buttons = RELEASED_BUTTONS;
    this.jumpQueued = false;
  }
}
