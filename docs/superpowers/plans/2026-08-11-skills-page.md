# /skills Free Skills Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A public `/skills` page where anyone can browse all pattern skills and install any of them with one copied command.

**Architecture:** Thin server page (`src/app/skills/page.tsx`) derives serializable rows from the pattern registry and passes them to one client component (`SkillsDirectory`) that handles filtering and copy. All logic lives in two small pure helpers in `src/lib/skills/` (deep-module rule: simple tested interfaces, page stays presentation-only). Spec: `docs/superpowers/specs/2026-08-11-skills-page-design.md`.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind v4 tokens, Jest + React Testing Library.

## Global Constraints

- Token contract (design-system rule): never raw colors/z-index/radii/shadows; use `bg-surface-*`, `text-text-*`, `rounded-card`, `shadow-card`, `.type-*` classes. `text-text-tertiary` is forbidden for readable text.
- No `framer-motion` anywhere on this page; no opacity/transform entrance animation on the H1 (perf incident table).
- Hero/H1 rendered by the server page, not inside the client component (LCP rule).
- All `<img>`/`<Image>` logos get explicit `width` and `height` attributes.
- No em-dashes in any user-facing copy.
- `export const revalidate = 3600` on the page (ISR rule).
- Tests are Jest + RTL, colocated under `__tests__/`. Run a single file with `npx jest <path> --silent`.
- Commits run husky hooks (`brand:check`, design audit); fix violations rather than bypassing.
- Existing exports used throughout: `patterns` (named) from `@/data/patterns`; `categories` (default) from `@/data/categories`; `SITE` from `@/lib/handoff/composeHandoff`; `skillName` from `@/lib/skills/composeSkill`; `companyLogos` from `@/data/company-logos`; `window.clarity` is typed globally (declared in `src/lib/audit/analytics.ts`).

---

### Task 1: Ubiquitous-language glossary

**Files:**
- Create: `.claude/rules/ubiquitous-language.md`

**Interfaces:**
- Consumes: nothing
- Produces: the terms later tasks must use in copy and identifiers (Skill, Pattern, Pack, Directory)

- [ ] **Step 1: Write the glossary**

```markdown
# Ubiquitous Language

One term, one meaning, everywhere: code identifiers, UI copy, docs, and AI sessions. When a word below is the right concept, use exactly this word.

| Term | Means | Is NOT |
|------|-------|--------|
| Pattern | One of the AI UX design patterns in the registry (`src/data/patterns/`), presented at `/patterns/<slug>` | A skill, a guide |
| Skill | The generated Claude Code `SKILL.md` for one pattern, named `aiux-<slug>`, served at `/skills/aiux-<slug>.md` | The pattern itself, the pack |
| Trigger line | The skill's frontmatter `description`; symptom-first; authored per pattern as `content.skillDescription` | Marketing copy |
| Pack | A user-curated set of saved skills downloaded together (installer markdown or zip) from the dashboard | The full library; the /skills directory |
| Installer | The single markdown file (`aiux-skills.md`) that instructs Claude to create each skill file | A shell script |
| Audit fixes | The one-shot task file (`aiux-audit-fixes.md`) generated from a user's audits; worked through once, then deleted | A skill |
| Save | Adding a pattern's skill to the visitor's pack (browser state) | Installing |
| Install | Getting a skill onto the visitor's machine under `.claude/skills/` | Saving to the pack |
| Directory | The public `/skills` page listing every skill with a copy-install command | The dashboard, the pack |
| Course | A guide at `/guides` (nav label says Courses) | A pattern page |

Naming rule for code: helpers that produce install commands or Used-by data live in `src/lib/skills/` and use these terms (`skillInstallCommand`, not `copyCmd`; `exampleProducts`, not `logos`).
```

- [ ] **Step 2: Commit**

```bash
git add .claude/rules/ubiquitous-language.md
git commit -m "docs: ubiquitous-language glossary for pattern/skill/pack terms"
```

---

### Task 2: `skillInstallCommand()` helper

**Files:**
- Create: `src/lib/skills/installCommand.ts`
- Test: `src/lib/skills/__tests__/installCommand.test.ts`

