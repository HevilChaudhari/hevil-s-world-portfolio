import { Link } from 'react-router-dom';
import { ContentSection } from '@/components/content/ContentSection';
import { ExampleDataToggle } from '@/components/content/ExampleDataToggle';
import { Missing } from '@/components/content/Missing';
import { PageLayout } from '@/components/layout/PageLayout';
import { ContactLinks } from '@/components/profile/ContactLinks';
import { ResumeDownload } from '@/components/profile/ResumeDownload';
import { SkillGroups } from '@/components/profile/SkillGroups';
import { ContentChecklist } from '@/components/projects/ContentChecklist';
import { Paragraphs } from '@/components/projects/ProjectContent';
import { getExperience } from '@/data/experience';
import { getPage } from '@/data/pages';
import { getProfile } from '@/data/profile';
import { useExampleContent } from '@/hooks/useExampleContent';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import { missingProfileFields } from '@/utils/contentStatus';
import { formatDate, formatDateRange } from '@/utils/formatDate';

export default function ResumePage() {
  const example = useExampleContent();
  const profile = getProfile(example);
  const experience = getExperience(example);
  const { openPage } = useSiteNavigation();

  const experienceLink = (
    <Link
      to={getPage('experience').path}
      onClick={(e) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        openPage('experience');
      }}
      className="text-sm font-bold text-grass-dark underline underline-offset-2"
    >
      Full experience →
    </Link>
  );

  return (
    <PageLayout pageId="resume">
      {import.meta.env.DEV && (
        <>
          <ExampleDataToggle active={example} />
          <ContentChecklist title="Resume" missing={missingProfileFields(profile, 'resume')} file="src/data/profile.ts" />
        </>
      )}

      <div className="mb-10 flex flex-col gap-3 bg-white p-5 pixel-border sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-bold">{profile.name}</p>
          {profile.headline ? <p className="text-soil">{profile.headline}</p> : <p className="italic text-soil/70">Headline to be added.</p>}
        </div>
        <ResumeDownload path={profile.resumePdf} />
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_19rem]">
        <div className="flex min-w-0 flex-col gap-12">
          <ContentSection id="summary" title="Professional summary">
            {profile.summary?.length ? <Paragraphs items={profile.summary} /> : <Missing what="Professional summary" hint="Two or three sentences in src/data/profile.ts (summary)." />}
          </ContentSection>

          <ContentSection id="experience" title="Work experience" aside={experience.length > 0 ? experienceLink : undefined}>
            {experience.length > 0 ? (
              <ol className="flex flex-col gap-4">
                {experience.map((e) => (
                  <li key={e.id} className="bg-white p-4 pixel-border">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="font-bold">
                        {e.role} <span className="font-normal text-soil">at</span> {e.company}
                      </h3>
                      <p className="font-pixel text-xs font-bold text-grass-dark">{formatDateRange(e.start, e.end) ?? 'Dates to be added'}</p>
                    </div>
                    {e.summary && <p className="mt-1 text-sm">{e.summary}</p>}
                    {!e.summary && e.responsibilities?.length ? (
                      <ul className="mt-1 list-inside list-disc text-sm">
                        {e.responsibilities.slice(0, 3).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <Missing what="Work experience" hint="Add roles in src/data/experience.ts; they appear here and on the Experience page." />
            )}
          </ContentSection>

          <ContentSection id="education" title="Education">
            {profile.education?.length ? (
              <ul className="flex flex-col gap-4">
                {profile.education.map((ed) => (
                  <li key={`${ed.institution}-${ed.qualification}`} className="bg-white p-4 pixel-border">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="font-bold">{ed.qualification}</h3>
                      {ed.period && <p className="font-pixel text-xs font-bold text-grass-dark">{ed.period}</p>}
                    </div>
                    <p className="text-soil">
                      {ed.institution}
                      {ed.location && ` · ${ed.location}`}
                    </p>
                    {ed.details?.length ? (
                      <ul className="mt-2 list-inside list-disc text-sm">
                        {ed.details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <Missing what="Education" hint="Institution, qualification and period in src/data/profile.ts (education)." />
            )}
          </ContentSection>

          <ContentSection id="achievements" title="Achievements">
            {profile.achievements?.length ? (
              <ul className="flex flex-col gap-3">
                {profile.achievements.map((a) => (
                  <li key={a.title} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 inline-block h-2 w-2 shrink-0 bg-wheat outline-2 outline-soil-dark" />
                    <span>
                      <span className="font-bold">
                        {a.link ? (
                          <a href={a.link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                            {a.title} ↗<span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        ) : (
                          a.title
                        )}
                      </span>
                      {a.date && <span className="text-sm text-soil"> · {formatDate(a.date)}</span>}
                      {a.description && <span className="block text-sm">{a.description}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Missing what="Achievements" hint="Real achievements only, in src/data/profile.ts (achievements)." />
            )}
          </ContentSection>
        </div>

        <aside className="flex flex-col gap-12" aria-label="Contact and skills">
          <ContentSection id="contact" title="Contact & links">
            <ContactLinks contact={profile.contact} compact />
          </ContentSection>
          <ContentSection id="skills" title="Technical skills">
            <SkillGroups groups={profile.skills} compact />
          </ContentSection>
        </aside>
      </div>
    </PageLayout>
  );
}
