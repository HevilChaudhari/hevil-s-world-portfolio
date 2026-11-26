import { TEST_STATUS_LABELS, TEST_STATUSES, type TestStatus } from '@/data/testCases';
import { StatusBadge } from './StatusBadge';

export interface SuiteRow {
  key: string;
  project: string;
  suite: string;
  counts: Record<TestStatus, number>;
  total: number;
}

interface SuiteOverviewProps {
  rows: readonly SuiteRow[];
  totals: Record<TestStatus, number>;
  /** Show the project column (when no single project is selected). */
  showProject: boolean;
}

/** Totals per status and a per-suite breakdown. Counts only; no percentages are derived. */
export function SuiteOverview({ rows, totals, showProject }: SuiteOverviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-3" aria-label="Results summary">
        {TEST_STATUSES.map((s) => (
          <li key={s} className="flex items-center gap-2 bg-white px-3 py-2 pixel-border">
            <StatusBadge status={s} />
            <span className="font-bold">{totals[s]}</span>
          </li>
        ))}
      </ul>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse bg-white text-left text-sm">
          <caption className="sr-only">Test cases per suite and status</caption>
          <thead>
            <tr className="bg-parchment">
              {showProject && (
                <th scope="col" className="p-2">
                  Project
                </th>
              )}
              <th scope="col" className="p-2">
                Suite
              </th>
              <th scope="col" className="p-2 text-right">
                Cases
              </th>
              {TEST_STATUSES.map((s) => (
                <th key={s} scope="col" className="p-2 text-right">
                  {TEST_STATUS_LABELS[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-parchment">
                {showProject && <td className="p-2">{r.project}</td>}
                <td className="p-2 font-semibold">{r.suite}</td>
                <td className="p-2 text-right font-bold">{r.total}</td>
                {TEST_STATUSES.map((s) => (
                  <td key={s} className={`p-2 text-right ${r.counts[s] ? '' : 'text-soil/50'}`}>
                    {r.counts[s]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
