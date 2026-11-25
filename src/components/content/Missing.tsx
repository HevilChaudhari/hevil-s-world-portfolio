interface MissingProps {
  /** What should go here, e.g. "Problem statement". */
  what: string;
  hint?: string;
}

/**
 * Clearly marked placeholder for content that has not been provided yet.
 * Shown instead of inventing facts; fill the matching field in src/data/.
 */
export function Missing({ what, hint }: MissingProps) {
  return (
    <div className="border-2 border-dashed border-sunset/60 bg-sunset/5 px-4 py-3 text-sm text-soil">
      <span className="font-pixel text-xs font-bold uppercase tracking-wider text-sunset">To be added</span>
      <span className="ml-2">{what}</span>
      {hint && <span className="mt-1 block text-xs text-soil/80">{hint}</span>}
    </div>
  );
}
