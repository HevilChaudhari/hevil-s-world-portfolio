import { Link } from 'react-router-dom';
import { projectPath } from '@/app/routes';
import { CATEGORY_LABELS } from '@/data/projects';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import type { Project } from '@/types/project';
import { PixelIcon } from '@/components/content/PixelIcon';
import { ImageWithFallback } from '@/components/media/ImageWithFallback';

/** Card on the Projects listing. The whole card is one link. */
export function ProjectCard({ project }: { project: Project }) {
  const { openRoute } = useSiteNavigation();
  const path = projectPath(project.slug);
  const techs = project.technologies ?? [];

  return (
    <article className="group relative flex h-full flex-col bg-white pixel-border transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {project.thumbnail ? (
        <ImageWithFallback image={project.thumbnail} className="aspect-video" withCaption={false} />
      ) : (
        <div aria-hidden="true" className="blueprint flex aspect-video items-center justify-center text-parchment">
          <PixelIcon icon={project.icon} size={64} />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-pixel text-[11px] font-bold uppercase tracking-wider text-grass-dark">
          {CATEGORY_LABELS[project.category]}
          {project.period && <span className="text-soil"> · {project.period}</span>}
        </p>
        <h2 className="text-lg font-bold leading-snug">
          <Link
            to={path}
            onClick={(e) => {
              if (!isPlainClick(e)) return;
              e.preventDefault();
              openRoute(path, 'projects-workshop');
            }}
            className="after:absolute after:inset-0 focus-visible:outline-none group-focus-within:underline"
          >
            {project.title}
          </Link>
        </h2>
        {project.tagline ? (
          <p className="text-sm text-soil">{project.tagline}</p>
        ) : (
          <p className="text-sm italic text-soil/70">Summary to be added.</p>
        )}
        {techs.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Technologies">
            {techs.slice(0, 5).map((t) => (
              <li key={t.name} className="bg-parchment px-2 py-0.5 text-xs font-semibold">
                {t.name}
              </li>
            ))}
          </ul>
        )}
        <span aria-hidden="true" className="mt-auto pt-2 text-sm font-bold text-grass-dark group-hover:underline">
          View project →
        </span>
      </div>
    </article>
  );
}
