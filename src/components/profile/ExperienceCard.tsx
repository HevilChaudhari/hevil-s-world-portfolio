import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { projectPath } from '@/app/routes';
import { Missing } from '@/components/content/Missing';
import { TagList } from '@/components/content/TagList';
import { Bullets } from '@/components/projects/ProjectContent';
import { getProject } from '@/data/projects';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import type { ExperienceEntry } from '@/types/experience';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="font-pixel text-xs font-bold uppercase tracking-wider text-soil">{title}</h3>
      {children}
    </div>
  );
}

/** One role on the Experience page: company, title and every detail section. */
export function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  const { openRoute } = useSiteNavigation();
  const meta = [entry.employmentType, entry.location].filter(Boolean).join(' · ');

  return (
    <article className="flex flex-col gap-5 bg-white p-5 pixel-border">
      <header>
        <h2 className="text-xl font-bold leading-snug">{entry.role}</h2>
        <p className="font-semibold text-grass-dark">
          {entry.companyUrl ? (
            <a href={entry.companyUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              {entry.company} ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            entry.company
          )}
        </p>
        {meta && <p className="text-sm text-soil">{meta}</p>}
        {entry.summary ? <p className="mt-3 max-w-3xl">{entry.summary}</p> : null}
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Block title="Responsibilities">
          {entry.responsibilities?.length ? <Bullets items={entry.responsibilities} /> : <Missing what="Responsibilities" />}
        </Block>
        <Block title="Technical contributions">
          {entry.contributions?.length ? <Bullets items={entry.contributions} /> : <Missing what="Technical contributions" />}
        </Block>
        <Block title="Projects">
          {entry.projects?.length ? (
            <ul className="flex flex-col gap-2">
              {entry.projects.map((p) => {
                const linked = p.projectSlug ? getProject(p.projectSlug) : undefined;
                return (
                  <li key={p.name} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 inline-block h-2 w-2 shrink-0 bg-grass" />
                    <span>
                      {linked ? (
                        <Link
                          to={projectPath(linked.slug)}
                          onClick={(e) => {
                            if (!isPlainClick(e)) return;
                            e.preventDefault();
                            openRoute(projectPath(linked.slug), 'projects-workshop');
                          }}
                          className="font-bold underline underline-offset-2"
                        >
                          {p.name}
                        </Link>
                      ) : (
                        <span className="font-bold">{p.name}</span>
                      )}
                      {p.description && <span className="block text-sm text-soil">{p.description}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Missing what="Projects" />
          )}
        </Block>
        <Block title="Achievements">
          {entry.achievements?.length ? <Bullets items={entry.achievements} /> : <Missing what="Achievements" />}
        </Block>
      </div>

      <Block title="Technologies used">
        {entry.technologies?.length ? <TagList items={entry.technologies} label="Technologies used" /> : <Missing what="Technologies used" />}
      </Block>
    </article>
  );
}
