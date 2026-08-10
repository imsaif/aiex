# Pattern Skills: patterns as Claude Code skills + dashboard skill pack

**Date:** 2026-08-10
**Status:** Approved design, pending implementation plan

## Problem

Each pattern page ships a one-shot `installPrompt` ("Copy prompt for Claude Code") and the dashboard composes a one-file markdown handoff from saved patterns and audits. A prompt runs once; a **Claude Code skill** persists in the user's repo (`.claude/skills/`) and shapes every future design conversation. Patterns are persistent design guidance, so the skill is the better artifact for the "design better with these patterns" job.

## Decisions (made during brainstorming)

1. **Skill job:** persistent design advisor — the skill triggers whenever the user works on relevant UI, not a one-shot installer.
2. **Dashboard export shape:** a skill *pack* — zip of separate per-pattern skills, each with its own sharp trigger description. Not one merged master skill (a single description covering many patterns triggers mushily).
3. **Pattern page CTA:** the "Copy prompt for Claude Code" card is **replaced** by the skill card. The `installPrompt` data field stays (audit flow + composer fallback still use it).
4. **Skill content:** generated from existing pattern fields, with an optional authored `skillDescription` override for hand-tuning trigger lines.
5. **Approach:** curl-able per-skill URLs + client-side pack zip (Approach A below).

## Design

### 1. Skill composer — `src/lib/skills/composeSkill.ts`

Pure module, sibling to `src/lib/handoff/composeHandoff.ts`.

- `composeSkillMd(pattern: Pattern): string` — full SKILL.md content:
  - YAML frontmatter: `name: aiux-<slug>`, `description:` = trigger line.
  - Trigger line: `pattern.content.skillDescription` when present; else generated fallback: `Use when <pattern.description, lowercased/trimmed> — apply the <title> pattern.`
  - Body, framed as persistent guidance (not one-shot install language):
    - `# <title>`
    - `Why it matters: <content.problem || description>`
    - `## The moves` — numbered list from `takeaways` (heading + body); fallback to first 5 `guidelines` when takeaways are absent (same precedence as `patternMoves()` in composeHandoff).
    - `Reference: https://aiuxdesign.guide/patterns/<slug>`
    - Closing guidance: make the smallest change that genuinely realises the pattern.
- `skillName(pattern): string` → `aiux-<slug>` (slugs are already lowercase-hyphenated, valid skill names).
- New optional field `skillDescription?: string` on the pattern content type (`src/types/index.ts`) and Zod schema (`src/schemas/pattern.schema.ts`). No pattern data changes required to ship; overrides are authored over time where generated triggers are weak.

### 2. Serving route — `/skills/[slug].md`

Static route handler:

- `export const dynamic = 'force-static'` + `generateStaticParams` over all 38 patterns.
- Returns `composeSkillMd(pattern)` with `Content-Type: text/markdown; charset=utf-8`.
- Unknown slug → 404.

Powers the copyable install command:

```
mkdir -p .claude/skills/aiux-<slug> && curl -fsSL https://aiuxdesign.guide/skills/aiux-<slug>.md -o .claude/skills/aiux-<slug>/SKILL.md
```

### 3. Pattern page CTA — `src/components/Pattern/InstallPatternCTA.tsx`

The card becomes **"Add this pattern as a Claude skill"**:

- Primary action: copy the install command (one-liner above).
- Secondary action: "Download SKILL.md" — Blob download of `composeSkillMd(pattern)`.
- The existing "Inspect before you copy" disclosure previews the skill content instead of the install prompt.
- `installPrompt` remains in the data; only the card presentation changes.

### 4. Dashboard skill pack — `src/app/dashboard/dashboard-client.tsx`

The export CTA becomes **"Download skill pack"**:

- Client-side zip via `fflate` (new dependency), dynamically imported on click so it adds nothing to the initial bundle.
- Zip structure — unzips directly at repo root:

```
README.md                                  ← what this is, where things go
.claude/skills/aiux-<slug-1>/SKILL.md
.claude/skills/aiux-<slug-2>/SKILL.md
aiux-audit-fixes.md                        ← only when saved audits exist
```

- **Saved audits stay handoff-shaped**: one-shot fixes ride along as a markdown task file inside the zip (composed from the existing audit handoff logic). They do not become skills.
- Audits-only, no saved patterns → keep today's plain `.md` Blob download unchanged.
- Dashboard hero + empty-state copy updates from "generate one handoff file" to the skill-pack story.

### 5. Analytics

New `trackAuditEvent` events, alongside the existing ones:

- `skill_install_command_copied` (pattern page)
- `skill_file_downloaded` (pattern page)
- `skill_pack_downloaded` (dashboard; payload includes pattern + audit counts)

### 6. Testing

- Unit tests for `composeSkillMd`: valid YAML frontmatter, `skillDescription` override vs generated fallback, takeaways present vs guidelines fallback.
- Route handler smoke test (`/skills/human-in-the-loop.md` → 200 + markdown; unknown slug → 404).
- Update the existing pattern-page structure test (`src/app/patterns/[slug]/__tests__/pattern-page-structure.test.tsx`) for the new card.
- Dashboard: test that pack export includes one skill folder per saved pattern and the audit file only when audits exist.

## Out of scope (deliberate)

- Sitemap entries for `/skills/*` URLs.
- A Claude Code plugin / marketplace listing.
- Skills generated from audits.
- Hand-authoring all 38 `skillDescription` trigger lines up front.

## Error handling

- Route: unknown slug 404s; composer never throws on missing optional fields (every field used has a fallback chain).
- Dashboard: `fflate` dynamic import failure surfaces the existing download-error toast path; no partial zips.

## Success criteria

- Every one of the 38 patterns serves a valid SKILL.md at `/skills/<slug>.md` (valid frontmatter, non-empty moves).
- Pattern page card copy-command works end to end: paste in a repo → Claude Code lists the skill.
- Dashboard pack unzips at repo root into working `.claude/skills/` entries.
- `avoid-em-dashes` holds in all new user-facing copy.
