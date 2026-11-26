import { useEffect, useRef, useState } from 'react';
import type Phaser from 'phaser';
import { createGame } from '@/game/createGame';
import { GAME_HEIGHT, GAME_WIDTH, REGISTRY_KEYS } from '@/game/config/constants';
import { useGameEvent } from '@/hooks/useGameEvent';
import { useNavMode } from '@/hooks/useNavMode';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTouchInput } from '@/hooks/useTouchInput';
import { computePixelZoom } from '@/utils/pixelZoom';
import { readReturnPoint } from '@/utils/villageReturn';
import { LoadingScreen } from './LoadingScreen';
import { GameHud } from './GameHud';
import { TouchControls } from './TouchControls';

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
  const touch = useTouchInput();
  const [, setNavMode] = useNavMode();

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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-sky-deep">
      {/* Game area: the canvas is zoomed to fit this box and the HUD sits exactly over it. */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={hostRef}
          // Portrait touch screens: sit the game just above the controls (HUD overlay below matches).
          className={`game-host flex h-full w-full items-center justify-center ${touch ? 'portrait:items-end' : ''}`}
          role="application"
          aria-label="Hevil's World village game"
        />
        {ready ? (
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${touch ? 'portrait:top-auto portrait:bottom-0 portrait:translate-y-0' : ''}`}
            style={{ width: GAME_WIDTH * zoom, height: GAME_HEIGHT * zoom }}
          >
            <GameHud touch={touch} />
          </div>
        ) : (
          <LoadingScreen progress={progress} />
        )}
        {ready && touch && (
          <p className="pointer-events-none absolute inset-x-0 top-14 hidden px-4 text-center text-xs text-parchment portrait:block">
            Tip: turn your phone sideways for a bigger village.
          </p>
        )}
      </div>

      {/* Portrait touch screens: keep the controls below the game instead of on top of it. */}
      {touch && <div aria-hidden="true" className="hidden h-28 shrink-0 portrait:block" />}
      {ready && touch && <TouchControls />}

      {ready && (
        <button
          type="button"
          onClick={() => setNavMode('simple')}
          className="absolute right-2 top-2 z-10 bg-parchment/90 px-2.5 py-1 text-xs text-soil-dark pixel-button hover:bg-wheat"
          title="Browse every page without playing"
        >
          Simple view
        </button>
      )}
    </div>
  );
}

function getInitialReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
