import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageLayout } from '@/components/layout/PageLayout';

/** Content arrives in Phase 7; until then this page shows a clearly marked placeholder. */
const PLANNED_SECTIONS = [
  'Technical notes and guides',
  'Things learned while building projects',
  'Quick tips and longer deep dives',
] as const;

export default function NotesPage() {
  return (
    <PageLayout pageId="notes">
      <ComingSoon sections={PLANNED_SECTIONS} />
    </PageLayout>
  );
}
