import { NOT_APPLICABLE, type Project, type ProjectCategory } from '@/types/project';
import { EXAMPLE_PROJECT } from './examples/exampleProject';

/**
 * PORTFOLIO PROJECTS
 * ------------------
 * Add a project by appending an object to PROJECTS; the listing, the detail
 * page (#/projects/<slug>) and its table of contents update automatically.
 *
 * Only the titles below are real so far. Every field left out shows a clearly
 * marked "to be added" placeholder on the site. Fill them in with real facts;
 * never placeholder claims.
 *
 * Full example of every field (copy, then delete what you don't need):
 *
 *   {
 *     slug: 'expense-tracker-api',
 *     title: 'Expense Tracker API',
 *     category: 'api',
 *     icon: 'api',
 *     tagline: 'One or two sentences shown on the card.',
 *     period: '2024',
 *     thumbnail: { kind: 'image', src: 'assets/projects/expense-tracker-api/cover.png', alt: 'Dashboard showing monthly totals' },
 *     overview: ['Paragraph one.', 'Paragraph two.'],
 *     problem: ['What problem does it solve, and for whom?'],
 *     objectives: ['Objective one', 'Objective two'],
 *     technologies: [{ name: 'Node.js', purpose: 'REST API server' }],
 *     architecture: {
 *       diagram: { kind: 'layers', layers: [
 *         { name: 'Client', components: ['Web app'] },
 *         { name: 'API', components: ['Auth', 'Expenses'] },
 *         { name: 'Data', components: ['PostgreSQL'] },
 *       ] },
 *       // or: diagram: { kind: 'image', image: { kind: 'image', src: 'assets/projects/x/architecture.png', alt: '...' } },
 *       description: ['How the parts fit together.'],
 *     },
 *     features: [{ title: 'Budgets', description: 'What it does.' }],
 *     implementation: [{ title: 'Authentication', body: ['How it works.'], code: { language: 'ts', snippet: '...' } }],
 *     api: [{ method: 'POST', path: '/expenses', summary: 'Create an expense', auth: 'Bearer token',
 *             request: '{ "amount": 12.5 }', response: '{ "id": 1 }', statusCodes: ['201 Created'] }],
 *     // api: NOT_APPLICABLE,   ← hides the API section
 *     media: [
 *       { kind: 'image', src: 'assets/projects/x/screen.png', alt: 'What the screenshot shows', caption: 'Optional' },
 *       { kind: 'video', title: 'Demo', youtubeId: 'VIDEO_ID' },
 *     ],
 *     challenges: [{ challenge: 'What was hard', solution: 'How it was solved' }],
 *     learnings: ['What you learned'],
 *     links: { github: 'https://github.com/...', demo: NOT_APPLICABLE },
 *   }
 *
 * Images go in public/assets/projects/<slug>/. Test cases live in testCases.ts
 * and are linked to a project by its slug.
 */
export const PROJECTS: readonly Project[] = [
  {
    slug: 'banking-management-system',
    title: 'Banking Management System',
    category: 'web',
    icon: 'bank',
  },
  {
    slug: 'expense-tracker-api',
    title: 'Expense Tracker API',
    category: 'api',
    icon: 'api',
  },
  {
    slug: 'unity-game-projects',
    title: 'Unity Game Projects',
    category: 'game',
    icon: 'controller',
    technologies: [{ name: 'Unity' }],
    api: NOT_APPLICABLE,
  },
  {
    slug: 'chat-application',
    title: 'Chat Application',
    category: 'realtime',
    icon: 'chat',
  },
  {
    slug: '3d-character-and-cinematics',
    title: '3D Character and Cinematic Experiments',
    category: '3d',
    icon: 'cube',
    api: NOT_APPLICABLE,
  },
];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  web: 'Web application',
  api: 'API / backend',
  game: 'Game development',
  realtime: 'Real-time app',
  '3d': '3D & cinematics',
};

/** Finds a project by slug. In development, also serves the example project (never in production). */
export const getProject = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug) ?? (import.meta.env.DEV && slug === EXAMPLE_PROJECT.slug ? EXAMPLE_PROJECT : undefined);

/** Dev-only slug of the fully filled example project. */
export const EXAMPLE_PROJECT_SLUG = import.meta.env.DEV ? EXAMPLE_PROJECT.slug : null;

/** Throws on duplicate or malformed slugs (runs in development). */
export function validateProjects(projects: readonly Project[]): void {
  const seen = new Set<string>();
  for (const p of projects) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) throw new Error(`Project '${p.title}': slug '${p.slug}' must be lowercase-with-dashes.`);
    if (seen.has(p.slug)) throw new Error(`Duplicate project slug '${p.slug}'.`);
    seen.add(p.slug);
  }
}

if (import.meta.env.DEV) validateProjects(PROJECTS);
