# Pattern Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship every one of the 38 patterns as an installable Claude Code skill, served at a curl-able URL, offered on each pattern page, and exportable from the dashboard as a zipped skill pack.

**Architecture:** A pure composer module (`src/lib/skills/`) turns a `Pattern` into SKILL.md text, mirroring the existing `src/lib/handoff/` composers. A force-static route handler serves one markdown file per pattern. The pattern-page CTA card and the dashboard export both consume that same composer, so there is exactly one definition of what a skill contains. The dashboard zips client-side via a dynamically imported `fflate`.

**Tech Stack:** Next.js 15 App Router (route handlers, `generateStaticParams`), React 19 client components, TypeScript strict, Jest + React Testing Library, `fflate` (new dependency, dynamic import only).

**Source spec:** `docs/superpowers/specs/2026-08-10-pattern-skills-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **`avoid-em-dashes`** in all new user-facing copy. This includes generated SKILL.md text, which users read. Sweep for `—` and `&mdash;` before each commit. (The spec's example fallback trigger line contains an em dash; this plan deliberately uses a period instead. See Task 1.)
- **Design tokens only** in any UI. No raw Tailwind colors, no raw z-index, no arbitrary radii/shadows/spacing under 2rem, no hex. `npm run brand:check` runs pre-commit via husky and blocks violations.
- **Type-check with `npx tsc --noEmit`. Never run `npm run build` while the dev server is up** (it clobbers `.next/` and breaks the running server). The one exception is the explicit bundle-analysis step in Task 4, which must be run with the dev server stopped.
- **Test command:** `npm test` for the suite, `npx jest <path>` for one file.
- **Tests are written and run, but never committed.** `.gitignore` excludes `**/__tests__/`, `**/*.test.*`, and `**/*.spec.*`. Confirmed as intended on 2026-08-11: test files stay local. Write every test the plan specifies and run it, but do not `git add -f` it, and never name a test path in a `git add` command (git errors on an explicitly-named ignored path). Reviewers read test files from disk at the paths given, not from the diff.
- **The suite is red at this branch's base.** 8 suites / 58 tests fail on `master` for reasons unrelated to this work. Do not try to fix them, and do not treat them as your regression. The two you will meet: `src/data/__tests__/patterns.test.ts` (missing `/images/examples/granola-ask.png`) and `src/app/patterns/[slug]/__tests__/pattern-page-structure.test.tsx` (1 of 2 red, a canonical heading is missing from the rendered page at line 113). Judge your work by the tests you wrote plus the absence of NEW failures.
- **Accessibility:** no `text-xs` for meaningful content, no `text-text-tertiary` for anything that must be read, never convey meaning by color alone.
- **Reuse before writing.** `SITE` and the moves-precedence logic already exist in `src/lib/handoff/composeHandoff.ts`. Import, do not duplicate.
- **Out of scope, do not add:** sitemap entries for `/skills/*`; a Claude Code plugin or marketplace listing; skills generated from audits; hand-authored `skillDescription` lines for the 38 patterns (the field ships empty everywhere and gets filled in later).

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `src/lib/skills/composeSkill.ts` (create) | Pure: one `Pattern` to one SKILL.md string, plus naming helpers | 1 |
| `src/lib/skills/__tests__/composeSkill.test.ts` (create) | Unit tests for the composer | 1 |
| `src/types/index.ts` (modify) | Add `skillDescription?: string` to `PatternContent` | 1 |
| `src/schemas/pattern.schema.ts` (modify) | Add `skillDescription` to `PatternContentSchema` | 1 |
| `src/app/skills/[slug]/route.ts` (create) | Force-static markdown route, one URL per pattern | 2 |
| `src/app/skills/[slug]/__tests__/route.test.ts` (create) | Route smoke test | 2 |
| `src/components/Pattern/InstallPatternCTA.tsx` (modify) | Card becomes the skill install card | 3 |
| `src/components/Pattern/__tests__/InstallPatternCTA.test.tsx` (create) | Card behavior test | 3 |
| `src/app/patterns/[slug]/client-page.tsx` (modify) | Pass composed skill props to the card | 3 |
| `src/lib/audit/analytics.ts` (modify) | Append new event names to the allowlist | 3, 4 |
| `src/lib/skills/composePack.ts` (create) | Pure: selected patterns + audits to a `{path: contents}` file map | 4 |
| `src/lib/skills/__tests__/composePack.test.ts` (create) | Pack-shape tests | 4 |
| `src/app/dashboard/dashboard-client.tsx` (modify) | Zip and download the pack; copy updates | 4 |

`composePack.ts` is deliberately separate from the dashboard component: the zip *shape* is the thing worth testing, and it can be tested without `fflate`, jsdom download plumbing, or React.

## Decisions this plan locks in

These resolve ambiguities in the spec. If you disagree, raise it before implementing rather than silently diverging.

1. **Canonical URL is `/skills/aiux-<slug>.md`**, matching the spec's install command. The spec's success-criteria line writes `/skills/<slug>.md` as shorthand for the same thing. One URL per pattern, not two.
2. **The card stays gated on `pattern.content.installPrompt`** in `client-page.tsx`. Verified 2026-08-11: the set of pattern files containing `takeaways` and the set containing `installPrompt` are identical (33 files), so ungating would change nothing observable. Keeping the gate matches the spec's "only the card presentation changes". When a future pattern gets `takeaways` without an `installPrompt`, revisit.
3. **`skillDescription` goes in the Zod schema even though it is not load-bearing.** Verified 2026-08-11: `PatternSchema` is referenced only by `src/utils/validation.ts` (dev/CLI helpers), never on the runtime read path, and it already omits `takeaways`, `installPrompt`, and `judgmentCall`. Adding the field follows the spec and costs one line; do not "fix" the missing siblings in this plan.
4. **The card fires `trackAuditEvent`, reversing the comment at the top of `InstallPatternCTA.tsx`.** That comment currently justifies calling `window.clarity` directly. The spec asks for real audit events, which also land in Postgres via `/api/events`. Delete the comment and the `fireInstallPromptCopied` helper. Do not restore them.
5. **Dashboard event split:** the zip path fires `skill_pack_downloaded`; the audits-only plain-`.md` path keeps firing today's `dashboard_handoff_generated` + `handoff_file_downloaded` unchanged. `handleCopy` is not touched at all.
6. **Pack download errors surface inline, not as a toast.** The spec says "the existing download-error toast path", but the dashboard has no such path today (only `UndoSnackbar`, which is for removals). Task 4 adds a minimal inline error line under the button rather than inventing a toast system.

---

### Task 1: Skill composer

**Files:**
- Create: `src/lib/skills/composeSkill.ts`
- Create: `src/lib/skills/__tests__/composeSkill.test.ts`
- Modify: `src/types/index.ts` (the `PatternContent` interface, around line 99)
- Modify: `src/schemas/pattern.schema.ts` (`PatternContentSchema`, around line 69)

**Interfaces:**
- Consumes: `SITE` from `@/lib/handoff/composeHandoff`; the `Pattern` and `Takeaway` types from `@/types`.
- Produces:
  - `composeSkillMd(pattern: Pattern): string`
  - `skillName(pattern: Pattern): string` returning `aiux-<slug>`
  - `skillFilename(pattern: Pattern): string` returning `aiux-<slug>.md`
  - `PatternContent.skillDescription?: string`

**Why the trigger line matters:** a Claude Code skill's `description` is the only thing the model sees when deciding whether to load the skill. A vague line means the skill never triggers, or triggers on everything. That is why the spec chose per-pattern skills over one merged skill, and why `skillDescription` exists as a hand-tuning escape hatch.

- [ ] **Step 1: Add the type field**

In `src/types/index.ts`, inside `interface PatternContent`, directly after the `installPrompt` line:

```ts
  skillDescription?: string;    // Hand-tuned trigger line for the generated Claude Code skill; overrides the line derived from `description`
```

- [ ] **Step 2: Add the schema field**

In `src/schemas/pattern.schema.ts`, inside `PatternContentSchema`, directly after the `figmaPrompt` line:

```ts
  skillDescription: z.string().min(1).optional(),
```

- [ ] **Step 3: Write the failing tests**

Create `src/lib/skills/__tests__/composeSkill.test.ts`:

```ts
import { composeSkillMd, skillName, skillFilename } from '../composeSkill';
import type { Pattern } from '@/types';

function makePattern(overrides: Partial<Pattern['content']> = {}, top: Partial<Pattern> = {}): Pattern {
  return {
    id: 'human-in-the-loop',
    title: 'Human in the Loop',
    slug: 'human-in-the-loop',
    description: 'The AI proposes, a person decides: keep humans in control of consequential actions',
    category: 'trust-transparency',
    content: {
      problem: 'Autonomous agents take irreversible actions users never approved.',
      solution: 'Insert an explicit approval step before consequential actions.',
      guidelines: ['Guideline one', 'Guideline two', 'Guideline three', 'Guideline four', 'Guideline five', 'Guideline six'],
      considerations: ['Consideration one'],
      examples: [],
      codeExamples: [],
      relatedPatterns: [],
      ...overrides,
    },
    ...top,
  } as Pattern;
}

describe('skillName / skillFilename', () => {
  it('prefixes the slug', () => {
    expect(skillName(makePattern())).toBe('aiux-human-in-the-loop');
    expect(skillFilename(makePattern())).toBe('aiux-human-in-the-loop.md');
  });
});

describe('composeSkillMd frontmatter', () => {
  it('opens with a name and a double-quoted description', () => {
    const lines = composeSkillMd(makePattern()).split('\n');
    expect(lines[0]).toBe('---');
    expect(lines[1]).toBe('name: aiux-human-in-the-loop');
    expect(lines[2]).toMatch(/^description: ".+"$/);
    expect(lines[3]).toBe('---');
  });

  it('quotes the description so a colon in the pattern description stays valid YAML', () => {
    // The fixture description contains ": keep humans in control", which would
    // break an unquoted single-line YAML scalar.
    const md = composeSkillMd(makePattern());
    expect(md).toContain('description: "Use when the AI proposes, a person decides: keep humans in control of consequential actions. Apply the Human in the Loop pattern."');
  });

  it('escapes embedded double quotes', () => {
    const md = composeSkillMd(makePattern({ skillDescription: 'Use when building a "review before send" step.' }));
    expect(md).toContain('description: "Use when building a \\"review before send\\" step."');
  });

  it('never emits an em dash', () => {
    expect(composeSkillMd(makePattern())).not.toContain('—');
  });
});

describe('composeSkillMd trigger line', () => {
  it('uses skillDescription verbatim when authored', () => {
    const md = composeSkillMd(makePattern({ skillDescription: 'Use when adding an approval gate to an agent action.' }));
    expect(md).toContain('description: "Use when adding an approval gate to an agent action."');
  });

  it('collapses whitespace in an authored description', () => {
    const md = composeSkillMd(makePattern({ skillDescription: '  Use when   gating\nagent actions. ' }));
    expect(md).toContain('description: "Use when gating agent actions."');
  });
});

describe('composeSkillMd body', () => {
  it('numbers takeaways as the moves, headings bolded', () => {
    const md = composeSkillMd(makePattern({
      takeaways: [
        { heading: 'Gate the irreversible', body: 'Approval belongs on actions you cannot undo.' },
        { heading: 'Show what will happen', body: 'Preview the exact effect before the user approves.' },
      ],
    }));
    expect(md).toContain('## The moves');
    expect(md).toContain('1. **Gate the irreversible** Approval belongs on actions you cannot undo.');
    expect(md).toContain('2. **Show what will happen** Preview the exact effect before the user approves.');
  });

  it('falls back to the first five guidelines when takeaways are absent', () => {
    const md = composeSkillMd(makePattern());
    expect(md).toContain('1. Guideline one');
    expect(md).toContain('5. Guideline five');
    expect(md).not.toContain('Guideline six');
  });

  it('prefers takeaways over guidelines when both exist', () => {
    const md = composeSkillMd(makePattern({
      takeaways: [{ heading: 'Gate the irreversible', body: 'Approval belongs on actions you cannot undo.' }],
    }));
    expect(md).toContain('Gate the irreversible');
    expect(md).not.toContain('Guideline one');
  });

  it('includes the title, the why line, and the reference URL', () => {
    const md = composeSkillMd(makePattern());
    expect(md).toContain('# Human in the Loop');
    expect(md).toContain('Why it matters: Autonomous agents take irreversible actions users never approved.');
    expect(md).toContain('Reference: https://aiuxdesign.guide/patterns/human-in-the-loop');
  });

  it('falls back to the pattern description when problem is empty', () => {
    const md = composeSkillMd(makePattern({ problem: '' }));
    expect(md).toContain('Why it matters: The AI proposes, a person decides');
  });

  it('does not throw when every optional field is missing', () => {
    const bare = makePattern({ problem: '', guidelines: [], takeaways: undefined });
    expect(() => composeSkillMd(bare)).not.toThrow();
    expect(composeSkillMd(bare)).toContain('name: aiux-human-in-the-loop');
  });
});
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `npx jest src/lib/skills/__tests__/composeSkill.test.ts`
Expected: FAIL with "Cannot find module '../composeSkill'".

- [ ] **Step 5: Write the composer**

Create `src/lib/skills/composeSkill.ts`:

```ts
import type { Pattern } from '@/types';
import { SITE } from '@/lib/handoff/composeHandoff';

/**
 * Turns a Pattern into a Claude Code SKILL.md.
 *
 * This is the SKILL composer: persistent design guidance that lives in the
 * reader's repo at `.claude/skills/aiux-<slug>/SKILL.md` and shapes every
 * future conversation about that surface. It is deliberately separate from
 * `src/lib/handoff/composeHandoff.ts`, which composes a one-shot "implement
 * these patterns now" task file. Different lifetimes, different framing.
 *
 * The frontmatter `description` is the load-bearing line: it is the only text
 * Claude sees when deciding whether to load the skill. We prefer an authored
 * `skillDescription` and fall back to a line derived from `pattern.description`.
 */

