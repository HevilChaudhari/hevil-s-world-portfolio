import type { Ref } from 'react';
import { Link } from 'react-router-dom';
import { projectPath } from '@/app/routes';
import { Missing } from '@/components/content/Missing';
import { VideoEmbed } from '@/components/media/VideoEmbed';
import { getProject } from '@/data/projects';
import { VLOG_CATEGORIES } from '@/data/vlogs';
import { isPlainClick, useSiteNavigation } from '@/hooks/useSiteNavigation';
import type { Vlog } from '@/types/vlog';
import { formatDate } from '@/utils/formatDate';

interface VlogPlayerProps {
  vlog: Vlog;
  /** The title, focused when a new video is picked from the gallery. */
  headingRef?: Ref<HTMLHeadingElement>;
}

/** Featured player with the selected video's details. */
export function VlogPlayer({ vlog, headingRef }: VlogPlayerProps) {
  const { openRoute } = useSiteNavigation();
  const project = vlog.projectSlug ? getProject(vlog.projectSlug) : undefined;

  return (
    <section aria-labelledby="now-playing-title" className="grid gap-6 bg-white p-4 pixel-border lg:grid-cols-[3fr_2fr]">
      {vlog.youtubeId || vlog.src ? (
        // key: a new video starts in its click-to-play state
        <VideoEmbed
          key={vlog.id}
          video={{ kind: 'video', title: vlog.title, youtubeId: vlog.youtubeId, src: vlog.src, poster: vlog.thumbnail?.src }}
        />
      ) : (
        // Keep the 16:9 frame so the layout matches a real video.
        <div className="flex aspect-video items-center justify-center bg-parchment p-4">
          <Missing what={`Video link for "${vlog.title}"`} hint="Set youtubeId or src in src/data/vlogs.ts." />
        </div>
      )}
      <div className="flex flex-col gap-3">
        <p className="font-pixel text-xs font-bold uppercase tracking-wider text-sunset">Now playing</p>
        <h2 id="now-playing-title" ref={headingRef} tabIndex={-1} className="scroll-mt-20 text-2xl font-bold leading-snug outline-none">
          {vlog.title}
        </h2>
        <p className="text-sm text-soil">
          {VLOG_CATEGORIES[vlog.category].label}
          {vlog.publishedOn && (
            <>
              {' · '}
              <time dateTime={vlog.publishedOn}>{formatDate(vlog.publishedOn)}</time>
            </>
          )}
          {vlog.duration && ` · ${vlog.duration}`}
        </p>
        {vlog.description ? <p className="leading-relaxed">{vlog.description}</p> : <p className="italic text-soil/80">Description to be added.</p>}
        {project && (
          <Link
            to={projectPath(project.slug)}
            onClick={(e) => {
              if (!isPlainClick(e)) return;
              e.preventDefault();
              openRoute(projectPath(project.slug), 'projects-workshop');
            }}
            className="mt-auto self-start font-bold text-grass-dark underline underline-offset-2"
          >
            Related project: {project.title} →
          </Link>
        )}
      </div>
    </section>
  );
}
