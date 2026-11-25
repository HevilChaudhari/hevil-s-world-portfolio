import { useMemo, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ContentChecklist } from '@/components/projects/ContentChecklist';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Link } from 'react-router-dom';
import { projectPath } from '@/app/routes';
import { CATEGORY_LABELS, EXAMPLE_PROJECT_SLUG, PROJECTS } from '@/data/projects';
import type { ProjectCategory } from '@/types/project';
import { missingProjectFields } from '@/utils/contentStatus';

type Filter = ProjectCategory | 'all';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  // Only offer categories that actually have projects.
  const categories = useMemo(() => [...new Set(PROJECTS.map((p) => p.category))], []);
  const visible = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  const incomplete = import.meta.env.DEV
    ? PROJECTS.map((p) => ({ title: p.title, missing: missingProjectFields(p).length })).filter((p) => p.missing > 0)
    : [];

  return (
    <PageLayout pageId="projects">
      {import.meta.env.DEV && (
        <>
          <ContentChecklist
            title="Content status"
            noun="project"
            missing={incomplete.map((p) => `${p.title}: ${p.missing} fields missing`)}
            file="src/data/projects.ts"
          />
          {EXAMPLE_PROJECT_SLUG && (
            <p className="-mt-4 mb-8 text-sm text-[#3b5f86]">
              Dev only:{' '}
              <Link to={projectPath(EXAMPLE_PROJECT_SLUG)} className="font-bold underline">
                preview a fully filled example project
              </Link>
            </p>
          )}
        </>
      )}

      <div role="group" aria-label="Filter projects by category" className="mb-6 flex flex-wrap gap-2">
        {(['all', ...categories] as Filter[]).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 text-sm pixel-button ${filter === c ? 'bg-wheat' : 'bg-white hover:bg-parchment'}`}
          >
            {c === 'all' ? 'All projects' : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} project{visible.length === 1 ? '' : 's'}
      </p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
