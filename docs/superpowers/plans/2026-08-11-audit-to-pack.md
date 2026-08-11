# Audit results feed the skill pack

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the audit results page into the best entry point for the skill pack: every recommended pattern becomes savable, saving routes to checkout, and the two dead-end actions (the copy-handoff prompt and the chat) are removed.

**Architecture:** The audit already resolves each gap to a real pattern slug (`resolvePatternSlug`, used today only to build a "See how X solves this" link). That slug is exactly what the save mechanism needs, so a save control on each gap card is a wiring job, not new logic. Everything then converges on the existing dashboard checkout rather than the audit keeping its own private export.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Jest + React Testing Library, Playwright for the audit E2E.

**Source of the decision:** the browse-save-checkout redesign in `/Users/imranmohammed/.claude/plans/we-have-save-as-vast-badger.md`, extended to the audit funnel.

## Why, with the numbers

Pulled from the `UiEvent` table on 2026-08-11:

| Event | Count |
|---|---|
| `audit_upload_viewed` | 48 |
| `audit_session_completed` | 25 |
| **`dashboard_pattern_saved`** | **17** |
| `audit_handoff_copied` | 6 |
| `audit_chat_message_sent` | 6, across **2 distinct non-admin sessions**, last on 2026-07-16 |

Saving is already the most-used action in this funnel, roughly 3x either audit-specific export. The chat has two lifetime users and has been dormant for a month. The copy-handoff prompt is barely load-bearing.

**Caveat to carry forward:** 25 completed audits is a small base. These numbers justify removing a dormant feature and reordering emphasis; they do not prove the new flow will convert better. Read the post-change numbers against this table, and check the volume before believing any rate.

## Global Constraints

- **`avoid-em-dashes`** in all user-facing copy. Note `FullPageResults.tsx:1135` currently contains a literal `&mdash;`; it sits in copy this plan deletes, so do not "fix" it separately.
- **Design tokens only**: no raw Tailwind colors, no raw z-index (use `z-sticky`/`z-toast`), no arbitrary radii/shadows/hex, no arbitrary spacing under 2rem.
- **Accessibility**: no `text-xs` for meaningful content; never `text-text-tertiary` for anything that must be read; never convey meaning by color alone.
- **`FullPageResults.tsx` renders the LCP element on the demo landing** (`AuditClient.tsx:18-21` says so explicitly). Do not disturb what renders above the fold, and do not convert any above-fold piece to a lazy or client-only path.
- TypeScript strict, `npx tsc --noEmit`. **Never `npm run build` while a dev server is running.**
- **Tests are written and run but NEVER committed** (`.gitignore` excludes `**/__tests__/`, `**/*.test.*`, `**/*.spec.*`). Do not `git add -f` them and never name a test path in a `git add` command. E2E specs under `e2e/` ARE tracked (`!e2e/**/*.spec.ts`).
- **The suite is red at baseline**: 8 suites / 58 tests fail for unrelated reasons. Judge by your own tests plus no NEW failures.
- **`brand:check` scans whole staged files.** `FullPageResults.tsx` carries pre-existing violations (raw `bg-red-100`, `text-emerald-700`, raw `z-30`, `dark:text-gray-900`). Do not fix them, and do not bypass without asking. The standing ruling is to split the commit and use `--no-verify` only for the file whose pre-existing violations block it, with the reason in the message.
- **Out of scope, do not do:** redesigning the gap cards, touching the audit scoring or analysis prompts, changing `/api/admin/audit-funnel` (it reads historical chat data and must keep working), deleting `/api/mentor/chat` (separately dead, flagged, not ours).

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `src/components/audit/GapCard.tsx` (modify) | Add a save control per gap, using the slug it already resolves | 1 |
| `src/hooks/useHandoffKit.ts` (modify) | Accept an optional `source` on save, for funnel attribution | 2 |
| `src/components/handoff/SaveToDashboardButton.tsx` (modify) | Pass `source` through | 2 |
| `src/components/audit/FullPageResults.tsx` (modify) | Mount the pack bar, remove the handoff CTA, remove the chat | 3, 4 |
| `src/app/api/audit/chat/route.ts` (delete) | The chat backend | 4 |
| `src/components/audit/ResultsPanel.tsx` (delete) | Dead component, 668 lines, rendered nowhere | 5 |
| `src/lib/audit/analytics.ts` (modify) | Retire dead event names with comments | 4 |

## Decisions this plan locks in

