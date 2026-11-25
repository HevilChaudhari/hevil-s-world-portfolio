import { NavLink } from 'react-router-dom';
import { PRIMARY_NAV, ROUTES } from '@/app/routes';
import { getPage } from '@/data/pages';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import { useMenu } from './menuContext';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-2.5 py-1.5 text-sm font-semibold transition-colors motion-reduce:transition-none ${
    isActive ? 'bg-parchment text-soil-dark' : 'text-parchment hover:bg-grass'
  }`;

/**
 * Permanent site navigation, so no visitor is ever forced to play the game.
 * Primary pages are inline on wide screens; every location is in the menu.
 */
export function MainNav() {
  const { openPage, goToVillage } = useSiteNavigation();
  const menu = useMenu();

  return (
    <nav aria-label="Main" className="flex items-center gap-2">
      <ul className="hidden items-center gap-1 lg:flex">
        <li>
          <NavLink
            to={ROUTES.home}
            end
            className={linkClass}
            onClick={(e) => {
              if (!isPlainClick(e)) return;
              e.preventDefault();
              goToVillage();
            }}
          >
            Village
          </NavLink>
        </li>
        {PRIMARY_NAV.map((id) => {
          const page = getPage(id);
          return (
            <li key={id}>
              <NavLink
                to={page.path}
                className={linkClass}
                onClick={(e) => {
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  openPage(id);
                }}
              >
                {page.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={menu.open}
        aria-haspopup="dialog"
        aria-expanded={menu.isOpen}
        className="flex items-center gap-2 bg-wheat px-3 py-1.5 text-sm text-soil-dark pixel-button hover:bg-parchment"
      >
        <span aria-hidden="true" className="flex flex-col gap-[3px]">
          <span className="block h-[3px] w-4 bg-soil-dark" />
          <span className="block h-[3px] w-4 bg-soil-dark" />
          <span className="block h-[3px] w-4 bg-soil-dark" />
        </span>
        Menu
      </button>
    </nav>
  );
}
