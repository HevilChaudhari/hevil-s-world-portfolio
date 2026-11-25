import type { ImageMedia, MediaItem } from './media';

/**
 * Data model for a portfolio project. Every content field is optional:
 *   - leave it out (undefined)  → the page shows a clearly marked "to be added" placeholder
 *   - set it to NOT_APPLICABLE  → the section is hidden (e.g. API docs for a game)
 */
export const NOT_APPLICABLE = 'not-applicable' as const;
export type NotApplicable = typeof NOT_APPLICABLE;

export type ProjectCategory = 'web' | 'api' | 'game' | 'realtime' | '3d';

/** Small pixel icon shown on cards and in the hero. */
export type ProjectIcon = 'bank' | 'api' | 'controller' | 'chat' | 'cube';

export interface Technology {
  name: string;
  /** What it was used for in this project. */
  purpose?: string;
}

/** Layered architecture drawn as boxes (top layer first), or an image of a diagram. */
export type ArchitectureDiagram =
  | { kind: 'layers'; layers: { name: string; components: string[] }[] }
  | { kind: 'image'; image: ImageMedia };

export interface Architecture {
  diagram?: ArchitectureDiagram;
  /** Paragraphs explaining the architecture. */
  description?: string[];
}

export interface Feature {
  title: string;
  description: string;
}

export interface ImplementationDetail {
  title: string;
  /** Paragraphs. */
  body: string[];
  code?: { language: string; snippet: string; caption?: string };
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  summary: string;
  auth?: string;
  /** Example request body (JSON as text). */
  request?: string;
  /** Example response body (JSON as text). */
  response?: string;
  /** e.g. ["201 Created", "400 Validation error"] */
  statusCodes?: string[];
}

export interface ChallengeSolution {
  challenge: string;
  solution: string;
}

export interface Project {
  /** URL id: lowercase-with-dashes, unique. Used in #/projects/<slug>. */
  slug: string;
  title: string;
  category: ProjectCategory;
  icon: ProjectIcon;
  /** One or two sentences for the project card. */
  tagline?: string;
  /** e.g. "2024" or "2023 – 2024". */
  period?: string;
  /** Card / hero image. */
  thumbnail?: ImageMedia;

  overview?: string[];
  problem?: string[];
  objectives?: string[];
  technologies?: Technology[];
  architecture?: Architecture;
  features?: Feature[];
  implementation?: ImplementationDetail[];
  api?: ApiEndpoint[] | NotApplicable;
  media?: MediaItem[];
  challenges?: ChallengeSolution[];
  learnings?: string[];
  links?: {
    github?: string | NotApplicable;
    demo?: string | NotApplicable;
  };
}
