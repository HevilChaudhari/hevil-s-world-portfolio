import type { ReactNode } from 'react';

interface ContentSectionProps {
  id: string;
  title: string;
  /** Small text or link shown at the right of the heading. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A titled block of a content page, styled like the project detail sections. */
export function ContentSection({ id, title, aside, children, className = '' }: ContentSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`flex min-w-0 flex-col gap-4 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-4 border-parchment pb-2">
        <h2 id={`${id}-title`} className="text-2xl font-bold">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
