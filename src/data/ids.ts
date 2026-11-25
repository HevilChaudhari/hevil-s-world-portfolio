/**
 * Ids shared across content files. Declared explicitly (not inferred from the
 * data) so pages, buildings and dialogues can reference each other without
 * circular type inference. Adding an id here makes TypeScript require its entry
 * in the matching data file.
 */
export type BuildingId =
  | 'my-home'
  | 'projects-workshop'
  | 'developers-forge'
  | 'testing-lab'
  | 'knowledge-library'
  | 'vlog-house'
  | 'castle';

export type PageId = 'projects' | 'architecture' | 'test-cases' | 'vlogs' | 'notes' | 'about' | 'resume' | 'experience';
