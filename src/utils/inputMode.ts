/**
 * Whether the visitor is using touch. True on coarse-pointer devices (phones,
 * tablets) and on any device as soon as a finger touches the screen (touch
 * laptops). A store for useSyncExternalStore: one set of listeners for the app.
 */
const COARSE_QUERY = '(pointer: coarse)';

let touch = false;
let started = false;
const listeners = new Set<() => void>();

const set = (value: boolean) => {
  if (touch === value) return;
  touch = value;
  listeners.forEach((l) => l());
};

function start(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  const query = window.matchMedia(COARSE_QUERY);
  touch = query.matches;
  query.addEventListener('change', (e) => {
    if (e.matches) set(true);
  });
  window.addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'touch') set(true);
    },
    { passive: true, capture: true },
  );
}

export function subscribeTouch(listener: () => void): () => void {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTouchSnapshot(): boolean {
  start();
  return touch;
}
