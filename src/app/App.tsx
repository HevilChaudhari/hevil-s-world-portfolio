import { lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { MenuProvider } from '@/components/navigation/MenuProvider';
import { TransitionProvider } from '@/components/transition/TransitionProvider';
import { PAGE_IDS, PAGES } from '@/data/pages';
import { PAGE_COMPONENTS } from './pageComponents';
import { ROUTES } from './routes';

// Pages are lazy-loaded so visitors who open a content page directly never
// download Phaser, and the game never blocks the rest of the site.
const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const ProjectDetailsPage = lazy(() => import('@/pages/ProjectDetails/ProjectDetailsPage'));

/** HashRouter: GitHub Pages has no server-side rewrites, so URLs look like /#/projects. */
export function App() {
  return (
    <HashRouter>
      <TransitionProvider>
        <MenuProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path={ROUTES.home} element={<HomePage />} />
              {PAGE_IDS.filter((id) => PAGES[id].available).map((id) => {
                const Page = PAGE_COMPONENTS[id];
                return <Route key={id} path={PAGES[id].path} element={<Page />} />;
              })}
              <Route path={ROUTES.projectDetail} element={<ProjectDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </MenuProvider>
      </TransitionProvider>
    </HashRouter>
  );
}