/** Skill directory + frontmatter name, e.g. `aiux-human-in-the-loop`. */
export function skillName(pattern: Pattern): string {
  return `aiux-${pattern.slug}`;
}

/** Served filename, e.g. `aiux-human-in-the-loop.md`. */
export function skillFilename(pattern: Pattern): string {
  return `${skillName(pattern)}.md`;
}

function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Quote a value as a single-line YAML scalar. Pattern descriptions routinely
 * contain colons ("The AI proposes, a person decides: ..."), which would make
 * an unquoted scalar invalid YAML and break skill loading.
 */
function yamlString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function skillTrigger(pattern: Pattern): string {
  const authored = pattern.content.skillDescription?.trim();
  if (authored) return oneLine(authored);

  const desc = oneLine(pattern.description || '').replace(/\.+$/, '');
  const lead = desc ? desc.charAt(0).toLowerCase() + desc.slice(1) : 'working on this surface';
  return `Use when ${lead}. Apply the ${pattern.title} pattern.`;
}

/**
 * Same precedence as `patternMoves()` in composeHandoff.ts: ranked takeaways
 * win; otherwise the first five guidelines.
 */
function skillMoves(pattern: Pattern): string[] {
  const takeaways = pattern.content.takeaways;
  if (takeaways && takeaways.length > 0) {
    return takeaways
      .map((t) => {
        const heading = t.heading?.trim();
        const body = t.body?.trim();
        if (heading && body) return `**${heading}** ${body}`;
        return heading || body || '';
      })
      .filter(Boolean);
  }
  return (pattern.content.guidelines || []).slice(0, 5);
}

