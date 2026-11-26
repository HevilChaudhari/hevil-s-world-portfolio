import { useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContentSection } from '@/components/content/ContentSection';
import { ExampleDataToggle } from '@/components/content/ExampleDataToggle';
import { Missing } from '@/components/content/Missing';
import { PageLayout } from '@/components/layout/PageLayout';
import { VlogCard } from '@/components/vlogs/VlogCard';
import { VlogPlayer } from '@/components/vlogs/VlogPlayer';
import { VLOG_CATEGORIES, VLOG_CATEGORY_ORDER, getVlogs } from '@/data/vlogs';
import { useExampleContent } from '@/hooks/useExampleContent';
import type { Vlog, VlogCategory } from '@/types/vlog';
import { scrollToElement } from '@/utils/scrollToElement';

const isCategory = (value: string | null): value is VlogCategory => value !== null && value in VLOG_CATEGORIES;

export default function VlogsPage() {
  const example = useExampleContent();
  const vlogs = useMemo(() => getVlogs(example), [example]);
  const [params, setParams] = useSearchParams();
  const playerHeading = useRef<HTMLHeadingElement>(null);

  // Only offer categories that actually have videos.
  const categories = VLOG_CATEGORY_ORDER.filter((c) => vlogs.some((v) => v.category === c));
  const categoryParam = params.get('category');
  const category = isCategory(categoryParam) && categories.includes(categoryParam) ? categoryParam : null;
  // ?v=<id> selects the video in the player (shareable); defaults to the newest.
  const selected = vlogs.find((v) => v.id === params.get('v')) ?? vlogs[0];

  const update = (changes: Record<string, string | null>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );

  const select = (vlog: Vlog) => {
    update({ v: vlog.id });
    scrollToElement(playerHeading.current);
  };

  const shown = category ? [category] : categories;

  return (
    <PageLayout pageId="vlogs">
      {import.meta.env.DEV && <ExampleDataToggle active={example} />}

      <p className="mb-8 max-w-3xl text-soil">The development journey on video: how the projects came together, plus a look behind the scenes.</p>

      {!selected ? (
        <div className="flex flex-col gap-4">
          <Missing
            what="Videos"
            hint="Add videos to src/data/vlogs.ts (title, category, date, description and a YouTube id or file). Thumbnails go in public/assets/vlogs/."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {VLOG_CATEGORY_ORDER.map((c) => (
              <li key={c} className="bg-white p-4 pixel-border">
                <p className="font-bold">{VLOG_CATEGORIES[c].label}</p>
                <p className="text-sm text-soil">{VLOG_CATEGORIES[c].description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <VlogPlayer vlog={selected} headingRef={playerHeading} />

          {categories.length > 1 && (
            <div role="group" aria-label="Filter videos by category" className="-mb-4 flex flex-wrap gap-2">
              {([null, ...categories] as (VlogCategory | null)[]).map((c) => (
                <button
                  key={c ?? 'all'}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => update({ category: c })}
                  className={`px-3 py-1 text-sm pixel-button ${category === c ? 'bg-wheat' : 'bg-white hover:bg-parchment'}`}
                >
                  {c ? VLOG_CATEGORIES[c].label : 'All videos'}
                </button>
              ))}
            </div>
          )}

          {shown.map((c) => (
            <ContentSection
              key={c}
              id={`vlogs-${c}`}
              title={VLOG_CATEGORIES[c].label}
              aside={<span className="text-sm text-soil">{VLOG_CATEGORIES[c].description}</span>}
            >
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vlogs
                  .filter((v) => v.category === c)
                  .map((v) => (
                    <li key={v.id}>
                      <VlogCard vlog={v} selected={v.id === selected.id} onSelect={select} />
                    </li>
                  ))}
              </ul>
            </ContentSection>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
