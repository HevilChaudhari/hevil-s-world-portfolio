import { Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MainNav } from '@/components/navigation/MainNav';
import { SiteMenu } from '@/components/navigation/SiteMenu';
import { ROUTES } from '@/app/routes';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';

/** Scroll to the top whenever the route changes (HashRouter has no scroll restoration). */
function useScrollTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
}

export function SiteLayout() {
  useScrollTopOnNavigate();
  const { goToVillage } = useSiteNavigation();

  return (
    <div className="flex min-h-dvh flex-col bg-night text-parchment">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-parchment focus:px-3 focus:py-2 focus:text-soil-dark"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b-4 border-soil-dark bg-grass-dark px-4 py-2.5">
        <Link
          to={ROUTES.home}
          onClick={(e) => {
            if (!isPlainClick(e)) return;
            e.preventDefault();
            goToVillage();
          }}
          className="font-pixel text-base font-bold tracking-wider text-parchment sm:text-lg"
        >
          HEVIL&apos;S WORLD
        </Link>
        <MainNav />
      </header>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Suspense fallback={<p className="p-6 font-pixel text-sm">Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>
      <SiteMenu />
    </div>
  );
}
