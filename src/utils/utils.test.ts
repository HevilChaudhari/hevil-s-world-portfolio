import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TestCase } from '@/data/testCases';
import { NOT_APPLICABLE } from '@/types/project';
import { missingProjectFields } from './contentStatus';
import { formatDate, formatDateRange } from './formatDate';
import { computePixelZoom } from './pixelZoom';
import { countByStatus, groupBy } from './testStats';

/** In-memory Web Storage for code that persists settings. */
function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
}

describe('computePixelZoom', () => {
  it('uses the largest whole-number zoom that fits', () => {
    expect(computePixelZoom(1280, 800, 480, 270)).toBe(2);
    expect(computePixelZoom(1920, 1080, 480, 270)).toBe(4);
    expect(computePixelZoom(844, 334, 480, 270)).toBe(1);
  });

  it('falls back to a fractional zoom on screens smaller than the game', () => {
    expect(computePixelZoom(390, 600, 480, 270)).toBeCloseTo(390 / 480);
  });

  it('never returns 0 for an unmeasured container', () => {
    expect(computePixelZoom(0, 0, 480, 270)).toBe(1);
  });
});

describe('formatDate', () => {
  it('formats year, month and day precision without time-zone shifts', () => {
    expect(formatDate('2024')).toBe('2024');
    expect(formatDate('2024-03')).toBe('Mar 2024');
    expect(formatDate('2024-03-05')).toBe('5 Mar 2024');
    expect(formatDate('2024-01-01')).toBe('1 Jan 2024');
  });

  it('leaves free text alone', () => {
    expect(formatDate('2021 – 2023')).toBe('2021 – 2023');
  });

  it('formats ranges, including ongoing roles', () => {
    expect(formatDateRange('2023-06', 'present')).toBe('Jun 2023 – Present');
    expect(formatDateRange('2023-06', '2023-12')).toBe('Jun 2023 – Dec 2023');
    expect(formatDateRange('2023-06')).toBe('Jun 2023');
    expect(formatDateRange(undefined, 'present')).toBeUndefined();
  });
});

describe('test statistics', () => {
  const t = (id: string, status: TestCase['status'], projectSlug = 'p'): TestCase => ({ id, projectSlug, scenario: id, steps: [], expected: '', status });

  it('counts every status, including zeros', () => {
    expect(countByStatus([t('a', 'pass'), t('b', 'pass'), t('c', 'fail')])).toEqual({ pass: 2, fail: 1, blocked: 0, 'not-run': 0 });
  });

  it('groups in first-seen order', () => {
    const groups = groupBy([t('a', 'pass', 'x'), t('b', 'pass', 'y'), t('c', 'pass', 'x')], (c) => c.projectSlug);
    expect([...groups.keys()]).toEqual(['x', 'y']);
    expect(groups.get('x')?.map((c) => c.id)).toEqual(['a', 'c']);
  });
});

describe('missingProjectFields', () => {
  it('lists every field of a bare project and treats NOT_APPLICABLE as provided', () => {
    const bare = { slug: 's', title: 'T', category: 'web' as const, icon: 'api' as const };
    const missing = missingProjectFields(bare);
    expect(missing).toContain('Overview');
    expect(missing).toContain('API documentation (or NOT_APPLICABLE)');
    expect(missingProjectFields({ ...bare, api: NOT_APPLICABLE })).not.toContain('API documentation (or NOT_APPLICABLE)');
  });
});

describe('village return point (sessionStorage)', () => {
  beforeEach(() => vi.stubGlobal('sessionStorage', memoryStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it('round-trips a building and door position', async () => {
    const { readReturnPoint, saveReturnPoint } = await import('./villageReturn');
    saveReturnPoint({ building: 'castle', x: 3016 });
    expect(readReturnPoint()).toEqual({ building: 'castle', x: 3016 });
  });

  it('ignores corrupt or invalid values', async () => {
    const { readReturnPoint } = await import('./villageReturn');
    sessionStorage.setItem('hevils-world:village-return', '{not json');
    expect(readReturnPoint()).toBeNull();
    sessionStorage.setItem('hevils-world:village-return', JSON.stringify({ building: 'castle', x: 'far' }));
    expect(readReturnPoint()).toEqual({ building: 'castle', x: undefined });
  });
});

describe('home page mode (localStorage)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('localStorage', memoryStorage());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('defaults to the game and remembers Simple view', async () => {
    const navMode = await import('./navMode');
    expect(navMode.getNavMode()).toBe('game');
    const listener = vi.fn();
    const off = navMode.subscribeNavMode(listener);
    navMode.setNavMode('simple');
    expect(listener).toHaveBeenCalledOnce();
    expect(localStorage.getItem('hevils-world:nav-mode')).toBe('simple');
    off();

    vi.resetModules();
    const reloaded = await import('./navMode');
    expect(reloaded.getNavMode()).toBe('simple');
  });

  it('still works when storage is unavailable', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    });
    const navMode = await import('./navMode');
    expect(navMode.getNavMode()).toBe('game');
    navMode.setNavMode('simple');
    expect(navMode.getNavMode()).toBe('simple');
  });
});
