import { useCallback, useMemo, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TransitionContext, type TransitionApi } from './transitionContext';

const COLS = 16;
const ROWS = 9;
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => i);

/**
 * Pixel-block screen transition between the village and website pages.
 * GSAP is loaded on first use, so it never weighs on the initial page load.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  /** Navigation to run when the screen is fully covered; a newer request replaces it. */
  const pendingRef = useRef<(() => void) | null>(null);
  const midpointPassedRef = useRef(false);

  const run = useCallback(
    (midpoint: () => void) => {
      const overlay = overlayRef.current;
      if (reducedMotion || !overlay) {
        midpoint();
        return;
      }
      if (busyRef.current) {
        // A transition is already running: the latest request wins. While the
        // screen is still covering, replace the pending navigation; once it is
        // uncovering, apply this one straight away.
        if (midpointPassedRef.current) midpoint();
        else pendingRef.current = midpoint;
        return;
      }
      busyRef.current = true;
      midpointPassedRef.current = false;
      pendingRef.current = midpoint;
      const reachMidpoint = () => {
        if (midpointPassedRef.current) return;
        midpointPassedRef.current = true;
        const next = pendingRef.current;
        pendingRef.current = null;
        next?.();
      };

      void (async () => {
        try {
          const { gsap } = await import('gsap');
          const cells = Array.from(overlay.children);
          const stagger = { grid: [ROWS, COLS] as [number, number], from: 'center' as const, amount: 0.22 };
          overlay.style.visibility = 'visible';
          await gsap.fromTo(cells, { scale: 0 }, { scale: 1.06, duration: 0.14, ease: 'steps(3)', stagger });
          reachMidpoint();
          // Give the new route a frame to render under the cover.
          await new Promise((resolve) => requestAnimationFrame(resolve));
          await gsap.to(cells, { scale: 0, duration: 0.14, ease: 'steps(3)', stagger, delay: 0.06 });
        } catch (error) {
          console.warn('[transition] falling back to instant navigation', error);
        } finally {
          reachMidpoint();
          overlay.style.visibility = 'hidden';
          busyRef.current = false;
        }
      })();
    },
    [reducedMotion],
  );

  const go = useCallback(
    (to: string) => {
      // Same page and nothing in flight: just scroll up. (While a transition is
      // running, still go through run() so this request replaces the pending one.)
      if (to === pathname && !busyRef.current) {
        window.scrollTo({ top: 0 });
        return;
      }
      run(() => navigate(to));
    },
    [navigate, pathname, run],
  );

  const api = useMemo<TransitionApi>(() => ({ run, go }), [run, go]);

  return (
    <TransitionContext.Provider value={api}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="invisible fixed inset-0 z-[100] grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {CELLS.map((i) => (
          <div key={i} className="scale-0 bg-night" />
        ))}
      </div>
    </TransitionContext.Provider>
  );
}
