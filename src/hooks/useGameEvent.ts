import { useEffect, useRef } from 'react';
import { EventBus, type GameEventMap, type GameEventName } from '@/game/systems/EventBus';

/**
 * Subscribes a React component to a game event for its lifetime.
 * The latest handler is always called, so callers need not memoize it.
 */
export function useGameEvent<E extends GameEventName>(
  event: E,
  handler: (payload: GameEventMap[E]) => void,
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => EventBus.on(event, (payload) => handlerRef.current(payload)), [event]);
}
