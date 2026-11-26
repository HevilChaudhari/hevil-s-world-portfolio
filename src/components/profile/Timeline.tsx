import type { ReactNode } from 'react';

export interface TimelineItem {
  key: string;
  /** Date line above the content. */
  when: ReactNode;
  content: ReactNode;
}

/** Vertical timeline with pixel markers (experience, professional journey). */
export function Timeline({ items, label }: { items: readonly TimelineItem[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-col gap-8 border-l-4 border-parchment pl-6 sm:pl-8">
      {items.map((item) => (
        <li key={item.key} className="relative">
          <span aria-hidden="true" className="absolute -left-[34px] top-1 h-4 w-4 bg-grass pixel-border sm:-left-[42px]" />
          <p className="mb-2 font-pixel text-xs font-bold uppercase tracking-wider text-grass-dark">{item.when}</p>
          {item.content}
        </li>
      ))}
    </ol>
  );
}
