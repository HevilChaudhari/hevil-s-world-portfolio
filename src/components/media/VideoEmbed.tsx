import { useState } from 'react';
import type { VideoMedia } from '@/types/media';
import { mediaUrl } from '@/utils/mediaUrl';
import { Missing } from '@/components/content/Missing';

/**
 * Video player. YouTube videos show a lightweight placeholder until clicked, so
 * no third-party iframe (or tracking) loads until the visitor asks for it.
 */
export function VideoEmbed({ video }: { video: VideoMedia }) {
  const [playing, setPlaying] = useState(false);

  let player: React.ReactNode;
  if (video.youtubeId) {
    const id = encodeURIComponent(video.youtubeId);
    player = playing ? (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full border-0"
      />
    ) : (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-night text-parchment"
        aria-label={`Play video: ${video.title}`}
      >
        {video.poster && <img src={mediaUrl(video.poster)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80" />}
        <span className="relative flex flex-col items-center gap-2">
          <span className="flex h-14 w-14 items-center justify-center bg-sunset pixel-border group-hover:bg-wheat">
            <span aria-hidden="true" className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-night" />
          </span>
          <span className="bg-night/80 px-2 py-1 text-sm font-semibold">{video.title}</span>
        </span>
      </button>
    );
  } else if (video.src) {
    player = (
      <video controls preload="none" poster={video.poster ? mediaUrl(video.poster) : undefined} className="aspect-video w-full bg-night">
        <source src={mediaUrl(video.src)} />
        Your browser can&apos;t play this video.
      </video>
    );
  } else {
    player = <Missing what={`Video link for "${video.title}"`} hint="Set youtubeId or src." />;
  }

  return (
    <figure className="flex flex-col gap-2">
      {player}
      {video.caption && <figcaption className="text-sm text-soil">{video.caption}</figcaption>}
    </figure>
  );
}
