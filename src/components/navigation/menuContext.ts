import { createContext, useContext } from 'react';

export interface MenuApi {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const MenuContext = createContext<MenuApi | null>(null);

/** Site menu (building selection) state, shared by the header, the HUD (Esc) and the menu. */
export function useMenu(): MenuApi {
  const api = useContext(MenuContext);
  if (!api) throw new Error('useMenu must be used inside <MenuProvider>.');
  return api;
}
