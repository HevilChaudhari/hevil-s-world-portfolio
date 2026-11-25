import { createContext, useContext } from 'react';

export interface TransitionApi {
  /**
   * Covers the screen with the pixel transition, runs `midpoint` (navigate,
   * teleport...) while covered, then uncovers. Instant under reduced motion.
   */
  run: (midpoint: () => void) => void;
  /** Navigate to a route with the transition. */
  go: (to: string) => void;
}

export const TransitionContext = createContext<TransitionApi | null>(null);

export function useTransition(): TransitionApi {
  const api = useContext(TransitionContext);
  if (!api) throw new Error('useTransition must be used inside <TransitionProvider>.');
  return api;
}
