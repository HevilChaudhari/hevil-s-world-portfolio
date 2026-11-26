import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { projectPath } from '@/app/routes';
import { ContentSection } from '@/components/content/ContentSection';
import { ExampleDataToggle } from '@/components/content/ExampleDataToggle';
import { Missing } from '@/components/content/Missing';
import { PageLayout } from '@/components/layout/PageLayout';
import { SuiteOverview, type SuiteRow } from '@/components/tests/SuiteOverview';
import { TestCaseCard } from '@/components/tests/TestCaseCard';
import { TestFilters, type ProjectOption } from '@/components/tests/TestFilters';
import { PROJECTS, getProject } from '@/data/projects';
import { getTestCases, isTestStatus, type TestStatus } from '@/data/testCases';
import { useExampleContent } from '@/hooks/useExampleContent';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import { DEFAULT_SUITE, countByStatus, groupBy } from '@/utils/testStats';

const projectTitle = (slug: string) => getProject(slug)?.title ?? slug;

export default function TestCasesPage() {
  const example = useExampleContent();
  const cases = getTestCases(example);
  const [params, setParams] = useSearchParams();
  const { openRoute } = useSiteNavigation();

  // Every project is selectable (so "no tests yet" is visible), plus any slug that only appears in test data.
  const projects = useMemo<ProjectOption[]>(() => {
    const slugs = [...new Set([...PROJECTS.map((p) => p.slug), ...cases.map((t) => t.projectSlug)])];
    return slugs.map((slug) => ({ slug, title: projectTitle(slug), count: cases.filter((t) => t.projectSlug === slug).length }));
  }, [cases]);

  // Filters live in the URL so a filtered view can be shared (project pages link to ?project=<slug>).
  const projectParam = params.get('project');
  const project = projects.some((p) => p.slug === projectParam) ? projectParam : null;
  const statusParam = params.get('status');
  const status = isTestStatus(statusParam) ? statusParam : null;

  const inProject = useMemo(() => (project ? cases.filter((t) => t.projectSlug === project) : cases), [cases, project]);
  const visible = useMemo(() => (status ? inProject.filter((t) => t.status === status) : inProject), [inProject, status]);
  const statusCounts = useMemo(() => countByStatus(inProject), [inProject]);

  const suiteRows = useMemo<SuiteRow[]>(
    () =>
      [...groupBy(inProject, (t) => `${t.projectSlug}\u0000${t.suite ?? DEFAULT_SUITE}`)].map(([key, list]) => ({
        key,
        project: projectTitle(list[0].projectSlug),
        suite: list[0].suite ?? DEFAULT_SUITE,
        counts: countByStatus(list),
        total: list.length,
      })),
    [inProject],
  );

  const setParam = (key: string, value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  const byProject = groupBy(visible, (t) => t.projectSlug);
  const selectedTitle = project ? projectTitle(project) : null;

  return (
    <PageLayout pageId="test-cases">
      {import.meta.env.DEV && <ExampleDataToggle active={example} />}

      <p className="mb-8 max-w-3xl text-soil">
        Test suites for each project, with the steps followed and what actually happened. Only results that were really observed are recorded here.
      </p>

      {cases.length === 0 ? (
        <Missing
          what="Test cases"
          hint="Add real test records to src/data/testCases.ts. Each one needs an id, projectSlug, scenario, steps, expected result and status; the actual result and evidence are added once the test has been run."
        />
      ) : (
        <div className="flex flex-col gap-12">
          <TestFilters
            projects={projects}
            project={project}
            status={status}
            statusCounts={statusCounts}
            total={inProject.length}
            onProjectChange={(slug) => setParam('project', slug)}
            onStatusChange={(s: TestStatus | null) => setParam('status', s)}
          />

          <ContentSection id="overview" title={selectedTitle ? `Overview: ${selectedTitle}` : 'Overview'}>
            {inProject.length > 0 ? (
              <SuiteOverview rows={suiteRows} totals={statusCounts} showProject={!project} />
            ) : (
              <Missing what={`Test cases for ${selectedTitle}`} hint="No test records for this project yet." />
            )}
          </ContentSection>

          <ContentSection id="cases" title="Test cases" aside={<span className="text-sm text-soil">{visible.length} shown</span>}>
            <p className="sr-only" aria-live="polite">
              Showing {visible.length} test case{visible.length === 1 ? '' : 's'}
            </p>
            {visible.length === 0 ? (
              inProject.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 bg-white p-4 pixel-border">
                  <span>No test cases match this filter.</span>
                  <button type="button" onClick={() => setParam('status', null)} className="bg-parchment px-3 py-1 text-sm pixel-button hover:bg-wheat">
                    Show all statuses
                  </button>
                </div>
              )
            ) : (
              <div className="flex flex-col gap-10">
                {[...byProject].map(([slug, list]) => {
                  const known = getProject(slug);
                  return (
                    <section key={slug} aria-labelledby={`tests-${slug}`} className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 id={`tests-${slug}`} className="text-lg font-bold">
                          {projectTitle(slug)}
                        </h3>
                        {known && (
                          <Link
                            to={projectPath(slug)}
                            onClick={(e) => {
                              if (!isPlainClick(e)) return;
                              e.preventDefault();
                              openRoute(projectPath(slug), 'projects-workshop');
                            }}
                            className="text-sm font-bold text-grass-dark underline underline-offset-2"
                          >
                            View project →
                          </Link>
                        )}
                      </div>
                      <ul className="flex flex-col gap-4">
                        {list.map((t) => (
                          <li key={t.id}>
                            <TestCaseCard test={t} defaultOpen={visible.length === 1} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            )}
          </ContentSection>
        </div>
      )}
    </PageLayout>
  );
}