**Interfaces:**
- Consumes: `skillName(pattern)` from `./composeSkill`, `SITE` from `@/lib/handoff/composeHandoff`
- Produces: `skillInstallCommand(pattern: Pattern): string` used by Task 5's page

- [ ] **Step 1: Write the failing test**

```ts
import { patterns } from '@/data/patterns';
import { skillInstallCommand } from '../installCommand';

const hitl = patterns.find((p) => p.slug === 'human-in-the-loop')!;

describe('skillInstallCommand', () => {
  it('produces the exact one-line install command', () => {
    expect(skillInstallCommand(hitl)).toBe(
      'mkdir -p .claude/skills/aiux-human-in-the-loop && curl -fsSL https://aiuxdesign.guide/skills/aiux-human-in-the-loop.md -o .claude/skills/aiux-human-in-the-loop/SKILL.md'
    );
  });

  it('produces a well-formed command for every pattern in the registry', () => {
    const shape =
      /^mkdir -p \.claude\/skills\/aiux-[a-z0-9-]+ && curl -fsSL https:\/\/aiuxdesign\.guide\/skills\/aiux-[a-z0-9-]+\.md -o \.claude\/skills\/aiux-[a-z0-9-]+\/SKILL\.md$/;
    for (const pattern of patterns) {
      expect(skillInstallCommand(pattern)).toMatch(shape);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/skills/__tests__/installCommand.test.ts --silent`
Expected: FAIL, cannot find module `../installCommand`

- [ ] **Step 3: Write the implementation**

```ts
import type { Pattern } from '@/types';
import { SITE } from '@/lib/handoff/composeHandoff';
import { skillName } from './composeSkill';

/**
 * The one-line command the /skills directory puts on the clipboard.
 * Targets the raw skill route (`/skills/aiux-<slug>.md`), which is the
 * machine-readable source of truth for a skill.
 */
export function skillInstallCommand(pattern: Pattern): string {
  const name = skillName(pattern);
  const dir = `.claude/skills/${name}`;
  return `mkdir -p ${dir} && curl -fsSL ${SITE}/skills/${name}.md -o ${dir}/SKILL.md`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/lib/skills/__tests__/installCommand.test.ts --silent`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/skills/installCommand.ts src/lib/skills/__tests__/installCommand.test.ts
git commit -m "feat(skills): skillInstallCommand helper for the /skills directory"
```

Note: `__tests__/` is currently gitignored repo-wide; `git add` will warn or skip the test file. Add it with `git add -f` so the test travels with the feature. Do the same in Tasks 3 and 4.

---

### Task 3: `exampleProducts()` Used-by helper

**Files:**
- Create: `src/lib/skills/usedBy.ts`
- Test: `src/lib/skills/__tests__/usedBy.test.ts`

**Interfaces:**
- Consumes: `companyLogos` from `@/data/company-logos` (array of `{ name: string; logo: string }`)
- Produces: `exampleProducts(pattern: Pattern, limit?: number): UsedByProduct[]` where `UsedByProduct = { name: string; logo?: string }`; used by Task 5's page

- [ ] **Step 1: Write the failing test**

```ts
import { patterns } from '@/data/patterns';
import { exampleProducts } from '../usedBy';

const hitl = patterns.find((p) => p.slug === 'human-in-the-loop')!;

