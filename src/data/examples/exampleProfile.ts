import type { Profile } from '@/types/profile';

/**
 * DEVELOPMENT-ONLY FIXTURE. A fictional profile that previews the About and
 * Resume pages filled in (?example on the dev server). None of this is about
 * a real person, and it never ships in production builds.
 */
export const EXAMPLE_PROFILE: Profile = {
  name: 'Hevil',
  headline: 'Example headline (dev preview)',
  summary: [
    'Sample professional summary. Two or three sentences on what you do, what you are good at and what you are looking for.',
  ],
  introduction: [
    'Sample introduction paragraph. Write it in your own voice: who you are and why you build things.',
    'A second sample paragraph about what visitors will find in this village.',
  ],
  journey: [
    { period: 'Example 2021', title: 'First sample milestone', description: 'What happened and why it mattered.' },
    { period: 'Example 2023', title: 'Second sample milestone', description: 'What changed.' },
    { period: 'Example now', title: 'Where things stand today' },
  ],
  interests: ['Example interest one', 'Example interest two', 'Example interest three'],
  skills: [
    { name: 'Example languages', skills: ['TypeScript', 'C#', 'SQL'] },
    { name: 'Example testing', skills: ['Manual testing', 'Playwright'] },
    { name: 'Example tools', skills: ['Git', 'Unity', 'Figma'] },
  ],
  careerGoals: ['Example goal for the next year', 'Example longer-term goal'],
  currentlyLearning: [
    { topic: 'Example topic', note: 'What and why, in one line.' },
    { topic: 'Another example topic' },
  ],
  education: [{ institution: 'Example University', qualification: 'Example degree', period: '2019 – 2022', details: ['Example detail'] }],
  achievements: [{ title: 'Example achievement', date: '2024-05', description: 'What it was and why it counts.' }],
  contact: {
    email: 'hello@example.com',
    github: 'https://github.com/example',
    linkedin: 'https://www.linkedin.com/in/example',
    location: 'Example City',
  },
  resumePdf: 'documents/example-resume.pdf',
};
