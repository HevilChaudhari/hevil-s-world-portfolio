import { lazy, Suspense } from 'react';
import { LoadingScreen } from '@/components/game/LoadingScreen';
import { SimpleVillage } from '@/components/home/SimpleVillage';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useNavMode } from '@/hooks/useNavMode';

// The game (and Phaser) only downloads when the village is actually shown.
const GameCanvas = lazy(() => import('@/components/game/GameCanvas').then((m) => ({ default: m.GameCanvas })));

export default function HomePage() {
  useDocumentTitle();
  const [mode] = useNavMode();

  if (mode === 'simple') return <SimpleVillage />;

  return (
    <section aria-labelledby="home-title" className="flex flex-1 flex-col">
      <h1 id="home-title" className="sr-only">
        Hevil&apos;s World: explore the village
      </h1>
      {/* The game fills the remaining viewport height. */}
      <div className="relative min-h-[270px] flex-1">
        <div className="absolute inset-0">
          <Suspense fallback={<LoadingScreen progress={0} />}>
            <GameCanvas />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
