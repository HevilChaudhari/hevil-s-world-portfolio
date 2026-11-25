import type { BuildingId, PageId } from './ids';

export type { PageId };

/**
 * Every professional website page, shared by the router, the menus and the
 * village (dialogue choices open pages by id).
 *
 * `available: false` hides a page from menus and makes dialogue choices that
 * lead to it say it is coming, instead of linking to nothing.
 */
export interface PageInfo {
  path: string;
  title: string;
  /** One sentence for menus and the page meta description. */
  summary: string;
  /** Village building this page belongs to ("Back to Village" returns there). */
  building: BuildingId;
  available: boolean;
}

export const PAGES = {
  projects: {
    path: '/projects',
    title: 'Projects',
    summary: 'Things Hevil has built, each with its architecture, features, tests and learnings.',
    building: 'projects-workshop',
    available: true,
  },
  architecture: {
    path: '/architecture',
    title: 'Architecture & Technical Work',
    summary: 'System designs, technical decisions and how the pieces fit together.',
    building: 'developers-forge',
    available: true,
  },
  'test-cases': {
    path: '/test-cases',
    title: 'Test Cases',
    summary: 'Test suites per project: scenarios, steps, expected and actual results.',
    building: 'testing-lab',
    available: true,
  },
  vlogs: {
    path: '/vlogs',
    title: 'Vlogs',
    summary: 'Development journey and behind-the-scenes videos.',
    building: 'vlog-house',
    available: true,
  },
  notes: {
    path: '/notes',
    title: 'Technical Notes',
    summary: 'Write-ups, guides and things learned along the way.',
    building: 'knowledge-library',
    available: true,
  },
  about: {
    path: '/about',
    title: 'About Me',
    summary: 'Who Hevil is, the journey so far, interests and goals.',
    building: 'my-home',
    available: true,
  },
  resume: {
    path: '/resume',
    title: 'Resume',
    summary: 'Summary, skills, education, achievements, resume download and contact links.',
    building: 'castle',
    available: true,
  },
  experience: {
    path: '/experience',
    title: 'Experience',
    summary: 'Roles, responsibilities, contributions and technologies used.',
    building: 'castle',
    available: true,
  },
} as const satisfies Record<PageId, PageInfo>;

export const PAGE_IDS = Object.keys(PAGES) as PageId[];

export const getPage = (id: PageId): PageInfo => PAGES[id];
