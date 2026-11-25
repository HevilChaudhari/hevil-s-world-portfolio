import type { NpcId } from './npcs';
import type { PageId } from './ids';

/**
 * Dialogue trees for every sign, building and villager.
 * Plain text only. Keep personal facts out of here: portfolio facts belong in
 * the page data files and must come from Hevil.
 */
export type DialogueAction =
  | { type: 'goto'; node: string }
  | { type: 'open-page'; page: PageId }
  | { type: 'close' };

export interface DialogueChoice {
  label: string;
  action: DialogueAction;
}

export interface DialogueNode {
  /** Villager speaking; omit for narration (signs, building descriptions). */
  speaker?: NpcId;
  /** Heading for narration nodes, e.g. a building or sign name. */
  title?: string;
  text: string;
  /** Omit for a single "Close" choice. */
  choices?: readonly DialogueChoice[];
}

export interface Dialogue {
  start: string;
  nodes: Readonly<Record<string, DialogueNode>>;
}

const close = (label = 'Return to the village'): DialogueChoice => ({ label, action: { type: 'close' } });
const open = (label: string, page: PageId): DialogueChoice => ({ label, action: { type: 'open-page', page } });
const goto = (label: string, node: string): DialogueChoice => ({ label, action: { type: 'goto', node } });

/** One-node narration (signs, simple doors). */
const narration = (title: string, text: string, choices?: DialogueChoice[]): Dialogue => ({
  start: 'start',
  nodes: { start: { title, text, choices } },
});

export const DIALOGUES = {
  // ---------------------------------------------------------------- Signs
  'sign-welcome': narration(
    "Welcome to Hevil's World",
    'Walk with A / D or the arrow keys, jump with W or Space, and press E to interact. Talk to the villagers or step into a building to explore Hevil\'s work.',
  ),
  'sign-bridge': narration(
    'Old River Bridge',
    'The river runs down from the snowy mountains. The Knowledge Library waits on the far bank.',
  ),
  'sign-east': narration(
    'Edge of the Village',
    'The road ends here. The castle on the hill keeps the village\'s most important records.',
  ),
  'door-cottage': narration(
    'A quiet cottage',
    'You knock, but nobody answers. The villagers must be out in the fields.',
  ),

  // ------------------------------------------------------------ Buildings
  'building-my-home': narration(
    'My Home',
    'A warm little house with a welcome mat. Step inside to get to know Hevil.',
    [open('About Me', 'about'), close('Stay outside')],
  ),
  'building-projects-workshop': narration(
    'Projects Workshop',
    'Workbenches, blueprints and half-finished machines. Hevil\'s projects are documented inside.',
    [open('View Projects', 'projects'), open('View Technical Architecture', 'architecture'), close('Stay outside')],
  ),
  'building-developers-forge': narration(
    "Developer's Forge",
    'The forge glows with heat. This is where systems are designed, hammered into shape and documented.',
    [open('Architecture & Technical Work', 'architecture'), close('Stay outside')],
  ),
  'building-testing-lab': narration(
    'Testing Laboratory',
    'Bubbling flasks and neatly labelled test reports line the shelves.',
    [open('View Test Cases', 'test-cases'), close('Stay outside')],
  ),
  'building-knowledge-library': narration(
    'Knowledge Library',
    'Tall shelves full of notebooks, guides and technical write-ups.',
    [open('Read Technical Notes', 'notes'), close('Stay outside')],
  ),
  'building-vlog-house': narration(
    'Vlog House',
    'A camera on a tripod points at a cosy desk. This is where the videos are made.',
    [open('Watch Vlogs', 'vlogs'), close('Stay outside')],
  ),
  'building-castle': narration(
    'Resume & Contact Castle',
    'The castle archives hold Hevil\'s resume, work experience and contact details.',
    [open('View Resume', 'resume'), open('View Experience', 'experience'), close('Stay outside')],
  ),

  // ------------------------------------------------------------ Villagers
  'npc-guide': {
    start: 'start',
    nodes: {
      start: {
        speaker: 'guide',
        text: "Hello, traveller! Welcome to Hevil's World, a little village where every building holds a part of Hevil's work.",
        choices: [goto("What's in the village?", 'tour'), goto('How do I get around?', 'controls'), close('Goodbye')],
      },
      tour: {
        speaker: 'guide',
        text: "My Home is right behind me. Head east for the Projects Workshop and the Developer's Forge in the village square, the Testing Laboratory past the hill, the Knowledge Library across the bridge, the Vlog House on the market lane, and the Castle on the far hill.",
        choices: [goto('Anything else?', 'start'), close('Thanks!')],
      },
      controls: {
        speaker: 'guide',
        text: 'Walk with A and D or the arrow keys, and jump with W or Space. Press E to talk to villagers or enter buildings; at a door, W or Up works too.',
        choices: [goto('Got it', 'start'), close('Thanks!')],
      },
    },
  },
  'npc-workshop-keeper': {
    start: 'start',
    nodes: {
      start: {
        speaker: 'workshop-keeper',
        text: 'Welcome to the Projects Workshop! What would you like to explore?',
        choices: [open('View Projects', 'projects'), open('View Technical Architecture', 'architecture'), close()],
      },
    },
  },
  'npc-qa-engineer': {
    start: 'start',
    nodes: {
      start: {
        speaker: 'qa-engineer',
        text: "Hi! I keep the test records for Hevil's projects: scenarios, steps, and expected versus actual results.",
        choices: [open('View Test Cases', 'test-cases'), goto('What do the records include?', 'details'), close()],
      },
      details: {
        speaker: 'qa-engineer',
        text: 'Each test case lists its preconditions, test data, steps, expected and actual result, and its status, with evidence where there is some. You can filter them by project and status.',
        choices: [open('View Test Cases', 'test-cases'), goto('Back', 'start')],
      },
    },
  },
  'npc-librarian': {
    start: 'start',
    nodes: {
      start: {
        speaker: 'librarian',
        text: "Shh... welcome to the Knowledge Library. Hevil's technical notes are shelved here, from quick tips to deep dives.",
        choices: [open('Read Technical Notes', 'notes'), close()],
      },
    },
  },
  'npc-video-creator': {
    start: 'start',
    nodes: {
      start: {
        speaker: 'video-creator',
        text: 'Hey there! I film the development journey: devlogs and behind-the-scenes clips. Want to watch?',
        choices: [open('Watch Vlogs', 'vlogs'), close()],
      },
    },
  },
} as const satisfies Record<string, Dialogue>;

export type DialogueId = keyof typeof DIALOGUES;

export const getDialogue = (id: DialogueId): Dialogue => DIALOGUES[id];

/** Throws if a dialogue's start node or a 'goto' target does not exist. */
export function validateDialogues(dialogues: Record<string, Dialogue>): void {
  for (const [id, dialogue] of Object.entries(dialogues)) {
    if (!dialogue.nodes[dialogue.start]) throw new Error(`Dialogue '${id}': start node '${dialogue.start}' not found.`);
    for (const [nodeId, node] of Object.entries(dialogue.nodes)) {
      for (const choice of node.choices ?? []) {
        if (choice.action.type === 'goto' && !dialogue.nodes[choice.action.node]) {
          throw new Error(`Dialogue '${id}', node '${nodeId}': choice '${choice.label}' goes to missing node '${choice.action.node}'.`);
        }
      }
    }
  }
}

if (import.meta.env.DEV) validateDialogues(DIALOGUES);
