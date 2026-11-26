interface TagListProps {
  items: readonly string[];
  /** Accessible name of the list, e.g. "Technologies". */
  label: string;
  className?: string;
}

/** Small parchment chips (technologies, skills). */
export function TagList({ items, label, className = '' }: TagListProps) {
  return (
    <ul aria-label={label} className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="bg-parchment px-2 py-0.5 text-xs font-semibold text-soil-dark">
          {item}
        </li>
      ))}
    </ul>
  );
}
