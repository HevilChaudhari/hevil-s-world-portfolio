interface ComingSoonProps {
  /** What this page will contain once its content is added. */
  sections: readonly string[];
}

/**
 * Clearly marked placeholder for a page whose content has not been added yet.
 * Never fill a page with invented facts; show this instead.
 */
export function ComingSoon({ sections }: ComingSoonProps) {
  return (
    <section aria-labelledby="coming-soon-title" className="bg-white p-6 pixel-border">
      <p className="font-pixel text-xs font-bold uppercase tracking-widest text-sunset">Under construction</p>
      <h2 id="coming-soon-title" className="mt-1 text-xl font-bold">
        This page is being prepared
      </h2>
      <p className="mt-2 text-soil">The content is on its way. When it&apos;s ready, you&apos;ll find:</p>
      <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {sections.map((s) => (
          <li key={s} className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-2 inline-block h-2 w-2 shrink-0 bg-grass" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
