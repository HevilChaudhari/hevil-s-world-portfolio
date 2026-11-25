import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectPath } from '@/app/routes';
import { PixelIcon } from '@/components/content/PixelIcon';
import { PageLayout } from '@/components/layout/PageLayout';
import { ImageWithFallback } from '@/components/media/ImageWithFallback';
import { ContentChecklist } from '@/components/projects/ContentChecklist';
import { getPage } from '@/data/pages';
import { CATEGORY_LABELS, PROJECTS, getProject } from '@/data/projects';
import { getTestCasesForProject } from '@/data/testCases';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import { NOT_APPLICABLE } from '@/types/project';
import { missingProjectFields } from '@/utils/contentStatus';
import { ExternalButton } from '@/components/content/ExternalButton';
import { buildProjectSections } from './buildProjectSections';

/** Scroll to a section without touching the URL (the hash belongs to the router). */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  el.focus({ preventScroll: true });
}

export default function ProjectDetailsPage() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  const { openRoute, openPage } = useSiteNavigation();
  const sections = useMemo(() => (project ? buildProjectSections(project, getTestCasesForProject(project.slug)) : []), [project]);

  if (!project) {
    return (
      <PageLayout pageId="projects" detail={{ title: 'Project not found', summary: 'There is no project at this address. It may have been renamed.' }}>
        <Link
          to={getPage('projects').path}
          onClick={(e) => {
            if (!isPlainClick(e)) return;
            e.preventDefault();
            openPage('projects');
          }}
          className="bg-wheat px-4 py-2 text-soil-dark pixel-button hover:bg-parchment"
        >
          See all projects
        </Link>
      </PageLayout>
    );
  }

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prev = PROJECTS[index - 1];
  const next = PROJECTS[index + 1];
  const github = project.links?.github;
  const demo = project.links?.demo;

  return (
    <PageLayout
      pageId="projects"
      detail={{
        title: project.title,
        icon: (
          <span className="hidden bg-night p-2 text-parchment pixel-border sm:block">
            <PixelIcon icon={project.icon} size={40} />
          </span>
        ),
        summary: (
          <>
            <p className="font-pixel text-xs font-bold uppercase tracking-wider text-grass-dark">
              {CATEGORY_LABELS[project.category]}
              {project.period && ` · ${project.period}`}
            </p>
            <p className="mt-1">{project.tagline ?? <span className="italic text-soil">Summary to be added.</span>}</p>
          </>
        ),
        actions: (
          <>
            {github && github !== NOT_APPLICABLE && <ExternalButton href={github} label="GitHub" />}
            {demo && demo !== NOT_APPLICABLE && <ExternalButton href={demo} label="Live demo" />}
          </>
        ),
      }}
    >
      {import.meta.env.DEV && <ContentChecklist title={project.title} missing={missingProjectFields(project)} file="src/data/projects.ts" />}

      {project.thumbnail && (
        <div className="mb-10">
          <ImageWithFallback image={project.thumbnail} className="aspect-video pixel-border" />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[13rem_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-2 font-pixel text-xs font-bold uppercase tracking-wider text-soil">On this page</p>
          <ol className="flex flex-wrap gap-x-4 gap-y-1 text-sm lg:flex-col">
            {sections.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => scrollToSection(s.id)} className="text-left hover:underline">
                  <span className="font-mono text-soil">{String(i + 1).padStart(2, '0')}</span> {s.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex min-w-0 flex-col gap-12">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} tabIndex={-1} aria-labelledby={`${s.id}-title`} className="scroll-mt-20 outline-none">
              <h2 id={`${s.id}-title`} className="mb-4 flex items-baseline gap-3 border-b-4 border-parchment pb-2 text-2xl font-bold">
                <span className="font-pixel text-sm text-grass-dark">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </div>
      </div>

      <nav aria-label="More projects" className="mt-16 grid gap-4 border-t-4 border-parchment pt-6 sm:grid-cols-2">
        {[prev && { project: prev, label: '← Previous project', align: '' }, next && { project: next, label: 'Next project →', align: 'sm:text-right sm:col-start-2' }]
          .filter((x): x is { project: typeof project; label: string; align: string } => Boolean(x))
          .map(({ project: other, label, align }) => (
            <Link
              key={other.slug}
              to={projectPath(other.slug)}
              onClick={(e) => {
                if (!isPlainClick(e)) return;
                e.preventDefault();
                openRoute(projectPath(other.slug), 'projects-workshop');
              }}
              className={`block bg-white p-4 pixel-border hover:bg-parchment ${align}`}
            >
              <span className="block text-sm text-soil">{label}</span>
              <span className="font-bold">{other.title}</span>
            </Link>
          ))}
      </nav>
    </PageLayout>
  );
}
