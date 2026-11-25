import { NOT_APPLICABLE, type Project } from '@/types/project';

/**
 * DEVELOPMENT-ONLY FIXTURE. Fictional content that shows what a fully filled
 * project page looks like and exercises every section during development.
 * Reachable at #/projects/example-project on the dev server only; production
 * builds never include it (see getProject in ../projects.ts).
 */
export const EXAMPLE_PROJECT: Project = {
  slug: 'example-project',
  title: 'Example Project (dev preview)',
  category: 'web',
  icon: 'chat',
  tagline: 'A fictional notes app used to preview every section of a project page. Not a real project.',
  period: 'Example',
  overview: [
    'This is sample text. Replace it by filling the same fields for a real project in src/data/projects.ts.',
    'Each field maps to one section of this page, in the order the portfolio brief defines.',
  ],
  problem: ['Describe the problem the project solves and who it is for.'],
  objectives: ['First objective', 'Second objective', 'Third objective'],
  technologies: [
    { name: 'React', purpose: 'User interface' },
    { name: 'Node.js', purpose: 'REST API' },
    { name: 'PostgreSQL', purpose: 'Storage' },
  ],
  architecture: {
    diagram: {
      kind: 'layers',
      layers: [
        { name: 'Client', components: ['Web app', 'Service worker'] },
        { name: 'API', components: ['Auth', 'Notes', 'Search'] },
        { name: 'Data', components: ['PostgreSQL', 'Object storage'] },
      ],
    },
    description: ['Explain how requests flow between the layers above.'],
  },
  features: [
    { title: 'Feature one', description: 'What it does and why it matters.' },
    { title: 'Feature two', description: 'What it does and why it matters.' },
  ],
  implementation: [
    {
      title: 'An implementation detail',
      body: ['Explain an interesting decision.'],
      code: { language: 'ts', snippet: "export function greet(name: string) {\n  return `Hello, ${name}!`;\n}", caption: 'Optional caption for the snippet.' },
    },
  ],
  api: [
    {
      method: 'POST',
      path: '/api/notes',
      summary: 'Create a note.',
      auth: 'Bearer token',
      request: '{\n  "title": "Shopping",\n  "body": "Milk"\n}',
      response: '{\n  "id": 1,\n  "title": "Shopping"\n}',
      statusCodes: ['201 Created', '400 Validation error', '401 Unauthorized'],
    },
    { method: 'GET', path: '/api/notes/:id', summary: 'Fetch one note.', statusCodes: ['200 OK', '404 Not found'] },
  ],
  media: [
    { kind: 'image', src: 'assets/projects/example-project/missing-on-purpose.png', alt: 'Example screenshot (intentionally missing to show the fallback)', caption: 'Images that fail to load show this labelled box.' },
    { kind: 'video', title: 'Example video (placeholder id)', youtubeId: 'EXAMPLE_ID', caption: 'YouTube videos load only when clicked.' },
  ],
  challenges: [{ challenge: 'Describe something that was hard.', solution: 'Describe how you solved it.' }],
  learnings: ['Something learned', 'Something else learned'],
  links: { github: 'https://github.com/', demo: NOT_APPLICABLE },
};
