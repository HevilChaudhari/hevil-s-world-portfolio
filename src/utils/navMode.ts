/**
 * How the home page is shown: the playable village ('game') or the simplified,
 * game-free building directory ('simple'). Remembered across visits in
 * localStorage; a store for useSyncExternalStore.
 */
export type NavMode = 'game' | 'simple';

const KEY = 'hevils-world:nav-mode';
const listeners = new Set<() => void>();

function read(): NavMode {
  try {
    return localStorage.getItem(KEY) === 'simple' ? 'simple' : 'game';
  } catch {
    return 'game';
  }
}

let mode: NavMode | null = null;

export function getNavMode(): NavMode {
  mode ??= read();
  return mode;
}

export function setNavMode(next: NavMode): void {
  mode = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Storage unavailable (private mode): the choice lasts for this page load.
  }
  listeners.forEach((l) => l());
}

export function subscribeNavMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
