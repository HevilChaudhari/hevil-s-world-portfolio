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

  if (import.meta.env.DEV) {
    window.__HEVIL_GAME__ = game;
    game.events.once(Phaser.Core.Events.DESTROY, () => {
      if (window.__HEVIL_GAME__ === game) delete window.__HEVIL_GAME__;
    });
  }
  return game;
}
