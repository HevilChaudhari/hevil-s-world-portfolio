import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageLayout } from '@/components/layout/PageLayout';

/** Content arrives in Phase 7; until then this page shows a clearly marked placeholder. */
const PLANNED_SECTIONS = [
  'Company, job title and employment dates',
  'Responsibilities and technical contributions',
  'Projects and achievements',
  'Technologies used',
] as const;

export default function ExperiencePage() {
  return (
    <PageLayout pageId="experience">
      <ComingSoon sections={PLANNED_SECTIONS} />
    </PageLayout>
  );
}
