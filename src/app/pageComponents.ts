import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { PageId } from '@/data/pages';

/**
 * Lazy page component per PageId. Typed as a full Record so adding a page id
 * without a component is a compile error. Each page is its own chunk, so
 * visitors only download what they open (and content pages never load Phaser).
 */
export const PAGE_COMPONENTS: Record<PageId, LazyExoticComponent<ComponentType>> = {
  projects: lazy(() => import('@/pages/Projects/ProjectsPage')),
  architecture: lazy(() => import('@/pages/Architecture/ArchitecturePage')),
  'test-cases': lazy(() => import('@/pages/TestCases/TestCasesPage')),
  vlogs: lazy(() => import('@/pages/Vlogs/VlogsPage')),
  notes: lazy(() => import('@/pages/Notes/NotesPage')),
  about: lazy(() => import('@/pages/About/AboutPage')),
  resume: lazy(() => import('@/pages/Resume/ResumePage')),
  experience: lazy(() => import('@/pages/Experience/ExperiencePage')),
};
