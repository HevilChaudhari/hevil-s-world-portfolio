import { ExampleDataToggle } from '@/components/content/ExampleDataToggle';
import { Missing } from '@/components/content/Missing';
import { PageLayout } from '@/components/layout/PageLayout';
import { ExperienceCard } from '@/components/profile/ExperienceCard';
import { Timeline } from '@/components/profile/Timeline';
import { getExperience } from '@/data/experience';
import { useExampleContent } from '@/hooks/useExampleContent';
import { formatDateRange } from '@/utils/formatDate';

export default function ExperiencePage() {
  const example = useExampleContent();
  const entries = getExperience(example);

  return (
    <PageLayout pageId="experience">
      {import.meta.env.DEV && <ExampleDataToggle active={example} />}

      {entries.length === 0 ? (
        <Missing
          what="Work experience"
          hint="Add roles to src/data/experience.ts, newest first: company, job title, employment dates, responsibilities, technical contributions, projects, achievements and technologies."
        />
      ) : (
        <Timeline
          label="Work experience, newest first"
          items={entries.map((entry) => ({
            key: entry.id,
            when: formatDateRange(entry.start, entry.end) ?? <span className="text-sunset">Dates to be added</span>,
            content: <ExperienceCard entry={entry} />,
          }))}
        />
      )}
    </PageLayout>
  );
}
