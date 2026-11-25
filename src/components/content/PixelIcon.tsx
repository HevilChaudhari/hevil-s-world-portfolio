import type { ProjectIcon } from '@/types/project';

/** 8x8 pixel icons: '#' = main colour, 'o' = accent colour. */
const ICONS: Record<ProjectIcon, readonly string[]> = {
  bank: ['...##...', '..####..', '.######.', '........', '.#.##.#.', '.#.##.#.', '.#.##.#.', '########'],
  api: ['.##..##.', '.#....#.', '.#....#.', '#..oo..#', '.#....#.', '.#....#.', '.##..##.', '........'],
  controller: ['........', '.######.', '##.###o#', '#...#o.#', '##.###o#', '########', '##....##', '........'],
  chat: ['.######.', '#......#', '#.o.o.o#', '#......#', '.######.', '..#.....', '.#......', '........'],
  cube: ['...##...', '.######.', '#..##..#', '#oo##..#', '#oo##..#', '#oo##..#', '.#o##.#.', '...##...'],
};

interface PixelIconProps {
  icon: ProjectIcon;
  /** Rendered size in px (multiple of 8 keeps pixels crisp). */
  size?: number;
  color?: string;
  accent?: string;
  className?: string;
}

export function PixelIcon({ icon, size = 32, color = 'currentColor', accent = '#e76f51', className }: PixelIconProps) {
  const rows = ICONS[icon];
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={cell === 'o' ? accent : color} />,
        ),
      )}
    </svg>
  );
}
