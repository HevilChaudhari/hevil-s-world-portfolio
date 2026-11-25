import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageLayout } from '@/components/layout/PageLayout';

/** Content arrives in Phase 7; until then this page shows a clearly marked placeholder. */
const PLANNED_SECTIONS = [
  'System architecture write-ups for each project',
  'Design decisions and trade-offs',
  'Diagrams of components, data flow and integrations',
  'Technical deep dives from the forge',
] as const;

export default function ArchitecturePage() {
  return (
    <PageLayout pageId="architecture">
      <ComingSoon sections={PLANNED_SECTIONS} />
    </PageLayout>
  );
}
