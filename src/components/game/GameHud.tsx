import { useCallback, useEffect, useState } from 'react';
import type { PageId } from '@/data/pages';
import { EventBus } from '@/game/systems/EventBus';
import type { InteractionFocus, InteractionTriggered } from '@/game/interactions/types';
import { useMenu } from '@/components/navigation/menuContext';
import { useGameEvent } from '@/hooks/useGameEvent';
import { useSiteNavigation } from '@/hooks/useSiteNavigation';
import { ControlsHint } from './ControlsHint';
import { InteractionPrompt } from './InteractionPrompt';
import { DialogueBox } from './dialogue/DialogueBox';

interface ActiveDialogue extends InteractionTriggered {
  /** Increments per interaction so re-talking to the same villager restarts the dialogue. */
  seq: number;
}

/**
 * React layer drawn over the game canvas: controls legend (keyboard only),
 * interaction prompt and dialogue window. Freezes player input while a dialogue or the site menu
 * is open, and opens the menu on Esc (the in-game pause / menu key).
 */
export function GameHud({ touch = false }: { touch?: boolean }) {
  const { openPage } = useSiteNavigation();
  const menu = useMenu();
  const [focus, setFocus] = useState<InteractionFocus | null>(null);
  const [active, setActive] = useState<ActiveDialogue | null>(null);

  useGameEvent('interaction-focus', setFocus);
  useGameEvent('interaction-triggered', (trigger) => setActive((prev) => ({ ...trigger, seq: (prev?.seq ?? 0) + 1 })));

  const isDialogueOpen = active !== null;
  const isLocked = isDialogueOpen || menu.isOpen;
  useEffect(() => {
    EventBus.emit('ui-modal-changed', { open: isLocked });
  }, [isLocked]);

  // Esc with nothing open: open the site menu. (Open dialogues/menus handle Esc themselves.)
  useEffect(() => {
    if (isLocked) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.repeat) return;
      event.preventDefault();
      menu.open();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLocked, menu]);

  const close = useCallback(() => setActive(null), []);
  // Return to the door/villager the visitor used when they come back.
  const doorX = active?.x;
  const handleOpenPage = useCallback((page: PageId) => openPage(page, doorX), [doorX, openPage]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* The legend gives way to the prompt so they never overlap on small screens. */}
      {!isLocked && !focus && !touch && <ControlsHint />}
      {!isLocked && focus && <InteractionPrompt focus={focus} touch={touch} />}
      {/* Polite live region: announces what can be interacted with to screen readers. */}
      <p className="sr-only" aria-live="polite">
        {focus && !isLocked ? `${focus.label}. ${touch ? 'Tap Use.' : 'Press E.'}` : ''}
      </p>
      {active && (
        <DialogueBox
          key={active.seq}
          dialogueId={active.dialogue}
          portrait={active.portrait}
          onClose={close}
          onOpenPage={handleOpenPage}
        />
      )}
    </div>
  );
}
