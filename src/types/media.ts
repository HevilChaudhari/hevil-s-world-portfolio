/**
 * Media shared by projects, test evidence and vlogs.
 * `src` paths are relative to /public (e.g. 'assets/projects/chat-app/home.png')
 * or absolute https URLs.
 */
export interface ImageMedia {
  kind: 'image';
  src: string;
  /** Describe what the image shows (required for accessibility). */
  alt: string;
  caption?: string;
}

export interface VideoMedia {
  kind: 'video';
  title: string;
  /** YouTube video id (the part after `v=`). Played via youtube-nocookie.com. */
  youtubeId?: string;
  /** Or a self-hosted file relative to /public. */
  src?: string;
  /** Optional poster image shown before playing. */
  poster?: string;
  caption?: string;
}

export type MediaItem = ImageMedia | VideoMedia;
