import type { ImageMedia } from './media';

export type VlogCategory = 'development-journey' | 'behind-the-scenes' | 'project-showcase' | 'tutorial';

export interface Vlog {
  /** Unique, lowercase-with-dashes. Used in #/vlogs?v=<id>. */
  id: string;
  title: string;
  category: VlogCategory;
  description?: string;
  /** "YYYY-MM-DD" (or "YYYY-MM"). */
  publishedOn?: string;
  /** YouTube video id (the part after `v=`). Played via youtube-nocookie.com, only after a click. */
  youtubeId?: string;
  /** Or a self-hosted video file inside /public. */
  src?: string;
  /** Your own thumbnail image (nothing is fetched from YouTube until the visitor clicks play). */
  thumbnail?: ImageMedia;
  /** e.g. "12:34". */
  duration?: string;
  /** Related project slug from src/data/projects.ts. */
  projectSlug?: string;
}
