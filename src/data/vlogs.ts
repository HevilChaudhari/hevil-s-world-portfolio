import type { Vlog, VlogCategory } from '@/types/vlog';
import { EXAMPLE_VLOGS } from './examples/exampleVlogs';

/**
 * VLOGS
 * -----
 * Add a video by appending an object. Real videos only.
 *
 *   {
 *     id: 'building-the-village',
 *     title: 'Building the village',
 *     category: 'development-journey',
 *     description: 'What the video covers.',
 *     publishedOn: '2025-01-15',
 *     youtubeId: 'VIDEO_ID',                 // or src: 'assets/vlogs/file.mp4'
 *     thumbnail: { kind: 'image', src: 'assets/vlogs/building-the-village.png', alt: 'Describe the image' },
 *     duration: '8:42',
 *     projectSlug: 'unity-game-projects',     // optional, links to the project page
 *   }
 *
 * Thumbnails go in public/assets/vlogs/. Without one, a pixel placeholder is
 * drawn; nothing loads from YouTube until a visitor presses play.
 */
export const VLOGS: readonly Vlog[] = [];

export const VLOG_CATEGORIES: Record<VlogCategory, { label: string; description: string }> = {
  'development-journey': { label: 'Development journey', description: 'How the projects grew, step by step.' },
  'behind-the-scenes': { label: 'Behind the scenes', description: 'Tools, workflow and the work in between.' },
  'project-showcase': { label: 'Project showcases', description: 'Walkthroughs of finished work.' },
  tutorial: { label: 'Tutorials', description: 'Explanations of techniques and tools.' },
};

export const VLOG_CATEGORY_ORDER = Object.keys(VLOG_CATEGORIES) as VlogCategory[];

/** Newest first; videos without a date go last, in data order. */
const byDateDesc = (a: Vlog, b: Vlog) => (b.publishedOn ?? '').localeCompare(a.publishedOn ?? '');

export const getVlogs = (example: boolean): readonly Vlog[] => [...(import.meta.env.DEV && example ? EXAMPLE_VLOGS : VLOGS)].sort(byDateDesc);

/** Throws on duplicate or malformed ids and dates (runs in development). */
export function validateVlogs(vlogs: readonly Vlog[]): void {
  const seen = new Set<string>();
  for (const v of vlogs) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.id)) throw new Error(`Vlog '${v.title}': id '${v.id}' must be lowercase-with-dashes.`);
    if (seen.has(v.id)) throw new Error(`Duplicate vlog id '${v.id}'.`);
    seen.add(v.id);
    if (v.publishedOn && !/^\d{4}-\d{2}(-\d{2})?$/.test(v.publishedOn)) throw new Error(`Vlog '${v.id}': publishedOn must be 'YYYY-MM-DD'.`);
  }
}

if (import.meta.env.DEV) {
  validateVlogs(VLOGS);
  validateVlogs(EXAMPLE_VLOGS);
}
