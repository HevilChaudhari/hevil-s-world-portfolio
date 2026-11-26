import type { TestCase } from '../testCases';

/**
 * DEVELOPMENT-ONLY FIXTURE. Fictional test records for the example project,
 * used to preview the Test Cases page (#/test-cases?example on the dev server).
 * These are not real results and never ship in production builds.
 */
export const EXAMPLE_TEST_CASES: readonly TestCase[] = [
  {
    id: 'EX-001',
    projectSlug: 'example-project',
    suite: 'Authentication (dev preview)',
    scenario: 'Example: sign in with valid credentials',
    preconditions: ['Example user account exists', 'App is open on the sign-in screen'],
    testData: 'email: user@example.test\npassword: (example value)',
    steps: ['Enter the email address', 'Enter the password', 'Press "Sign in"'],
    expected: 'The notes list opens and shows the user name in the header.',
    actual: 'Example text: the notes list opened with the user name in the header.',
    status: 'pass',
    executedOn: '2025-01-10',
    evidence: [{ kind: 'image', src: 'assets/examples/ex-001.png', alt: 'Example screenshot of the notes list after sign-in', caption: 'Missing on purpose: shows the fallback box.' }],
  },
  {
    id: 'EX-002',
    projectSlug: 'example-project',
    suite: 'Authentication (dev preview)',
    scenario: 'Example: sign in with a wrong password',
    preconditions: ['Example user account exists'],
    testData: 'password: wrong-password',
    steps: ['Enter a valid email address', 'Enter a wrong password', 'Press "Sign in"'],
    expected: 'An inline error says the email or password is incorrect; no session is created.',
    actual: 'Example text: the error appeared, but the password field was not cleared.',
    status: 'fail',
    executedOn: '2025-01-10',
  },
  {
    id: 'EX-003',
    projectSlug: 'example-project',
    suite: 'Notes (dev preview)',
    scenario: 'Example: create a note while offline',
    preconditions: ['Signed in', 'Network disabled in dev tools'],
    steps: ['Press "New note"', 'Type a title and body', 'Press "Save"'],
    expected: 'The note is saved locally and synced when the connection returns.',
    actual: 'Example text: could not run, offline mode not built yet.',
    status: 'blocked',
  },
  {
    id: 'EX-004',
    projectSlug: 'example-project',
    suite: 'Notes (dev preview)',
    scenario: 'Example: delete a note and undo',
    steps: ['Open a note', 'Press "Delete"', 'Press "Undo" in the toast'],
    expected: 'The note is restored with its original content.',
    status: 'not-run',
  },
];
