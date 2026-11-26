import { Missing } from '@/components/content/Missing';
import { TagList } from '@/components/content/TagList';
import type { SkillGroup } from '@/types/profile';

interface SkillGroupsProps {
  groups?: readonly SkillGroup[];
  /** Single column (for narrow sidebars). */
  compact?: boolean;
}

/** Skills grouped by area. Shared by About and Resume. */
export function SkillGroups({ groups, compact = false }: SkillGroupsProps) {
  if (!groups?.length) {
    return <Missing what="Technical skills" hint="Add skill groups in src/data/profile.ts (skills), e.g. Languages, Testing, Tools." />;
  }
  return (
    <ul className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
      {groups.map((group) => (
        <li key={group.name} className="flex flex-col gap-2 bg-white p-4 pixel-border">
          <h3 className="font-bold">{group.name}</h3>
          <TagList items={group.skills} label={group.name} />
        </li>
      ))}
    </ul>
  );
}
