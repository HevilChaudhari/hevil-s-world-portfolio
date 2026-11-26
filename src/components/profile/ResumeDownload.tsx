import { Missing } from '@/components/content/Missing';
import { mediaUrl } from '@/utils/mediaUrl';

/**
 * Resume PDF download. The path is resolved against the site base, so it
 * works at both user.github.io/ and user.github.io/repo/. Until a file is
 * configured, a "To be added" box is shown instead of a broken link.
 */
export function ResumeDownload({ path }: { path?: string }) {
  if (!path) {
    return <Missing what="Resume PDF" hint="Put the file in public/documents/ and set resumePdf: 'documents/resume.pdf' in src/data/profile.ts." />;
  }
  const url = mediaUrl(path);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={url} download className="bg-wheat px-4 py-2 text-sm text-soil-dark pixel-button hover:bg-parchment">
        ↓ Download resume (PDF)
      </a>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-grass-dark underline underline-offset-2">
        Open in a new tab<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
