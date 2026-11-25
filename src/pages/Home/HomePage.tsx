import { GameCanvas } from '@/components/game/GameCanvas';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle();
  return (
    <section aria-labelledby="home-title" className="flex flex-1 flex-col">
      <h1 id="home-title" className="sr-only">
        Hevil&apos;s World: explore the village
      </h1>
      {/* The game fills the remaining viewport height. */}
      <div className="relative min-h-[270px] flex-1">
        <div className="absolute inset-0">
          <GameCanvas />
        </div>
      </div>
    </section>
  );
}