1. **Save replaces the copy-handoff prompt.** The audit stops having a private export; it feeds the same checkout as pattern browsing.
2. **The pack bar appears on audit results too.** This extends the earlier "pattern routes only" rule, because results are now a save surface. Without it, someone who saves three gaps gets no route onward.
3. **Saving an audit and saving its gap patterns stay independent.** A saved audit still carries its gap notes as one-shot fixes; saved patterns become skills. Deduping them is deliberately not attempted here, because the two serve different purposes and the overlap is visible at checkout.
4. **Dead event names are retired with a comment, never deleted.** Historical rows in `UiEvent` keep their names, and `/api/admin/audit-funnel` still queries them.

---

### Task 1: Save each recommended pattern from its gap card

**Files:**
- Modify: `src/components/audit/GapCard.tsx` (the slug-resolution block at lines 114-146)
- Test: `src/components/audit/__tests__/GapCard.test.tsx` (create; gitignored)

**Interfaces:**
- Consumes: `resolvePatternSlug(gap.pattern, gap.resource)` from `@/lib/audit/pattern-link` (already imported and called at line 118); `SaveToDashboardButton` from `@/components/handoff/SaveToDashboardButton`.
- Produces: no new exports. `GapCardProps` is unchanged.

**Why here:** line 118 already computes the slug for the "See how X solves this" link. The save control is the same slug used a second way, so there is no new mapping and no new failure mode. When the slug does not resolve (an external-resource gap), there is nothing savable and the card keeps only its existing link.

- [ ] **Step 1: Write the failing test**

Create `src/components/audit/__tests__/GapCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { GapCard } from '../GapCard';
import type { TopGap } from '@/types/audit';

jest.mock('@/lib/audit/analytics', () => ({ trackAuditEvent: jest.fn() }));

function makeGap(overrides: Partial<TopGap> = {}): TopGap {
  return {
    pattern: 'Human-in-the-Loop',
    status: 'missing',
    finding: 'The agent sends without asking.',
    recommendation: 'Add an approval step before send.',
    resource: null,
    ...overrides,
  } as TopGap;
}

describe('GapCard save control', () => {
  it('offers to save a gap whose pattern resolves', () => {
    render(<GapCard gap={makeGap()} index={1} />);
    expect(screen.getByRole('button', { name: /save to dashboard/i })).toBeInTheDocument();
  });

  it('still renders the pattern link alongside the save control', () => {
    render(<GapCard gap={makeGap()} index={1} />);
    expect(screen.getByRole('link', { name: /See how Human-in-the-Loop solves this/i }))
      .toHaveAttribute('href', '/patterns/human-in-the-loop');
  });

  it('offers no save control when the pattern does not resolve', () => {
    const gap = makeGap({ pattern: 'Not A Real Pattern', resource: 'https://example.com/x' });
    render(<GapCard gap={gap} index={1} />);
    expect(screen.queryByRole('button', { name: /save to dashboard/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Learn more about this pattern/i })).toBeInTheDocument();
  });

  it('has no em dash in its copy', () => {
    const { container } = render(<GapCard gap={makeGap()} index={1} />);
    expect(container.textContent).not.toContain('—');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx jest src/components/audit/__tests__/GapCard.test.tsx`
Expected: FAIL on the first test, no save button in the tree.

- [ ] **Step 3: Add the save control**

In `src/components/audit/GapCard.tsx`, add the import:

```tsx
import SaveToDashboardButton from '@/components/handoff/SaveToDashboardButton';
```

Then replace the IIFE at lines 114-146 so the resolved-slug branch renders the save control beside the existing link. Keep the external-resource and null branches exactly as they are:

```tsx
          {(() => {
            // Prefer internal /patterns/<slug> link so the audit funnels link
            // equity into pattern pages. Fall back to the external resource only
            // when no pattern matches. New tab preserves the user's audit state.
            const slug = resolvePatternSlug(gap.pattern, gap.resource);
            if (slug) {
              return (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {/* Saving here is the same action as saving from a pattern page:
                      one store, so a gap saved from an audit shows up in the same
                      pack. The link stays because reading the pattern and
                      collecting it are different intents. */}
                  <SaveToDashboardButton slug={slug} variant="full" source="audit_gap" />
                  <Link
                    href={`/patterns/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAuditEvent('audit_resource_clicked', { pattern: gap.pattern, slug })}
                    className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-accent-primary hover:underline"
                  >
                    See how {gap.pattern} solves this &rarr;
                  </Link>
                </div>
              );
            }
            if (gap.resource) {
              return (
                <a
                  href={gap.resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAuditEvent('audit_resource_clicked', { pattern: gap.pattern, external: true })}
                  className="inline-flex items-center gap-1 mt-3 text-xs text-text-tertiary hover:text-accent-primary hover:underline"
                >
                  Learn more about this pattern &rarr;
                </a>
              );
            }
            return null;
          })()}
