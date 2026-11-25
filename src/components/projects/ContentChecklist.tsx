interface ContentChecklistProps {
  title: string;
  missing: readonly string[];
  /** Data file to edit. */
  file: string;
  /** What each list entry is, singular (default "field"). */
  noun?: string;
}

/**
 * Development-only list of fields still to fill in. Never rendered in
 * production builds (callers guard with import.meta.env.DEV).
 */
export function ContentChecklist({ title, missing, file, noun = 'field' }: ContentChecklistProps) {
  if (missing.length === 0) return null;
  return (
    <details className="mb-8 border-2 border-dashed border-[#4f7cac] bg-[#4f7cac]/5 p-4 text-sm">
      <summary className="cursor-pointer font-bold text-[#3b5f86]">
        Dev only · {title}: {missing.length} {noun}
        {missing.length === 1 ? '' : 's'} to fill in <code className="font-mono">{file}</code>
      </summary>
      <ul className="mt-2 grid list-inside list-disc gap-x-6 sm:grid-cols-2">
        {missing.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </details>
  );
}