export function composeSkillMd(pattern: Pattern): string {
  const lines: string[] = [
    '---',
    `name: ${skillName(pattern)}`,
    `description: ${yamlString(skillTrigger(pattern))}`,
    '---',
    '',
    `# ${pattern.title}`,
    '',
  ];

  const why = oneLine(pattern.content.problem || pattern.description || '');
  if (why) lines.push(`Why it matters: ${why}`, '');

  const moves = skillMoves(pattern);
  if (moves.length > 0) {
    lines.push('## The moves', '');
    moves.forEach((move, i) => lines.push(`${i + 1}. ${move}`));
    lines.push('');
  }

  lines.push(
    `Reference: ${SITE}/patterns/${pattern.slug}`,
    '',
    'When this applies, make the smallest change that genuinely realises the pattern. Do not add UI the product does not need, and say what you changed and why.',
    '',
  );

  return lines.join('\n');
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx jest src/lib/skills/__tests__/composeSkill.test.ts`
Expected: PASS, 13 tests.

- [ ] **Step 7: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/skills src/types/index.ts src/schemas/pattern.schema.ts
git commit -m "feat(skills): compose a Claude Code SKILL.md from a pattern"
```

---

### Task 2: Serving route

**Files:**
- Create: `src/app/skills/[slug]/route.ts`
- Create: `src/app/skills/[slug]/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `composeSkillMd`, `skillFilename` from `@/lib/skills/composeSkill` (Task 1); the default `patterns` array from `@/data/patterns`.
- Produces: `GET(request: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response>` and `generateStaticParams()`. Nothing later in this plan imports from this file; it is a leaf.

**Why `dynamicParams = false`:** it is this repo's idiom for "unknown slug means 404" (see `src/app/patterns/[slug]/page.tsx:18`) and it means the route never runs for a slug that was not prerendered. The in-handler `notFound` branch below is still needed for the jest test, which calls `GET` directly and bypasses routing.

- [ ] **Step 1: Write the failing test**

Create `src/app/skills/[slug]/__tests__/route.test.ts`:

```ts
import { GET, generateStaticParams } from '../route';
import patterns from '@/data/patterns';

function ctx(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

describe('GET /skills/[slug]', () => {
  it('serves markdown for a known pattern', async () => {
    const res = await GET(new Request('https://aiuxdesign.guide/skills/aiux-human-in-the-loop.md'), ctx('aiux-human-in-the-loop.md'));
    expect(res.status).toBe(200);
    // Loose match on purpose: header-value normalization varies across the
    // Response polyfill jest uses, and the guard here is "markdown, not HTML".
    expect(res.headers.get('content-type')).toContain('text/markdown');
    const body = await res.text();
    expect(body.startsWith('---\nname: aiux-human-in-the-loop\n')).toBe(true);
  });

  it('404s an unknown slug', async () => {
    const res = await GET(new Request('https://aiuxdesign.guide/skills/aiux-nope.md'), ctx('aiux-nope.md'));
    expect(res.status).toBe(404);
  });

  it('404s a slug without the .md extension', async () => {
    const res = await GET(new Request('https://aiuxdesign.guide/skills/aiux-human-in-the-loop'), ctx('aiux-human-in-the-loop'));
    expect(res.status).toBe(404);
  });

  it('prerenders one URL per pattern', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(patterns.length);
    expect(params).toContainEqual({ slug: 'aiux-human-in-the-loop.md' });
  });

  it('every pattern composes a skill with non-empty moves', async () => {
    for (const pattern of patterns) {
      const res = await GET(new Request(`https://aiuxdesign.guide/skills/aiux-${pattern.slug}.md`), ctx(`aiux-${pattern.slug}.md`));
      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain('## The moves');
      expect(body).toMatch(/^1\. .+$/m);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/app/skills`
Expected: FAIL with "Cannot find module '../route'".

- [ ] **Step 3: Write the route handler**

Create `src/app/skills/[slug]/route.ts`:

```ts
import patterns from '@/data/patterns';
import { composeSkillMd, skillFilename } from '@/lib/skills/composeSkill';

/**
 * Serves one Claude Code SKILL.md per pattern at
 * `/skills/aiux-<slug>.md`, so the pattern page can offer a one-line
 * curl install. Fully static: the content is derived from pattern data
 * that only changes at build time.
 *
 * Deliberately absent from the sitemap. These are install targets for a
 * copy-pasted command, not pages we want indexed.
 */

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return patterns.map((pattern) => ({ slug: skillFilename(pattern) }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const pattern = patterns.find((p) => skillFilename(p) === slug);

  if (!pattern) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(composeSkillMd(pattern), {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/app/skills`
Expected: PASS, 5 tests. The last one iterates all 38 patterns and is the spec's "every pattern serves a valid SKILL.md" success criterion enforced in CI.

- [ ] **Step 5: Verify the route in a running dev server**

Run (dev server up, in a second shell):

```bash
curl -si http://localhost:3000/skills/aiux-human-in-the-loop.md | head -20
curl -so /dev/null -w '%{http_code}\n' http://localhost:3000/skills/aiux-not-a-pattern.md
```

Expected: first prints `HTTP/1.1 200` with `content-type: text/markdown; charset=utf-8` followed by the frontmatter. Second prints `404`.

- [ ] **Step 6: Commit**

```bash
git add src/app/skills
git commit -m "feat(skills): serve per-pattern SKILL.md at /skills/aiux-<slug>.md"
```

---

### Task 3: Pattern page skill card

**Files:**
- Modify: `src/components/Pattern/InstallPatternCTA.tsx` (whole-file rewrite, currently 121 lines)
- Create: `src/components/Pattern/__tests__/InstallPatternCTA.test.tsx`
- Modify: `src/app/patterns/[slug]/client-page.tsx:239-242` (the `<InstallPatternCTA />` call site)
- Modify: `src/lib/audit/analytics.ts` (append to `AUDIT_EVENT_NAMES`)
- Verify only, no edit expected: `src/app/patterns/[slug]/__tests__/pattern-page-structure.test.tsx`

**Interfaces:**
- Consumes: `composeSkillMd`, `skillName` from `@/lib/skills/composeSkill` (Task 1); `trackAuditEvent` from `@/lib/audit/analytics`.
- Produces: `InstallPatternCTA` with the new props `{ patternTitle: string; patternSlug: string; skillName: string; skillMd: string }`. The old `installPrompt: string` prop is removed.

**Two things to know before you start:**

1. `AUDIT_EVENT_NAMES` is a runtime allowlist. `src/app/api/events/route.ts:4` imports that exact array and builds `ALLOWED_NAMES` from it, so an event not in the array is silently swallowed server-side and never reaches Postgres. Add the names in this task, not later. Verified 2026-08-11: payloads are untyped per-event (`trackAuditEvent(event: AuditEvent, properties?: Record<string, unknown>)`) and the route does not validate payload keys, so no payload type work is needed for the new events.
2. The current file opens with a comment explaining why it calls `window.clarity` directly instead of `trackAuditEvent`. Decision 4 above reverses that. Delete the comment, the `declare global` block, and `fireInstallPromptCopied` entirely. Do not preserve them.

- [ ] **Step 1: Add the two pattern-page event names**

In `src/lib/audit/analytics.ts`, inside the `AUDIT_EVENT_NAMES` array, after the `'handoff_file_downloaded',` line:

```ts
  // Pattern pages: the install card now ships a Claude Code skill, not a one-shot
  // prompt. Both events carry the pattern slug so we learn which patterns get installed.
  'skill_install_command_copied',
  'skill_file_downloaded',
```

- [ ] **Step 2: Write the failing component test**

Create `src/components/Pattern/__tests__/InstallPatternCTA.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InstallPatternCTA from '../InstallPatternCTA';

const trackAuditEvent = jest.fn();
jest.mock('@/lib/audit/analytics', () => ({
  trackAuditEvent: (...args: unknown[]) => trackAuditEvent(...args),
}));

const SKILL_MD = '---\nname: aiux-human-in-the-loop\ndescription: "Use when gating agent actions."\n---\n\n# Human in the Loop\n';

const writeText = jest.fn().mockResolvedValue(undefined);

function renderCard() {
  return render(
    <InstallPatternCTA
      patternTitle="Human in the Loop"
      patternSlug="human-in-the-loop"
      skillName="aiux-human-in-the-loop"
      skillMd={SKILL_MD}
    />,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  Object.assign(navigator, { clipboard: { writeText } });
  Object.defineProperty(window, 'isSecureContext', { value: true, writable: true });
});

describe('InstallPatternCTA', () => {
  it('renders the skill framing, not the old prompt framing', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: /Add Human in the Loop as a Claude skill/i })).toBeInTheDocument();
    expect(screen.queryByText(/Copy prompt for Claude Code/i)).not.toBeInTheDocument();
  });

  it('copies the install command and fires the event with the slug', async () => {
    renderCard();
    fireEvent.click(screen.getByRole('button', { name: /copy the install command/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toContain('mkdir -p .claude/skills/aiux-human-in-the-loop');
    expect(copied).toContain('https://aiuxdesign.guide/skills/aiux-human-in-the-loop.md');
    expect(copied).toContain('-o .claude/skills/aiux-human-in-the-loop/SKILL.md');
    expect(trackAuditEvent).toHaveBeenCalledWith('skill_install_command_copied', { slug: 'human-in-the-loop' });
  });

  it('downloads SKILL.md and fires the download event', () => {
    const createObjectURL = jest.fn().mockReturnValue('blob:skill');
    const revokeObjectURL = jest.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });

    renderCard();
    fireEvent.click(screen.getByRole('button', { name: /download SKILL\.md/i }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(trackAuditEvent).toHaveBeenCalledWith('skill_file_downloaded', { slug: 'human-in-the-loop' });
  });

  it('previews the skill content, not an install prompt', () => {
    renderCard();
    const toggle = screen.getByRole('button', { name: /Inspect before you copy/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/name: aiux-human-in-the-loop/)).toBeInTheDocument();
  });

  it('has no em dash in its copy', () => {
    const { container } = renderCard();
    expect(container.textContent).not.toContain('—');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx jest src/components/Pattern/__tests__/InstallPatternCTA.test.tsx`
Expected: FAIL. The heading assertion fails first, since the component still renders "Add {patternTitle} to your product".

- [ ] **Step 4: Rewrite the card**

Replace the entire contents of `src/components/Pattern/InstallPatternCTA.tsx`:

```tsx
'use client';

import React, { useState, useCallback } from 'react';
import { CommandLineIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface Props {
  patternTitle: string;
  patternSlug: string;
  skillName: string;
  skillMd: string;
}

/**
 * Headless skill-install card. The caller provides the surrounding <section>
 * and (typically) the section H2, so the parent can compose this side-by-side
 * with TakeawaysList under a shared "Take it into your own product" heading.
 *
 * A prompt runs once. A skill persists in the reader's repo and shapes every
 * later design conversation, so this card installs a skill rather than copying
 * a prompt. The pattern's `installPrompt` still powers the audit flow and the
 * dashboard handoff composer; it just no longer drives this card.
 */
export default function InstallPatternCTA({ patternTitle, patternSlug, skillName, skillMd }: Props) {
  const [showSkill, setShowSkill] = useState(false);
  const [copied, setCopied] = useState(false);

  const installCommand =
    `mkdir -p .claude/skills/${skillName} && curl -fsSL https://aiuxdesign.guide/skills/${skillName}.md -o .claude/skills/${skillName}/SKILL.md`;

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(installCommand);
      } else {
        const ta = document.createElement('textarea');
        ta.value = installCommand;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      trackAuditEvent('skill_install_command_copied', { slug: patternSlug });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy install command:', err);
    }
  }, [installCommand, patternSlug]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([skillMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SKILL.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    trackAuditEvent('skill_file_downloaded', { slug: patternSlug });
  }, [skillMd, patternSlug]);

  return (
    <div className="bg-surface-primary border-2 border-accent-primary/30 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="text-xs font-semibold text-accent-primary uppercase tracking-wide mb-3">
          Install as a Claude skill
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight">
          Add {patternTitle} as a Claude skill
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-5">
          Run this in your repo and Claude Code picks the skill up from then on. It encodes the moves
          on the left, so Claude applies them whenever you work on a surface this pattern covers,
          not just once.
        </p>

        <button
          type="button"
          onClick={handleCopy}
          disabled={copied}
          className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
            copied
              ? 'bg-status-success/10 text-status-success border-status-success/30'
              : 'bg-accent-primary text-white border-accent-primary hover:bg-accent-hover'
          }`}
          aria-label="Copy the install command for Claude Code"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied. Run it in your repo.
            </>
          ) : (
            <>
              <CommandLineIcon className="h-4 w-4" />
              Copy install command
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border border-primary bg-surface-secondary text-text-primary hover:text-accent-primary transition-colors cursor-pointer"
          aria-label="Download SKILL.md for this pattern"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Download SKILL.md
        </button>

        <button
          type="button"
          onClick={() => setShowSkill((s) => !s)}
          aria-expanded={showSkill}
          className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform ${showSkill ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showSkill ? 'Hide the skill' : 'Inspect before you copy'}
        </button>
      </div>

      {showSkill && (
        <div className="border-t border-primary bg-surface-secondary">
          <pre className="p-5 text-xs text-text-primary font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
            {skillMd}
          </pre>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx jest src/components/Pattern/__tests__/InstallPatternCTA.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Update the call site**

In `src/app/patterns/[slug]/client-page.tsx`, add to the imports near the top (with the other non-dynamic imports, not as a `dynamic()` call, since it is a pure function):

```tsx
import { composeSkillMd, skillName } from '@/lib/skills/composeSkill';
```

Then replace the `<InstallPatternCTA ... />` element at lines 239-242:

```tsx
                    <InstallPatternCTA
                      patternTitle={pattern.title}
                      patternSlug={pattern.slug}
                      skillName={skillName(pattern)}
                      skillMd={composeSkillMd(pattern)}
                    />
```

Leave the surrounding `{pattern.content.installPrompt ? (` gate untouched. See Decision 2.

Also update the block comment above the section (lines 216-221) so it stops describing a paste-a-prompt CTA. Replace the last sentence, `the paste-into-Claude-Code CTA sticky on the right.`, with:

```
            the skill-install CTA sticky on the right.
```

- [ ] **Step 7: Confirm the structure test is no worse than before**

Run: `npx jest --testPathPattern "pattern-page-structure"`
Expected: exactly 1 failed, 1 passed. The failure is `renders sections in canonical order with the demo only under Implementation`, failing at line 113 because a canonical heading is missing from the rendered page.

**That failure is pre-existing.** It was verified red at this branch's base commit on 2026-08-11, before any skills work. It is not yours, and fixing it is explicitly out of scope for this branch. What you must confirm is that the count does not get worse: still 1 failed / 1 passed, and the still-passing test (`omits the Implementation section when a pattern has no code examples`) stays green. If a second test goes red, that one IS yours, so stop and investigate.

The spec lists this test as needing an update for the new card. It does not: the test stubs `next/dynamic` to a no-op, so `InstallPatternCTA` renders as `null` there and the test only asserts section headings and order, which this task does not change. Do not edit this test file.

- [ ] **Step 8: Type-check, lint, and run the full suite**

```bash
npx tsc --noEmit
npm run lint
npm test
```

Expected: clean type-check, no new lint errors, full suite green.

- [ ] **Step 9: Verify in the browser**

With the dev server running, open `http://localhost:3000/patterns/human-in-the-loop`, scroll to "Take it into your own product", and check: the card reads "Add Human in the Loop as a Claude skill"; "Copy install command" flips to the copied state; "Inspect before you copy" reveals the YAML frontmatter; "Download SKILL.md" saves a file whose first line is `---`.

- [ ] **Step 10: Commit**

```bash
git add src/components/Pattern/InstallPatternCTA.tsx "src/app/patterns/[slug]/client-page.tsx" src/lib/audit/analytics.ts
git commit -m "feat(skills): pattern page installs a Claude skill instead of copying a prompt"
```

---

### Task 4: Dashboard skill pack

**Files:**
- Create: `src/lib/skills/composePack.ts`
- Create: `src/lib/skills/__tests__/composePack.test.ts`
- Modify: `src/app/dashboard/dashboard-client.tsx` (`handleDownload` at lines 141-155, the header copy at lines 178-194, the export-panel copy around lines 323-341, and the empty-state copy around line 219)
- Modify: `src/lib/audit/analytics.ts` (append `skill_pack_downloaded`)
- Modify: `package.json` / `package-lock.json` (add `fflate`)

**Interfaces:**
- Consumes: `composeSkillMd`, `skillName` from `@/lib/skills/composeSkill` (Task 1); `composeCombinedHandoff` from `@/lib/handoff/composeCombined`; `SavedAudit` from `@/hooks/useSavedAudits`.
- Produces:
  - `composeSkillPack(patterns: Pattern[], audits: SavedAudit[]): Record<string, string>` mapping zip-relative path to file contents
  - `skillPackFilename(): string` returning `aiux-skill-pack.zip`

**Why a separate pure module:** the thing worth testing is the zip's *shape* (one folder per pattern, audit file present only when audits exist). Testing that through `fflate` plus jsdom download plumbing would test the plumbing instead. `composePack` is pure and the component becomes a thin caller.

**Why the dynamic import:** this repo has a documented incident where a single static import pulled ~85KB of framer-motion into the homepage bundle. `fflate` is needed only after a click, so it must be `await import('fflate')` inside the handler, and Step 9 verifies it stayed out of the initial chunk.

- [ ] **Step 1: Install fflate**

```bash
npm install fflate@0.8.2
```

Expected: `fflate` appears under `dependencies` in `package.json` at `^0.8.2`.

- [ ] **Step 2: Add the pack event name**

In `src/lib/audit/analytics.ts`, in `AUDIT_EVENT_NAMES`, directly after the two names added in Task 3:

```ts
  // Dashboard: zipped pack of one skill per saved pattern, plus the audit fixes file.
  'skill_pack_downloaded',
```

- [ ] **Step 3: Write the failing pack tests**

Create `src/lib/skills/__tests__/composePack.test.ts`:

```ts
import { composeSkillPack, skillPackFilename } from '../composePack';
import type { Pattern } from '@/types';
import type { SavedAudit } from '@/hooks/useSavedAudits';

function makePattern(slug: string, title: string): Pattern {
  return {
    id: slug,
    title,
    slug,
    description: 'A description long enough to read as a real sentence about the pattern',
    category: 'trust-transparency',
    content: {
      problem: 'A problem statement.',
      solution: 'A solution statement.',
      guidelines: ['Guideline one'],
      considerations: ['Consideration one'],
      examples: [],
      codeExamples: [],
      relatedPatterns: [],
    },
  } as Pattern;
}

function makeAudit(id: string): SavedAudit {
  return {
    id,
    savedAt: 1_700_000_000_000,
    productType: 'chat',
    productLabel: 'a chat interface',
    surfaceDescription: 'A chat thread with a composer.',
    score: 12,
    maxScore: 20,
    applicablePatternsCount: 10,
    gaps: [],
    quickWins: [],
  } as SavedAudit;
}

describe('composeSkillPack', () => {
  it('writes one skill folder per pattern, at the repo-root path', () => {
    const files = composeSkillPack([makePattern('human-in-the-loop', 'Human in the Loop'), makePattern('citations', 'Citations')], []);
    expect(Object.keys(files).sort()).toEqual([
      '.claude/skills/aiux-citations/SKILL.md',
      '.claude/skills/aiux-human-in-the-loop/SKILL.md',
      'README.md',
    ]);
    expect(files['.claude/skills/aiux-citations/SKILL.md']).toContain('name: aiux-citations');
  });

  it('omits the audit file when there are no audits', () => {
    const files = composeSkillPack([makePattern('citations', 'Citations')], []);
    expect(files['aiux-audit-fixes.md']).toBeUndefined();
  });

  it('includes the audit file when audits exist', () => {
    const files = composeSkillPack([makePattern('citations', 'Citations')], [makeAudit('a1')]);
    expect(files['aiux-audit-fixes.md']).toBeDefined();
    expect(files['aiux-audit-fixes.md']).toContain('a chat interface');
  });

  it('always includes a README that explains where things go', () => {
    const files = composeSkillPack([makePattern('citations', 'Citations')], []);
    expect(files['README.md']).toContain('.claude/skills/');
    expect(files['README.md']).toContain('1 skill');
  });

  it('does not put audits into skills', () => {
    const files = composeSkillPack([], [makeAudit('a1')]);
    expect(Object.keys(files).filter((k) => k.startsWith('.claude/skills/'))).toHaveLength(0);
  });

  it('has no em dash anywhere in the pack', () => {
    const files = composeSkillPack([makePattern('citations', 'Citations')], [makeAudit('a1')]);
    Object.values(files).forEach((contents) => expect(contents).not.toContain('—'));
  });

  it('names the zip', () => {
    expect(skillPackFilename()).toBe('aiux-skill-pack.zip');
  });
});
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `npx jest src/lib/skills/__tests__/composePack.test.ts`
Expected: FAIL with "Cannot find module '../composePack'".

- [ ] **Step 5: Write the pack composer**

Create `src/lib/skills/composePack.ts`:

```ts
import type { Pattern } from '@/types';
import type { SavedAudit } from '@/hooks/useSavedAudits';
import { composeCombinedHandoff } from '@/lib/handoff/composeCombined';
import { composeSkillMd, skillName } from '@/lib/skills/composeSkill';

/**
 * Builds the dashboard skill pack as a plain {path: contents} map, ready to zip.
 *
 * The pack unzips at the repo root, so the paths here are repo-relative on
 * purpose. Two shapes ride together because they have different lifetimes:
 *
 *   - Saved patterns become SKILLS. They are persistent guidance, so they belong
 *     in `.claude/skills/` where they shape every later conversation.
 *   - Saved audits stay HANDOFF-SHAPED. They are one-shot fixes for gaps in the
 *     user's own product, so they ride along as a task file, not a skill.
 *
 * Kept free of `fflate` so the zip shape is testable without the zipper.
 */

const AUDIT_FILE = 'aiux-audit-fixes.md';

function packReadme(patternCount: number, auditCount: number): string {
  const lines: string[] = [
    '# Your AI UX skill pack',
    '',
    `From aiuxdesign.guide. This pack contains ${patternCount} skill${patternCount === 1 ? '' : 's'}` +
      `${auditCount > 0 ? ` plus fixes from ${auditCount} saved audit${auditCount === 1 ? '' : 's'}` : ''}.`,
    '',
    '## How to use it',
    '',
    'Unzip this at the root of your repo. The skills land in `.claude/skills/`, where Claude Code picks them up automatically. Each skill triggers on its own when you work on a surface that pattern covers, so there is nothing to run.',
    '',
  ];

  if (auditCount > 0) {
    lines.push(
      `\`${AUDIT_FILE}\` is different. It is a one-off task list of the gaps we found in your own product, so hand it to Claude Code once and work through it. It is not a skill, because those fixes stop applying once they are done.`,
      '',
    );
  }

  lines.push(
    '## What is in here',
    '',
    '```',
    'README.md',
    '.claude/skills/aiux-<pattern>/SKILL.md',
    ...(auditCount > 0 ? [AUDIT_FILE] : []),
    '```',
    '',
  );

  return lines.join('\n');
}

/** Map of zip-relative path to file contents. */
export function composeSkillPack(patterns: Pattern[], audits: SavedAudit[]): Record<string, string> {
  const files: Record<string, string> = {
    'README.md': packReadme(patterns.length, audits.length),
  };

  patterns.forEach((pattern) => {
    files[`.claude/skills/${skillName(pattern)}/SKILL.md`] = composeSkillMd(pattern);
  });

  if (audits.length > 0) {
    // Reuse the combined composer with no patterns: it already knows how to
    // render audit gaps, and the patterns are shipping as skills instead.
    files[AUDIT_FILE] = composeCombinedHandoff(audits, []);
  }

  return files;
}

/** Suggested filename for the downloaded pack. */
export function skillPackFilename(): string {
  return 'aiux-skill-pack.zip';
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx jest src/lib/skills/__tests__/composePack.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 7: Wire the dashboard**

In `src/app/dashboard/dashboard-client.tsx`, add to the imports:

```tsx
import { composeSkillPack, skillPackFilename } from '@/lib/skills/composePack';
```

Add a state hook alongside the existing `copied` state (see Decision 6, there is no toast system here):

```tsx
  const [packError, setPackError] = useState<string | null>(null);
```

Replace `handleDownload` (lines 141-155) with:

```tsx
  /** Shared blob-to-disk step for both download shapes. */
  const saveBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (!canGenerate) return;
    setPackError(null);

    // Audits with no patterns: nothing to turn into a skill, so keep the plain
    // markdown handoff (and its existing events) exactly as it was.
    if (nP === 0) {
      const content = composeCombinedHandoff(selectedAudits, selectedPatterns);
      saveBlob(new Blob([content], { type: 'text/markdown;charset=utf-8' }), combinedHandoffFilename());
      trackAuditEvent('dashboard_handoff_generated', { action: 'download', audits: nA, patterns: nP, count: nA + nP });
      trackAuditEvent('handoff_file_downloaded', { audits: nA, patterns: nP, count: nA + nP });
      return;
    }

    try {
      // Loaded on click only. A static import would put the zipper in the
      // initial dashboard bundle for every visitor who never exports.
      const { zipSync, strToU8 } = await import('fflate');
      const files = composeSkillPack(selectedPatterns, selectedAudits);
      const zippable = Object.fromEntries(
        Object.entries(files).map(([path, contents]) => [path, strToU8(contents)]),
      );
      saveBlob(new Blob([zipSync(zippable, { level: 6 })], { type: 'application/zip' }), skillPackFilename());
      trackAuditEvent('dashboard_handoff_generated', { action: 'download', audits: nA, patterns: nP, count: nA + nP });
      trackAuditEvent('skill_pack_downloaded', { audits: nA, patterns: nP, count: nA + nP });
    } catch (err) {
      // No partial zips: nothing was saved, so say so and leave the selection intact.
      console.warn('Failed to build the skill pack:', err);
      setPackError('We could not build the pack just now. Try again, or copy the handoff text instead.');
    }
  };
```

Note that `handleCopy` is unchanged. It still composes the combined markdown, which is the right shape for pasting into a chat.

If `zipSync` rejects the `Object.fromEntries` result on the `Zippable` parameter, cast it (`zipSync(zippable as Record<string, Uint8Array>, { level: 6 })`). Do not "fix" it by making `composeSkillPack` return `Uint8Array` values. Returning plain strings is the whole reason that module is testable without `fflate`, and changing it would force the pack-shape tests through the zipper.

- [ ] **Step 8: Update the dashboard copy**

Three copy sites. Keep the em-dash rule in mind.

Header paragraph (lines 184-188), replace the paragraph text with:

```tsx
        Audits are fixes for your own product. Patterns are reference for what you want to build.
        Pick what to include, then download a skill pack: one Claude Code skill per pattern, ready
        to unzip at the root of your repo.
```

Empty state (around line 219), replace `Everything you save collects here, ready to export as a handoff file.` with:

```tsx
            any pattern. Everything you save collects here, ready to export as a skill pack.
```

Export panel (around lines 323-341): change the `<h2>` text from `Generate handoff` to `Download skill pack`, the description under it to:

```tsx
                One zip for your repo: a Claude Code skill per pattern you saved, plus a task file
                of the fixes from your audits.
```

and the download button label from `Download handoff file` to `Download skill pack`.

Render the error under the button, inside the same container as the button:

```tsx
                {packError && (
                  <p role="alert" className="mt-3 text-sm text-text-secondary">
                    {packError}
                  </p>
                )}
```

`role="alert"` plus text (not color alone) is what carries the meaning here, per the accessibility constraint.

- [ ] **Step 9: Verify fflate stayed out of the initial bundle**

Stop the dev server first (the build clobbers `.next/` and breaks a running server). Then:

```bash
ANALYZE=true npm run build
```

`@next/bundle-analyzer` is wired in `next.config.mjs` behind `ANALYZE === 'true'` and opens treemaps in the browser. Note that `npm run build:analyze` is a different thing: it is a custom aggregate size report (`scripts/analysis/build-optimization.js`) with no module attribution, so it cannot answer this question.

Expected: in the client treemap, `fflate` sits in its own async chunk, not inside the `/dashboard` page's initial JS. Cross-check against the build's route table, where `/dashboard` First Load JS should be within a kilobyte or two of its value on `master`. If `fflate` shows up in the initial chunk, the `await import` was hoisted or replaced with a static import. Fix it before continuing.

- [ ] **Step 10: Type-check, lint, brand-check, and run the full suite**

```bash
npx tsc --noEmit
npm run lint
git add -A && npm run brand:check
npm test
```

Expected: all clean. `brand:check` runs with `--staged`, so it only inspects staged files. Running it on an unstaged tree silently checks nothing and reports success.

- [ ] **Step 11: Verify the pack end to end**

With the dev server running: save two patterns and one audit, go to `/dashboard`, click "Download skill pack", then:

```bash
cd ~/Downloads && unzip -l aiux-skill-pack.zip
mkdir -p /tmp/packtest && cd /tmp/packtest && unzip -o ~/Downloads/aiux-skill-pack.zip && find .claude/skills -name SKILL.md
head -5 .claude/skills/*/SKILL.md
```

Expected: `README.md`, one `.claude/skills/aiux-<slug>/SKILL.md` per saved pattern, and `aiux-audit-fixes.md`. Each SKILL.md starts with `---` and a `name:` line. Then deselect all audits and download again: the zip should no longer contain `aiux-audit-fixes.md`. Then deselect all patterns, leaving one audit: the download should be a plain `.md` file, not a zip.

- [ ] **Step 12: Commit**

```bash
git add src/lib/skills/composePack.ts src/app/dashboard/dashboard-client.tsx src/lib/audit/analytics.ts package.json package-lock.json
git commit -m "feat(skills): dashboard exports a zipped Claude skill pack"
```

---

## Final verification

Run after Task 4, before opening a PR.

- [ ] `npm test` shows no NEW failures against the branch base (8 suites / 58 tests were already failing at `6adbbde`), and every test this plan added passes.
- [ ] `npx tsc --noEmit` is clean.
- [ ] `npm run lint` has no new errors.
- [ ] `npm run brand:check` passes with the changes staged (it reads `--staged`, so an unstaged tree passes vacuously). It also runs pre-commit via husky.
- [ ] `grep -rn '—' src/lib/skills src/components/Pattern/InstallPatternCTA.tsx src/app/dashboard/dashboard-client.tsx` returns nothing.
- [ ] Copy the install command from a live pattern page, run it in a scratch git repo, start Claude Code there, and confirm the skill is listed. This is the spec's end-to-end success criterion and the only step that proves the URL, the filename, and the frontmatter all agree.
- [ ] `git diff master --stat` touches no sitemap file, adds no plugin manifest, and adds no `skillDescription` values to pattern data (all three are out of scope).

## Spec coverage

| Spec section | Task |
|---|---|
| 1. Skill composer, `skillName`, type + schema field | 1 |
| 2. `/skills/[slug].md` route, static params, 404 | 2 |
| 3. Pattern page CTA, copy command, download, inspect disclosure | 3 |
| 4. Dashboard pack, zip shape, audits-stay-handoff, audits-only fallback, copy updates | 4 |
| 5. Analytics (3 events) | 3 (two), 4 (one) |
| 6. Testing (composer units, route smoke, structure test, dashboard pack) | 1, 2, 3, 4 |
| Out of scope | Global Constraints, final verification |
| Error handling | 2 (404), 4 (import failure, no partial zips) |
| Success criteria | Task 2 Step 4 (all 38 valid), final verification (end-to-end, unzip, em dashes) |
