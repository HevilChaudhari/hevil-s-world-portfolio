import { useCallback, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import type { BuildingId } from '@/data/buildings';
import { getPage, type PageId } from '@/data/pages';
import { ROUTES } from '@/app/routes';
import { useTransition } from '@/components/transition/transitionContext';
import { EventBus } from '@/game/systems/EventBus';
import { readReturnPoint, saveReturnPoint } from '@/utils/villageReturn';

/** True for plain left clicks; modified clicks (new tab, etc.) keep native link behaviour. */
export const isPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/**
 * All site navigation goes through here so every route change gets the pixel
 * transition and remembers where the player should stand in the village.
 */
export function useSiteNavigation() {
  const { go, run } = useTransition();
  const { pathname } = useLocation();

  /**
   * Open a page. Coming back to the village puts the player at `fromX` (the
   * door or villager used) or, without it, at the page's building.
   */
  const openPage = useCallback(
    (page: PageId, fromX?: number) => {
      saveReturnPoint({ building: getPage(page).building, x: fromX });
      go(getPage(page).path);
    },
    [go],
  );

  /** Open any in-site route (e.g. a project detail page) that belongs to `building`. */
  const openRoute = useCallback(
    (path: string, building: BuildingId) => {
      if (readReturnPoint()?.building !== building) saveReturnPoint({ building });
      go(path);
    },
    [go],
  );

  /**
   * Go to the village. With `building`, the player appears there, unless the
   * saved spot already belongs to that building (keeps the exact door/villager).
   */
  const goToVillage = useCallback(
    (building?: BuildingId) => {
      if (building && readReturnPoint()?.building !== building) saveReturnPoint({ building });
      go(ROUTES.home);
    },
    [go],
  );

  /** Fast travel to a building's door: teleports if the village is open, otherwise loads it there. */
  const travelTo = useCallback(
    (building: BuildingId) => {
      saveReturnPoint({ building });
      if (pathname === ROUTES.home) run(() => EventBus.emit('ui-travel', { building }));
      else go(ROUTES.home);
    },
    [go, pathname, run],
  );

  return { openPage, openRoute, goToVillage, travelTo };
}
