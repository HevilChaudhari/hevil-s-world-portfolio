import type { Vlog } from '@/types/vlog';

/**
 * DEVELOPMENT-ONLY FIXTURE. Fictional videos that preview the Vlogs page
 * (#/vlogs?example on the dev server). No real video links: the player shows
 * its "To be added" box. Never part of production builds.
 */
export const EXAMPLE_VLOGS: readonly Vlog[] = [
  {
    id: 'example-devlog-1',
    title: 'Example devlog: first steps (dev preview)',
    category: 'development-journey',
    description: 'Sample description. A real entry would say what the video covers in two or three sentences.',
    publishedOn: '2025-02-01',
    duration: '8:42',
    projectSlug: 'example-project',
  },
  {
    id: 'example-devlog-2',
    title: 'Example devlog: the second milestone (dev preview)',
    category: 'development-journey',
    description: 'Sample description of a follow-up video.',
    publishedOn: '2025-03-15',
    duration: '11:05',
  },
  {
    id: 'example-desk-tour',
    title: 'Example: workflow and tools (dev preview)',
    category: 'behind-the-scenes',
    description: 'Sample description of a behind-the-scenes video.',
    publishedOn: '2025-01-20',
    thumbnail: { kind: 'image', src: 'assets/examples/vlog-thumb.png', alt: 'Example thumbnail (missing on purpose)' },
  },
  {
    id: 'example-tutorial',
    title: 'Example tutorial without a date (dev preview)',
    category: 'tutorial',
  },
];