```

Note the `source` prop does not exist yet. Task 2 adds it. Until then TypeScript will error on that line, which is expected and is why Task 2 follows immediately. If you prefer a green tree at every step, do Task 2 first.

- [ ] **Step 4: Run the test again**

Run: `npx jest src/components/audit/__tests__/GapCard.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/audit/GapCard.tsx
git commit -m "feat(audit): save a recommended pattern as a skill from its gap card"
```

---

### Task 2: Attribute saves to where they happened

**Files:**
- Modify: `src/hooks/useHandoffKit.ts` (`add` and `toggle`)
- Modify: `src/components/handoff/SaveToDashboardButton.tsx` (props)
- Test: `src/hooks/__tests__/useHandoffKit.test.ts` (create; gitignored)

**Interfaces:**
- Produces: `add(slug: string, source?: string)`, `toggle(slug: string, source?: string)`, and a `source?: string` prop on `SaveToDashboardButton`. Both optional, so every existing call site keeps working untouched.

**Why:** the whole point of this change is to learn whether the audit drives saves. `dashboard_pattern_saved` already fires on every save from every surface; without a `source` it cannot tell an audit save from a pattern-page save. This is a property on an existing event, deliberately not a new event name, so the total stays intact.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/__tests__/useHandoffKit.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react';
import { useHandoffKit } from '../useHandoffKit';

const trackAuditEvent = jest.fn();
jest.mock('@/lib/audit/analytics', () => ({
  trackAuditEvent: (...args: unknown[]) => trackAuditEvent(...args),
}));
jest.mock('../../utils/analytics', () => ({ trackEvent: jest.fn() }));

beforeEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();
});

describe('useHandoffKit source attribution', () => {
  it('passes the source through on add', () => {
    const { result } = renderHook(() => useHandoffKit());
    act(() => result.current.add('human-in-the-loop', 'audit_gap'));
    expect(trackAuditEvent).toHaveBeenCalledWith(
      'dashboard_pattern_saved',
      expect.objectContaining({ slug: 'human-in-the-loop', source: 'audit_gap' }),
    );
  });

  it('omits source when the caller does not give one', () => {
    const { result } = renderHook(() => useHandoffKit());
    act(() => result.current.add('progressive-disclosure'));
    const call = trackAuditEvent.mock.calls.find((c) => c[0] === 'dashboard_pattern_saved');
    expect(call?.[1]).not.toHaveProperty('source');
  });

  it('prunes slugs that are not real patterns when reading the store', () => {
    window.localStorage.setItem('aiux-handoff-kit', JSON.stringify(['citations', 'human-in-the-loop']));
    const { result } = renderHook(() => useHandoffKit());
    expect(result.current.savedSlugs).toEqual(['human-in-the-loop']);
    expect(result.current.count).toBe(1);
  });

  it('refuses to add a slug that is not a real pattern', () => {
    // Guards the write path, not just the read path. Without this, add() puts a
    // bogus slug into state and fires a save event for it; the value only
    // disappears on the next read, so the count is briefly wrong and the
    // analytics row is permanently wrong.
    const { result } = renderHook(() => useHandoffKit());
    act(() => result.current.add('not-a-pattern'));
    expect(result.current.savedSlugs).toEqual([]);
    expect(trackAuditEvent).not.toHaveBeenCalledWith('dashboard_pattern_saved', expect.anything());
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx jest src/hooks/__tests__/useHandoffKit.test.ts`
Expected: FAIL, the event fires without a `source` key.

- [ ] **Step 3: Thread `source` through the hook**

In `src/hooks/useHandoffKit.ts`, change `add` and `toggle` to take an optional source and include it only when present, so existing payloads are byte-identical:

```ts
  const add = useCallback((slug: string, source?: string) => {
    // Guard the write path too. `readStore` already prunes unknown slugs, but
    // without this an add() of a bogus slug lands in state and fires a save
    // event before the next read cleans it up: a briefly wrong count and a
    // permanently wrong analytics row.
    if (!isKnownPatternSlug(slug)) return;
    const current = readStore();
    if (current.includes(slug)) return;
    const next = [...current, slug];
    writeStore(next);
    setSlugs(next);
    trackEvent('handoff', { action: 'add', slug, count: next.length });
    // `source` is omitted rather than sent as undefined so historical payloads
    // and new ones stay directly comparable.
    trackAuditEvent('dashboard_pattern_saved', { slug, count: next.length, ...(source ? { source } : {}) });
  }, []);
```

