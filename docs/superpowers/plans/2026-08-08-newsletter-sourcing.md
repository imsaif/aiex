# Newsletter Sourcing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Find out which newsletter sources readers actually click, and add the three first-party feeds that verified live.

**Architecture:** Three pure, unit-tested functions in `src/lib/newsletter/click-attribution.ts` (CSV parsing, URL normalisation, aggregation), consumed by one hand-run CLI script in `scripts/analysis/`. Pure logic lives under `src/` because Jest only collects tests from `src/**/__tests__/**` and `__tests__/**`; a script under `scripts/` cannot be unit tested. Section B is a separate config-only change to `RSS_SOURCES`.

**Tech Stack:** TypeScript, Prisma (generated client at `src/generated/prisma`), Jest with `jest-environment-jsdom`, `npx tsx` for running scripts, `rss-parser` for feed verification.

## Global Constraints

- **No new dependencies.** There is no CSV library in `package.json` and none is to be added; Task 2 writes a small tested parser.
- **Never present per-story click figures as meaningful.** At 285 subscribers a story draws roughly 1 to 3 clicks. Only source-level aggregates are reportable, and every aggregate must be shown next to its appearance count.
- **Only items carrying `sourceName` are attributable.** `sourceName`/`sourceTier` injection began 2026-07-23. Earlier items fall back to `product`, which is Claude's label for the story's *subject*, not its publisher. Never use `product` as a source key.
- **Unjoined rows are reported, never silently dropped.** A high unjoined rate invalidates the output, so it must be visible.
- **Section A adds no automation.** No cron entry, no API route, no dashboard. One script, run by hand.
- **Do not modify** `src/app/api/cron/generate-newsletter/route.ts` selection logic, `buildQABlock`, the product-news floor, or the admin QA strip. Those were settled separately on 2026-08-08. Task 6 touches only the `RSS_SOURCES` array.
- **Run type checks with `npx tsc --noEmit`, never `npm run build`.** A build clobbers `.next/` and breaks a running dev server. Expect pre-existing errors elsewhere in the repo; only assert that no new error names your changed files.
- **Avoid em-dashes** in any prose or printed output; use commas, colons, or parentheses.

---

### Task 1: Verify the Beehiiv export shape (gate, no code)

This task is a human verification step and it gates Tasks 2 through 5. If it fails, stop and report; do not build the script.

**Files:** none.

**Interfaces:**
- Consumes: nothing.
- Produces: a saved CSV at `/tmp/beehiiv-clicks.csv` and a confirmed answer to whether the URLs in it are destination URLs or Beehiiv click-tracking wrappers.

- [ ] **Step 1: Export click data from Beehiiv**

Ask the user to do this, since it needs a dashboard login:

> In Beehiiv, open a published post (any recent AI UX Daily), go to its analytics, and export or copy the per-link click breakdown. Save it as `/tmp/beehiiv-clicks.csv`. If there is an account-level or aggregate "clicks by link" export covering many posts, prefer that.

- [ ] **Step 2: Inspect the first rows**

Run: `head -5 /tmp/beehiiv-clicks.csv`

Record two things: the exact column names, and whether the URL column holds destination URLs (for example `https://www.figma.com/blog/...`) or Beehiiv wrappers (for example `https://link.mail.beehiiv.com/ss/c/...`).

- [ ] **Step 3: Decide whether to proceed**

- **Destination URLs** and a numeric click column: proceed to Task 2.
- **Beehiiv wrapper URLs:** STOP. URL normalisation cannot recover the destination from a wrapper. Report to the user that Section A needs a different join key and that the spec's risk has materialised. Do not build the script.
- **No per-link export available:** STOP and report. The free tier may not expose it.

- [ ] **Step 4: Record the finding in the spec**

Append a short "Export verified" note to `docs/superpowers/specs/2026-08-08-newsletter-sourcing-design.md` under Risks, stating the actual column names and URL form found.

```bash
git add docs/superpowers/specs/2026-08-08-newsletter-sourcing-design.md
git commit -m "docs: record verified Beehiiv export shape"
```

---

### Task 2: CSV parsing and URL normalisation

