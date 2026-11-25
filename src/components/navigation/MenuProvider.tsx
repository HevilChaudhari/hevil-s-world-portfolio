import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { MenuContext, type MenuApi } from './menuContext';

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const api = useMemo<MenuApi>(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <MenuContext.Provider value={api}>{children}</MenuContext.Provider>;
}
