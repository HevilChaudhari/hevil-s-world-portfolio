import type { PageId } from '@/data/pages';

/** Routes that are not top-level content pages. Page paths live in src/data/pages.ts. */
export const ROUTES = {
  home: '/',
  projectDetail: '/projects/:slug',
} as const;

export const projectPath = (slug: string) => `/projects/${slug}`;

/** Pages shown directly in the header on wider screens; every page is in the menu. */
export const PRIMARY_NAV: readonly PageId[] = ['projects', 'test-cases', 'vlogs', 'resume', 'about'];
