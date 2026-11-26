/** Scrolls to an element (instantly under reduced motion) and moves focus to it, without touching the URL. */
export function scrollToElement(el: HTMLElement | null): void {
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  el.focus({ preventScroll: true });
}
