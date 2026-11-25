import { useEffect, useRef, useState } from 'react';
import type Phaser from 'phaser';
import { createGame } from '@/game/createGame';
import { GAME_HEIGHT, GAME_WIDTH, REGISTRY_KEYS } from '@/game/config/constants';
import { useGameEvent } from '@/hooks/useGameEvent';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { computePixelZoom } from '@/utils/pixelZoom';
import { readReturnPoint } from '@/utils/villageReturn';
import { LoadingScreen } from './LoadingScreen';
import { GameHud } from './GameHud';

/**
 * Hosts the Phaser game inside React. Owns the game's lifecycle (create on mount,
 * destroy on unmount), keeps it scaled by integer zoom to fit its container, and
 * lays the React HUD exactly over the visible canvas.
 */
export function GameCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1);

  useGameEvent('loading-progress', setProgress);
  useGameEvent('scene-ready', () => setReady(true));

  // Create once; destroy on unmount (also handles React StrictMode double-mount).
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const game = createGame(host, { reducedMotion: getInitialReducedMotion(), spawn: readReturnPoint() });
    gameRef.current = game;

    const fit = () => {
      const next = computePixelZoom(host.clientWidth, host.clientHeight, GAME_WIDTH, GAME_HEIGHT);
      game.scale.setZoom(next);
      setZoom(next);
    };
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    game.events.once('ready', fit);

    return () => {
      observer.disconnect();
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Keep the game informed if the OS setting changes while it runs.
  useEffect(() => {
    gameRef.current?.registry.set(REGISTRY_KEYS.reducedMotion, reducedMotion);
  }, [reducedMotion]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-sky-deep">
      <div
        ref={hostRef}
        className="game-host flex h-full w-full items-center justify-center"
        role="application"
        aria-label="Hevil's World village game"
      />
      {ready ? (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: GAME_WIDTH * zoom, height: GAME_HEIGHT * zoom }}
        >
          <GameHud />
        </div>
      ) : (
        <LoadingScreen progress={progress} />
      )}
    </div>
  );
}

function getInitialReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
