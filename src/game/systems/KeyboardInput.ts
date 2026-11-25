import Phaser from 'phaser';

/** What the player wants to do this frame, independent of the input device. */
export interface MovementIntent {
  left: boolean;
  right: boolean;
  down: boolean;
  /** Jump key is currently held (for variable jump height). */
  jumpHeld: boolean;
  /** Jump key went down this frame. */
  jumpPressed: boolean;
}

/** Movement plus one-shot action presses. */
export interface InputState extends MovementIntent {
  /** E went down this frame. */
  interactPressed: boolean;
  /** W or Up went down this frame (contextual: enters doors instead of jumping). */
  upPressed: boolean;
}

/** No input at all; used while a UI panel has focus. */
export const NEUTRAL_INTENT: Readonly<MovementIntent> = {
  left: false,
  right: false,
  down: false,
  jumpHeld: false,
  jumpPressed: false,
};

const KeyCodes = Phaser.Input.Keyboard.KeyCodes;
type KeyName = 'left' | 'a' | 'right' | 'd' | 'up' | 'w' | 'space' | 'down' | 's' | 'e';

/**
 * Maps WASD, arrow keys, Space and E to an InputState.
 * Only arrows and Space are captured (preventDefault), so letter keys keep
 * working in any text field React may render over the game.
 */
export class KeyboardInput {
  private readonly keys: Record<KeyName, Phaser.Input.Keyboard.Key>;
  private readonly keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
  private readonly onBlur = () => this.keyboard.resetKeys();

  constructor(private readonly scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is not available.');
    this.keyboard = keyboard;

    const add = (code: number) => keyboard.addKey(code, false);
    this.keys = {
      left: add(KeyCodes.LEFT),
      a: add(KeyCodes.A),
      right: add(KeyCodes.RIGHT),
      d: add(KeyCodes.D),
      up: add(KeyCodes.UP),
      w: add(KeyCodes.W),
      space: add(KeyCodes.SPACE),
      down: add(KeyCodes.DOWN),
      s: add(KeyCodes.S),
      e: add(KeyCodes.E),
    };
    keyboard.addCapture([KeyCodes.LEFT, KeyCodes.RIGHT, KeyCodes.UP, KeyCodes.DOWN, KeyCodes.SPACE]);

    // Avoid "stuck" movement when the tab or window loses focus mid-keypress.
    scene.game.events.on(Phaser.Core.Events.BLUR, this.onBlur);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
    scene.events.once(Phaser.Scenes.Events.DESTROY, () => this.destroy());
  }

  read(): InputState {
    const k = this.keys;
    const justDown = Phaser.Input.Keyboard.JustDown;
    // Each JustDown consumes the key's flag, so evaluate every key exactly once.
    const up = justDown(k.up);
    const w = justDown(k.w);
    const space = justDown(k.space);
    const e = justDown(k.e);
    return {
      left: k.left.isDown || k.a.isDown,
      right: k.right.isDown || k.d.isDown,
      down: k.down.isDown || k.s.isDown,
      jumpHeld: k.up.isDown || k.w.isDown || k.space.isDown,
      jumpPressed: up || w || space,
      interactPressed: e,
      upPressed: up || w,
    };
  }

  destroy(): void {
    this.scene.game.events.off(Phaser.Core.Events.BLUR, this.onBlur);
  }
}