**Files:**
- Create: `src/lib/newsletter/click-attribution.ts`
- Test: `src/lib/newsletter/__tests__/click-attribution.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `parseCsv(text: string): string[][]` — rows of fields, handles double-quoted fields containing commas and escaped `""`.
  - `normaliseUrl(url: string): string` — canonical join key. Lowercases host, strips a leading `www.`, drops all `utm_*` plus `ref`, `source`, `fbclid`, `gclid` params, drops the fragment, drops a trailing slash on the path. Returns the input unchanged if it does not parse as a URL.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/newsletter/__tests__/click-attribution.test.ts`:

```ts
import { parseCsv, normaliseUrl } from '../click-attribution';

describe('parseCsv', () => {
  it('parses a simple row', () => {
    expect(parseCsv('url,clicks\nhttps://a.com,5')).toEqual([
      ['url', 'clicks'],
      ['https://a.com', '5'],
    ]);
  });

  it('keeps commas inside quoted fields', () => {
    expect(parseCsv('title,clicks\n"Figma, Inc ships",3')).toEqual([
      ['title', 'clicks'],
      ['Figma, Inc ships', '3'],
    ]);
  });

  it('unescapes doubled quotes', () => {
    expect(parseCsv('a\n"say ""hi"""')).toEqual([['a'], ['say "hi"']]);
  });

  it('ignores a trailing newline', () => {
    expect(parseCsv('a,b\n1,2\n')).toEqual([['a', 'b'], ['1', '2']]);
  });

  it('handles CRLF line endings', () => {
    expect(parseCsv('a,b\r\n1,2')).toEqual([['a', 'b'], ['1', '2']]);
  });
});

describe('normaliseUrl', () => {
  it('strips utm params', () => {
    expect(normaliseUrl('https://vercel.com/blog/x?utm_source=tldrdesign')).toBe(
      'https://vercel.com/blog/x',
    );
  });

  it('strips www and lowercases the host', () => {
    expect(normaliseUrl('https://WWW.Figma.com/blog/y')).toBe('https://figma.com/blog/y');
  });

  it('drops a trailing slash and the fragment', () => {
    expect(normaliseUrl('https://a.com/b/#top')).toBe('https://a.com/b');
  });

  it('keeps meaningful query params', () => {
    expect(normaliseUrl('https://a.com/p?id=7&utm_medium=email')).toBe('https://a.com/p?id=7');
  });

  it('returns non-URLs unchanged', () => {
    expect(normaliseUrl('not a url')).toBe('not a url');
  });

  it('treats two forms of the same link as equal', () => {
    const a = normaliseUrl('https://www.nngroup.com/articles/prove/?utm_source=rss');
    const b = normaliseUrl('https://nngroup.com/articles/prove');
    expect(a).toBe(b);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest src/lib/newsletter/__tests__/click-attribution.test.ts`
Expected: FAIL, cannot find module `../click-attribution`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/newsletter/click-attribution.ts`:

```ts
/**
 * Joins Beehiiv per-link click counts to the stories we published, so we can see
 * which SOURCES earn reader attention. Pure functions only: the CLI wrapper lives
 * at scripts/analysis/newsletter-click-attribution.ts.
 *
 * Lives under src/ because Jest only collects tests from src/**\/__tests__/**;
 * logic placed under scripts/ cannot be unit tested.
 */

/** Params that identify a referrer rather than a resource, so two links differing
 *  only by these are the same story. */
const TRACKING_PARAMS = ['ref', 'source', 'fbclid', 'gclid'];

/** Minimal CSV reader. No dependency is added for this on purpose; Beehiiv exports
 *  are small and the only awkward case is a quoted field containing a comma. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Canonical join key for a story link. Both sides of the join must pass through
 *  this, or feed-added utm params will make identical stories look distinct. */
export function normaliseUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  parsed.hash = '';
  parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

  for (const key of Array.from(parsed.searchParams.keys())) {
    if (key.toLowerCase().startsWith('utm_') || TRACKING_PARAMS.includes(key.toLowerCase())) {
      parsed.searchParams.delete(key);
    }
  }

  let out = parsed.toString();
  out = out.replace(/\?$/, '');
  // Drop a trailing slash on the path, but never turn "https://a.com/" into
  // "https://a.com" plus a dangling query.
  out = out.replace(/\/(?=$|\?)/, '');
  return out;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest src/lib/newsletter/__tests__/click-attribution.test.ts`
Expected: PASS, 12 tests.

- [ ] **Step 5: Type check**

Run: `npx tsc --noEmit 2>&1 | grep click-attribution`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/lib/newsletter/click-attribution.ts src/lib/newsletter/__tests__/click-attribution.test.ts
git commit -m "feat(newsletter): CSV parsing and URL normalisation for click attribution"
```

