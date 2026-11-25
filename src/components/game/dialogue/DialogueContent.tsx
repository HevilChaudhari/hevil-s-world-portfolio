import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTypewriter } from '@/hooks/useTypewriter';

export interface ResolvedChoice {
  label: string;
  run: () => void;
}

interface DialogueContentProps {
  heading: string;
  subheading?: string;
  portrait: string | null;
  text: string;
  choices: readonly ResolvedChoice[];
  onClose: () => void;
}

const CONFIRM_KEYS = new Set(['e', 'E', 'Enter', ' ']);
const NEXT_KEYS = new Set(['ArrowDown', 's', 'S']);
const PREV_KEYS = new Set(['ArrowUp', 'w', 'W']);

/**
 * One dialogue node: portrait, name, typed text and choices.
 * Keyboard: E / Enter / Space skips typing, then confirms; Up/Down or W/S move
 * the selection; 1-9 pick a choice directly; Esc closes.
 * Mounted with a fresh `key` per node so typing and selection reset.
 */
export function DialogueContent({ heading, subheading, portrait, text, choices, onClose }: DialogueContentProps) {
  const reducedMotion = useReducedMotion();
  const { shown, done, finish } = useTypewriter(text, reducedMotion);
  const [selected, setSelected] = useState(0);
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const choiceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Move focus into the dialogue so screen readers announce it.
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const select = (index: number) => {
      const next = (index + choices.length) % choices.length;
      setSelected(next);
      choiceRefs.current[next]?.focus({ preventScroll: true });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (!done) {
        if (CONFIRM_KEYS.has(event.key)) {
          event.preventDefault();
          finish();
        }
        return;
      }
      if (NEXT_KEYS.has(event.key)) {
        event.preventDefault();
        select(selected + 1);
      } else if (PREV_KEYS.has(event.key)) {
        event.preventDefault();
        select(selected - 1);
      } else if (CONFIRM_KEYS.has(event.key)) {
        event.preventDefault();
        choices[selected]?.run();
      } else if (/^[1-9]$/.test(event.key)) {
        const choice = choices[Number(event.key) - 1];
        if (choice) {
          event.preventDefault();
          choice.run();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [choices, done, finish, onClose, selected]);

  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={headingId}
      className="flex max-h-full gap-3 overflow-y-auto bg-parchment p-3 text-soil-dark outline-none pixel-border motion-safe:animate-panel-in sm:p-4"
    >
      {portrait && (
        <div className="hidden h-16 w-16 shrink-0 overflow-hidden bg-sky pixel-border sm:block" aria-hidden="true">
          <img src={portrait} alt="" className="h-24 w-16 [image-rendering:pixelated]" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h2 id={headingId} className="font-pixel text-sm font-bold sm:text-base">
          {heading}
          {subheading && <span className="ml-2 font-sans text-xs font-normal text-soil">{subheading}</span>}
        </h2>

        {/* Full text for assistive tech; the typed version is visual only. */}
        <p className="sr-only">{text}</p>
        <p aria-hidden="true" className="mt-1 min-h-[3lh] text-sm leading-relaxed sm:text-base">
          {shown}
          {!done && <span className="motion-safe:animate-pulse">▍</span>}
        </p>

        <ul className={`mt-2 flex flex-col gap-1 ${done ? '' : 'invisible'}`} aria-label="Choices">
          {choices.map((choice, i) => (
            <li key={choice.label}>
              <button
                ref={(el) => {
                  choiceRefs.current[i] = el;
                }}
                type="button"
                tabIndex={done ? 0 : -1}
                onClick={choice.run}
                onFocus={() => setSelected(i)}
                onMouseEnter={() => setSelected(i)}
                className={`flex w-full items-center gap-2 px-2 py-1 text-left text-sm font-bold ${
                  i === selected ? 'bg-wheat' : 'hover:bg-wheat/60'
                }`}
              >
                <span aria-hidden="true" className="w-3 font-pixel">
                  {i === selected ? '▶' : ''}
                </span>
                <span className="font-pixel text-xs text-soil">{i + 1}.</span>
                <span>{choice.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 hidden text-right text-[11px] text-soil [@media(hover:hover)_and_(pointer:fine)]:block">
          {done ? '↑↓ choose · E / Enter select · Esc close' : 'E / Enter to skip'}
        </p>
      </div>
    </section>
  );
}
