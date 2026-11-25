import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageLayout } from '@/components/layout/PageLayout';

/** Content arrives in Phase 7; until then this page shows a clearly marked placeholder. */
const PLANNED_SECTIONS = [
  'Introduction and professional journey',
  'Interests and skills',
  'Career goals',
  'What Hevil is currently learning',
  'Contact links',
] as const;

export default function AboutPage() {
  return (
    <PageLayout pageId="about">
      <ComingSoon sections={PLANNED_SECTIONS} />
    </PageLayout>
  );
}
