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

  const run = useCallback(
    (midpoint: () => void) => {
      const overlay = overlayRef.current;
      if (reducedMotion || !overlay || busyRef.current) {
        midpoint();
        return;
      }
      busyRef.current = true;
      let midpointDone = false;
      const reachMidpoint = () => {
        if (midpointDone) return;
        midpointDone = true;
        midpoint();
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
      if (to === pathname) {
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
