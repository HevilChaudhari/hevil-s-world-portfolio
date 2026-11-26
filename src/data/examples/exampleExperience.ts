import { PRESENT, type ExperienceEntry } from '@/types/experience';

/**
 * DEVELOPMENT-ONLY FIXTURE. Fictional roles that preview the Experience and
 * Resume pages (?example on the dev server). Never part of production builds.
 */
export const EXAMPLE_EXPERIENCE: readonly ExperienceEntry[] = [
  {
    id: 'example-current',
    company: 'Example Company Ltd (dev preview)',
    role: 'Example Job Title',
    employmentType: 'Full-time',
    location: 'Example City',
    start: '2024-03',
    end: PRESENT,
    summary: 'Sample summary: one or two sentences about the team and what the role covers.',
    responsibilities: ['Example responsibility one', 'Example responsibility two', 'Example responsibility three'],
    contributions: ['Example technical contribution', 'Another example contribution'],
    projects: [
      { name: 'Example internal tool', description: 'What it does and your part in it.' },
      { name: 'Example project with a page', projectSlug: 'example-project' },
    ],
    achievements: ['Example achievement'],
    technologies: ['TypeScript', 'React', 'Playwright'],
  },
  {
    id: 'example-previous',
    company: 'Example Studio (dev preview)',
    role: 'Example Internship',
    employmentType: 'Internship',
    start: '2023-06',
    end: '2023-12',
    responsibilities: ['Example responsibility'],
    technologies: ['Unity', 'C#'],
  },
];
