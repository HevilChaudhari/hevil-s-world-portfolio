import type { ImageMedia } from '@/types/media';

/**
 * TEST CASES
 * ----------
 * Real test records only: never add results that were not actually observed.
 * Each case links to a project via `projectSlug` (see projects.ts).
 * The Test Cases page (Phase 7) and each project's detail page read from here.
 *
 * Example:
 *   {
 *     id: 'ETA-001',
 *     projectSlug: 'expense-tracker-api',
 *     suite: 'Authentication',
 *     scenario: 'Login with valid credentials',
 *     preconditions: ['User account exists'],
 *     testData: 'email: test@example.com',
 *     steps: ['POST /auth/login with valid body', 'Read response'],
 *     expected: '200 OK with an access token',
 *     actual: '200 OK with an access token',
 *     status: 'pass',
 *     evidence: [{ kind: 'image', src: 'assets/projects/expense-tracker-api/tests/eta-001.png', alt: 'Postman response' }],
 *   }
 */
export type TestStatus = 'pass' | 'fail' | 'blocked' | 'not-run';

export interface TestCase {
  id: string;
  projectSlug: string;
  suite?: string;
  scenario: string;
  preconditions?: string[];
  testData?: string;
  steps: string[];
  expected: string;
  /** What actually happened. Leave out if the test has not been run. */
  actual?: string;
  status: TestStatus;
  evidence?: ImageMedia[];
}

export const TEST_CASES: readonly TestCase[] = [];

export const getTestCasesForProject = (slug: string): TestCase[] => TEST_CASES.filter((t) => t.projectSlug === slug);

export const TEST_STATUS_LABELS: Record<TestStatus, string> = {
  pass: 'Pass',
  fail: 'Fail',
  blocked: 'Blocked',
  'not-run': 'Not run',
};
