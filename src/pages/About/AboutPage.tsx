import { Link } from 'react-router-dom';
import { ContentSection } from '@/components/content/ContentSection';
import { ExampleDataToggle } from '@/components/content/ExampleDataToggle';
import { Missing } from '@/components/content/Missing';
import { PageLayout } from '@/components/layout/PageLayout';
import { ImageWithFallback } from '@/components/media/ImageWithFallback';
import { ContactLinks } from '@/components/profile/ContactLinks';
import { SkillGroups } from '@/components/profile/SkillGroups';
import { Timeline } from '@/components/profile/Timeline';
import { ContentChecklist } from '@/components/projects/ContentChecklist';
import { Bullets, Paragraphs } from '@/components/projects/ProjectContent';
import { getPage } from '@/data/pages';
import { getProfile } from '@/data/profile';
import { useExampleContent } from '@/hooks/useExampleContent';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import { missingProfileFields } from '@/utils/contentStatus';

export default function AboutPage() {
  const example = useExampleContent();
  const profile = getProfile(example);
  const { openPage } = useSiteNavigation();

  return (
    <PageLayout pageId="about">
      {import.meta.env.DEV && (
        <>
          <ExampleDataToggle active={example} />
          <ContentChecklist title="About Me" missing={missingProfileFields(profile, 'about')} file="src/data/profile.ts" />
        </>
      )}

      <div className="flex flex-col gap-14">
        {/* Introduction */}
        <section aria-labelledby="intro-title" className="grid items-start gap-6 bg-white p-5 pixel-border sm:p-6 md:grid-cols-[10rem_1fr]">
          {profile.portrait ? (
            <div className="w-40 pixel-border">
              <ImageWithFallback image={profile.portrait} className="aspect-square" withCaption={false} />
            </div>
          ) : (
            <div aria-hidden="true" className="relative flex aspect-square w-32 items-end justify-center overflow-hidden bg-gradient-to-b from-sky to-[#cfe8f0] pixel-border md:w-40">
              <span className="absolute inset-x-0 bottom-0 h-1/4 pixel-grass" />
              <span className="relative mb-[18%] font-pixel text-6xl font-bold text-soil-dark">{profile.name.charAt(0)}</span>
            </div>
          )}
          <div className="flex min-w-0 flex-col gap-3">
            <h2 id="intro-title" className="font-pixel text-2xl font-bold sm:text-3xl">
              Hi, I&apos;m {profile.name}
            </h2>
            {profile.headline ? <p className="text-lg text-grass-dark">{profile.headline}</p> : <p className="italic text-soil/70">Headline to be added.</p>}
            {profile.introduction?.length ? (
              <Paragraphs items={profile.introduction} />
            ) : (
              <Missing what="Introduction" hint="A few sentences in your own voice, in src/data/profile.ts (introduction)." />
            )}
          </div>
        </section>

        <ContentSection id="journey" title="Professional journey">
          {profile.journey?.length ? (
            <Timeline
              label="Professional journey"
              items={profile.journey.map((step) => ({
                key: `${step.period}-${step.title}`,
                when: step.period,
                content: (
                  <div className="bg-white p-4 pixel-border">
                    <h3 className="font-bold">{step.title}</h3>
                    {step.description && <p className="mt-1 text-soil">{step.description}</p>}
                  </div>
                ),
              }))}
            />
          ) : (
            <Missing what="Professional journey" hint="Milestones with a period and title in src/data/profile.ts (journey)." />
          )}
        </ContentSection>

        <div className="grid gap-14 lg:grid-cols-2">
          <ContentSection id="interests" title="Technical interests">
            {profile.interests?.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {profile.interests.map((interest) => (
                  <li key={interest} className="flex items-center gap-3 bg-white p-3 font-semibold pixel-border">
                    <span aria-hidden="true" className="inline-block h-3 w-3 shrink-0 bg-sunset" />
                    {interest}
                  </li>
                ))}
              </ul>
            ) : (
              <Missing what="Technical interests" />
            )}
          </ContentSection>

          <ContentSection id="learning" title="Currently learning">
            {profile.currentlyLearning?.length ? (
              <ul className="flex flex-col gap-3">
                {profile.currentlyLearning.map((item) => (
                  <li key={item.topic} className="bg-white p-3 pixel-border">
                    <p className="font-bold">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                          {item.topic} ↗<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        item.topic
                      )}
                    </p>
                    {item.note && <p className="text-sm text-soil">{item.note}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <Missing what="What you are learning now" />
            )}
          </ContentSection>
        </div>

        <ContentSection id="skills" title="Skills">
          <SkillGroups groups={profile.skills} />
        </ContentSection>

        <ContentSection id="goals" title="Career goals">
          {profile.careerGoals?.length ? <Bullets items={profile.careerGoals} /> : <Missing what="Career goals" />}
        </ContentSection>

        <ContentSection
          id="contact"
          title="Get in touch"
          aside={
            <Link
              to={getPage('resume').path}
              onClick={(e) => {
                if (!isPlainClick(e)) return;
                e.preventDefault();
                openPage('resume');
              }}
              className="text-sm font-bold text-grass-dark underline underline-offset-2"
            >
              View resume →
            </Link>
          }
        >
          <ContactLinks contact={profile.contact} />
        </ContentSection>
      </div>
    </PageLayout>
  );
}
