import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { BUILDINGS } from '@/data/buildings';
import { getPage, type PageId } from '@/data/pages';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';

/** A sub-page of a section (e.g. one project inside Projects). */
export interface PageDetail {
  title: string;
  summary?: ReactNode;
  /** Shown left of the title. */
  icon?: ReactNode;
  /** Extra buttons in the hero (e.g. GitHub, live demo). */
  actions?: ReactNode;
}

interface PageLayoutProps {
  pageId: PageId;
  detail?: PageDetail;
  children: ReactNode;
}

/**
 * Shared frame for every professional page: breadcrumb, title, the building
 * it belongs to, "Back to Village", related pages, and the page content.
 */
export function PageLayout({ pageId, detail, children }: PageLayoutProps) {
  const page = getPage(pageId);
  const building = BUILDINGS[page.building];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { openPage, goToVillage } = useSiteNavigation();
  const title = detail?.title ?? page.title;
  useDocumentTitle(title);

  // Move focus to the page title after navigation, for keyboard and screen reader users.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [title]);

  const related = detail
    ? []
    : building.pages.filter((id) => id !== pageId).map((id) => ({ id, ...getPage(id) })).filter((p) => p.available);

  const intercept = (action: () => void) => (e: MouseEvent) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    action();
  };
  const backToVillage = intercept(() => goToVillage(page.building));

  return (
    <div className="flex-1 bg-[#fbf6e9] text-soil-dark">
      {/* Hero: sky with a pixel grass edge */}
      <div className="relative bg-gradient-to-b from-sky to-[#cfe8f0] pb-10 pt-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1 text-soil-dark/80">
              <li>
                <Link to={ROUTES.home} onClick={backToVillage} className="underline underline-offset-2 hover:text-soil-dark">
                  Village
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>{building.name}</li>
              <li aria-hidden="true">›</li>
              {detail ? (
                <>
                  <li>
                    <Link to={page.path} onClick={intercept(() => openPage(pageId))} className="underline underline-offset-2 hover:text-soil-dark">
                      {page.title}
                    </Link>
                  </li>
                  <li aria-hidden="true">›</li>
                </>
              ) : null}
              <li aria-current="page" className="font-semibold text-soil-dark">
                {title}
              </li>
            </ol>
          </nav>
          <div className="mt-4 flex items-center gap-4">
            {detail?.icon}
            <h1 ref={headingRef} tabIndex={-1} className="font-pixel text-2xl font-bold outline-none sm:text-4xl">
              {title}
            </h1>
          </div>
          <div className="mt-3 max-w-2xl text-base sm:text-lg">{detail ? detail.summary : page.summary}</div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={ROUTES.home} onClick={backToVillage} className="bg-meadow px-4 py-2 text-sm text-soil-dark pixel-button hover:bg-wheat">
              ← Back to Village
            </Link>
            {detail && (
              <Link to={page.path} onClick={intercept(() => openPage(pageId))} className="bg-parchment px-4 py-2 text-sm text-soil-dark pixel-button hover:bg-wheat">
                All {page.title}
              </Link>
            )}
            {related.map((p) => (
              <Link
                key={p.id}
                to={p.path}
                onClick={intercept(() => openPage(p.id))}
                className="bg-parchment px-4 py-2 text-sm text-soil-dark pixel-button hover:bg-wheat"
              >
                {p.title} →
              </Link>
            ))}
            {detail?.actions}
          </div>
        </div>
        <div aria-hidden="true" className="pixel-grass absolute inset-x-0 bottom-0 h-4" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
