import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { BUILDINGS, type BuildingId } from '@/data/buildings';
import { getPage } from '@/data/pages';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import { useMenu } from './menuContext';

const BUILDING_ORDER = Object.keys(BUILDINGS) as BuildingId[];

/**
 * Building selection menu: every location with its pages, plus "Walk there"
 * fast travel. Uses a native modal <dialog> for focus trapping and Esc.
 */
export function SiteMenu() {
  const { isOpen, close } = useMenu();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { openPage, goToVillage, travelTo } = useSiteNavigation();
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

        <ul className="grid gap-4 sm:grid-cols-2">
          {BUILDING_ORDER.map((id) => {
            const building = BUILDINGS[id];
            const pages = building.pages.map((pageId) => ({ id: pageId, ...getPage(pageId) })).filter((p) => p.available);
            return (
              <li key={id} className="flex flex-col bg-white/60 p-4 pixel-border">
                <h3 className="font-pixel text-sm font-bold">{building.name}</h3>
                <ul className="mt-2 flex flex-1 flex-col gap-2">
                  {pages.map((page) => (
                    <li key={page.id}>
                      <Link
                        to={page.path}
                        onClick={(e) => {
                          if (!isPlainClick(e)) return;
                          e.preventDefault();
                          thenClose(() => openPage(page.id));
                        }}
                        className="group block"
                      >
                        <span className="font-semibold text-soil-dark underline decoration-2 underline-offset-2 group-hover:decoration-sunset">
                          {page.title}
                        </span>
                        <span className="block text-xs text-soil">{page.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => thenClose(() => travelTo(id))}
                  className="mt-3 self-start bg-wheat px-3 py-1 text-xs text-soil-dark pixel-button hover:bg-meadow"
                >
                  Walk there in the village
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );
}
