import type { Profile } from '@/types/profile';
import { EXAMPLE_PROFILE } from './examples/exampleProfile';

/**
 * PROFILE (About Me + Resume)
 * ---------------------------
 * Real facts only. Every field left out shows a clearly marked "To be added"
 * box on the site. Fill a field in to replace its placeholder.
 *
 *   headline: 'Software developer & QA engineer',
 *   portrait: { kind: 'image', src: 'assets/ui/portrait.png', alt: 'Describe the photo' },
 *   summary: ['Resume summary paragraph.'],
 *   introduction: ['About-page introduction paragraph.'],
 *   journey: [{ period: '2023', title: 'Started X', description: 'What happened.' }],
 *   interests: ['Game development', 'Test automation'],
 *   skills: [{ name: 'Languages', skills: ['TypeScript', 'C#'] }],
 *   careerGoals: ['Goal one'],
 *   currentlyLearning: [{ topic: 'Playwright', note: 'End-to-end testing', link: 'https://...' }],
 *   education: [{ institution: 'University', qualification: 'B.Sc. ...', period: '2020 – 2023', details: ['...'] }],
 *   achievements: [{ title: 'Award', date: '2024-05', description: '...', link: 'https://...' }],
 *   contact: {
 *     email: 'an address you are happy to publish',
 *     github: 'https://github.com/<username>',
 *     linkedin: 'https://www.linkedin.com/in/<profile>',
 *     location: 'City, Country',
 *   },
 *   resumePdf: 'documents/resume.pdf',   // the file goes in public/documents/
 *
 * On the dev server, add ?example to the page URL (e.g. #/about?example) to
 * preview the page filled with fictional data. Never part of production builds.
 */
export const PROFILE: Profile = {
  name: 'Hevil',
  contact: {},
};

/** The real profile or, on the dev server with ?example, the fictional preview. */
export const getProfile = (example: boolean): Profile => (import.meta.env.DEV && example ? EXAMPLE_PROFILE : PROFILE);
