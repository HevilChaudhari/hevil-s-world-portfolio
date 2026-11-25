import type { Project } from '@/types/project';

/** Labels of the content fields still missing (undefined) for a project. */
export function missingProjectFields(p: Project): string[] {
  const checks: [string, unknown][] = [
    ['Card tagline', p.tagline],
    ['Period (year)', p.period],
    ['Thumbnail image', p.thumbnail],
    ['Overview', p.overview],
    ['Problem statement', p.problem],
    ['Objectives', p.objectives],
    ['Technologies', p.technologies],
    ['Architecture diagram', p.architecture?.diagram],
    ['Architecture description', p.architecture?.description],
    ['Main features', p.features],
    ['Implementation details', p.implementation],
    ['API documentation (or NOT_APPLICABLE)', p.api],
    ['Screenshots / videos', p.media],
    ['Challenges & solutions', p.challenges],
    ['Learnings', p.learnings],
    ['GitHub link (or NOT_APPLICABLE)', p.links?.github],
    ['Live demo link (or NOT_APPLICABLE)', p.links?.demo],
  ];
  return checks.filter(([, value]) => value === undefined || (Array.isArray(value) && value.length === 0)).map(([label]) => label);
}
