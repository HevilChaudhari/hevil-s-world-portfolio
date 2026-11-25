import { useCallback, useEffect, useState } from 'react';

const CHARS_PER_TICK = 2;
const TICK_MS = 30;

/**
 * Reveals `text` a few characters at a time. Mount a fresh component (via
 * `key`) per text so it restarts. With `instant` (reduced motion) the whole
 * text shows at once.
 */
export function useTypewriter(text: string, instant: boolean) {
  const [count, setCount] = useState(() => (instant ? text.length : 0));
  const done = count >= text.length;

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setCount((c) => Math.min(text.length, c + CHARS_PER_TICK)), TICK_MS);
    return () => window.clearInterval(id);
  }, [done, text.length]);

  const finish = useCallback(() => setCount(text.length), [text.length]);

  return { shown: text.slice(0, count), done, finish };
}
