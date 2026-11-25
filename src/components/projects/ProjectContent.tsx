import { Link } from 'react-router-dom';
import { getPage } from '@/data/pages';
import type { TestCase, TestStatus } from '@/data/testCases';
import { Missing } from '@/components/content/Missing';
import { StatusBadge } from '@/components/tests/StatusBadge';

/** Small presentational pieces used by the project detail sections. */
export function Paragraphs({ items }: { items: readonly string[] }) {
  return (
    <div className="flex max-w-3xl flex-col gap-3 leading-relaxed">
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

export function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex max-w-3xl flex-col gap-2">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-2 inline-block h-2 w-2 shrink-0 bg-grass" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

export function TestsSummary({ slug, tests }: { slug: string; tests: readonly TestCase[] }) {
  const testsPath = `${getPage('test-cases').path}?project=${encodeURIComponent(slug)}`;
  if (tests.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <Missing what="Test cases" hint="Add real test records for this project in src/data/testCases.ts (projectSlug must match)." />
      </div>
    );
  }

  const counts = tests.reduce<Partial<Record<TestStatus, number>>>((acc, t) => ({ ...acc, [t.status]: (acc[t.status] ?? 0) + 1 }), {});
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-3" aria-label="Results summary">
        {(Object.keys(counts) as TestStatus[]).map((status) => (
          <li key={status} className="flex items-center gap-2 bg-white px-3 py-2 pixel-border">
            <StatusBadge status={status} />
            <span className="font-bold">{counts[status]}</span>
          </li>
        ))}
      </ul>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse bg-white text-left text-sm">
          <caption className="sr-only">Test cases for this project</caption>
          <thead>
            <tr className="bg-parchment">
              <th scope="col" className="p-2">ID</th>
              <th scope="col" className="p-2">Scenario</th>
              <th scope="col" className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tests.slice(0, 8).map((t) => (
              <tr key={t.id} className="border-t border-parchment">
                <td className="p-2 font-mono">{t.id}</td>
                <td className="p-2">{t.scenario}</td>
                <td className="p-2">
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to={testsPath} className="self-start font-bold text-grass-dark underline underline-offset-2">
        See all {tests.length} test case{tests.length === 1 ? '' : 's'} with steps and evidence →
      </Link>
    </div>
  );
}
