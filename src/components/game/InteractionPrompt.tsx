import { EventBus } from '@/game/systems/EventBus';
import type { InteractionFocus } from '@/game/interactions/types';

interface InteractionPromptProps {
  focus: InteractionFocus;
}

/**
 * "Press E to ..." prompt. It is also a button, so mouse and touch visitors can
 * interact without a keyboard (dedicated mobile controls arrive in Phase 8).
 */
export function InteractionPrompt({ focus }: InteractionPromptProps) {
  return (
    <button
      type="button"
      onClick={() => EventBus.emit('ui-interact-request', null)}
      className="pointer-events-auto absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 bg-parchment px-3 py-1.5 text-sm text-soil-dark pixel-border hover:bg-wheat"
    >
      <kbd className="bg-soil-dark px-1.5 font-pixel text-xs font-bold text-parchment">E</kbd>
      {focus.acceptsUp && (
        <kbd className="bg-soil-dark px-1.5 font-pixel text-xs font-bold text-parchment" aria-label="or Up">
          ↑
        </kbd>
      )}
      <span className="font-pixel font-bold">{focus.label}</span>
    </button>
  );
}
