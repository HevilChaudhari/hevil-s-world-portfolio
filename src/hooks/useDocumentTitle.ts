import { useEffect } from 'react';

const SITE_NAME = "HEVIL'S WORLD";

/** Sets the browser tab title for the current page ("Projects · HEVIL'S WORLD"). */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