Apply the same shape to `toggle`'s add branch (including the `isKnownPatternSlug` guard), and to its remove branch for `dashboard_pattern_removed`. `remove` needs no guard: removing an unknown slug is exactly how a user would clear a ghost, so it must keep working.

- [ ] **Step 4: Thread it through the button**

In `src/components/handoff/SaveToDashboardButton.tsx`, add `source?: string` to the props interface with a comment explaining it is funnel attribution, and pass it: `toggle(slug, source)`.

- [ ] **Step 5: Run the tests**

Run: `npx jest src/hooks/__tests__/useHandoffKit.test.ts src/components/audit/__tests__/GapCard.test.tsx`
Expected: PASS, 7 tests total.

- [ ] **Step 6: Type-check and commit**

```bash
npx tsc --noEmit
git add src/hooks/useHandoffKit.ts src/components/handoff/SaveToDashboardButton.tsx
git commit -m "feat(handoff): attribute saves to the surface they came from"
```

---

### Task 3: Results route to checkout instead of exporting themselves

**Files:**
- Modify: `src/components/audit/FullPageResults.tsx` (the sidebar handoff card at 1124-1171, the mobile sticky CTA at 1379-1400, and the state/handler at 520-522 and 635-666)

**Interfaces:** consumes `SavedItemsBar` from `@/components/handoff/SavedItemsBar`. No new exports.

**Why:** with each gap savable, a separate "copy one prompt with all the gaps" button is a second export competing with checkout, and the data says it is used 6 times ever. Removing it leaves one way forward.

- [ ] **Step 1: Delete the sidebar handoff card**

Remove the whole `{issues.length > 0 && (() => { ... })()}` block at lines 1124-1171, including its `composeHandoffPrompt` call and the "Inspect prompt" disclosure. Leave the screenshot, save, email, and audit-facts cards beneath it untouched.

- [ ] **Step 2: Replace the mobile sticky CTA with the pack bar**

Remove the mobile sticky handoff block at lines 1379-1400 and mount the shared bar instead, so mobile and desktop use the same affordance:

```tsx
      <SavedItemsBar />
```

The bar hides itself when nothing is saved, so no gate is needed. It is `fixed bottom-0 z-sticky`, replacing a block that used a raw `z-30`, which also removes one token violation from this file.

- [ ] **Step 3: Remove the now-dead handoff state and handler**

Delete `handoffCopied`, `showHandoffSource` (lines 520-522) and the whole `handleCopyHandoff` callback (lines 635-666). Then remove the `composeHandoffPrompt` import at line 16 if nothing else in the file uses it, and `productTypeLabel` only if it is likewise unused. Check before deleting either.

- [ ] **Step 4: Retire the dead event names**

In `src/lib/audit/analytics.ts`, leave `audit_handoff_copied` and `audit_inspect_prompt_toggled` in the array, each with a comment: retired 2026-08-11, the audit results page now routes to checkout. Deleting them would break `/api/admin/audit-funnel`, which queries historical rows by name.

- [ ] **Step 5: Verify nothing else referenced them**

```bash
grep -rn "handleCopyHandoff\|handoffCopied\|showHandoffSource\|audit_handoff_copied\|audit_inspect_prompt_toggled" src/ | grep -v node_modules
```
Expected: only the retired names in `analytics.ts` and the queries in `src/app/api/admin/audit-funnel/route.ts`.

- [ ] **Step 6: Type-check, test, and commit**

```bash
npx tsc --noEmit
npx jest src/components/audit
git add src/components/audit/FullPageResults.tsx src/lib/audit/analytics.ts
git commit -m "feat(audit): results route to checkout instead of their own export"
```

If the husky hook rejects this commit for pre-existing violations in `FullPageResults.tsx`, stop and report rather than bypassing. The standing ruling permits `--no-verify` for exactly that case, but confirm it applies before using it.

---

### Task 4: Remove the chat

**Files:**
- Modify: `src/components/audit/FullPageResults.tsx`
- Delete: `src/app/api/audit/chat/route.ts`
- Modify: `src/lib/audit/analytics.ts`

**Why:** 6 messages from 2 people in the product's lifetime, dormant since 2026-07-16.

- [ ] **Step 1: Remove the chat from the results component**

