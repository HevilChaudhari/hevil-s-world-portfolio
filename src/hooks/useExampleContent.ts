import { useSearchParams } from 'react-router-dom';

/**
 * True when a page should show the fictional example data: dev server only,
 * with `?example` in the URL (e.g. #/resume?example). Always false in production.
 */
export function useExampleContent(): boolean {
  const [params] = useSearchParams();
  return import.meta.env.DEV && params.has('example');
}
