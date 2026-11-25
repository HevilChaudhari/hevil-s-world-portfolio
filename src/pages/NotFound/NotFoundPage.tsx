import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';

export default function NotFoundPage() {
  useDocumentTitle('Lost in the woods');
  const { goToVillage } = useSiteNavigation();

  return (
    <section className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="font-pixel text-xl">Lost in the woods</h1>
      <p className="text-parchment/80">This path doesn&apos;t lead anywhere. Let&apos;s get you back to the village.</p>
      <Link
        to={ROUTES.home}
        onClick={(e) => {
          if (!isPlainClick(e)) return;
          e.preventDefault();
          goToVillage();
        }}
        className="bg-parchment px-4 py-2 text-soil-dark pixel-button hover:bg-wheat"
      >
        Back to Village
      </Link>
    </section>
  );
}
