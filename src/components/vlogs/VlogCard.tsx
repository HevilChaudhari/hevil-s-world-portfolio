import { VLOG_CATEGORIES } from '@/data/vlogs';
import type { Vlog } from '@/types/vlog';
import { formatDate } from '@/utils/formatDate';
import { VlogThumbnail } from './VlogThumbnail';

interface VlogCardProps {
  vlog: Vlog;
  selected: boolean;
  onSelect: (vlog: Vlog) => void;
}

/** Gallery card; the whole card is one button that loads the video into the player. */
export function VlogCard({ vlog, selected, onSelect }: VlogCardProps) {
  return (
    <article
      className={`group relative flex h-full flex-col bg-white pixel-border transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${selected ? 'outline-4 outline-offset-4 outline-wheat' : ''}`}
    >
      <VlogThumbnail vlog={vlog} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-pixel text-[11px] font-bold uppercase tracking-wider text-grass-dark">
          {VLOG_CATEGORIES[vlog.category].label}
          {vlog.publishedOn && (
            <span className="text-soil">
              {' '}
              · <time dateTime={vlog.publishedOn}>{formatDate(vlog.publishedOn)}</time>
            </span>
          )}
        </p>
        <h3 className="text-lg font-bold leading-snug">
          <button
            type="button"
            onClick={() => onSelect(vlog)}
            aria-current={selected ? 'true' : undefined}
            className="text-left after:absolute after:inset-0 focus-visible:outline-none group-focus-within:underline"
          >
            {vlog.title}
          </button>
        </h3>
        {vlog.description ? (
          <p className="line-clamp-3 text-sm text-soil">{vlog.description}</p>
        ) : (
          <p className="text-sm italic text-soil/70">Description to be added.</p>
        )}
        <span aria-hidden="true" className="mt-auto pt-2 text-sm font-bold text-grass-dark">
          {selected ? 'Now in the player' : 'Watch →'}
        </span>
      </div>
    </article>
  );
}
