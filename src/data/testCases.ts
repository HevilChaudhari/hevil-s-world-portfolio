import type { ImageMedia } from '@/types/media';
import { EXAMPLE_TEST_CASES } from './examples/exampleTestCases';

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
  /** When the test was run: "YYYY-MM-DD". */
  executedOn?: string;
  evidence?: ImageMedia[];
}

export const TEST_CASES: readonly TestCase[] = [];

export const getTestCasesForProject = (slug: string): TestCase[] => TEST_CASES.filter((t) => t.projectSlug === slug);

/**
 * All real test cases or, on the dev server with ?example (#/test-cases?example),
 * the fictional preview set. Never part of production builds.
 */
export const getTestCases = (example: boolean): readonly TestCase[] => (import.meta.env.DEV && example ? EXAMPLE_TEST_CASES : TEST_CASES);

export const TEST_STATUS_LABELS: Record<TestStatus, string> = {
  pass: 'Pass',
  fail: 'Fail',
  blocked: 'Blocked',
  'not-run': 'Not run',
};

export const TEST_STATUSES = Object.keys(TEST_STATUS_LABELS) as TestStatus[];

export const isTestStatus = (value: string | null): value is TestStatus => value !== null && value in TEST_STATUS_LABELS;

/**
 * Throws on duplicate ids, and on a pass/fail result with no recorded actual
 * result: a status is only a claim if what happened is written down (runs in development).
 */
export function validateTestCases(cases: readonly TestCase[]): void {
  const seen = new Set<string>();
  for (const t of cases) {
    if (seen.has(t.id)) throw new Error(`Duplicate test case id '${t.id}'.`);
    seen.add(t.id);
    if ((t.status === 'pass' || t.status === 'fail') && !t.actual) {
      throw new Error(`Test case '${t.id}' is marked '${t.status}' but has no actual result.`);
    }
  }
}

if (import.meta.env.DEV) {
  validateTestCases(TEST_CASES);
  validateTestCases(EXAMPLE_TEST_CASES);
}
