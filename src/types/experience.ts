/** Value for `end` while a role is ongoing. */
export const PRESENT = 'present' as const;

export interface ExperienceProject {
  name: string;
  description?: string;
  /** Links to a project page when it matches a slug in src/data/projects.ts. */
  projectSlug?: string;
}

/**
 * One role on the Experience page (and, condensed, on the Resume).
 * Optional fields left out render a "To be added" placeholder.
 */
export interface ExperienceEntry {
  /** Unique, lowercase-with-dashes. */
  id: string;
  company: string;
  role: string;
  /** e.g. "Full-time", "Internship", "Freelance". */
  employmentType?: string;
  location?: string;
  companyUrl?: string;
  /** "YYYY-MM" (or "YYYY"). */
  start?: string;
  /** "YYYY-MM", "YYYY" or PRESENT. */
  end?: string;
  /** One or two sentences about the role. */
  summary?: string;
  responsibilities?: readonly string[];
  /** Technical work you personally did. */
  contributions?: readonly string[];
  projects?: readonly ExperienceProject[];
  achievements?: readonly string[];
  technologies?: readonly string[];
}
