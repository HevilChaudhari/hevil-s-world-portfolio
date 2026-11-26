import { Link } from 'react-router-dom';
import { BUILDINGS, type BuildingId } from '@/data/buildings';
import { getPage } from '@/data/pages';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';

const BUILDING_ORDER = Object.keys(BUILDINGS) as BuildingId[];

interface BuildingDirectoryProps {
  /** Runs before navigating (e.g. close the menu). */
  onBeforeNavigate?: () => void;
  /** "Walk there in the village" for a building. */
  onTravel: (building: BuildingId) => void;
  /** Heading level of each building name, to fit the surrounding outline. */
  headingLevel?: 'h2' | 'h3';
}

/**
 * Every village location with its pages and a "walk there" button.
 * Shared by the site menu and the home page's Simple view.
 */
export function BuildingDirectory({ onBeforeNavigate, onTravel, headingLevel: Heading = 'h3' }: BuildingDirectoryProps) {
  const { openPage } = useSiteNavigation();

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {BUILDING_ORDER.map((id) => {
        const building = BUILDINGS[id];
        const pages = building.pages.map((pageId) => ({ id: pageId, ...getPage(pageId) })).filter((p) => p.available);
        return (
          <li key={id} className="flex flex-col bg-white/60 p-4 pixel-border">
            <Heading className="font-pixel text-sm font-bold">{building.name}</Heading>
            <ul className="mt-2 flex flex-1 flex-col gap-2">
              {pages.map((page) => (
                <li key={page.id}>
                  <Link
                    to={page.path}
                    onClick={(e) => {
                      if (!isPlainClick(e)) return;
                      e.preventDefault();
                      onBeforeNavigate?.();
                      openPage(page.id);
                    }}
                    className="group block py-0.5"
                  >
                    <span className="font-semibold text-soil-dark underline decoration-2 underline-offset-2 group-hover:decoration-sunset">
                      {page.title}
                    </span>
                    <span className="block text-xs text-soil">{page.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                onBeforeNavigate?.();
                onTravel(id);
              }}
              className="mt-3 self-start bg-wheat px-3 py-1.5 text-xs text-soil-dark pixel-button hover:bg-meadow"
            >
              Walk there in the village
            </button>
          </li>
        );
      })}
    </ul>
  );
}
