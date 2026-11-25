import { useMemo, useState } from 'react';
import { getDialogue, type DialogueChoice, type DialogueId, type DialogueNode } from '@/data/dialogues';
import { NPCS } from '@/data/npcs';
import { getPage, type PageId } from '@/data/pages';
import { DialogueContent, type ResolvedChoice } from './DialogueContent';

interface DialogueBoxProps {
  dialogueId: DialogueId;
  portrait: string | null;
  onClose: () => void;
  onOpenPage: (page: PageId) => void;
}

/** Either a node of the dialogue, or the notice for a page that isn't built yet. */
type View = { kind: 'node'; nodeId: string } | { kind: 'unavailable'; page: PageId; fromNodeId: string };

/**
 * Runs a dialogue tree: follows 'goto' choices, opens pages, closes.
 * A choice pointing at a page whose `available` flag is false shows a
 * "coming soon" node with a way back, so no choice is ever a dead link.
 */
export function DialogueBox({ dialogueId, portrait, onClose, onOpenPage }: DialogueBoxProps) {
  const dialogue = getDialogue(dialogueId);
  const [view, setView] = useState<View>({ kind: 'node', nodeId: dialogue.start });

  const node: DialogueNode = dialogue.nodes[view.kind === 'node' ? view.nodeId : view.fromNodeId];

  const resolved = useMemo(() => {
    const resolveChoice = (choice: DialogueChoice, fromNodeId: string): ResolvedChoice => {
      const { action } = choice;
      switch (action.type) {
        case 'close':
          return { label: choice.label, run: onClose };
        case 'goto':
          return { label: choice.label, run: () => setView({ kind: 'node', nodeId: action.node }) };
        case 'open-page':
          return {
            label: choice.label,
            run: () =>
              getPage(action.page).available
                ? onOpenPage(action.page)
                : setView({ kind: 'unavailable', page: action.page, fromNodeId }),
          };
      }
    };

    if (view.kind === 'unavailable') {
      const page = getPage(view.page);
      return {
        key: `unavailable-${view.page}`,
        title: page.title,
        text: `The ${page.title} page is still being prepared. It will open here in an upcoming update.`,
        choices: [
          { label: 'Back', run: () => setView({ kind: 'node', nodeId: view.fromNodeId }) },
          { label: 'Return to the village', run: onClose },
        ],
      };
    }
    const choices = node.choices?.length ? node.choices : [{ label: 'Close', action: { type: 'close' } } as const];
    return {
      key: `node-${view.nodeId}`,
      title: node.title,
      text: node.text,
      choices: choices.map((c) => resolveChoice(c, view.nodeId)),
    };
  }, [node, onClose, onOpenPage, view]);

  const speaker = node.speaker ? NPCS[node.speaker] : null;
  const heading = speaker?.name ?? resolved.title ?? '';

  return (
    <div className="pointer-events-auto absolute inset-x-2 bottom-2 top-2 mx-auto flex max-w-2xl flex-col justify-end sm:inset-x-6 sm:bottom-3">
      <DialogueContent
        key={resolved.key}
        heading={heading}
        subheading={speaker?.role}
        portrait={speaker ? portrait : null}
        text={resolved.text}
        choices={resolved.choices}
        onClose={onClose}
      />
    </div>
  );
}
