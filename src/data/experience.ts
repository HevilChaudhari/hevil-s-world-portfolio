import type { ExperienceEntry } from '@/types/experience';
import { EXAMPLE_EXPERIENCE } from './examples/exampleExperience';

/**
 * WORK EXPERIENCE
 * ---------------
 * Newest role first. Real facts only: company, title and dates exactly as they
 * were. Optional fields left out show a "To be added" placeholder.
 *
 *   {
 *     id: 'company-role',
 *     company: 'Company name',
 *     role: 'Job title',
 *     employmentType: 'Full-time',
 *     location: 'City, Country',
 *     companyUrl: 'https://...',
 *     start: '2023-06',
 *     end: PRESENT,                 // import { PRESENT } from '@/types/experience'; or '2024-08'
 *     summary: 'One or two sentences.',
 *     responsibilities: ['...'],
 *     contributions: ['...'],
 *     projects: [{ name: 'Internal tool', description: '...', projectSlug: 'chat-application' }],
 *     achievements: ['...'],
 *     technologies: ['TypeScript', 'Jest'],
 *   }
 *
 * The Resume page shows a condensed version of the same entries.
 */
export const EXPERIENCE: readonly ExperienceEntry[] = [];

export const getExperience = (example: boolean): readonly ExperienceEntry[] =>
  import.meta.env.DEV && example ? EXAMPLE_EXPERIENCE : EXPERIENCE;

/** Throws on duplicate ids and malformed dates (runs in development). */
export function validateExperience(entries: readonly ExperienceEntry[]): void {
  const seen = new Set<string>();
  for (const e of entries) {
    if (seen.has(e.id)) throw new Error(`Duplicate experience id '${e.id}'.`);
    seen.add(e.id);
    for (const [field, value] of [
      ['start', e.start],
      ['end', e.end],
    ] as const) {
      if (value !== undefined && value !== 'present' && !/^\d{4}(-\d{2})?$/.test(value)) {
        throw new Error(`Experience '${e.id}': ${field} '${value}' must be 'YYYY-MM', 'YYYY' or PRESENT.`);
      }
    }
  }
}

if (import.meta.env.DEV) {
  validateExperience(EXPERIENCE);
  validateExperience(EXAMPLE_EXPERIENCE);
}
