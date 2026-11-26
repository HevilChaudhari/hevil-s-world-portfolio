import { useEffect, useRef } from 'react';
import { BuildingDirectory } from '@/components/navigation/BuildingDirectory';
import { useNavMode } from '@/hooks/useNavMode';
import { useSiteNavigation } from '@/hooks/useSiteNavigation';

/**
 * Simplified home page: every location and page as a directory, with no game.
 * Useful on small or slow devices and for visitors who prefer not to play.
 * The game (and Phaser) is not downloaded in this mode.
 */
export function SimpleVillage() {
  const [, setNavMode] = useNavMode();
  const { travelTo } = useSiteNavigation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Switching modes replaces the page content: move focus to the new heading.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex-1 bg-[#fbf6e9] text-soil-dark">
      <div className="relative bg-gradient-to-b from-sky to-[#cfe8f0] pb-10 pt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="font-pixel text-xs font-bold uppercase tracking-widest text-grass-dark">Simple view</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-1 font-pixel text-2xl font-bold outline-none sm:text-4xl">
            Hevil&apos;s World
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg">
            A pixel-art village where each building holds part of the portfolio. Here is every place at a glance, no game needed.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => setNavMode('game')} className="bg-meadow px-4 py-2 text-sm text-soil-dark pixel-button hover:bg-wheat">
              ▶ Play the village
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="pixel-grass absolute inset-x-0 bottom-0 h-4" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <BuildingDirectory
          headingLevel="h2"
          onTravel={(id) => {
            setNavMode('game');
            travelTo(id);
          }}
        />
      </div>
    </div>
  );
}
