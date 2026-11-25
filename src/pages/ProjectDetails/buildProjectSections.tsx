import type { ReactNode } from 'react';
import type { TestCase } from '@/data/testCases';
import { NOT_APPLICABLE, type Project } from '@/types/project';
import { ExternalButton } from '@/components/content/ExternalButton';
import { Missing } from '@/components/content/Missing';
import { ImageWithFallback } from '@/components/media/ImageWithFallback';
import { VideoEmbed } from '@/components/media/VideoEmbed';
import { ApiDocs } from '@/components/projects/ApiDocs';
import { ArchitectureDiagramView } from '@/components/projects/ArchitectureDiagramView';
import { Bullets, Paragraphs, TestsSummary } from '@/components/projects/ProjectContent';

export interface ProjectSection {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Builds the detail page sections in the order the portfolio spec defines.
 * Missing content renders a "to be added" placeholder; NOT_APPLICABLE hides the section.
 */
export function buildProjectSections(p: Project, tests: readonly TestCase[]): ProjectSection[] {
  const sections: ProjectSection[] = [];
  const add = (id: string, title: string, content: ReactNode) => sections.push({ id, title, content });

  add('overview', 'Overview', p.overview ? <Paragraphs items={p.overview} /> : <Missing what="Overview" hint="Two or three short paragraphs: what the project is and what it does." />);

  add('problem', 'Problem statement', p.problem ? <Paragraphs items={p.problem} /> : <Missing what="Problem statement" hint="What problem does it solve, and for whom?" />);

  add('objectives', 'Objectives', p.objectives ? <Bullets items={p.objectives} /> : <Missing what="Project objectives" />);

  add(
    'technologies',
    'Technologies used',
    p.technologies?.length ? (
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {p.technologies.map((t) => (
          <li key={t.name} className="bg-white p-3 pixel-border">
            <p className="font-bold">{t.name}</p>
            {t.purpose ? <p className="text-sm text-soil">{t.purpose}</p> : <p className="text-sm italic text-soil/70">Purpose to be added.</p>}
          </li>
        ))}
      </ul>
    ) : (
      <Missing what="Technologies used" hint="Name each technology and what it was used for." />
    ),
  );

  add(
    'architecture',
    'Architecture',
    <div className="flex flex-col gap-4">
      {p.architecture?.diagram ? (
        <ArchitectureDiagramView diagram={p.architecture.diagram} />
      ) : (
        <Missing what="Architecture diagram" hint="Either a list of layers and components, or a diagram image." />
      )}
      {p.architecture?.description ? <Paragraphs items={p.architecture.description} /> : <Missing what="Architecture description" />}
    </div>,
  );

  add(
    'features',
    'Main features',
    p.features?.length ? (
      <ul className="grid gap-4 sm:grid-cols-2">
        {p.features.map((f) => (
          <li key={f.title} className="bg-white p-4 pixel-border">
            <h3 className="font-bold">{f.title}</h3>
            <p className="mt-1 text-sm text-soil">{f.description}</p>
          </li>
        ))}
      </ul>
    ) : (
      <Missing what="Main features" />
    ),
  );

  add(
    'implementation',
    'Implementation details',
    p.implementation?.length ? (
      <div className="flex flex-col gap-6">
        {p.implementation.map((item) => (
          <article key={item.title}>
            <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
            <Paragraphs items={item.body} />
            {item.code && (
              <figure className="mt-3">
                <pre className="overflow-x-auto bg-night p-4 text-sm leading-relaxed text-parchment">
                  <code data-language={item.code.language}>{item.code.snippet}</code>
                </pre>
                {item.code.caption && <figcaption className="mt-1 text-sm text-soil">{item.code.caption}</figcaption>}
              </figure>
            )}
          </article>
        ))}
      </div>
    ) : (
      <Missing what="Implementation details" />
    ),
  );

  if (p.api !== NOT_APPLICABLE) {
    add(
      'api',
      'API documentation',
      p.api?.length ? <ApiDocs endpoints={p.api} /> : <Missing what="API documentation" hint="List the endpoints, or set api: NOT_APPLICABLE to hide this section." />,
    );
  }

  add(
    'media',
    'Screenshots & videos',
    p.media?.length ? (
      <ul className="grid gap-6 md:grid-cols-2">
        {p.media.map((m) => (
          <li key={m.kind === 'image' ? m.src : m.title}>{m.kind === 'image' ? <ImageWithFallback image={m} /> : <VideoEmbed video={m} />}</li>
        ))}
      </ul>
    ) : (
      <Missing what="Screenshots and video demonstrations" hint={`Put files in public/assets/projects/${p.slug}/ and list them under media.`} />
    ),
  );

  add('tests', 'Test cases & results', <TestsSummary slug={p.slug} tests={tests} />);

  add(
    'challenges',
    'Challenges & solutions',
    p.challenges?.length ? (
      <ul className="flex flex-col gap-4">
        {p.challenges.map((c) => (
          <li key={c.challenge} className="grid gap-3 bg-white p-4 pixel-border md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sunset">Challenge</p>
              <p className="mt-1">{c.challenge}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-grass-dark">Solution</p>
              <p className="mt-1">{c.solution}</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <Missing what="Challenges and solutions" />
    ),
  );

  add('learnings', 'Learnings', p.learnings?.length ? <Bullets items={p.learnings} /> : <Missing what="Learnings" />);

  const github = p.links?.github;
  const demo = p.links?.demo;
  if (github !== NOT_APPLICABLE || demo !== NOT_APPLICABLE) {
    add(
      'links',
      'Source code & live demo',
      <div className="flex flex-col gap-3">
        {github !== NOT_APPLICABLE &&
          (github ? <ExternalButton href={github} label="View the code on GitHub" /> : <Missing what="GitHub repository link" hint="Or set links.github: NOT_APPLICABLE." />)}
        {demo !== NOT_APPLICABLE &&
          (demo ? <ExternalButton href={demo} label="Open the live demo" /> : <Missing what="Live demo link" hint="Or set links.demo: NOT_APPLICABLE if there is none." />)}
      </div>,
    );
  }

  return sections;
}