describe('exampleProducts', () => {
  it('matches known companies from example titles and attaches their logo', () => {
    const products = exampleProducts(hitl);
    const grammarly = products.find((p) => p.name === 'Grammarly');
    expect(grammarly).toBeDefined();
    expect(grammarly!.logo).toBe('/images/logos/simple-icons/grammarly.svg');
  });

  it('falls back to the example title as a text-only product when no logo matches', () => {
    const fake = {
      ...hitl,
      content: {
        ...hitl.content,
        examples: [{ title: 'Obscure Tool Nobody Logos', description: '', image: '', altText: '' }],
      },
    };
    expect(exampleProducts(fake)).toEqual([{ name: 'Obscure Tool Nobody Logos' }]);
  });

  it('dedupes and caps at the limit, and never throws for any registry pattern', () => {
    for (const pattern of patterns) {
      const products = exampleProducts(pattern, 4);
      expect(products.length).toBeLessThanOrEqual(4);
      const names = products.map((p) => p.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/skills/__tests__/usedBy.test.ts --silent`
Expected: FAIL, cannot find module `../usedBy`

- [ ] **Step 3: Write the implementation**

```ts
import type { Pattern } from '@/types';
import { companyLogos } from '@/data/company-logos';

export interface UsedByProduct {
  name: string;
  logo?: string;
}

/**
 * Derives the "Used by" products for a pattern from its real-world examples.
 * A known company name appearing in an example title gets its self-hosted
 * logo; anything else degrades to a text-only name. Must never throw: the
 * directory renders one row per pattern regardless of example data quality.
 */
export function exampleProducts(pattern: Pattern, limit = 4): UsedByProduct[] {
  const examples = pattern.content.examples ?? [];
  const seen = new Set<string>();
  const products: UsedByProduct[] = [];
  for (const example of examples) {
    const title = (example.title ?? '').trim();
    if (!title) continue;
    const match = companyLogos.find((company) =>
      title.toLowerCase().includes(company.name.toLowerCase())
    );
    const name = match ? match.name : title;
    if (seen.has(name)) continue;
    seen.add(name);
    products.push(match ? { name, logo: match.logo } : { name });
    if (products.length >= limit) break;
  }
  return products;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/lib/skills/__tests__/usedBy.test.ts --silent`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/skills/usedBy.ts
git add -f src/lib/skills/__tests__/usedBy.test.ts
git commit -m "feat(skills): exampleProducts helper derives Used-by cell from pattern examples"
```

---

### Task 4: `SkillsDirectory` client component

**Files:**
- Create: `src/components/skills/SkillsDirectory.tsx`
- Test: `src/components/skills/__tests__/SkillsDirectory.test.tsx`

**Interfaces:**
- Consumes: the serializable row shape it defines and exports:
  `SkillRow = { slug: string; skillName: string; title: string; category: string; trigger: string; products: { name: string; logo?: string }[]; command: string }`
- Produces: `<SkillsDirectory rows={SkillRow[]} categories={string[]} />` used by Task 5's page

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsDirectory, type SkillRow } from '../SkillsDirectory';

const rows: SkillRow[] = [
  {
    slug: 'human-in-the-loop',
    skillName: 'aiux-human-in-the-loop',
    title: 'Human-in-the-Loop',
    category: 'Human-AI Collaboration',
    trigger: 'Use when AI output needs human review.',
    products: [{ name: 'Grammarly', logo: '/images/logos/simple-icons/grammarly.svg' }],
    command: 'mkdir -p .claude/skills/aiux-human-in-the-loop && curl ...',
  },
  {
    slug: 'progressive-disclosure',
    skillName: 'aiux-progressive-disclosure',
    title: 'Progressive Disclosure',
    category: 'User Experience',
    trigger: 'Use when a UI shows too much at once.',
    products: [{ name: 'Obscure Tool' }],
    command: 'mkdir -p .claude/skills/aiux-progressive-disclosure && curl ...',
  },
];

function renderDirectory() {
  return render(
    <SkillsDirectory rows={rows} categories={['Human-AI Collaboration', 'User Experience']} />
  );
}

describe('SkillsDirectory', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
    window.clarity = jest.fn();
  });

  it('renders one row per skill with name, trigger, and Used-by', () => {
    renderDirectory();
    expect(screen.getByText('aiux-human-in-the-loop')).toBeInTheDocument();
    expect(screen.getByText('Use when a UI shows too much at once.')).toBeInTheDocument();
    expect(screen.getByText('Obscure Tool')).toBeInTheDocument();
  });

  it('filters rows by category chip', () => {
    renderDirectory();
    fireEvent.click(screen.getByRole('button', { name: 'User Experience' }));
    expect(screen.queryByText('aiux-human-in-the-loop')).not.toBeInTheDocument();
    expect(screen.getByText('aiux-progressive-disclosure')).toBeInTheDocument();
  });

  it('copies the install command and fires the clarity event', async () => {
    renderDirectory();
    fireEvent.click(screen.getAllByRole('button', { name: /copy install/i })[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(rows[0].command);
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
    expect(window.clarity).toHaveBeenCalledWith('event', 'skill-copy');
  });

  it('reveals the command for manual copy when clipboard write fails', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('denied'));
    renderDirectory();
    fireEvent.click(screen.getAllByRole('button', { name: /copy install/i })[0]);
    expect(await screen.findByText(rows[0].command)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/components/skills/__tests__/SkillsDirectory.test.tsx --silent`
Expected: FAIL, cannot find module `../SkillsDirectory`

- [ ] **Step 3: Write the component**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface SkillRow {
  slug: string;
  skillName: string;
  title: string;
  category: string;
  trigger: string;
  products: { name: string; logo?: string }[];
  command: string;
}

interface SkillsDirectoryProps {
  rows: SkillRow[];
  categories: string[];
}

export function SkillsDirectory({ rows, categories }: SkillsDirectoryProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [failedSlug, setFailedSlug] = useState<string | null>(null);

  const visible = activeCategory ? rows.filter((r) => r.category === activeCategory) : rows;

  async function copyCommand(row: SkillRow) {
    try {
      await navigator.clipboard.writeText(row.command);
      setCopiedSlug(row.slug);
      setFailedSlug(null);
      window.clarity?.('event', 'skill-copy');
      window.clarity?.('set', 'skill-copy-slug', row.skillName);
    } catch {
      setFailedSlug(row.slug);
      setCopiedSlug(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-tight" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`rounded-pill border px-snug py-tight text-sm ${
            activeCategory === null
              ? 'border-accent-primary text-text-primary'
              : 'border-border-default text-text-secondary'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-pill border px-snug py-tight text-sm ${
              activeCategory === category
                ? 'border-accent-primary text-text-primary'
                : 'border-border-default text-text-secondary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <ol className="mt-loose divide-y divide-border-default">
        {visible.map((row, index) => (
          <li key={row.slug} className="flex flex-wrap items-start gap-default py-default">
            <span className="type-caption w-6 shrink-0 text-text-secondary">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <Link href={`/patterns/${row.slug}`} className="font-medium text-text-primary hover:underline">
                {row.skillName}
              </Link>
              <span className="ml-snug rounded-pill border border-border-default px-tight text-sm text-text-secondary">
                {row.category}
              </span>
              <p className="mt-tight text-sm text-text-secondary" title={row.trigger}>
                {row.trigger}
              </p>
              {failedSlug === row.slug && (
                <pre className="mt-tight overflow-x-auto rounded-input bg-surface-secondary p-snug text-sm text-text-primary">
                  {row.command}
                </pre>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-tight" aria-label={`Products using ${row.title}`}>
              {row.products.map((product) =>
                product.logo ? (
                  <Image
                    key={product.name}
                    src={product.logo}
                    alt={product.name}
                    title={product.name}
                    width={20}
                    height={20}
                  />
                ) : (
                  <span key={product.name} className="text-sm text-text-secondary">
                    {product.name}
                  </span>
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => copyCommand(row)}
              className="shrink-0 rounded-input border border-border-default px-snug py-tight text-sm text-text-primary hover:bg-surface-secondary"
            >
              {copiedSlug === row.slug ? 'Copied' : 'Copy install'}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/components/skills/__tests__/SkillsDirectory.test.tsx --silent`
Expected: PASS (4 tests). If a token class used above does not exist in `tailwind.config.mjs` (check `border-border-default`, `bg-surface-secondary`, `rounded-pill`, spacing aliases), swap to the nearest existing token rather than adding arbitrary values.

- [ ] **Step 5: Commit**

```bash
git add src/components/skills/SkillsDirectory.tsx
git add -f src/components/skills/__tests__/SkillsDirectory.test.tsx
git commit -m "feat(skills): SkillsDirectory client component with category filter and copy install"
```

---

### Task 5: `/skills` server page with SEO

**Files:**
- Create: `src/app/skills/page.tsx`

**Interfaces:**
- Consumes: `patterns`, `categories`, `SITE`, `skillName`, `skillInstallCommand` (Task 2), `exampleProducts` (Task 3), `SkillsDirectory` + `SkillRow` (Task 4), `skillTrigger` behavior via `pattern.content.skillDescription`
- Produces: the public page at `/skills`

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from 'next';
import { patterns } from '@/data/patterns';
import categories from '@/data/categories';
import { SITE } from '@/lib/handoff/composeHandoff';
import { skillName } from '@/lib/skills/composeSkill';
import { skillInstallCommand } from '@/lib/skills/installCommand';
import { exampleProducts } from '@/lib/skills/usedBy';
import { SkillsDirectory, type SkillRow } from '@/components/skills/SkillsDirectory';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free Claude Code Skills for AI UX Design',
  description:
    'Install free Claude Code skills, one per AI UX pattern. Copy one command and your coding agent gains that pattern\'s design judgment: when it applies and the moves that make it real.',
  alternates: { canonical: `${SITE}/skills` },
};

const GENERIC_COMMAND =
  'mkdir -p .claude/skills/aiux-<pattern> && curl -fsSL https://aiuxdesign.guide/skills/aiux-<pattern>.md -o .claude/skills/aiux-<pattern>/SKILL.md';

export default function SkillsPage() {
  const categoryNames = categories.map((c) => c.name);
  const rows: SkillRow[] = [...patterns]
    .sort(
      (a, b) =>
        categoryNames.indexOf(a.category) - categoryNames.indexOf(b.category) ||
        a.title.localeCompare(b.title)
    )
    .map((pattern) => ({
      slug: pattern.slug,
      skillName: skillName(pattern),
      title: pattern.title,
      category: pattern.category,
      trigger: pattern.content.skillDescription ?? pattern.description,
      products: exampleProducts(pattern),
      command: skillInstallCommand(pattern),
    }));

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Claude Code skills for AI UX patterns',
    numberOfItems: rows.length,
    itemListElement: rows.map((row, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: row.skillName,
      url: `${SITE}/patterns/${row.slug}`,
    })),
  };

  return (
    <main className="mx-auto max-w-5xl px-default py-roomy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <h1 className="type-h1 text-text-primary">
        {rows.length} free Claude Code skills, one per AI UX pattern
      </h1>
      <p className="mt-snug max-w-2xl text-text-secondary">
        A skill is persistent design guidance for your coding agent. Install one and it triggers on
        its own whenever the work matches: no prompting, no reminders. Copy a command, paste it in
        your terminal at your repo root, done.
      </p>
      <pre className="mt-default overflow-x-auto rounded-input bg-surface-secondary p-snug text-sm text-text-primary">
        {GENERIC_COMMAND}
      </pre>

      <div className="mt-roomy">
        <SkillsDirectory rows={rows} categories={categoryNames} />
      </div>

      <footer className="mt-roomy border-t border-border-default pt-loose text-sm text-text-secondary">
        <p>
          Want several at once? Save patterns as you browse and download them as one pack from your{' '}
          <Link href="/dashboard" className="text-text-primary hover:underline">
            dashboard
          </Link>
          . Not sure which patterns your product needs?{' '}
          <Link href="/audit" className="text-text-primary hover:underline">
            Run the free audit
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Verify it renders**

Run: `npx tsc --noEmit 2>&1 | grep "src/app/skills"` (expect no output), then `npm run dev` is assumed running in the main checkout; in this worktree verify by test-rendering via the existing jest setup only if a page test is added. Minimum bar: type-check clean plus visual check in the browser during final verification (Task 7).

- [ ] **Step 3: Commit**

```bash
git add src/app/skills/page.tsx
git commit -m "feat(skills): public /skills directory page with ItemList structured data"
```

---

### Task 6: Nav entry and sitemap

**Files:**
- Modify: `src/components/layout/Navbar.tsx:95-113` (insert Skills link between Patterns and Courses; add icon import)
- Modify: `src/app/sitemap.ts` (add `/skills` to `staticPages`)

**Interfaces:**
- Consumes: `getLinkClasses` (existing in Navbar), heroicons outline set (existing import block at line ~13)
- Produces: nav + sitemap visibility for `/skills`

- [ ] **Step 1: Add `CommandLineIcon` to the existing heroicons import** (the `from '@heroicons/react/24/outline'` block ending line 13)

- [ ] **Step 2: Insert the Skills link after the Patterns link (after line 103), matching the exact structure of its neighbors**

```tsx
            <Link href="/skills" className={getLinkClasses('/skills')}>
              <CommandLineIcon className="w-5 h-5" />
              <span className="hidden sm:inline relative">
                Skills
                <span className="invisible font-semibold block h-0" aria-hidden="true">
                  Skills
                </span>
              </span>
            </Link>
```

- [ ] **Step 3: Add the sitemap entry** inside the `staticPages` array in `src/app/sitemap.ts`, after the homepage entry:

```ts
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
```

- [ ] **Step 4: Check the mobile menu.** Search `Navbar.tsx` for a second nav list (mobile drawer). If one exists, add the same Skills link there in the same position; if navigation is a single responsive list (the `hidden sm:inline` pattern above suggests it is), no extra change.

- [ ] **Step 5: Type-check and commit**

Run: `npx tsc --noEmit 2>&1 | grep -E "Navbar|sitemap"` (expect no output)

```bash
git add src/components/layout/Navbar.tsx src/app/sitemap.ts
git commit -m "feat(skills): Skills nav entry and sitemap route"
```

---

### Task 7: Full verification

**Files:** none new

- [ ] **Step 1: Run the full skills-related test suite**

Run: `npx jest src/lib/skills src/components/skills --silent`
Expected: all suites PASS (existing 26 + new ~9)

- [ ] **Step 2: Type-check the repo**

Run: `npx tsc --noEmit 2>&1 | grep -E "src/(app/skills|components/skills|lib/skills)/" | grep -v __tests__`
Expected: no output (repo has pre-existing unrelated errors; the grep scopes to this feature)

- [ ] **Step 3: Production build in the worktree**

The worktree needs two gitignored artifacts first:

```bash
cp /Users/imranmohammed/aiex/jest.setup.js .
cp -r /Users/imranmohammed/aiex/.env .env 2>/dev/null; cp /Users/imranmohammed/aiex/.env.local .env.local
npx prisma generate
npm run build > build.log 2>&1; echo "build exit: $?"
```

Expected: `build exit: 0` and `/skills` listed in the route table (`grep "skills" build.log`). Never run `npm run build` in the main checkout while the dev server is up.

- [ ] **Step 4: Visual smoke test**

Run `npm run dev` inside the worktree on a spare port (`PORT=3001 npm run dev`) and check `http://localhost:3001/skills`: hero renders server-side, chips filter, Copy install shows "Copied", logos render at 20x20 with text fallbacks.

- [ ] **Step 5: Final commit and report**

```bash
git add -A
git status --porcelain   # confirm only intended files; do NOT commit build.log, .env*, jest.setup.js
git commit -m "chore(skills): verification artifacts for /skills directory" --allow-empty
```

Report: tests passing, build green, screenshots or notes from the smoke test. Merging to master and pushing happens only after the user reviews.

---

## Follow-ups (captured, explicitly not in this plan)

1. **Pattern candidates from the Pocock talk:** (a) AI-led clarifying interview (grill-me mechanic: interrogate until shared understanding before acting; upstream of Intent Preview and Plan Summary); (b) Shared vocabulary (ubiquitous language between user and AI, visible and editable; adjacent to Selective Memory).
2. **Designer adaptations of those skills** (likely for dwc, not aiex): design-grill (relentless brief interview) and design-system ubiquitous language. Note dwc already has briefing-claude and design-critic.
3. **Approach B:** publish the 38 skills to a public GitHub repo and list on skills.sh (`npx skills add`), pointing back at aiuxdesign.guide.
4. **Un-gitignore unit tests + CI job** (talk lesson 3; discussed 2026-08-11, awaiting user decision).
