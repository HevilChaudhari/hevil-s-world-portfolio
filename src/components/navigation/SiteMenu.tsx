import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import { useNavMode } from '@/hooks/useNavMode';
import { BuildingDirectory } from './BuildingDirectory';
import { useMenu } from './menuContext';

/**
 * Building selection menu: every location with its pages, plus "Walk there"
 * fast travel. Uses a native modal <dialog> for focus trapping and Esc.
 */
export function SiteMenu() {
  const { isOpen, close } = useMenu();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { goToVillage, travelTo } = useSiteNavigation();
  const [navMode, setNavMode] = useNavMode();
  const onVillage = useLocation().pathname === ROUTES.home;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  /** Close the menu first, then run the navigation behind the transition. */
  const thenClose = (action: () => void) => {
    close();
    action();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="site-menu-title"
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close(); // backdrop click
      }}
      className="m-auto max-h-[90dvh] w-[min(56rem,calc(100vw-1.5rem))] overflow-y-auto bg-parchment p-0 text-soil-dark pixel-border backdrop:bg-night/70"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-4 border-soil-dark bg-grass-dark px-4 py-3 text-parchment">
        <h2 id="site-menu-title" className="font-pixel text-base font-bold sm:text-lg">
          Explore Hevil&apos;s World
        </h2>
        <button type="button" onClick={close} className="bg-parchment px-3 py-1 text-sm text-soil-dark pixel-button hover:bg-wheat">
          Close <span className="sr-only">menu</span>
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <p className="mb-4 text-sm">
          Every part of the portfolio is one click away; no walking required. Or jump to a building in the village and explore from there.
        </p>
        {!onVillage && (
          <Link
            to={ROUTES.home}
            onClick={(e) => {
              if (!isPlainClick(e)) return;
              e.preventDefault();
              thenClose(() => goToVillage());
            }}
            className="mb-5 inline-block bg-meadow px-4 py-2 text-sm text-soil-dark pixel-button hover:bg-wheat"
          >
            ← Back to the village
          </Link>
        )}

        <BuildingDirectory
          onBeforeNavigate={close}
          onTravel={(id) => {
            // Fast travel needs the game: leave Simple view first.
            setNavMode('game');
            travelTo(id);
          }}
        />

        <p className="mt-5 flex flex-wrap items-center gap-3 border-t-2 border-soil/20 pt-4 text-sm">
          <span>Home page:</span>
          <button
            type="button"
            aria-pressed={navMode === 'game'}
            onClick={() => thenClose(() => setNavMode('game'))}
            className={`px-3 py-1 text-xs pixel-button ${navMode === 'game' ? 'bg-wheat' : 'bg-white hover:bg-parchment'}`}
          >
            Play the village
          </button>
          <button
            type="button"
            aria-pressed={navMode === 'simple'}
            onClick={() => thenClose(() => setNavMode('simple'))}
            className={`px-3 py-1 text-xs pixel-button ${navMode === 'simple' ? 'bg-wheat' : 'bg-white hover:bg-parchment'}`}
          >
            Simple view (no game)
          </button>
        </p>
      </div>
    </dialog>
  );
}
