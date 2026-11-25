import { Fragment } from 'react';
import type { ArchitectureDiagram } from '@/types/project';
import { ImageWithFallback } from '@/components/media/ImageWithFallback';

/**
 * Renders an architecture diagram from data: stacked layers of component
 * boxes joined by arrows, or a supplied diagram image.
 */
export function ArchitectureDiagramView({ diagram }: { diagram: ArchitectureDiagram }) {
  if (diagram.kind === 'image') return <ImageWithFallback image={diagram.image} />;

  const description = diagram.layers.map((l) => `${l.name}: ${l.components.join(', ')}`).join('; then ');
  return (
    <figure className="blueprint p-4 sm:p-6" aria-label={`Architecture: ${description}`}>
      <ol className="flex flex-col items-stretch">
        {diagram.layers.map((layer, i) => (
          <Fragment key={layer.name}>
            {i > 0 && (
              <li aria-hidden="true" className="flex justify-center py-1">
                <span className="h-0 w-0 border-x-[8px] border-t-[10px] border-x-transparent border-t-wheat" />
              </li>
            )}
            <li className="flex flex-col gap-2 border-2 border-parchment/60 p-3 sm:flex-row sm:items-center">
              <span className="w-32 shrink-0 font-pixel text-xs font-bold uppercase tracking-wider text-wheat">{layer.name}</span>
              <ul className="flex flex-1 flex-wrap gap-2">
                {layer.components.map((c) => (
                  <li key={c} className="bg-parchment px-3 py-1.5 text-sm font-semibold text-soil-dark pixel-border">
                    {c}
                  </li>
                ))}
              </ul>
            </li>
          </Fragment>
        ))}
      </ol>
    </figure>
  );
}
