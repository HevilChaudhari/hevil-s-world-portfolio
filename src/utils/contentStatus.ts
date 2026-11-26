import type { Project } from '@/types/project';
import type { Profile } from '@/types/profile';

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

/** Labels of the profile fields a page needs that are still missing. */
export function missingProfileFields(p: Profile, page: 'about' | 'resume'): string[] {
  const shared: [string, unknown][] = [
    ['Skills', p.skills],
    ['Email (contact.email)', p.contact.email],
    ['GitHub link (contact.github)', p.contact.github],
    ['LinkedIn link (contact.linkedin)', p.contact.linkedin],
  ];
  const specific: [string, unknown][] =
    page === 'about'
      ? [
          ['Headline', p.headline],
          ['Introduction', p.introduction],
          ['Professional journey', p.journey],
          ['Technical interests', p.interests],
          ['Career goals', p.careerGoals],
          ['Currently learning', p.currentlyLearning],
        ]
      : [
          ['Professional summary', p.summary],
          ['Education', p.education],
          ['Achievements', p.achievements],
          ['Resume PDF (resumePdf)', p.resumePdf],
        ];
  return [...specific, ...shared].filter(([, value]) => value === undefined || (Array.isArray(value) && value.length === 0)).map(([label]) => label);
}
