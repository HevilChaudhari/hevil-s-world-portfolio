import { TEST_STATUS_LABELS, type TestStatus } from '@/data/testCases';

const STATUS_STYLES: Record<TestStatus, string> = {
  pass: 'bg-grass text-white',
  fail: 'bg-sunset text-white',
  blocked: 'bg-[#c07f25] text-white',
  'not-run': 'bg-soil/20 text-soil-dark',
};

/** Test result badge. Status always shown as text, never colour alone. */
export function StatusBadge({ status }: { status: TestStatus }) {
  return <span className={`inline-block px-2 py-0.5 text-xs font-bold ${STATUS_STYLES[status]}`}>{TEST_STATUS_LABELS[status]}</span>;
}
