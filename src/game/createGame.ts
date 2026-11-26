import Phaser from 'phaser';
import type { ReturnPoint } from '@/utils/villageReturn';
import { createGameConfig } from './config/gameConfig';
import { REGISTRY_KEYS } from './config/constants';

export interface CreateGameOptions {
  reducedMotion: boolean;
  /** Where the player appears; null = the map's spawn column. */
  spawn: ReturnPoint | null;
}

declare global {
  interface Window {
    /** Dev builds only: the running game, for debugging and automated browser checks. */
    __HEVIL_GAME__?: Phaser.Game;
  }
}

/** Single entry point the React layer uses to start the game. */
export function createGame(parent: HTMLElement, options: CreateGameOptions): Phaser.Game {
  const game = new Phaser.Game(createGameConfig(parent));
  game.registry.set(REGISTRY_KEYS.reducedMotion, options.reducedMotion);
  game.registry.set(REGISTRY_KEYS.spawn, options.spawn);
  releaseEngineResourcesOnDestroy(game);
  removeVisibilityHandlerOnDestroy(game);

  if (import.meta.env.DEV) {
    window.__HEVIL_GAME__ = game;
    game.events.once(Phaser.Core.Events.DESTROY, () => {
      if (window.__HEVIL_GAME__ === game) delete window.__HEVIL_GAME__;
    });
  }
  return game;
}

/**
 * Works around two Phaser 3 behaviours that would otherwise keep every
 * destroyed game alive. Each visit to the village creates a new game, so both
 * grew with every round trip (measured: ~1.4 MB and one WebGL context per visit).
 *
 * 1. WebGL context: Phaser never releases it, and browsers cap live contexts
 *    (about 16), after which Chrome force-loses old ones ("Too many active
 *    WebGL contexts"). We release it explicitly.
 * 2. `Graphics.TargetCamera`: a camera shared by all games at module level.
 *    `generateTexture()` (used to paint the placeholder art) adds each Graphics
 *    to its render list and points it at the scene, and nothing ever clears
 *    them, so the old game stays reachable. We clear them.
 *
 * The DESTROY event fires at the start of Phaser's synchronous teardown, before
 * the renderer is destroyed; the timeout runs once that teardown has finished.
 */
function releaseEngineResourcesOnDestroy(game: Phaser.Game): void {
  game.events.once(Phaser.Core.Events.DESTROY, () => {
    const renderer = game.renderer as Phaser.Renderer.Canvas.CanvasRenderer | Phaser.Renderer.WebGL.WebGLRenderer | null;
    const gl = renderer && 'gl' in renderer ? renderer.gl : null;
    if (gl) setTimeout(() => gl.getExtension('WEBGL_lose_context')?.loseContext(), 0);

    // Fields set by BaseCamera.setScene(); generateTexture() sets them again next time.
    const target = Phaser.GameObjects.Graphics.TargetCamera as unknown as {
      renderList: unknown[];
      scene: unknown;
      sceneManager: unknown;
      scaleManager: unknown;
      cameraManager: unknown;
    };
    target.renderList.length = 0;
    target.scene = target.sceneManager = target.scaleManager = target.cameraManager = null;
  });
}

/**
 * Phaser 3's VisibilityHandler adds a `visibilitychange` listener to `document`
 * (and sets window.onblur / onfocus) when a game starts, and never removes
 * them, so one listener piled up per village visit.
 *
 * Phaser emits READY and then, in the same synchronous call, runs start(),
 * which registers that listener. For that one synchronous stretch we note the
 * listener as it is added (calls still go through unchanged), restore the
 * original method in a microtask, and remove the listener on destroy.
 */
function removeVisibilityHandlerOnDestroy(game: Phaser.Game): void {
  let visibility: { type: string; listener: EventListenerOrEventListenerObject } | null = null;
  let onBlur: Window['onblur'] = null;
  let onFocus: Window['onfocus'] = null;

  game.events.once(Phaser.Core.Events.READY, () => {
    const hadOwn = Object.prototype.hasOwnProperty.call(document, 'addEventListener');
    const original = document.addEventListener;
    document.addEventListener = function (
      this: Document,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) {
      if (!visibility && type.endsWith('visibilitychange')) visibility = { type, listener };
      original.call(this, type, listener, options);
    } as typeof document.addEventListener;

    queueMicrotask(() => {
      if (hadOwn) document.addEventListener = original;
      else Reflect.deleteProperty(document, 'addEventListener');
      onBlur = window.onblur;
      onFocus = window.onfocus;
    });
  });

  game.events.once(Phaser.Core.Events.DESTROY, () => {
    if (visibility) document.removeEventListener(visibility.type, visibility.listener);
    if (onBlur && window.onblur === onBlur) window.onblur = null;
    if (onFocus && window.onfocus === onFocus) window.onfocus = null;
  });
}
