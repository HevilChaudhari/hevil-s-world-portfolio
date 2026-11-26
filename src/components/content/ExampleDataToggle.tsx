import { Link, useSearchParams } from 'react-router-dom';

/**
 * Development-only switch between the real data and the fictional example
 * data (?example). Callers render it behind import.meta.env.DEV.
 */
export function ExampleDataToggle({ active }: { active: boolean }) {
  const [params] = useSearchParams();
  const next = new URLSearchParams(params);
  if (active) next.delete('example');
  else next.set('example', '');
  const search = next.toString();

  return (
    <p className="mb-8 border-2 border-dashed border-[#4f7cac] bg-[#4f7cac]/5 px-4 py-3 text-sm text-[#3b5f86]">
      <span className="font-bold">Dev only:</span>{' '}
      {active ? 'showing fictional example data, never shipped. ' : 'preview this page filled with fictional example data. '}
      <Link to={{ search: search ? `?${search}` : '' }} replace className="font-bold underline">
        {active ? 'Show real data' : 'Preview example data'}
      </Link>
    </p>
  );
}
