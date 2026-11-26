import { describe, expect, it } from 'vitest';
import { PRIMARY_NAV } from '@/app/routes';
import { measureText } from '@/game/assets/pixelFont';
import { BUILDINGS } from './buildings';
import { DIALOGUES, validateDialogues, type Dialogue } from './dialogues';
import { EXAMPLE_EXPERIENCE } from './examples/exampleExperience';
import { EXAMPLE_PROJECT } from './examples/exampleProject';
import { EXAMPLE_TEST_CASES } from './examples/exampleTestCases';
import { EXAMPLE_VLOGS } from './examples/exampleVlogs';
import { EXPERIENCE, validateExperience } from './experience';
import { PAGE_IDS, PAGES } from './pages';
import { PROJECTS, getProject, validateProjects } from './projects';
import { TEST_CASES, validateTestCases } from './testCases';
import { VLOGS, validateVlogs } from './vlogs';

/**
 * Cross-file content integrity: the village, dialogues, menus and pages all
 * reference each other by id, so a typo in one data file must fail here,
 * not as a dead end for a visitor.
 */
const allDialogues = DIALOGUES as Record<string, Dialogue>;

describe('pages and buildings', () => {
  it('every page belongs to a building that lists it', () => {
    for (const id of PAGE_IDS) {
      expect(BUILDINGS[PAGES[id].building].pages, `page '${id}'`).toContain(id);
    }
  });

  it('every page a building lists exists', () => {
    for (const [buildingId, building] of Object.entries(BUILDINGS)) {
      for (const page of building.pages) expect(PAGE_IDS, `building '${buildingId}'`).toContain(page);
    }
  });

  it('page paths are unique, start with / and do not clash with the home route', () => {
    const paths = PAGE_IDS.map((id) => PAGES[id].path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) expect(path).toMatch(/^\/[a-z0-9-]+$/);
  });

  it('the primary navigation only shows pages that are available', () => {
    for (const id of PRIMARY_NAV) expect(PAGES[id].available, id).toBe(true);
  });

  it('signboard text only uses characters the pixel font can draw', () => {
    for (const building of Object.values(BUILDINGS)) {
      for (const line of building.signLines) expect(() => measureText(line), line).not.toThrow();
    }
  });
});

describe('dialogues', () => {
  it('every start node and goto target exists', () => {
    expect(() => validateDialogues(allDialogues)).not.toThrow();
  });

  it('every open-page choice targets an existing page', () => {
    for (const [id, dialogue] of Object.entries(allDialogues)) {
      for (const node of Object.values(dialogue.nodes)) {
        for (const choice of node.choices ?? []) {
          if (choice.action.type === 'open-page') expect(PAGE_IDS, `dialogue '${id}' → '${choice.label}'`).toContain(choice.action.page);
        }
      }
    }
  });

  it('every building has a dialogue', () => {
    for (const building of Object.values(BUILDINGS)) expect(allDialogues[building.dialogue], building.name).toBeDefined();
  });

  it('validation catches a broken goto', () => {
    const broken: Dialogue = { start: 'a', nodes: { a: { text: 'x', choices: [{ label: 'go', action: { type: 'goto', node: 'missing' } }] } } };
    expect(() => validateDialogues({ broken })).toThrow(/missing node 'missing'/);
  });
});

describe('portfolio data', () => {
  it('projects have valid, unique slugs', () => {
    expect(() => validateProjects(PROJECTS)).not.toThrow();
    expect(() => validateProjects([...PROJECTS, PROJECTS[0]])).toThrow(/Duplicate/);
  });

  it('real and example test cases are valid and link to existing projects', () => {
    for (const cases of [TEST_CASES, EXAMPLE_TEST_CASES]) {
      expect(() => validateTestCases(cases)).not.toThrow();
      for (const t of cases) expect(getProject(t.projectSlug), `${t.id} → ${t.projectSlug}`).toBeDefined();
    }
  });

  it('a pass/fail result without an actual result is rejected', () => {
    const claim = { id: 'X-1', projectSlug: EXAMPLE_PROJECT.slug, scenario: 's', steps: ['a'], expected: 'e', status: 'pass' as const };
    expect(() => validateTestCases([claim])).toThrow(/no actual result/);
    expect(() => validateTestCases([{ ...claim, status: 'not-run' }])).not.toThrow();
  });

  it('vlogs and experience entries are valid (real and example)', () => {
    expect(() => validateVlogs([...VLOGS, ...EXAMPLE_VLOGS])).not.toThrow();
    expect(() => validateExperience([...EXPERIENCE, ...EXAMPLE_EXPERIENCE])).not.toThrow();
    expect(() => validateExperience([{ id: 'a', company: 'c', role: 'r', start: 'March 2024' }])).toThrow(/YYYY-MM/);
  });
});
