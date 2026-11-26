import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { EventBus } from '@/game/systems/EventBus';
import type { VirtualButtons } from '@/game/systems/VirtualInput';
import type { InteractionFocus } from '@/game/interactions/types';
import { useGameEvent } from '@/hooks/useGameEvent';

type Direction = 'left' | 'right';

const RELEASED: VirtualButtons = { left: false, right: false, jump: false };
const same = (a: VirtualButtons, b: VirtualButtons) => a.left === b.left && a.right === b.right && a.jump === b.jump;

const padButton = (pressed: boolean) =>
  `flex h-14 w-14 items-center justify-center pixel-border text-xl ${pressed ? 'translate-y-0.5 bg-wheat' : 'bg-parchment/85'}`;

/**
 * On-screen controls for touch screens: a left/right pad, Jump and Use.
 * Movement is sent to the game as `ui-virtual-input` (merged with the keyboard
 * there); Use sends the existing `ui-interact-request`. Multi-touch works, and
 * a finger can slide between left and right without lifting.
 *
 * Every button is released whenever a panel opens, the page loses focus, or
 * the controls unmount, so the player can never keep walking on its own.
 */
export function TouchControls() {
  const [locked, setLocked] = useState(false);
  const [focus, setFocus] = useState<InteractionFocus | null>(null);
  const [pressed, setPressed] = useState<VirtualButtons>(RELEASED);
  const current = useRef<VirtualButtons>(RELEASED);
  const padPointers = useRef(new Map<number, Direction>());
  const jumpPointers = useRef(new Set<number>());

  useGameEvent('ui-modal-changed', ({ open }) => setLocked(open));
  useGameEvent('interaction-focus', setFocus);

  const sync = useCallback(() => {
    const dirs = [...padPointers.current.values()];
    const next = { left: dirs.includes('left'), right: dirs.includes('right'), jump: jumpPointers.current.size > 0 };
    if (same(next, current.current)) return;
    current.current = next;
    setPressed(next);
    EventBus.emit('ui-virtual-input', next);
  }, []);

  const releaseAll = useCallback(() => {
    padPointers.current.clear();
    jumpPointers.current.clear();
    sync();
  }, [sync]);

  // Opening a dialogue or the menu hides the controls: let go of everything.
  useEffect(() => {
    if (locked) releaseAll();
  }, [locked, releaseAll]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) releaseAll();
    };
    window.addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('blur', releaseAll);
      document.removeEventListener('visibilitychange', onVisibility);
      releaseAll();
    };
  }, [releaseAll]);

  const directionAt = (el: HTMLElement, clientX: number): Direction => {
    const r = el.getBoundingClientRect();
    return clientX < r.left + r.width / 2 ? 'left' : 'right';
  };

  const onPadDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    padPointers.current.set(e.pointerId, directionAt(e.currentTarget, e.clientX));
    sync();
  };
  const onPadMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!padPointers.current.has(e.pointerId)) return;
    padPointers.current.set(e.pointerId, directionAt(e.currentTarget, e.clientX));
    sync();
  };
  const onPadEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (padPointers.current.delete(e.pointerId)) sync();
  };

  const onJumpDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    jumpPointers.current.add(e.pointerId);
    sync();
  };
  const onJumpEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (jumpPointers.current.delete(e.pointerId)) sync();
  };

  if (locked) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex select-none items-end justify-between pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] text-soil-dark [-webkit-touch-callout:none]"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Movement pad. Hidden from assistive tech: the site menu and Simple view are the accessible way around. */}
      <div
        aria-hidden="true"
        className="pointer-events-auto flex touch-none gap-3 p-1"
        onPointerDown={onPadDown}
        onPointerMove={onPadMove}
        onPointerUp={onPadEnd}
        onPointerCancel={onPadEnd}
        onLostPointerCapture={onPadEnd}
      >
        <span className={padButton(pressed.left)}>◀</span>
        <span className={padButton(pressed.right)}>▶</span>
      </div>

      <div className="pointer-events-auto flex items-end gap-3 p-1">
        <button
          type="button"
          onClick={() => EventBus.emit('ui-interact-request', null)}
          disabled={!focus}
          aria-label={focus ? `Use: ${focus.label}` : 'Use (nothing nearby)'}
          className="flex h-14 w-14 touch-manipulation flex-col items-center justify-center bg-parchment/85 font-pixel text-xs font-bold pixel-border enabled:active:translate-y-0.5 enabled:active:bg-wheat disabled:opacity-45"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ●
          </span>
          Use
        </button>
        <div
          aria-hidden="true"
          className={`flex h-16 w-16 touch-none flex-col items-center justify-center font-pixel text-xs font-bold pixel-border ${pressed.jump ? 'translate-y-0.5 bg-wheat' : 'bg-meadow/90'}`}
          onPointerDown={onJumpDown}
          onPointerUp={onJumpEnd}
          onPointerCancel={onJumpEnd}
          onLostPointerCapture={onJumpEnd}
        >
          <span className="text-lg leading-none">▲</span>
          Jump
        </div>
      </div>
    </div>
  );
}
