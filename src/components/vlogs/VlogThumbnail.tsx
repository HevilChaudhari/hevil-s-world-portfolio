import { ImageWithFallback } from '@/components/media/ImageWithFallback';
import type { Vlog } from '@/types/vlog';

/**
 * The video's own thumbnail, or a countryside pixel placeholder. Nothing is
 * requested from YouTube here: its player only loads after a click.
 */
export function VlogThumbnail({ vlog }: { vlog: Vlog }) {
  return (
    <div className="relative">
      {vlog.thumbnail ? (
        <ImageWithFallback image={vlog.thumbnail} className="aspect-video" withCaption={false} />
      ) : (
        <div aria-hidden="true" className="relative aspect-video overflow-hidden bg-gradient-to-b from-sky to-[#cfe8f0]">
          <span className="absolute left-[12%] top-[18%] h-3 w-10 bg-white/90" />
          <span className="absolute left-[60%] top-[28%] h-3 w-14 bg-white/80" />
          <span className="absolute inset-x-0 bottom-0 h-1/5 pixel-grass" />
        </div>
      )}
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center bg-sunset pixel-border transition-colors group-hover:bg-wheat motion-reduce:transition-none">
          <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-night" />
        </span>
      </span>
      {vlog.duration && <span className="absolute bottom-2 right-2 bg-night/85 px-1.5 py-0.5 font-mono text-xs text-parchment">{vlog.duration}</span>}
    </div>
  );
}
