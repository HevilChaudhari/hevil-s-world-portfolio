import { ComingSoon } from '@/components/layout/ComingSoon';
import { PageLayout } from '@/components/layout/PageLayout';

/** Content arrives in Phase 7; until then this page shows a clearly marked placeholder. */
const PLANNED_SECTIONS = [
  'Video gallery with thumbnails',
  'Title, description, category and publication date',
  'Embedded YouTube (or other) players',
  'Development journey and behind-the-scenes videos',
] as const;

export default function VlogsPage() {
  return (
    <PageLayout pageId="vlogs">
      <ComingSoon sections={PLANNED_SECTIONS} />
    </PageLayout>
  );
}
