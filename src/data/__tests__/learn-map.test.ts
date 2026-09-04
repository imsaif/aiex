import fs from 'fs';
import path from 'path';
import { guides } from '@/data/guides';
import { learnMap } from '@/data/learn-map';
import { resolveLearnItem } from '@/lib/learn-map';

/**
 * The Learn Map stores references, not content, so a renamed or deleted piece of
 * content shows up here as a red test rather than as a card linking to a 404.
 *
 * The resolver itself throws on an unresolvable reference — that is the real gate,
 * since /guides is statically generated and the build fails with the slug named.
 * These assertions exist so the failure arrives in seconds instead of at build.
 */
describe('learn map', () => {
  const allItems = learnMap.flatMap((section) => section.items);

  it('resolves every reference to real content', () => {
    for (const item of allItems) {
      expect(() => resolveLearnItem(item)).not.toThrow();
    }
  });

  it('never links to the same page twice', () => {
    const hrefs = allItems.map((item) => resolveLearnItem(item).href);
    const duplicates = hrefs.filter((href, i) => hrefs.indexOf(href) !== i);
    expect(duplicates).toEqual([]);
  });

  it('points every resource at a route that exists on disk', () => {
    for (const item of allItems) {
      if (item.kind !== 'resource') continue;
      const routeDir = path.join(process.cwd(), 'src/app', item.href);
      expect(fs.existsSync(path.join(routeDir, 'page.tsx'))).toBe(true);
    }
  });

  it('gives every section a unique id and at least one item', () => {
    const ids = learnMap.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const section of learnMap) {
      expect(section.items.length).toBeGreaterThan(0);
      expect(section.more.href.startsWith('/')).toBe(true);
    }
  });

  /**
   * The map is an editorial recommendation. Featuring a course that is still
   * marked work-in-progress sends people at unfinished content.
   */
  it('only features courses that are ready', () => {
    const notReady = allItems
      .filter((item) => item.kind === 'course')
      .map((item) => guides.find((g) => g.slug === (item as { slug: string }).slug))
      .filter((guide) => guide && guide.status !== 'ready')
      .map((guide) => guide!.slug);

    expect(notReady).toEqual([]);
  });
});
