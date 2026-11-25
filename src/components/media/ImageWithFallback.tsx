import { useState } from 'react';
import type { ImageMedia } from '@/types/media';
import { mediaUrl } from '@/utils/mediaUrl';

interface ImageWithFallbackProps {
  image: ImageMedia;
  className?: string;
  /** Show the caption under the image. */
  withCaption?: boolean;
}

/** Lazy-loaded image that degrades to a labelled box if the file is missing. */
export function ImageWithFallback({ image, className = '', withCaption = true }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="flex flex-col gap-2">
      {failed ? (
        <div
          role="img"
          aria-label={image.alt}
          className={`flex aspect-video items-center justify-center border-2 border-dashed border-soil/40 bg-parchment p-4 text-center text-sm text-soil ${className}`}
        >
          <span>
            <span className="block font-pixel text-xs font-bold uppercase tracking-wider">Image unavailable</span>
            {image.alt}
          </span>
        </div>
      ) : (
        <img
          src={mediaUrl(image.src)}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`w-full bg-parchment object-cover ${className}`}
        />
      )}
      {withCaption && image.caption && <figcaption className="text-sm text-soil">{image.caption}</figcaption>}
    </figure>
  );
}