---

### Task 3: Extract attributable stories from drafts

**Files:**
- Modify: `src/lib/newsletter/click-attribution.ts`
- Modify: `src/lib/newsletter/__tests__/click-attribution.test.ts`

**Interfaces:**
- Consumes: `normaliseUrl` from Task 2.
- Produces:
  - `type PublishedStory = { url: string; sourceName: string; sourceTier: string; publishDate: string }`
  - `type DraftRow = { publishDate: Date; structuredData: unknown }`
  - `extractStories(drafts: DraftRow[]): { stories: PublishedStory[]; unattributed: number }` — one entry per selected item that carries a non-empty `sourceName`. Items without `sourceName` are counted in `unattributed`, never guessed at.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/newsletter/__tests__/click-attribution.test.ts`:

```ts
import { extractStories } from '../click-attribution';

const draft = (items: unknown[], date = '2026-08-06') => ({
  publishDate: new Date(`${date}T00:00:00Z`),
  structuredData: { items },
});

describe('extractStories', () => {
  it('extracts items that carry sourceName', () => {
    const { stories, unattributed } = extractStories([
      draft([
        { sourceUrl: 'https://figma.com/blog/a', sourceName: 'Figma', sourceTier: 'design-tool' },
      ]),
    ]);
    expect(unattributed).toBe(0);
    expect(stories).toEqual([
      {
        url: 'https://figma.com/blog/a',
        sourceName: 'Figma',
        sourceTier: 'design-tool',
        publishDate: '2026-08-06',
      },
    ]);
  });

  it('counts items lacking sourceName as unattributed and never uses product', () => {
    const { stories, unattributed } = extractStories([
      draft([{ sourceUrl: 'https://a.com/x', product: 'ChatGPT' }]),
    ]);
    expect(stories).toEqual([]);
    expect(unattributed).toBe(1);
  });

  it('normalises the stored url so it can join', () => {
    const { stories } = extractStories([
      draft([
        {
          sourceUrl: 'https://www.NNgroup.com/articles/p/?utm_source=rss',
          sourceName: 'Nielsen Norman Group',
          sourceTier: 'design-pub',
        },
      ]),
    ]);
    expect(stories[0].url).toBe('https://nngroup.com/articles/p');
  });

  it('defaults a missing tier to unknown rather than dropping the story', () => {
    const { stories } = extractStories([
      draft([{ sourceUrl: 'https://a.com/x', sourceName: 'Sidebar' }]),
    ]);
    expect(stories[0].sourceTier).toBe('unknown');
  });

  it('skips drafts with no structuredData items', () => {
    const { stories, unattributed } = extractStories([
      { publishDate: new Date('2026-08-06T00:00:00Z'), structuredData: null },
    ]);
    expect(stories).toEqual([]);
    expect(unattributed).toBe(0);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest src/lib/newsletter/__tests__/click-attribution.test.ts -t extractStories`
Expected: FAIL, `extractStories` is not a function.

- [ ] **Step 3: Write the implementation**

Append to `src/lib/newsletter/click-attribution.ts`:

```ts
export type PublishedStory = {
  url: string;
  sourceName: string;
  sourceTier: string;
  publishDate: string;
};

export type DraftRow = {
  publishDate: Date;
  structuredData: unknown;
};

type RawItem = {
  sourceUrl?: string;
  sourceName?: string;
  sourceTier?: string;
};

/**
 * One PublishedStory per selected item that carries a real publisher name.
 *
 * `sourceName`/`sourceTier` injection began 2026-07-23. Items published before
 * that carry only `product`, which is Claude's label for the story's SUBJECT (for
 * example "Claude (Anthropic)" on a third-party post about Claude). Using it as a
 * source key would invent publishers, so those items are counted as unattributed
 * instead.
 */
export function extractStories(drafts: DraftRow[]): {
  stories: PublishedStory[];
  unattributed: number;
} {
  const stories: PublishedStory[] = [];
  let unattributed = 0;

  for (const draft of drafts) {
    const sd = draft.structuredData as { items?: RawItem[] } | null | undefined;
    if (!sd?.items || !Array.isArray(sd.items)) continue;

    for (const item of sd.items) {
      if (!item.sourceUrl) continue;
      if (!item.sourceName) {
        unattributed += 1;
        continue;
      }
      stories.push({
        url: normaliseUrl(item.sourceUrl),
        sourceName: item.sourceName,
        sourceTier: item.sourceTier || 'unknown',
        publishDate: draft.publishDate.toISOString().slice(0, 10),
      });
    }
  }

  return { stories, unattributed };
}
```

Then fix the stray comment: the date in the docblock must read `2026-07-23` only, with no correction text. Rewrite that line as:

```ts
 * `sourceName`/`sourceTier` injection began 2026-07-23.
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest src/lib/newsletter/__tests__/click-attribution.test.ts`
Expected: PASS, 17 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/newsletter/click-attribution.ts src/lib/newsletter/__tests__/click-attribution.test.ts
git commit -m "feat(newsletter): extract attributable published stories from drafts"
```

---

### Task 4: Aggregate clicks by source

**Files:**
- Modify: `src/lib/newsletter/click-attribution.ts`
- Modify: `src/lib/newsletter/__tests__/click-attribution.test.ts`

**Interfaces:**
- Consumes: `PublishedStory` from Task 3.
- Produces:
  - `type SourceRow = { sourceName: string; sourceTier: string; appearances: number; clicks: number; clicksPerAppearance: number }`
  - `aggregateBySource(stories: PublishedStory[], clicksByUrl: Map<string, number>): { rows: SourceRow[]; joined: number; unjoined: PublishedStory[] }` — rows sorted by `clicksPerAppearance` descending, then by `appearances` descending as a tie-break. A story with no entry in `clicksByUrl` contributes an appearance and 0 clicks, and is also listed in `unjoined`.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/newsletter/__tests__/click-attribution.test.ts`:

```ts
import { aggregateBySource } from '../click-attribution';

const story = (url: string, sourceName: string, sourceTier = 'design-pub') => ({
  url,
  sourceName,
  sourceTier,
  publishDate: '2026-08-06',
});

describe('aggregateBySource', () => {
  it('sums clicks per source and counts appearances', () => {
    const { rows } = aggregateBySource(
      [story('https://a.com/1', 'Figma'), story('https://a.com/2', 'Figma')],
      new Map([
        ['https://a.com/1', 4],
        ['https://a.com/2', 6],
      ]),
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ sourceName: 'Figma', appearances: 2, clicks: 10 });
    expect(rows[0].clicksPerAppearance).toBe(5);
  });

  it('ranks by clicks per appearance, not raw clicks', () => {
    const { rows } = aggregateBySource(
      [
        story('https://a.com/1', 'Busy'),
        story('https://a.com/2', 'Busy'),
        story('https://a.com/3', 'Busy'),
        story('https://b.com/1', 'Sharp'),
      ],
      new Map([
        ['https://a.com/1', 2],
        ['https://a.com/2', 2],
        ['https://a.com/3', 2],
        ['https://b.com/1', 5],
      ]),
    );
    expect(rows.map((r) => r.sourceName)).toEqual(['Sharp', 'Busy']);
  });

  it('counts an unjoined story as an appearance with zero clicks and reports it', () => {
    const { rows, joined, unjoined } = aggregateBySource(
      [story('https://a.com/1', 'Figma')],
      new Map(),
    );
    expect(joined).toBe(0);
    expect(unjoined).toHaveLength(1);
    expect(rows[0]).toMatchObject({ appearances: 1, clicks: 0 });
  });

  it('breaks ties on appearances so better-evidenced sources rank higher', () => {
    const { rows } = aggregateBySource(
      [
        story('https://a.com/1', 'Solid'),
        story('https://a.com/2', 'Solid'),
        story('https://b.com/1', 'Thin'),
      ],
      new Map([
        ['https://a.com/1', 3],
        ['https://a.com/2', 3],
        ['https://b.com/1', 3],
      ]),
    );
    expect(rows.map((r) => r.sourceName)).toEqual(['Solid', 'Thin']);
  });

  it('returns an empty result for no stories', () => {
    expect(aggregateBySource([], new Map())).toEqual({ rows: [], joined: 0, unjoined: [] });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest src/lib/newsletter/__tests__/click-attribution.test.ts -t aggregateBySource`
Expected: FAIL, `aggregateBySource` is not a function.

- [ ] **Step 3: Write the implementation**

Append to `src/lib/newsletter/click-attribution.ts`:

```ts
export type SourceRow = {
  sourceName: string;
  sourceTier: string;
  appearances: number;
  clicks: number;
  clicksPerAppearance: number;
};

/**
 * Ranks sources by clicks per appearance rather than raw clicks, so a source with
 * 10 appearances is not automatically ahead of one with 2. `appearances` is
 * returned alongside so weak evidence stays visible: at 285 subscribers a single
 * story draws roughly 1 to 3 clicks, and a one-appearance source proves nothing.
 */
export function aggregateBySource(
  stories: PublishedStory[],
  clicksByUrl: Map<string, number>,
): { rows: SourceRow[]; joined: number; unjoined: PublishedStory[] } {
  const acc = new Map<string, SourceRow>();
  const unjoined: PublishedStory[] = [];
  let joined = 0;

  for (const s of stories) {
    const clicks = clicksByUrl.get(s.url);
    if (clicks === undefined) {
      unjoined.push(s);
    } else {
      joined += 1;
    }

    const row = acc.get(s.sourceName) || {
      sourceName: s.sourceName,
      sourceTier: s.sourceTier,
      appearances: 0,
      clicks: 0,
      clicksPerAppearance: 0,
    };
    row.appearances += 1;
    row.clicks += clicks ?? 0;
    acc.set(s.sourceName, row);
  }

  const rows = Array.from(acc.values());
  for (const row of rows) {
    row.clicksPerAppearance = row.appearances === 0 ? 0 : row.clicks / row.appearances;
  }
  rows.sort(
    (a, b) => b.clicksPerAppearance - a.clicksPerAppearance || b.appearances - a.appearances,
  );

  return { rows, joined, unjoined };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest src/lib/newsletter/__tests__/click-attribution.test.ts`
Expected: PASS, 22 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/newsletter/click-attribution.ts src/lib/newsletter/__tests__/click-attribution.test.ts
git commit -m "feat(newsletter): aggregate clicks by source with appearance-normalised ranking"
```

---

### Task 5: The CLI script

**Files:**
- Create: `scripts/analysis/newsletter-click-attribution.ts`

**Interfaces:**
- Consumes: `parseCsv`, `normaliseUrl`, `extractStories`, `aggregateBySource` from Tasks 2 to 4.
- Produces: a printed report. No exports, no return value consumed by anything.

- [ ] **Step 1: Write the script**

Create `scripts/analysis/newsletter-click-attribution.ts`:

```ts
/**
 * Which newsletter SOURCES earn reader clicks?
 *
 * Joins a Beehiiv per-link click export to the stories we actually published
 * (from NewsletterDraft.structuredData) and ranks sources by clicks per
 * appearance.
 *
 * Run: npx tsx scripts/analysis/newsletter-click-attribution.ts /tmp/beehiiv-clicks.csv
 *
 * Reads the PROD database via .env.local, but performs no writes.
 *
 * Interpretation: at 285 subscribers a single story draws roughly 1 to 3 clicks,
 * so per-story numbers are noise. Only the source-level ranking is meaningful,
 * and only for sources with several appearances.
 */
import 'dotenv/config';
import { readFileSync } from 'fs';
import { PrismaClient } from '../../src/generated/prisma';
import {
  parseCsv,
  normaliseUrl,
  extractStories,
  aggregateBySource,
} from '../../src/lib/newsletter/click-attribution';

const prisma = new PrismaClient();

/** Finds the URL and click columns by header name, so a Beehiiv column rename
 *  fails loudly here instead of silently producing zeros. */
function findColumns(header: string[]): { urlIdx: number; clicksIdx: number } {
  const lower = header.map((h) => h.trim().toLowerCase());
  const urlIdx = lower.findIndex((h) => h.includes('url') || h.includes('link'));
  const clicksIdx = lower.findIndex((h) => h.includes('click'));
  if (urlIdx === -1 || clicksIdx === -1) {
    throw new Error(
      `Could not find a url column and a clicks column in the CSV header: ${header.join(', ')}`,
    );
  }
  return { urlIdx, clicksIdx };
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: npx tsx scripts/analysis/newsletter-click-attribution.ts <clicks.csv>');
    process.exit(1);
  }

  const rows = parseCsv(readFileSync(csvPath, 'utf8')).filter((r) => r.some((f) => f !== ''));
  if (rows.length < 2) throw new Error('CSV has no data rows');

  const { urlIdx, clicksIdx } = findColumns(rows[0]);
  const clicksByUrl = new Map<string, number>();
  for (const row of rows.slice(1)) {
    const url = normaliseUrl((row[urlIdx] || '').trim());
    const clicks = parseInt((row[clicksIdx] || '0').replace(/[^0-9-]/g, ''), 10);
    if (!url || Number.isNaN(clicks)) continue;
    clicksByUrl.set(url, (clicksByUrl.get(url) || 0) + clicks);
  }

  const drafts = await prisma.newsletterDraft.findMany({
    where: { type: 'daily', status: 'published' },
    orderBy: { publishDate: 'desc' },
    select: { publishDate: true, structuredData: true },
  });

  const { stories, unattributed } = extractStories(drafts);
  const { rows: sourceRows, joined, unjoined } = aggregateBySource(stories, clicksByUrl);

  console.log(`\nCSV links: ${clicksByUrl.size}`);
  console.log(`Published dailies: ${drafts.length}`);
  console.log(`Attributable stories: ${stories.length}`);
  console.log(`Unattributed (pre-2026-07-23, no sourceName): ${unattributed}`);
  console.log(
    `Joined to a click row: ${joined}/${stories.length}` +
      (stories.length ? ` (${Math.round((100 * joined) / stories.length)}%)` : ''),
  );

  if (stories.length > 0 && joined / stories.length < 0.5) {
    console.log(
      '\nWARNING: fewer than half the stories joined. Treat the ranking below as unreliable ' +
        'and check whether Beehiiv is reporting wrapped tracking URLs rather than destinations.',
    );
  }

  console.log('\n--- sources by clicks per appearance ---');
  console.log('appearances  clicks  per-appearance  tier             source');
  for (const r of sourceRows) {
    console.log(
      `${String(r.appearances).padStart(11)}  ${String(r.clicks).padStart(6)}  ` +
        `${r.clicksPerAppearance.toFixed(2).padStart(14)}  ${r.sourceTier.padEnd(15)}  ${r.sourceName}`,
    );
  }

  console.log('\nNOTE: sources with 1 or 2 appearances are noise at this list size. Read the top');
  console.log('of this table only where appearances are in the high single digits or more.');

  if (unjoined.length > 0) {
    console.log(`\n--- ${unjoined.length} stories with no matching click row (first 10) ---`);
    for (const s of unjoined.slice(0, 10)) console.log(`  ${s.publishDate}  ${s.url}`);
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit 2>&1 | grep newsletter-click-attribution`
Expected: no output.

- [ ] **Step 3: Run it against the real export**

Run: `npx tsx scripts/analysis/newsletter-click-attribution.ts /tmp/beehiiv-clicks.csv`

Expected: the counts block, then a ranked table. Confirm the join rate is printed and that the unattributed count is non-zero (there are published dailies from before 2026-07-23).

- [ ] **Step 4: Sanity check one row by hand**

Pick the top source in the table. Verify its `appearances` count against the database directly, so a join bug cannot pass unnoticed.

Write `/tmp/check-appearances.ts`. Note `tsx` does NOT support top-level await, so the `async function main()` wrapper is required, matching the convention in `scripts/analysis/audit-sample-iphash.ts`:

```ts
import 'dotenv/config';
import { PrismaClient } from '../Users/imranmohammed/aiex/src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const target = process.argv[2];
  const rows = await prisma.newsletterDraft.findMany({
    where: { type: 'daily', status: 'published' },
    select: { structuredData: true },
  });
  let n = 0;
  for (const r of rows) {
    const items = (r.structuredData as { items?: { sourceName?: string }[] } | null)?.items ?? [];
    for (const i of items) if (i.sourceName === target) n += 1;
  }
  console.log(target, n);
  await prisma.$disconnect();
}

main();
```

The relative import above is brittle from `/tmp`. Put the file at `scripts/analysis/tmp-check-appearances.ts` instead, import from `../../src/generated/prisma`, run it, then delete it:

```bash
npx tsx scripts/analysis/tmp-check-appearances.ts '<top source name>'
rm scripts/analysis/tmp-check-appearances.ts
```

The number must match the table's `appearances` for that source.

- [ ] **Step 5: Commit**

```bash
git add scripts/analysis/newsletter-click-attribution.ts
git commit -m "feat(newsletter): hand-run click attribution report by source"
```

---

### Task 6: Add the three verified feeds (Section B)

Independent of Tasks 1 to 5. Can be done first if Task 1 blocks.

**Files:**
- Modify: `src/app/api/cron/generate-newsletter/route.ts` (the `RSS_SOURCES` array only)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Re-verify the three feeds are still live**

Feeds rot silently, so do not add one on the strength of a check from a previous day.

Write `scripts/analysis/tmp-feed-check.ts` (not `/tmp`, so the `rss-parser` import resolves; `tsx` has no top-level await, hence the `main()` wrapper):

```ts
import Parser from 'rss-parser';

const CANDIDATES: [string, string][] = [
  ['Apple Newsroom', 'https://www.apple.com/newsroom/rss-feed.rss'],
  ['Simon Willison', 'https://simonwillison.net/atom/everything/'],
  ['Interconnects', 'https://www.interconnects.ai/feed'],
];

async function main() {
  const parser = new Parser({ timeout: 8000 });
  for (const [name, url] of CANDIDATES) {
    try {
      const feed = await parser.parseURL(url);
      const host = new URL(feed.items[0]?.link || url).hostname;
      console.log(`OK   ${name} — ${feed.items.length} items, articleHost=${host}`);
    } catch (err) {
      console.log(`DEAD ${name} — ${(err as Error).message}`);
    }
  }
}

main();
```

```bash
npx tsx scripts/analysis/tmp-feed-check.ts
rm scripts/analysis/tmp-feed-check.ts
```

Expected: three OK lines. If any is DEAD, skip that feed and note it in the spec. Record each `articleHost`, because Step 3 needs it for Interconnects.

- [ ] **Step 2: Add the sources**

In `src/app/api/cron/generate-newsletter/route.ts`, add one entry to `RSS_SOURCES` in each tier's existing block, matching the surrounding style:

```ts
  // ai-lab block:
  { name: 'Apple Newsroom', url: 'https://www.apple.com/newsroom/rss-feed.rss', color: '#000000', tier: 'ai-lab' }, // added Aug 8 2026 — Apple had no feed, so iOS 27 AI features only ever reached us via TLDR Design. `ai-lab` is deliberate: it makes Apple launches count toward the product-news floor. Feed also carries retail/finance items; the relevance threshold is expected to drop those, verify after a week.

  // designer-voice block:
  { name: 'Simon Willison', url: 'https://simonwillison.net/atom/everything/', color: '#ff6600', tier: 'designer-voice' }, // added Aug 8 2026 — near-daily AI tooling coverage. `designer-voice` is already capped at 1/day by MAX_ITEMS_PER_SOURCE_BY_TIER, so no extra cap is needed.

  // curator block:
  { name: 'Interconnects', url: 'https://www.interconnects.ai/feed', color: '#7c3aed', tier: 'curator' }, // added Aug 8 2026 — substantive AI analysis, closest in kind to Latent Space. Substack on a custom domain: exempt from the /p/ ghosthost opinion rule automatically via SUBSCRIBED_FEED_HOSTS.
```

- [ ] **Step 3: Verify the opinion filter does not strip the two Substack-backed feeds**

`isOpinionUrl` blocks custom-domain Substack `/p/` paths unless the host is in `SUBSCRIBED_FEED_HOSTS`, which is derived from `RSS_SOURCES`. Adding the feeds should exempt them, but the curator tier has been silently killed by this exact rule twice before, so prove it rather than assume it.

Add a case to the existing deterministic URL test file `src/lib/__tests__/newsletter-sources.test.ts` only if that file already exercises `isOpinionUrl`. Check first:

Run: `grep -c isOpinionUrl src/lib/__tests__/newsletter-sources.test.ts`

- If the count is 0, `isOpinionUrl` is not reachable from tests (it is private to `route.ts`, and Next.js rejects arbitrary exports from a `route.ts`). In that case verify by inspection instead: confirm `https://www.interconnects.ai/feed` yields hostname `interconnects.ai` after the `www.` strip in `SUBSCRIBED_FEED_HOSTS`, and confirm article links from that feed use that same host. Record the finding in the commit message.
- If the count is above 0, add cases asserting `interconnects.ai/p/...` and `simonwillison.net/...` are not treated as opinion.

- [ ] **Step 4: Type check**

Run: `npx tsc --noEmit 2>&1 | grep generate-newsletter`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cron/generate-newsletter/route.ts
git commit -m "feat(newsletter): add Apple Newsroom, Simon Willison and Interconnects feeds"
```

- [ ] **Step 6: Record in the incident log**

Add a row to `.claude/rules/newsletter-and-infra.md` noting the three additions, the 8 candidates verified dead (Adobe, Google Design, Airbnb Design, Spotify Design, Miro, Canva, Every, Anthropic), and that most company design blogs have no usable feed or are Medium hosted, so feed-widening has a low ceiling.

```bash
git add .claude/rules/newsletter-and-infra.md
git commit -m "docs(newsletter): record feed additions and the dead candidates"
```

---

### Task 7: Confirm the Google News resolution cut did not starve the search feeds

Independent of all other tasks. Do this on the first run after 2026-08-09.

**Files:**
- Modify: `src/app/api/cron/generate-newsletter/route.ts:1348-1352` only if a rollback is needed.

**Interfaces:** none.

- [ ] **Step 1: Read the newest daily's QA block**

Write `scripts/analysis/tmp-read-qa.ts` (`tsx` has no top-level await, hence the `main()` wrapper):

```ts
import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const row = await prisma.newsletterDraft.findFirst({
    where: { type: 'daily' },
    orderBy: { publishDate: 'desc' },
  });
  if (!row) {
    console.log('no daily drafts found');
  } else {
    const qa = (row.structuredData as { qa?: unknown } | null)?.qa;
    console.log(row.publishDate.toISOString().slice(0, 10), row.status);
    console.log(JSON.stringify(qa, null, 1));
  }
  await prisma.$disconnect();
}

main();
```

```bash
npx tsx scripts/analysis/tmp-read-qa.ts
rm scripts/analysis/tmp-read-qa.ts
```

- [ ] **Step 2: Compare against the pre-cut baselines**

The 10 Google-News search sources are Claude AI, Cursor, Perplexity, Notion, Linear, Windsurf, Arc, Loom, Mobbin, Raycast. They produce only redirect links, and unresolved links are dropped, so the cut lands on them.

Baselines to compare against: `poolSize` was 38 on 2026-08-07 and 51 on 2026-08-08, and `duplicateSourceClipped` on 08-08 included Claude AI, Perplexity and Cursor, proving those sources were reaching the pool before the cut.

- [ ] **Step 3: Roll back if starved**

If `poolSize` has dropped well below the high 30s, or if none of the 10 search sources appear in `duplicateSourceClipped` or `sourceCounts` across two consecutive runs, restore the old values in `resolvePoolGoogleNewsLinks`:

```ts
  { budgetMs = 12000, maxResolve = 12, concurrency = 3 }: { budgetMs?: number; maxResolve?: number; concurrency?: number } = {},
```

This gives back the retry headroom bought on 2026-08-08, so if it is rolled back, the retry skip floor of 20000 will begin firing `skipped_budget` instead of running. That is the accepted trade: a thin pool is worse than a skipped retry. Note it in the commit message.

```bash
git add src/app/api/cron/generate-newsletter/route.ts
git commit -m "revert(newsletter): restore Google News resolve budget, pool was starved"
```

- [ ] **Step 4: Record the outcome either way**

Append the result to the 2026-08-08 retry row in `.claude/rules/newsletter-and-infra.md`: either "verified not starved, poolSize N on DATE" or the rollback and why.

```bash
git add .claude/rules/newsletter-and-infra.md
git commit -m "docs(newsletter): record Google News resolve budget outcome"
```
