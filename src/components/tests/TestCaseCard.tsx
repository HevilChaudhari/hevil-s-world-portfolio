import type { ReactNode } from 'react';
import { Missing } from '@/components/content/Missing';
import { ImageWithFallback } from '@/components/media/ImageWithFallback';
import type { TestCase } from '@/data/testCases';
import { formatDate } from '@/utils/formatDate';
import { StatusBadge } from './StatusBadge';

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <h4 className="font-pixel text-xs font-bold uppercase tracking-wider text-soil">{label}</h4>
      {children}
    </div>
  );
}

const none = (text: string) => <p className="text-sm italic text-soil/80">{text}</p>;

/**
 * One test case, collapsed to its ID, scenario and status; expands to the full
 * record. A missing actual result or evidence is stated, never implied.
 */
export function TestCaseCard({ test, defaultOpen = false }: { test: TestCase; defaultOpen?: boolean }) {
  let actual: ReactNode;
  if (test.actual) actual = <p>{test.actual}</p>;
  else if (test.status === 'not-run') actual = none('Not run yet.');
  else actual = <Missing what="Actual result" />;

  return (
    <details open={defaultOpen} className="group bg-white pixel-border">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 p-4 hover:bg-parchment/50 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="font-mono text-soil transition-transform group-open:rotate-90 motion-reduce:transition-none">
          ▶
        </span>
        <span className="font-mono text-sm font-bold">{test.id}</span>
        <span className="min-w-0 flex-1 font-semibold">{test.scenario}</span>
        {test.suite && <span className="hidden bg-parchment px-2 py-0.5 text-xs sm:inline">{test.suite}</span>}
        <StatusBadge status={test.status} />
      </summary>

      <div className="grid gap-5 border-t-2 border-parchment p-4 md:grid-cols-2">
        <Field label="Preconditions">
          {test.preconditions?.length ? (
            <ul className="list-inside list-disc text-sm">
              {test.preconditions.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : (
            none('None listed.')
          )}
        </Field>
        <Field label="Test data">
          {test.testData ? <pre className="whitespace-pre-wrap break-words bg-[#fbf6e9] p-2 font-mono text-xs">{test.testData}</pre> : none('None.')}
        </Field>
        <Field label="Steps" className="md:col-span-2">
          <ol className="flex flex-col gap-1 text-sm">
            {test.steps.map((step, i) => (
              <li key={`${i}-${step}`} className="flex gap-2">
                <span className="font-mono font-bold text-grass-dark">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Field>
        <Field label="Expected result">
          <p>{test.expected}</p>
        </Field>
        <Field label="Actual result">{actual}</Field>
        <Field label="Evidence" className="md:col-span-2">
          {test.evidence?.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {test.evidence.map((img) => (
                <ImageWithFallback key={img.src} image={img} className="pixel-border" />
              ))}
            </div>
          ) : (
            none(test.status === 'not-run' ? 'No evidence yet.' : 'No screenshots attached.')
          )}
        </Field>
        {test.executedOn && (
          <p className="text-sm text-soil md:col-span-2">
            Executed on <time dateTime={test.executedOn}>{formatDate(test.executedOn)}</time>
          </p>
        )}
      </div>
    </details>
  );
}
