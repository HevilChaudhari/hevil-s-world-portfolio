import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageLayout } from '@/components/layout/PageLayout';

/** Content arrives in Phase 7; until then this page shows a clearly marked placeholder. */
const PLANNED_SECTIONS = [
  'Professional summary',
  'Technical skills',
  'Education and achievements',
  'Resume PDF download',
  'GitHub, LinkedIn and contact information',
] as const;

export default function ResumePage() {
  return (
    <PageLayout pageId="resume">
      <ComingSoon sections={PLANNED_SECTIONS} />
    </PageLayout>
  );
}
