interface LoadingScreenProps {
  /** 0..1 */
  progress: number;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const percent = Math.round(Math.min(Math.max(progress, 0), 1) * 100);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-night text-parchment">
      <p className="font-pixel text-sm tracking-widest">Entering the village…</p>
      <div
        className="pixel-border h-5 w-56 bg-soil-dark p-1"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Loading game"
      >
        <div className="h-full bg-meadow transition-[width] motion-reduce:transition-none" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
