const CONTROLS: { keys: string[]; action: string }[] = [
  { keys: ['A', 'D'], action: 'Walk' },
  { keys: ['W', 'Space'], action: 'Jump' },
  { keys: ['E'], action: 'Interact' },
  { keys: ['Esc'], action: 'Menu' },
];

/**
 * Small keyboard legend over the game. Shown only on devices with a precise
 * pointer (keyboard likely); touch controls arrive in Phase 8.
 */
export function ControlsHint() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 hidden gap-3 bg-night/75 px-3 py-2 text-xs text-parchment pixel-border [@media(hover:hover)_and_(pointer:fine)]:flex">
      {CONTROLS.map(({ keys, action }) => (
        <span key={action} className="flex items-center gap-1">
          {keys.map((k) => (
            <kbd key={k} className="bg-parchment px-1.5 font-pixel text-[10px] font-bold text-soil-dark">
              {k}
            </kbd>
          ))}
          <span className="ml-1">{action}</span>
        </span>
      ))}
      <span className="text-parchment/70">(arrow keys work too)</span>
    </div>
  );
}
