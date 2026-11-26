import { useSyncExternalStore } from 'react';
import { getNavMode, setNavMode, subscribeNavMode, type NavMode } from '@/utils/navMode';

/** Current home-page mode (game or simple view) and a setter that persists it. */
export function useNavMode(): [NavMode, (mode: NavMode) => void] {
  const mode = useSyncExternalStore(subscribeNavMode, getNavMode, () => 'game' as const);
  return [mode, setNavMode];
}
