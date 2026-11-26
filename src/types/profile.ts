import type { ImageMedia } from './media';

/**
 * Personal profile shared by the About and Resume pages. Every optional field
 * follows the project convention: leave it out and the page shows a clearly
 * marked "To be added" box instead of invented text.
 */
export interface SkillGroup {
  /** e.g. "Languages", "Testing", "Game development". */
  name: string;
  skills: readonly string[];
}

export interface EducationEntry {
  institution: string;
  qualification: string;
  /** "YYYY", "YYYY-MM" or free text such as "2021 – 2024". */
  period?: string;
  location?: string;
  details?: readonly string[];
}

export interface Achievement {
  title: string;
  /** "YYYY", "YYYY-MM" or "YYYY-MM-DD". */
  date?: string;
  description?: string;
  link?: string;
}

/** One step of the professional journey on the About page. */
export interface JourneyStep {
  /** Free text, e.g. "2022" or "2022 – 2023". */
  period: string;
  title: string;
  description?: string;
}

export interface LearningItem {
  topic: string;
  /** What exactly, or why. */
  note?: string;
  link?: string;
}

export interface ContactInfo {
  /** Only an address you are happy to publish. */
  email?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  /** e.g. "City, Country" or "Remote". */
  location?: string;
}

export interface Profile {
  name: string;
  /** One line under the name, e.g. "Software developer & QA engineer". */
  headline?: string;
  portrait?: ImageMedia;
  /** Professional summary (Resume). Short paragraphs. */
  summary?: readonly string[];
  /** Friendly introduction (About). Short paragraphs. */
  introduction?: readonly string[];
  journey?: readonly JourneyStep[];
  interests?: readonly string[];
  skills?: readonly SkillGroup[];
  careerGoals?: readonly string[];
  currentlyLearning?: readonly LearningItem[];
  education?: readonly EducationEntry[];
  achievements?: readonly Achievement[];
  contact: ContactInfo;
  /** Path inside /public, e.g. 'documents/resume.pdf'. Leave out until the file exists. */
  resumePdf?: string;
}
