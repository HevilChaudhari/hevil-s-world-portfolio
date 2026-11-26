import { TEST_STATUSES, type TestCase, type TestStatus } from '@/data/testCases';

export const emptyStatusCounts = (): Record<TestStatus, number> =>
  Object.fromEntries(TEST_STATUSES.map((s) => [s, 0])) as Record<TestStatus, number>;

export function countByStatus(cases: readonly TestCase[]): Record<TestStatus, number> {
  const counts = emptyStatusCounts();
  for (const t of cases) counts[t.status] += 1;
  return counts;
}

/** Groups items by key, keeping first-seen order. */
export function groupBy<T>(items: readonly T[], key: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = groups.get(k);
    if (list) list.push(item);
    else groups.set(k, [item]);
  }
  return groups;
}

/** Suite name used when a test case has none. */
export const DEFAULT_SUITE = 'General';
