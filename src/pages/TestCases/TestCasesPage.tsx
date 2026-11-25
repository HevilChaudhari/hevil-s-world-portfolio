import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageLayout } from '@/components/layout/PageLayout';

/** Content arrives in Phase 7; until then this page shows a clearly marked placeholder. */
const PLANNED_SECTIONS = [
  'Project selection and a test suite overview',
  'Test case ID, scenario, preconditions and test data',
  'Steps, expected result and actual result',
  'Pass / fail status with screenshots or evidence',
  'Filters by project and by status',
] as const;

export default function TestCasesPage() {
  return (
    <PageLayout pageId="test-cases">
      <ComingSoon sections={PLANNED_SECTIONS} />
    </PageLayout>
  );
}
