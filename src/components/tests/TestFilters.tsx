import { useId } from 'react';
import { TEST_STATUS_LABELS, TEST_STATUSES, type TestStatus } from '@/data/testCases';

export interface ProjectOption {
  slug: string;
  title: string;
  count: number;
}

interface TestFiltersProps {
  projects: readonly ProjectOption[];
  project: string | null;
  status: TestStatus | null;
  /** Case counts per status within the selected project. */
  statusCounts: Record<TestStatus, number>;
  total: number;
  onProjectChange: (slug: string | null) => void;
  onStatusChange: (status: TestStatus | null) => void;
}

/** Project selector and status filter. State lives in the URL (?project=&status=). */
export function TestFilters({ projects, project, status, statusCounts, total, onProjectChange, onStatusChange }: TestFiltersProps) {
  const selectId = useId();
  const statuses: (TestStatus | null)[] = [null, ...TEST_STATUSES];

  return (
    <div className="flex flex-col gap-4 bg-white p-4 pixel-border md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1">
        <label htmlFor={selectId} className="font-pixel text-xs font-bold uppercase tracking-wider text-soil">
          Project
        </label>
        <select
          id={selectId}
          value={project ?? ''}
          onChange={(e) => onProjectChange(e.target.value || null)}
          className="min-w-[16rem] border-2 border-soil-dark bg-[#fbf6e9] px-3 py-2 font-semibold"
        >
          <option value="">All projects ({projects.reduce((n, p) => n + p.count, 0)})</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title} ({p.count})
            </option>
          ))}
        </select>
      </div>

      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s ?? 'all'}
            type="button"
            aria-pressed={status === s}
            onClick={() => onStatusChange(s)}
            className={`px-3 py-1 text-sm pixel-button ${status === s ? 'bg-wheat' : 'bg-white hover:bg-parchment'}`}
          >
            {s ? TEST_STATUS_LABELS[s] : 'All'} <span className="font-sans font-normal">({s ? statusCounts[s] : total})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