Delete, in this order so the file stays parseable:
1. The conversation UI block around lines 1040-1110 (heading, message list, suggestion chips, empty state).
2. The desktop floating chat input around lines 1349-1370.
3. `sendMessage` (lines 578-633) and the scroll effect at 573-575.
4. The state at lines 524-528 (`messages`, input value, loading, `chatScrollRef`).
5. `FormattedChatMessage` (line 170) and the `ChatMessage` interface (line 59).
6. The `chatContext` prop at line 36 if nothing else reads it, and the `ChatBubbleLeftRightIcon` import at line 5.

Do not remove `DemoChatMockup` (line 25). Despite the name it is a marketing mockup of a chat product on the demo landing, not the chat feature.

- [ ] **Step 2: Delete the backend**

```bash
rm src/app/api/audit/chat/route.ts
```

- [ ] **Step 3: Retire the event name**

Leave `audit_chat_message_sent` in `AUDIT_EVENT_NAMES` with a comment: retired 2026-08-11, 6 events from 2 sessions, last 2026-07-16. `/api/admin/audit-funnel/route.ts:93,179,185` queries it for historical funnel numbers and must keep working.

- [ ] **Step 4: Verify the blast radius**

```bash
grep -rn "audit/chat\|sendMessage\|ChatMessage\|chatScrollRef\|FormattedChatMessage" src/ | grep -v node_modules
```
Expected: only `ResultsPanel.tsx` (deleted in Task 5) and the admin funnel's historical queries.

- [ ] **Step 5: Confirm the page still renders**

Run the dev server and load a results view via the E2E mock path, then confirm the H1 and gap cards render and the console is clean. `E2E_MODE` and the `runOneAudit()` helper in `e2e/` drive the funnel without a live model call.

- [ ] **Step 6: Commit**

```bash
git add -A src/components/audit/FullPageResults.tsx src/app/api/audit src/lib/audit/analytics.ts
git commit -m "feat(audit): remove the results chat"
```

---

### Task 5: Delete the dead ResultsPanel

**Files:** delete `src/components/audit/ResultsPanel.tsx` (668 lines)

**Why:** rendered nowhere. The only mention in the codebase is a stale comment in `src/app/api/patterns/analyze/route.ts:326` about backward compatibility. It carries its own copy of the chat, so leaving it would leave chat code in the tree after Task 4.

- [ ] **Step 1: Prove it is unreferenced**

```bash
grep -rn "ResultsPanel" src/ e2e/ | grep -v node_modules | grep -v "ResultsPanel.tsx:"
```
Expected: only the comment at `src/app/api/patterns/analyze/route.ts:326`. **If anything else appears, stop.**

- [ ] **Step 2: Delete it and update the stale comment**

```bash
rm src/components/audit/ResultsPanel.tsx
```

Reword the comment at `analyze/route.ts:326` so it stops naming a component that no longer exists, while keeping the legacy fields it describes.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
npm test
git add -A src/components/audit src/app/api/patterns/analyze/route.ts
git commit -m "chore(audit): delete the unrendered ResultsPanel"
```

---

## Final verification

- [ ] `npx tsc --noEmit` shows no NEW errors against baseline.
- [ ] `npm run lint` shows no new errors in touched files.
- [ ] `npm test` has no NEW failures against the 8-suite / 58-test baseline.
- [ ] `npx playwright test` (or the `e2e.yml` job) passes. The audit E2E drives this exact page, and it is the strongest guard against a botched extraction from a 1,459-line component.
- [ ] `grep -rn '—' src/components/audit/GapCard.tsx src/components/audit/FullPageResults.tsx` returns nothing.
- [ ] Manual: run an audit with `E2E_MODE`, save two gap patterns, confirm the bar appears and the count matches, follow it to checkout, confirm both patterns are listed and download a pack containing both skills.
- [ ] Manual: confirm the demo landing above-fold content still renders server-side (view source, look for the H1) so the LCP element was not disturbed.
- [ ] `git diff master --stat` shows no change to `/api/admin/audit-funnel/route.ts` and no deletion of any event name from `AUDIT_EVENT_NAMES`.

## Spec coverage

| Decision | Task |
|---|---|
| Recommended patterns savable as skills | 1 |
| Save routes to checkout, audit loses its private export | 3 |
| Measure whether the audit drives saves | 2 |
| Remove the chat entirely | 4 |
| No dead code left behind | 4, 5 |
| Historical analytics keep working | 3, 4 (retire not delete), final verification |
