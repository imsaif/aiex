# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application showcasing AI design patterns with TypeScript, React 19, and Tailwind CSS. The project has **all 36 AI design patterns fully completed** across 8 categories, with complete implementations including code examples, interactive demos, real-world examples, and design guidance.

### Pattern Status Summary
- **✅ All Patterns Complete (36/36)**: Every pattern has complete implementations with code examples, interactive demos, real-world examples, guidelines, considerations, and Figma design prompts

### All Patterns - Complete (36/36)
1. ✅ Adaptive Interfaces
2. ✅ Ambient Intelligence (Oct 17)
3. ✅ Anti-Manipulation Safeguards (Nov 11)
4. ✅ Augmented Creation
5. ✅ Collaborative AI
6. ✅ Confidence Visualization
7. ✅ Context Switching (Nov 2)
8. ✅ Contextual Assistance
9. ✅ Conversational UI
10. ✅ Crisis Detection & Escalation (Nov 11)
11. ✅ Error Recovery
12. ✅ Explainable AI
13. ✅ Feedback Loops (Nov 2)
14. ✅ Graceful Handoff (Nov 2)
15. ✅ Guided Learning
16. ✅ Human-in-the-Loop
17. ✅ Intelligent Caching (Nov 3)
18. ✅ Multimodal Interaction
19. ✅ Predictive Anticipation
20. ✅ Privacy-First Design (Nov 7)
21. ✅ Progressive Disclosure
22. ✅ Progressive Enhancement (Nov 7)
23. ✅ Responsible AI Design
24. ✅ Safe Exploration (Oct 21)
25. ✅ Selective Memory
26. ✅ Session Degradation Prevention (Nov 11)
27. ✅ Universal Access Patterns (Nov 7)
28. ✅ Vulnerable User Protection (Nov 11)
29. ✅ Autonomy Spectrum (Feb 16) 🤖
30. ✅ Intent Preview (Feb 16) 🤖
31. ✅ Plan Summary (Feb 16) 🤖
32. ✅ Action Audit Trail (Feb 16) 🤖
33. ✅ Escalation Pathways (Feb 16) 🤖
34. ✅ Trust Calibration (Feb 16) 🤖
35. ✅ Mixed-Initiative Control (Feb 16) 🤖
36. ✅ Agent Status & Monitoring (Feb 16) 🤖

### Pattern Categories (8 Total)

#### Accessibility & Inclusion (1 pattern)
  - Universal Access Patterns

#### Adaptive & Intelligent Systems (4 patterns)
  - Adaptive Interfaces
  - Ambient Intelligence
  - Guided Learning
  - Predictive Anticipation

#### Human-AI Collaboration (10 patterns)
  - Augmented Creation
  - Collaborative AI
  - Contextual Assistance
  - Feedback Loops
  - Graceful Handoff
  - Human-in-the-Loop
  - Autonomy Spectrum 🤖
  - Intent Preview 🤖
  - Escalation Pathways 🤖
  - Mixed-Initiative Control 🤖

#### Natural Interaction (4 patterns)
  - Context Switching
  - Conversational UI
  - Multimodal Interaction
  - Progressive Disclosure

#### Performance & Efficiency (3 patterns)
  - Intelligent Caching
  - Progressive Enhancement
  - Agent Status & Monitoring 🤖

#### Privacy & Control (2 patterns)
  - Privacy-First Design
  - Selective Memory

#### Safety & Harm Prevention (4 patterns)
  - Anti-Manipulation Safeguards
  - Crisis Detection & Escalation
  - Session Degradation Prevention
  - Vulnerable User Protection

#### Trustworthy & Reliable AI (8 patterns)
  - Confidence Visualization
  - Error Recovery
  - Explainable AI
  - Responsible AI Design
  - Safe Exploration
  - Plan Summary 🤖
  - Action Audit Trail 🤖
  - Trust Calibration 🤖

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbo (http://localhost:3000)
- `npm run build` - Full production build with image optimization and analysis
- `npm run build:production` - Production build with NODE_ENV=production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - CI mode tests (no watch, with coverage)
- `npm run test:patterns` - Test pattern data validation only
- `npm run test:components` - Test components only

### AI-Powered Development Tools
- `npm run generate-pattern` - Generate new AI pattern using AI
- `npm run generate-all-patterns` - Generate all missing patterns
- `npm run list-patterns` - List all pattern statuses
- `npm run generate-guide` - Generate Designer Guide learning paths (NEW!)
- `npm run list-guides` - List all guides and completion status (NEW!)
- `npm run validate-guides` - Validate guide structure (NEW!)
- `npm run generate-test` - Generate tests for components using AI
- `npm run generate-all-tests` - Generate all missing tests
- `npm run list-untested` - List components without tests

### Automation & Agent Orchestration (NEW - Nov 3, 2025)
- `npm run orchestrate:workflow guide-generation` - Run guide generation workflow
- `npm run orchestrate:workflow aiux-sprint` - Full AIUX feature development sprint
- **See [.claude/AUTOMATION-SETUP.md](.claude/AUTOMATION-SETUP.md) for complete automation documentation**

**Key Feature**: Claude now **automatically detects** when you mention patterns or guides and proactively suggests the appropriate generator commands. This is powered by enhanced skills in `.claude/skills/pattern-dev/` and `.claude/skills/guide-gen/`.

### Project Progress & Coordination
- `npm run progress-report` - Comprehensive progress report with agent activities
- `npm run progress-status` - Quick project status summary
- `npm run progress-agents` - Show all AI agent status and recent activities
- `npm run progress-next` - Get next priority actions with agent suggestions
- `npm run progress-update` - Update task status based on agent activities
- `npm run progress-sync` - Synchronize all status files with current state

### Design Consistency Tools
- `npm run design-audit` - Scan for hardcoded colors and design token violations (runs on every commit)
- `npm run design-analyze` - Analyze design consistency
- `npm run design-report` - Generate design consistency report
- `npm run design-style-guide` - Generate style guide
- `npm run design-fix` - Fix single design issue
- `npm run design-fix-all` - Fix all design issues
- **See** [Design System Enforcement](docs/DESIGN_SYSTEM_ENFORCEMENT.md) for automatic pre-commit validation

### Image & Asset Management
- `npm run optimize-images` - Optimize all images (WebP, AVIF, compression)
- `npm run convert-gifs` - Convert GIFs to WebM/MP4 for better performance

### Data Management
- `npm run fix-patterns` - Fix pattern data structure issues

### Newsletter & Email Management
- `npm run send-newsletter` — generate a pattern-update HTML blob that admin pastes into a new Beehiiv post
- Newsletter broadcasts via **Beehiiv (manual compose)**: admin clicks Publish in our admin UI → post goes live on /news → admin clicks "Copy HTML" → pastes into a new Beehiiv post → Beehiiv sends to subscribers. Beehiiv free/Launch tier has no Posts API, so delivery is intentionally manual.
- Welcome emails via **Beehiiv Automations** (keyed on `signup_source` custom field, triggered by subscriber sync).
- Transactional emails (audit reports, admin watchdog alerts, cron failure alerts) via **Resend free tier** — ~150 emails/month, well under the 3,000/month cap.
- See [Newsletter Documentation](docs/NEWSLETTER.md) for complete setup and usage guide

## My Development Workflow

### ⚡ Automated Workflow System (NEW - Nov 3, 2025)
**Claude is now configured with automated pattern and guide generation.**

Instead of manually managing tasks, Claude will:
1. **Detect intent** - When you mention "pattern", "guide", "generate", etc.
2. **Auto-suggest** - Proactively recommend the right generator
3. **Explain what happens** - Show what the command will do
4. **Coordinate agents** - Work with test-gen, design agents, etc.

**See [.claude/AUTOMATION-SETUP.md](.claude/AUTOMATION-SETUP.md) for full documentation**

**Quick examples of new behavior**:
- You: "Let's work on Ambient Intelligence"
- Claude: "Ready to generate? Run: `npm run generate-pattern ambient-intelligence`"

- You: "Create a guide for GitHub Copilot"
- Claude: "I'll generate a learning path using your existing guides as templates. Run: `npm run generate-guide`"

This automation system includes:
- ✅ Enhanced pattern-dev skill (`.claude/skills/pattern-dev/SKILL.md`)
- ✅ New guide-gen skill (`.claude/skills/guide-gen/SKILL.md`)
- ✅ Guide generator script (`.scripts/ai-guide-generator.js`)
- ✅ Updated agent orchestrator with guide support

### Pattern Update Workflow (Primary)
**I work on ONE pattern at a time until 100% complete.** Do not move to the next pattern until the current one is finished.

**Now with automation**: Instead of manually creating all files, run `npm run generate-pattern [slug]` and then enhance with images and content.

#### Pattern Completion Checklist
When working on a pattern, ensure ALL of these are completed:
- [ ] Review existing pattern content and structure
- [ ] Update/add code examples (working implementations)
- [ ] Add/update images and visual examples
- [ ] Write/improve text content (description, use cases)
- [ ] Write/update guidelines and considerations
- [ ] Create/update Figma design prompts
- [ ] Build/update interactive demo component
- [ ] Add/update component tests for demo
- [ ] Validate pattern with `npm run test:patterns`
- [ ] Review pattern in browser (http://localhost:3000)
- [ ] Ensure all assets are optimized

#### Pattern Development Process
1. **Select Pattern**: Choose one pattern from the 12 requiring updates
2. **Review Current State**: Check what exists and what's missing
3. **Work Through Checklist**: Complete items one by one
4. **Validate**: Run tests and review in browser
5. **Mark Complete**: Only when ALL checklist items are done
6. **Move to Next**: Select the next pattern to update

**⚠️ Important Rule**: Stay focused on ONE pattern. Don't jump to another pattern until current one is 100% complete with all checklist items done.

## Current Work Session

### Active Pattern
**Pattern:** None (Select next pattern to work on)
**Status:** Not Started
**Started:** N/A

### Pattern Checklist Progress
- [ ] Code examples
- [ ] Images
- [ ] Text content
- [ ] Guidelines
- [ ] Considerations
- [ ] Figma prompts
- [ ] Demo component
- [ ] Component tests
- [ ] Validation passed
- [ ] Browser review complete

### Next Patterns in Queue
1. [To be selected from 12 remaining patterns]
2. [Second in queue]
3. [Third in queue]

### Session Notes
[This section is automatically updated by /save command]

## Recent Sessions

_This section tracks the last 10 work sessions across all machines. It's automatically updated by the /save command._
### Session 2026-05-12 21:20 (MacBook)
- **Pattern:** Audit-intent subscriber tagging split + Beehiiv welcome HTML templates + send-report email design alignment
- **Status:** ✅ Completed
- **Files Changed:** 7
- **Tests Added/Modified:** 0
- **Notes:** User asked where homepage hero email-form signups land in Beehiiv after the May 7 audit-first reposition, and how to distinguish them from the patterns-era homepage cohort. Walked through the full surface inventory: `DemoStartForm` in `FullPageResults.tsx:888-979` fires `POST /api/newsletter/subscribe` with `source: 'homepage-hero'` only when the opt-in checkbox is ticked (audit-skip subscribers are invisible — no row created); routes to Prisma + Beehiiv with `signup_source` custom field. **Tag split.** Renamed the homepage-hero source to `homepage-hero-pre-audit` (audit-curious — opted into news before running) so it's distinguishable from the post-audit cohorts (`audit` from SaveResultsCard, `audit-report` from EmailReportModal, `audit-waitlist` from PaywallInlineCapture). Kept legacy `homepage-hero` value in the enum so transitional May 7 → today rows stay valid. Two-line code change: added `homepage-hero-pre-audit` to `NEWSLETTER_SOURCES` in `src/types/newsletter.ts:22`, swapped the `source:` value in `FullPageResults.tsx:913`. **Beehiiv welcome templates (3).** Built three copy-paste HTML files in new `docs/email-templates/` directory matching the newsletter publish design system (DM Sans wrapper, navy `#162036` ink, `#64748b` muted, `#e5e7eb` hairlines, white card on default page bg, 640px max-width — same tokens as `EMAIL_INK`/`EMAIL_MUTED`/`EMAIL_HAIRLINE` in `src/app/api/cron/generate-newsletter/route.ts:1199-1205`). Files: `homepage-hero-pre-audit.html` (soft welcome — "your daily AI UX brief starts tomorrow" + 3-link starter pack: patterns/Claude Code course/news), `audit-saved.html` (for `signup_source = audit` from SaveResultsCard local-download path — followup with 3 high-leverage patterns: Confidence Visualization/Error Recovery/Explainable AI), `audit-waitlist.html` (waitlist confirmation — keeps `$9` price as transparency since recipient has already committed; user can drop if they want). Each file has `<!-- subject: ... -->` and `<!-- preheader: ... -->` comments to copy into Beehiiv subject/preview fields. **Caught my own mistake mid-session.** User asked to verify there wasn't already a post-audit email — there was: `EmailReportModal` triggers `POST /api/audit/send-report` which sends a comprehensive transactional report email via Resend immediately (subject `Your AI UX Audit Report - Score: X/Y`, full per-user HTML with score/findings/actions). Originally I'd designed an `audit-followup.html` template targeting both `audit` and `audit-report` — that would've been a duplicate "welcome" minutes after the substantive Resend report. Fixed: renamed file to `audit-saved.html`, narrowed trigger to `signup_source = audit` only (the SaveResultsCard cohort that gets nothing besides the local download); added explicit warning to `README.md` to NOT create a Beehiiv Automation for `audit-report` since the Resend transactional IS the welcome. **send-report email design alignment.** User then asked to update the Resend report email to match the same design system as the newsletter + welcome templates. Surgical refactor of `src/app/api/audit/send-report/route.ts:245-471`: kept the report's content structure (it works — header / what-we-analyzed / executive summary / strengths / top 3 actions / "if you fix one thing" / full breakdown / CTA / footer) but swapped every visual token. Font stack `-apple-system, ...` → `'DM Sans', -apple-system, ...`. Muted `#6b7280` → `#64748b`. Body copy `#4b5563` → `#162036` (use ink for max contrast). Soft callout bg `#f9fafb` → `#f8fafc`. Dropped forced page bg `#f5f5f5` (now respects email client). Max-width 680 → 640. **Layout shift**: replaced the navy header band + 6 stacked sections each with simulated left/right card borders → single white rounded card (14px radius, 1px hairline) with internal sections divided by top-borders, matching the newsletter publish format. CTA button: 6px → 8px radius with letter-spacing to match the cron's "Explore all guides" button. Footer: separate footer band → outside-the-card centered "Imran · aiuxdesign.guide" sign-off + unsubscribe links matching welcome template footer pattern. Net effect: all 5 surfaces (newsletters, audit-report transactional, 3 Beehiiv welcomes) now share the same DM Sans / navy / hairline / 640px / single-card visual language. **Test send.** User asked "send myself a test report." Two snags: (1) the dev server already running on port 3000 was rooted at a stale worktree (`.claude/worktrees/frosty-jennings-10e4df/`) so my edits weren't loaded; (2) that worktree's prisma client was missing (`Module not found: Can't resolve '../generated/prisma'` — needs `npx prisma generate`). Started a fresh dev server in the actual repo on port 3010 via `PORT=3010 npm run dev` (background job `buz4ehx8y`); waited for ready via curl loop; built a synthetic payload at `/tmp/audit-report-test-payload.json` exercising every visual surface (4 well-implemented + 3 weak + 4 missing patterns including all 3 high-priority items, full productContext with chat-interface type, summary + benchmark + critical missing arrays, etc.); POST returned 200 + "Report sent successfully! Check your inbox." to misaif20@gmail.com. **Verification.** `npx tsc --noEmit` — only pre-existing test mock errors in `audit-send-report.test.ts` unchanged (test types diverged from the function signatures sometime before this session, documented in CLAUDE.md as test-mock divergence). HTML div-balance verified via awk extraction — 12 open / 12 close inside the template literal. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. **Outstanding follow-ups.** (a) **Beehiiv dashboard wiring** — user needs to create three Automations: `signup_source = homepage-hero-pre-audit` → soft welcome; `signup_source = audit` → audit-saved followup; `signup_source = audit-waitlist` → waitlist confirmation. Do NOT create one for `audit-report` (Resend transactional already serves that role). (b) **Visual eyeball test** — open the test report email in Gmail web + mobile and Apple Mail; compare side-by-side with yesterday's daily newsletter to confirm DM Sans behavior and hairline rendering. Most desktop email clients lack DM Sans installed so they'll fall back to `-apple-system` (same behavior as the existing newsletter — already validated visually in past sessions). (c) **Two dev servers running** — original on port 3000 (worktree, stale) + the one I started on port 3010 for this test. User can kill the 3010 one with `lsof -ti:3010 | xargs kill` or by killing background job `buz4ehx8y`. The worktree server should also probably be killed since it's not loading current code. (d) **`audit-saved.html` hard-codes 3 pattern recommendations** (Confidence Visualization, Error Recovery, Explainable AI) — these are the universally applicable ones, but a recipient who just audited a chatbot may have just been told these are weak in their own design — could read as either reinforcing or repetitive. Easy to swap if user wants different recommendations. (e) **`audit-waitlist.html` mentions `$9`** — kept for transparency since recipient already committed by joining the waitlist (different psychological surface than the modal where price was dropped per May 1 session). User should sanity-check this matches their pricing intent before publishing. (f) **No retroactive re-tag** — existing daily-newsletter subscribers who tick the homepage-hero checkbox won't get their `signup_source` re-stamped (the `/api/newsletter/subscribe` route short-circuits on "already subscribed" per May 1 notes). If user wants re-tagging on every submit, copy the `audit-waitlist` route's pattern: awaited Beehiiv sync via `addSubscriberToBeehiiv` with `reactivate_existing: true` re-stamps the field on every call. (g) **`update-memory.sh` again emitted a stray `0` line** into the new session block (fourth recurrence per `feedback_save_script_ordering.md`). Hand-cleaned in this Notes block; worth patching the script. (h) Three pre-existing untracked files left alone per established pattern (`.claude/worktrees/`, `.dwic/`, `scripts/inject-hoang-cta.mjs`) plus `docs/building-trust-into-an-llm-audit-tool.md` (carried in from a prior session, intentionally not auto-committed).


### Session 2026-05-11 18:57 (MacBook)
- **Pattern:** Audit tool quality testing — Week 1 (parser/schema hardening) + Week 2 (golden-corpus eval framework) + first prompt-tune iteration
- **Status:** ✅ Completed (Bugs 1-3 fixed; Bug 4 — CV/XAI scope on conversational vs research — gated on adding a research/citation fixture)
- **Files Changed:** 20
- **Tests Added/Modified:** 13
- **Notes:** Multi-hour audit-quality session. User asked how to thoroughly QA the audit tool. Built a 4-week testing strategy plan at `~/.claude/plans/staged-purring-hoare.md`, then executed Week 1 + Week 2 + a first prompt-tune iteration in this session. **Week 1 — Stop-the-bleed (DONE).** (a) Added Zod schemas (`TopGapSchema`, `ClaudeAnalysisResponseSchema`) to `src/types/audit.ts` alongside existing TS types. (b) Created `src/lib/audit/parseAnalysis.ts` with a brace-balancing JSON extractor (replaces the fragile `\{[\s\S]*\}` greedy regex at the old `analyze/route.ts:147`) + Zod-validated `parseAnalysisResponse()` returning a typed Result that never throws. Handles markdown fences, prose preamble, nested objects, escaped quotes, truncated JSON, trailing commas — all unit-tested. (c) Wired the parser into `src/app/api/patterns/analyze/route.ts` — schema failures now return 502 with `reason` + `detail` + 2KB raw-text snippet logged, instead of generic 500 with no signal. (d) 40 new Jest tests across `src/lib/audit/__tests__/parseAnalysis.test.ts` (25 fuzz cases) + `prompts.test.ts` (15 tests + 5 snapshots). Snapshot tests explicitly guard the Apr 28 "lead with pattern X" regression by asserting evidence-first hard rules + agentic-block ONLY-on-ai-agent routing. **Discovered the repo's gitignore line 27 (`**/__tests__/`) silently ignores all test files** — only `src/app/api/__tests__/setup.ts` is currently tracked. Force-added the audit `__tests__/` directory in this commit since these are load-bearing regression guards. Larger gitignore cleanup is out of scope but flagged as follow-up. **Week 2 — Eval framework (DONE) + first corpus (PARTIAL).** Built `tests/audit-evals/` infrastructure: `types.ts` (Zod schemas for `ExpectedFixture` + judge scores + report), `judge.ts` (Claude Sonnet 4 vision LLM-as-judge with 5-axis rubric — faithfulness, specificity, patternFit, actionability, noFabrication), `run.ts` (loads fixtures, calls the PRODUCTION `buildSystemPrompt`/`buildUserPrompt`/`parseAnalysisResponse` from `src/lib/audit/` — zero prompt drift between eval and prod). Wired `npm run eval:audit` script with `tsconfig.eval.json` + tsconfig-paths runtime resolution. Wrote `README.md` (usage + 15-25 fixture coverage targets) and `BASELINE.md` (scores + open issues + how-to-use-for-future-refinement). **Deviated from plan's Promptfoo choice** → custom TS runner. Reason: the eval must import the exact production prompts/parser to avoid drift; Promptfoo would have required either YAML-mirroring the prompts (drift risk) or a custom JS provider (more wrapper than value). Trade-off accepted: no Promptfoo HTML report, no built-in variant CLI. Documented in `tests/audit-evals/README.md`. **Fixture curation iteration.** First fixture attempt: `chat-claude` (Claude.ai vanilla chat thread) — my initial draft had Confidence Visualization + Explainable AI as must-find. User pushed back ("claude.ai screenshot is a simple chat view and not a research or deep dive i dont think a confidence vis and explainable ai are relevant here"). User's pushback was correct — dropped to empty must-find + kept the 8 agentic patterns as must-NOT-find regression guards against the Apr 28 class. Second fixture attempt: `agent-claude-code` (terminal screenshot of Claude Code mid-session). Initial framing: must-find = Action Audit Trail, Agent Status & Monitoring, Autonomy Spectrum. **Eval run revealed the framing was wrong** — the audit correctly read it as "this is a terminal/console interface showing command-line output... a developer/testing surface rather than an end-user AI product interface" and returned `applicablePatterns: []`. User then made the load-bearing observation: "it is just a terminal screenshot infact i ran claude code in my terminal" — meaning the audit was RIGHT, not buggy. From a what's-visible perspective, terminal text without product chrome is not an AI UI to audit. Action Audit Trail, Agent Status & Monitoring, Autonomy Spectrum require visible UI affordances (panels, action logs as UI, autonomy controls) — not text strings rendered in a terminal. **Flipped `agent-claude-code/expected.json` to a NEGATIVE CASE** (`expectEmptyTopGaps: true`, `maxApplicablePatterns: 3`, empty must-find + must-NOT-find). It now serves as a regression guard against the failure mode "audit invents UI patterns from textual descriptions of agent activity." Equally valuable as a fixture. **Three real bugs caught + fixed in the prompt-tune iteration.** (1) **applicablePatterns padding** — audit returned 19 patterns on chat-claude despite soft "3-7" guidance in the prompt. Added explicit hard cap "applicablePatterns MUST contain AT MOST 8 entries. No exceptions" to both Step 2 and Hard Rules in `src/lib/audit/prompts.ts`. Cap honored on re-run (6 returned). (2) **Vision faithfulness stochasticity** — same chat-claude screenshot, 3 runs, audit hallucinated absence of visible thumbs-up/down on 2 of 3 runs (faithfulness axis swung 2 → 4.5 → 1, noFabrication 2 → 4.5 → 0.5). Two fixes: (a) added Step-1 enhancement requiring explicit inventory of visible interactive controls in `surfaceDescription` BEFORE evaluating any pattern (anchors later "X is missing" findings against visible UI); (b) added a new Hard Rule: "Before writing a 'missing' finding, re-check the screenshot for the control you're about to claim is absent. If it appears anywhere — including small icons under a message, hover states, or items in your Step-1 inventory — the finding is wrong. False-absence claims (e.g. 'no thumbs-up/down' when feedback icons are visible under the message) are the most damaging failure mode for this audit." (c) Set `temperature: 0` on the analyze API call in `src/app/api/patterns/analyze/route.ts` AND the eval runner (`tests/audit-evals/run.ts`) — temperature was previously unset (defaulted to ~1), causing run-to-run variance even with stable prompt. Deterministic sampling is the right default for structured-JSON output. (3) **Parser fragility** — already fixed by Week 1's brace-balanced parser + Zod validation. **Eval before/after.** Pre-tune (2 fixtures, default temperature): hard-asserts 0/2; F=3.0, S=1.75, P=0.5, A=2.0, NF=2.75. Post-tune: hard-asserts 2/2; F=4.75, S=4.25, P=3.0, A=4.0, NF=4.75. Four of five axis means now pass the 4.0 threshold. **Open issue Bug 4 — gated on more fixtures.** patternFit axis still fails (3.0 mean) because chat-claude scores 1.0 — the audit still flags CV + XAI on the vanilla Claude.ai chat. The audit is technically rule-consistent: per the prompt's current definitions, CV "applies where the AI returns a substantive answer/result" and XAI "applies to AI-generated answers/recommendations" — a long instructional Claude response qualifies. The right fix is to narrow CV/XAI scope to "fact claims about external state of the world that could be verifiably wrong" (search/citation/research surfaces) and explicitly exclude conversational dialog. **NOT shipping this fix without a research/citation fixture as safety net** — narrowing too aggressively would break a Perplexity/ChatGPT-search-mode case where CV/XAI legitimately apply. Documented in `BASELINE.md` Known Open Issues + flagged in plan file. Next session priority: curate `research-perplexity` (or equivalent) fixture, then iterate the prompt with both fixtures + this safety net in place. **Stochastic LLM-as-judge.** Same fixture, same audit output, scored 2 → 4.5 → 1 on faithfulness across separate runs even with deterministic prompt input. The judge has its own variance. Worth investigating later whether averaging N≥3 judge runs per fixture produces stable scores. Not a blocker today but a measurement quality concern. **Files (20 + 13 tests).** Modified: `.gitignore` (gitignored `tests/audit-evals/last-run.json`), `package.json` (new `eval:audit` script), `src/app/api/patterns/analyze/route.ts` (parser wired + temperature=0 + 502 on schema fail), `src/lib/audit/prompts.ts` (cap + inventory + re-check rules), `src/types/audit.ts` (Zod schemas + `ClaudeAnalysisResponseSchema`). New: `src/lib/audit/parseAnalysis.ts`, `src/lib/audit/__tests__/parseAnalysis.test.ts` (25 tests), `src/lib/audit/__tests__/prompts.test.ts` (15 tests), `src/lib/audit/__tests__/__snapshots__/prompts.test.ts.snap` (5 snapshots), `tests/audit-evals/{run,judge,types}.ts`, `tests/audit-evals/{README,BASELINE}.md`, `tests/audit-evals/fixtures/_template/expected.json`, `tests/audit-evals/fixtures/chat-claude/{screenshot.png,expected.json}`, `tests/audit-evals/fixtures/agent-claude-code/{screenshot.png,expected.json}`, `tsconfig.eval.json`. **Verification.** `npx tsc --noEmit -p tsconfig.eval.json` clean. `npx jest src/lib/audit` 40/40 passing (10 snapshots). `npm run eval:audit` returns expected scores (2/2 hard-asserts pass; 4/5 axis means above 4.0). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. **Outstanding follow-ups.** (a) **Curate fixture #3** — research/citation chat (Perplexity, ChatGPT search mode, Claude with citations) before any CV/XAI scope refinement. (b) **Gitignore cleanup** — `**/__tests__/` rule on line 27 silently ignores all test files; force-added this session's audit tests, but the broader pattern needs review (the 481-tests claim in CLAUDE.md "Testing Strategy" section may be referring to files that aren't actually tracked). (c) **Judge stability** — investigate averaging N≥3 judge runs per fixture for stable axis means; current single-run scores swing too much to gate CI cleanly. (d) **Production sampling (Week 4 of plan)** — Prisma `AuditSample` table + `/admin/samples` viewer to catch real-world distribution drift; deferred until eval framework matures. (e) **Playwright e2e (Week 3 of plan)** — deferred to a separate session. (f) **CI gate** — eval framework supports a CI hook on PRs touching `src/lib/audit/prompts.ts` or `src/app/api/patterns/analyze/`, but `.github/workflows/evals.yml` not yet written; defer until corpus reaches ~10 real fixtures. (g) **Plan file** at `~/.claude/plans/staged-purring-hoare.md` documents the full 4-week strategy + current progress; reference on next session. (h) Three pre-existing untracked files left alone per established repo pattern (`.claude/worktrees/`, `.dwic/`, `scripts/inject-hoang-cta.mjs`). (i) Stochastic vision behavior on Claude Sonnet 4 — even with `temperature: 0`, the model can produce different findings across calls if the screenshot is ambiguous. Temperature=0 reduces variance but doesn't eliminate it entirely; that's a model-level limit, not a prompt issue.

### Session 2026-05-11 12:57 (MacBook)
- **Pattern:** SEO indexation — add news article URLs to sitemap
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** User shared GSC Page Indexing screen showing 61 indexed / 108 not indexed and asked to "use the SEO plugin we have." Invoked Addy Osmani `seo` skill, but the substantive value came from cross-referencing the GSC breakdown against the comprehensive SEO history already in CLAUDE.md + memory. Walked the 8-reason GSC table: most buckets are either already-handled (May 7 robots.txt Googlebot fix accounts for the 2 robots-blocked OG endpoints; May 7 + Apr 11 internal-linking work is in flight for the 75 "Discovered - not indexed" lessons) or expected/benign (3 noindex = /privacy, /terms, /unsubscribe per grep audit; 4 "Page with redirect failed validation" is the misleading-label issue documented in CLAUDE.md SEO table; 6 not-found are stale pre-redirect crawls from Jan/Nov 2025; 2 soft-404s are /search + the stale `agent-status-&-monitoring` URL with no source-code generator). **One real structural gap found**: live sitemap fetch shows 137 URLs spread 85 guides / 45 patterns / 9 static — and zero `/news/[slug]` entries. The sitemap only lists `/news` (index). Confirmed via `curl https://www.aiuxdesign.guide/news | grep -oE 'href="/news/[^"]+"'` that 27 published articles exist with no sitemap presence — Google has to discover them via internal links from the /news index, which is exactly the depth-from-root problem that compounds with crawl-budget starvation on a young domain. **Fix shipped (sitemap.ts, +42 lines).** Made `sitemap()` async; added `getPublishedNewsSlugs()` helper using the same Prisma projection as `/news/page.tsx:56` (select: slug + publishDate, `where: { status: 'published' }`, `orderBy: publishDate desc`, `take: 200` cap — higher than /news's take:60 since sitemap should expose the full archive). Mirrored the static-wins-on-slug-collision merge logic from `news/page.tsx:96-97` using a `staticNewsSlugs` Set filter, so DB drafts whose slugs duplicate a static newsletter file get dropped (preserves the same precedence rule the rendered page uses). News URLs added at `priority: 0.6` + `changeFrequency: 'yearly'` to reflect that news articles are evergreen archive items — not high-priority surfaces — and Google should infer their lastmod from the actual `publishDate`, not a bogus `new Date()` (same logic that fixed the pattern-page daily-freshness signal on May 7). DB failure path returns empty array so the sitemap still builds if Neon is suspended — static newsletters cover the gap as documented in the helper comment. **Verification.** `npx tsc --noEmit` clean on the modified file (filtered grep). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Did NOT manually fetch the production sitemap post-deploy since Vercel build will need to complete first — caller should `curl -s https://www.aiuxdesign.guide/sitemap.xml | grep -c "<loc>"` after deploy to confirm count jumps from 137 → ~165 (137 + ~27 DB news + however many static). **Outstanding follow-ups.** (a) **GSC sitemap re-submission**: after deploy, manually re-submit `https://www.aiuxdesign.guide/sitemap.xml` in Search Console → Sitemaps to nudge Google to re-crawl. Not strictly required (Googlebot re-fetches sitemaps on its own cadence), but accelerates discovery of the new ~27 URLs by a few days. (b) **Recheck GSC ~2026-05-28** (per existing May 7 follow-up timeline): expect ~10-20 of the new /news/[slug] URLs to index within 2-3 weeks; remainder will sit in "Discovered - not indexed" until domain authority compounds. The May 7 robots.txt + Guides-nav fixes are still in the same 28-day read window, so news-URL discovery effects will overlap. (c) **Did NOT touch**: the existing 75 "Discovered" lessons (gated on authority not technical fix per existing notes), the 4 "Page with redirect" validation-failed entries (misleading GSC label, redirects work fine), or the `agent-status-&-monitoring` soft-404 (no source generator, will fade on recrawl; documented in May 7 session). Per the `feedback_data_before_strategy.md` + "don't ship more on top of today's stack for ~14 days" guidance, deliberately kept this narrow to the one technical gap rather than touching the broader audit/SEO surfaces. (d) **`/news/[slug]` was missing from sitemap historically** — git log on `src/app/sitemap.ts` would show whether this was an oversight from when /news/[slug] was added, or whether it was intentionally excluded (e.g., during the early period when news was less authoritative). Not investigated; not blocking. (e) **The new `take: 200`** cap is well above the current ~27 published count, but at the current daily-cron pace (one newsletter/day) we'd hit it in ~6 months. Worth bumping to 500 or paginating if news volume grows; for now this is over-engineered already. (f) Three pre-existing untracked files left alone per established pattern (`.claude/worktrees/`, `.dwic/`, `scripts/inject-hoang-cta.mjs`). (g) `update-memory.sh` again emitted a stray `0` line into CLAUDE.md (third time in recent sessions — the `feedback_save_script_ordering.md` memo flags this; worth patching the script). Hand-cleaned in this Notes block.


### Session 2026-05-11 12:47 (MacBook)
- **Pattern:** Homepage hero + SocialProof — moved logo carousel into hero, added pattern micro-app showcase, accessibility pass on all cards, copy trims
- **Status:** ✅ Completed
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** Reorganized the homepage below-the-fold content into a tighter audit-first narrative. **(1) Logo carousel relocated into hero.** Pulled the "Patterns used by teams at" + `CompanyLogoCarousel` block out of `SocialProof.tsx` (was lines 37–49) and re-inserted in `FullPageResults.tsx` between the email-form wrapper (PaywallInlineCapture / DemoStartForm at lines 493–505) and the multi-device laptop+phone composition. Centered the label (was left-aligned in SocialProof) to match the centered hero text composition; sized at `mt-10 sm:mt-12` so it has air from the CTA above and the existing `mt-12 sm:mt-16 md:mt-20` on the device composition becomes the gap below. Carousel scrolls full hero width (sits inside `max-w-6xl` outside the `max-w-3xl` text wrapper). The trust-by-logo signal now lives near the primary CTA where it has the most psychological pull, rather than buried under "What is an AI UX audit?" 6 sections down. **(2) Pattern micro-app showcase added to SocialProof.** New "Each pattern has a working demo" section inserted right after the intro paragraph (before the "Patterns tested:" pill row). 3-card poster grid linking to pattern detail pages — `Contextual Assistance` (Gmail Smart Compose Taco Tuesday clip), `Trust Calibration` (notion-ai), `Mixed-Initiative Control` (figma-ai-design). Chose **poster grid → pattern page** over live embed per the documented framer-motion-on-homepage perf trap (CLAUDE.md Perf Issue #8): 22 of 44 pattern demos use framer-motion, so even one dynamic-imported demo on the homepage risks bundle creep. Posters use `OptimizedMedia` (`src/components/ui/OptimizedMedia.tsx`) which auto-derives `.mp4` from `.gif` paths and lazy-loads via IntersectionObserver — zero JS bundle cost on homepage, only the 3 chosen mp4s load when scrolled into view. First iteration had `OptimizedMedia fill` without a `className` and the cards rendered empty — root cause was the inner relative div inside OptimizedMedia collapsed to 0 height, so the absolute-positioned video pinned to a zero-height container; fixed by passing `className="w-full h-full"` so the outer wrapper fills the aspect-video parent. Each card has top-left "Interactive" pill (PlayCircleIcon + accent text on white-95% backdrop-blur) overlaying the poster, title, 1-line blurb, and "Try the demo →" CTA. Trailing "See all 36 patterns" link below the grid. **(3) Intro copy consolidated.** The previous two paragraphs (intro paragraph under "What is an AI UX audit?" + the demo-section blurb) were collapsed into one combined sentence: "Score your interface against 36 patterns built for AI products. Upload a screenshot of any chatbot, code assistant, or dashboard to get instant, actionable feedback, then explore each pattern through a working micro-app with code you can paste into your own designs." Em dashes removed throughout (intro, Mixed-Initiative blurb "Click any field. AI yields and keeps writing the others.", "Not sure where to start?" descriptions). Demo section now has just the H3 + cards (no sub-paragraph) since the intro covers the framing. **(4) Card order tuning.** Contextual Assistance moved to first position per user direction — Gmail Smart Compose is the most universally familiar AI-assist micro-interaction, sets a low-friction tone before the more abstract Trust Calibration + Mixed-Initiative Control examples. **(5) Accessibility pass — gray-on-gray fix across ALL homepage cards.** User flagged contrast issue: cards use `bg-background-grain` (`#F0F1F5`) and inner elements were using `bg-accent-subtle` (`#f5f5f5`) for icon tiles + pill badges and `bg-background-tertiary` (`#f5f5f5`) for chips — all three are near-identical light grays, making icon tiles and chips visually disappear into the card. Initial fix tried `bg-accent-primary` (navy) on inner surfaces with white icons/text — user pushed back: "background seems too dark lets tone it down". Final state: all inner surfaces unified as `bg-background-primary border border-border-primary` (white with subtle gray outline) with `text-accent-primary` icons and `text-text-primary` chip text. Reaches WCAG AAA contrast (navy `#162036` on white ≈ 14:1) in light mode, and in dark mode the inversion still works (near-black `#0f0f0f` tiles on navy `#162036` grain card, white icons on near-black tiles ≈ 19:1, gray-700 border for outline). Applied across How-it-works (3 cards), Keep-exploring (2 cards), Not-sure-where-to-start (2 cards) — pill badges ("36 patterns", "Free · No signup", "Hands-on", "Most popular"), chips (Conversational UI, Confidence Visualization, +34 more / Claude Code, Cursor, GitHub Copilot, Claude Design), and all icon tile circles/rounded squares. The Claude logo on the Claude Code course tile kept its existing `dark:invert` since tiles flipped back to white in light mode. **(6) "Not sure where to start?" copy trims.** Build a Conversational UI: 17 words "Ship a chat interface from scratch — bubbles, inputs, error recovery, the patterns ChatGPT and Claude use." → 12 words "Ship a real chat interface using the patterns ChatGPT and Claude rely on." Claude Code Course for Designers: 13 words "Zero to shipping real features with Claude Code — for designers who don't (yet) code daily." → 10 words "Ship real features with Claude Code, even if you don't code daily." Both remove em dashes and tighten without losing meaning. **Verification.** `npx tsc --noEmit` clean on both modified files at each step (filtered grep — pre-existing 80+ errors elsewhere unchanged per CLAUDE.md test-mock divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout at `http://localhost:3001` (port 3000 was in use); HMR clean across every Edit; multiple `GET / 200` cycles confirmed visually. **Outstanding follow-ups.** (a) Logo carousel inside hero now sits over `bg-hero-mesh` gradient — logos use navy-tinted grayscale filter so they read fine, but worth eyeballing in dark mode where the mesh bottom is deeper navy; if any logo washes out, the carousel could get a soft `bg-background-primary/40 backdrop-blur` wrapper. (b) The pattern micro-app cards use `notion-ai.gif`, `figma-ai-design.gif`, `Smart-compose_Taco_Tuesday.gif` — all already optimized to mp4 (per `ls public/images/examples/`); none are the 15MB animated webp class flagged in CLAUDE.md Perf Issue #13. Still worth confirming via DevTools Network on a cold load that the homepage doesn't pull more than ~600KB of video before scroll. (c) The "Interactive" pill overlay uses `bg-background-primary/95 backdrop-blur` — text-accent-primary on white-95% is high contrast but the backdrop-blur paint may cost on low-end mobile; if Clarity shows INP regressions on /, drop the backdrop-blur and stick with solid `bg-background-primary`. (d) `LessonRenderer` callout system still uses `bg-accent-subtle` for some surfaces — not touched in this session since callouts sit on white card surfaces (not on grain), but worth a separate audit pass if the user flags similar gray-on-gray issues on guide pages. (e) Three pre-existing untracked files left alone per established pattern: `.claude/worktrees/`, `.dwic/`, `scripts/inject-hoang-cta.mjs`. (f) Dev server `b81xh98gt` still running in background on localhost:3001 — caller can kill before next session. (g) The new SocialProof intro paragraph + demo H3 + 3-card grid + trailing "See all 36 patterns" link bring the SEO content above-the-fold-of-this-section significantly higher (more semantic markup, more internal links to /patterns/{slug}); should help with the "Discovered - not indexed" pattern-detail-page bucket flagged in SEO Apr 11 follow-up. Recheck GSC indexation around 2026-05-25.

### Session 2026-05-09 00:43 (MacBook)
- **Pattern:** Audit hero — inline paywall capture, glass mockup frames, copy trim, slate-token cards + newsletter selection-rule validator
- **Status:** ✅ Completed
- **Files Changed:** 8
- **Tests Added/Modified:** 0
- **Notes:** Multi-thread session covering the audit hero polish + a separately-staged newsletter QA backstop. **(1) Inline paywall email capture.** Replaced the post-free-audit "Join Early Access" button (`FullPageResults.tsx:492-506`) + `PaywallModal` round-trip with a new inline `PaywallInlineCapture` component at `src/components/audit/PaywallInlineCapture.tsx`. Reuses the consolidated `/api/audit/waitlist` endpoint (Prisma upsert + awaited Beehiiv sync with `signupSource: 'audit-waitlist'` — May 1 session). Preserves the original `audit_paywall_shown` + `audit_paywall_waitlist_signup` analytics events on mount/submit so historical funnel comparisons still work. Includes the same eyebrow + scarcity-pulse-dot + honeypot + disclosure as `PaywallModal`. `PaywallModal` itself stays in the repo for the other trigger surfaces (clicking demo CTA when paywalled, "Run Another Audit"). Threaded `auditCount` through `AuditClient.tsx` → `FullPageResults` props for the `auditCountAtTrigger` event. **(2) Hero layout iterations — landed on previous design.** Tried an asymmetric `lg:grid-cols-12` 5/7 two-column layout per a reference screenshot (text left, devices right tilted -3° with phone overlapping bottom-right at +6°), then reverted to the original centered single-column composition per user direction ("lets use the previous layout only"). The asymmetric grid + tilt classes + inline SVG sine-wave decoration were removed; the hero is back to its multi-device centered composition with `bg-hero-mesh bg-grain` background and corner reticles intact. **(3) Mesh gradient pumped + softened to taste.** Original `.bg-hero-mesh` used 3 radial blobs (cream top, sky top-left, navy bottom) at 0.48/0.55/0.12 alphas plus a hidden 1px hairline. Iterated through several intensities — first added a 4th rose blob top-right at 0.55 + bumped existing blobs to 0.85/0.95/0.90 (too strong per user), softened to 0.55/0.60/0.55. Replaced the unrendered `linear-gradient` hairline with a proper crosshatch (`to right` + `to bottom` 96px cells, alpha 0.07 light / 0.05 dark) so grid lines actually render. Tried moving blobs to mid-height (5%/45%, 95%/35%) so colored areas would sit behind the devices and tint the glass; user pushed back and we reverted blob positions to top-of-section. Mesh ends the session with cream + sky + rose top-row blobs at ~0.55-0.60 alpha + visible 96px crosshatch + faint navy bottom + dark mode mirror. **(4) Glass mockup frames.** PhoneFrame was already glass; brought LaptopFrame into the same family — translucent gradient bezel (rgba 0.18 → 0.06 white) with `backdropFilter: blur(20px) saturate(140%)` (also added to PhoneFrame). Padding bumped from p-1.5 → p-2.5 so the glass band has visible surface area. Inner screens stay opaque (`bg-background-primary` ringed with `border-white/40 ring-1 ring-black/[0.04]`) so dashboard/chat content reads cleanly. The `saturate(140%)` is the trick that makes Apple-style frosted UI feel "colorful glass" rather than white frosting — amplifies whatever sits behind. Caveat acknowledged at session end: with mesh blobs at the top of the section and devices in the lower middle, the glass effect reads strongest along the *upper edges* of the frames where they overlap the colored blobs; lower portions sit over plain `--background-grain` so look more neutral. User accepted that geometry rather than re-positioning blobs. **(5) Phone size tuning.** Original 230×480 → bumped to 280×580 ("too big") → settled on 235×490 to roughly match the laptop's outer height (laptop content min-h-[460] + bezel padding + camera dot strip + base strip ≈ 508px outer; phone p-2.5 + 490px screen ≈ 508px outer). Both frames now read at parity height in the side-by-side composition. **(6) Page-wide copy trim — same meaning, fewer words.** Hero subhead 16→11 words, newsletter checkbox 8→6, free-audit subline trimmed, paywall headline 7→5, paywall subhead 21→9, paywall disclosure 12→8. SocialProof: "What is an AI UX audit" para 52→26, all 3 "How it works" step descriptions trimmed, "Keep exploring" subhead 15→10, all 4 discovery card descriptions trimmed (Patterns 19→13, Courses 19→10, Conv UI 24→17, Claude Code 22→16). **(7) Slate-token cards.** User asked whether we use `--background-grain` (`#F0F1F5` light / `#162036` dark) on cards, since it's the convention for hero/section backgrounds. Audit confirmed: the established convention is grain on *sections* with white cards inside (Footer.tsx pattern from May 8), but applying grain directly to cards is on-system. Tried a slate gradient first (`bg-gradient-to-br from-background-secondary to-background-tertiary` per `SaveResultsCard:142` precedent) — user clarified they meant grain specifically. Final: all 7 SocialProof cards (3 How-it-works + 2 Keep-exploring + 2 Not-sure-where-to-start) now use `bg-background-grain` flat fill; the 4 hover-eligible discovery cards lift to `bg-background-primary` (white) on hover for affordance. **(8) Newsletter QA backstop — separately staged in this commit.** Independent change to `src/app/api/cron/generate-newsletter/route.ts` adding the post-Claude validator (Option C deferred from May 7 session). New `isOpinionUrl()` helper detects opinion sources (uxdesign.cc / uxplanet.org / lennysnewsletter.com / *.substack.com / medium.com); `buildQABlock` now counts `opinionCount` + `productNewsCount` (from ai-lab/design-tool tier) on selected items and writes `selectionRuleViolation` to the QA block when (a) productNewsCount < 1 with non-empty product-news pool, or (b) opinionCount > 1. Pool-aware escape hatch: if the pool genuinely had zero ai-lab/design-tool items, rule (a) doesn't fire — shipping 4 design-pub items is acceptable when there's no better choice. The QA fields surface in admin via `structuredData.qa` so the reviewer sees the violation before publish; auto-quiet on violation TBD via downstream consumer. **Verification.** `npx tsc --noEmit` clean on every modified file (filtered grep — pre-existing 80+ errors elsewhere unchanged per CLAUDE.md test-mock divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live at localhost:3001 throughout (port 3000 in use). Hero rendered cleanly through every layout iteration; PaywallInlineCapture confirmed via `localStorage.removeItem('aiux_audit_count')` reload back to demo state. **Outstanding follow-ups.** (a) **Glass-frame visual** — the geometry caveat from #4 means the glass effect reads softly because mesh color is concentrated at top while devices sit middle-low. If user pushes back, options are (i) move mesh blobs lower (we tried + reverted), (ii) introduce a 4th colored blob at mid-low position behind the devices specifically, (iii) tint the device shadows with mesh colors. Defer until user signals dissatisfaction. (b) **Newsletter validator auto-quiet** — current implementation only flags violations on `qa.selectionRuleViolation`. Wire up the auto-quiet response (return early with quiet-day flag when violation present) before next cron run if user wants the backstop to actually prevent bad issues from reaching admin review. Currently it's observability-only. (c) **PaywallInlineCapture conversion delta** — Clarity check post-deploy a few days out: compare email submits / `audit_paywall_shown` ratio against the modal baseline. Save the delta to memory if non-trivial. (d) **PaywallModal removal candidate** — once the inline form proves out, the other modal trigger surfaces (clicking demo CTA when paywalled, "Run Another Audit" after results) could route to scrolling/highlighting the inline form instead of opening the modal. Out of scope this session. (e) Pre-existing untracked files left alone per established pattern: `.dwic/`, `scripts/inject-hoang-cta.mjs`, `.claude/worktrees/`. (f) Dev server running in background (job `be7euzzvi`) at localhost:3001 — caller may want to kill before next session. (g) The ` 0` stray output line that update-memory.sh emitted into CLAUDE.md was hand-cleaned in this Notes block; if the script bug persists, worth patching — not session-blocking.

### Session 2026-05-08 17:43 (MacBook)
- **Pattern:** Audit-first repositioning Phase B — promote /audit to homepage, multi-device hero composition, font-weight sweep, /news perf fix
- **Status:** ✅ Completed
- **Files Changed:** 33
- **Tests Added/Modified:** 0
- **Notes:** Multi-thread session continuing from May 7 Stage A. **Phase A commit (`c7f9c60`) shipped first** — committed the in-session homepage hero work as a stable baseline before stacking Phase B (per the May 7 "don't ship more on top" feedback memo). Hero baseline had: in-place AuditClient transform on /, email-capture form + opt-in checkbox for newsletter, AuditClient gains `initialStep` + `showSocialProof` props, Satoshi 900 wired into layout.tsx, HeroAuditButton onClick prop, InlineNewsletterSignup secondary variant, `homepage-hero` added to NEWSLETTER_SOURCES. **Phase B — wholesale promote /audit → /.** User's call after seeing my piecemeal migration plan: "what if we just migrate the full audit page to the home page and have the free courses and patterns as cards" — confirmed `/patterns/page.tsx` and `/guides/page.tsx` already exist as fully-equipped indexes with their own metadata (so duplicating their content on / was drag without lift). **Wholesale move shipped** — copied `/audit/page.tsx` content into `/page.tsx` (Navbar + AuditClient + Footer) verbatim, updated canonical to `/`, WebApplication JSON-LD url to `/`, dropped BreadcrumbList JSON-LD entirely (homepage is root). Added two-card discovery section pointing at /patterns + /guides. **301 redirects** in `next.config.mjs`: `/audit → /` (308 permanent in Next.js), updated `/audit/upload`, `/audit/context`, `/audit/analyze`, `/prompt-builder`, `/prompt-builder/:path*` to redirect direct to `/` instead of chaining through `/audit` (Google penalizes chained redirects per CLAUDE.md SEO section). **Did NOT wildcard `/audit/:path*`** — would break `/audit/results/[id]` email deep-link target. Verified live: `curl -I localhost:3000/audit` → 308 with `Location: /`, `/audit/results/test123` → 200 (preserved). **Component graph cleanup.** `git mv` `src/app/audit/audit-client.tsx → src/components/audit/AuditClient.tsx` (preserves history). Deleted `src/app/audit/page.tsx`, `src/app/audit/loading.tsx`, `src/components/audit/HeroAuditExperience.tsx` (no longer needed — homepage just renders `<AuditClient />` directly), `src/components/audit/HeroAuditCTA.tsx` (orphan per Explore), `src/components/audit/HeroAuditButton.tsx` (orphan after the in-place transform got replaced by full audit-on-homepage), `src/app/pattern-grid.tsx` (verified unused — `/patterns/page.tsx` doesn't import it). **Pattern grid restoration.** User: "for the /patterns page lets use what we had before on the home page" — restored `pattern-grid.tsx` from the deleted state via `git restore`, rebuilt `/patterns/page.tsx` to mirror the old homepage layout (interactive grid with search + filters + responsive cards + InlineNewsletterSignup section + SEO text block). Then user said "remove the free courses strip the user came here for patterns" — dropped the courses band from /patterns, trimmed unused imports (Link, ArrowRightIcon, guides). Hero on /patterns also restored to pre-swap homepage treatment (large H1 + subhead + LazyLogoCarousel social-proof strip on grain bg). **Internal-link sweep — 11 occurrences of `href="/audit"`** swept to `href="/"` across `not-found.tsx`, `resources/page.tsx`, `agent-readability-audit-kit/audit-kit-client.tsx` (×2), `agentic-ux-checklist/agentic-checklist-client.tsx` (×2), `HandbookHero.tsx` (×2), `InlineAuditCTA.tsx` (×2), `audit/results/[id]/page.tsx` (×2 — fallback `router.push('/audit')` flipped to `/`, "Start New Audit" CTA flipped to `/`, "Explore All Patterns" repointed to `/patterns`). Email template URLs in `send-report/route.ts:449,464` updated direct to `https://www.aiuxdesign.guide/`. **Navbar surgery.** Removed Audit nav entry (lines 117-125), dropped `BeakerIcon` import (only used for that entry), simplified `isActive('/')` from "pathname === '/' || startsWith('/patterns')" to just `pathname === '/'` since homepage is no longer the patterns index. Repointed Patterns nav from `href="/"` to `href="/patterns"`. **Footer cleanup.** Removed "AI UX Audit" Resources column entry. Then user reported double-footer (SocialProof had its own "Community & Resources" 3-column card duplicating Footer.tsx) — deleted entire SocialProof Community section, restyled global Footer.tsx with the lifted card-on-grain treatment (outer `bg-[#F0F1F5] dark:bg-[#162036] bg-grain` + inner `bg-background-primary rounded-2xl border shadow-card`). One footer, comprehensive content, card visual. **Sitemap.** Dropped `/audit` block (lines 46-51); confirmed via `curl /sitemap.xml | grep audit` — only `/agent-readability-audit-kit` remains (different feature). **Font weight sweep** — user: "headlines... reduce the thickness". Diagnosed: every `font-extrabold` (Tailwind 800) was synthesized by browser since Satoshi 900 was loaded but 800 wasn't. Synthesized weight renders muddy with inconsistent letter-spacing. Mass-swap `font-extrabold → font-bold` (Tailwind 700, real loaded `satoshi-700.woff2`) across 9 files: `/patterns/page.tsx`, `/patterns/category/[slug]/page.tsx`, `/resources/page.tsx`, `/guides/page.tsx`, `SocialProof.tsx`, `FullPageResults.tsx`, `WelcomeModal.tsx`, `WelcomePanel.tsx`, `Hero.tsx`. **`/news` perf fix.** User reported slow loads. Diagnosed `prisma.newsletterDraft.findMany` had no `select` projection — pulling `structuredData` (50-200KB JSON per row, completely unused on /news) plus `sources`, `createdAt`, `updatedAt`. With 24+ published rows that's MBs of unused JSON streamed from Neon every cold request. Fix: added `select` projection limiting to 7 rendered columns, added `take: 60`. Cold went 1.7s → 0.93s (45% faster), warm 870ms → 390ms (55% faster). Production already has ISR `revalidate=60` so users mostly hit edge cache. **Hero composition iterations** — Many design iterations driven by user feedback + 3 inspiration screenshots ("apart from the colors" — keep navy-led, never SaaS-rainbow). Built `LaptopFrame.tsx` (CSS MacBook chrome with top bezel + camera dot + base platform), `PhoneFrame.tsx` (started navy gradient → user wanted glass: rebuilt as translucent frosted-white with backdrop-blur-md), `DemoChatMockup.tsx` (started as Claude chat → user wanted PulseMetrics dashboard mobile view → user wanted "just AI Assistant findings" → final: AI Assistant findings panel with 5 pulsating numbered pins matching laptop pin styling, tapping a row opens the same GapSidePanel as the laptop). **Atmospheric mesh gradient.** User: "more visually appealing maybe a gradient using our design system". Used both `frontend-design` skill (committed to "editorial precision" aesthetic — calibrated measurement instrument) and `designwithclaude/color-specialist` MCP (seeded `--color-primary-*` ramp from #162036). Built `.bg-hero-mesh` utility in globals.css: 3 layered radial gradients + faint vertical hairline grid every 96px. Light mode: warm cream halo top-center (rgba(252,240,218,0.48)) + brand-aligned sky tint top-left (rgba(201,211,233,0.55) = primary-200 from MCP) + navy depth bottom (rgba(22,32,54,0.12)). Dark mode mirrors with primary-50 cool spotlight + primary-400 sky glow + deeper-black bottom. AA contrast preserved for navy H1 (≥14:1 at every blob peak). Added `.hero-reticle` utility — calibration "+" marks at hero corners via `::before/::after` pseudo-elements. Eyebrow "FREE · NO SIGNUP REQUIRED" got matching hairline rules left/right via Tailwind `before:`/`after:`. **Composition iterations.** Started full-bleed laptop → user "looks stretched" → wrapped in `max-w-4xl`, added phone overlap absolutely positioned bottom-right with 6° tilt. User: "side by side instead of over" → restructured to flex layout, vertical centering, no rotation, phone vertically aligned with laptop right edge. User: "increase height" → laptop dashboard `min-h` 340 → 460, phone screen 200×400 → 230×480. User: "too many animation circles" → cut from 10 simultaneous pulses (5 laptop + 5 phone) to 2 (only pin #1 on each surface) — same `pin.index === 1` branch on both DemoProductMockup and DemoChatMockup. **Subhead trim.** User: "too much text". Was 31 words → 14 words: "Score any AI interface against 36 proven patterns. Get specific next steps from Claude." **Keep exploring section in SocialProof** restructured: 2 primary feature cards (Patterns / Courses with `Squares2X2Icon` + `AcademicCapIcon` 56px tiles + top-right pill badges + chip lists + hover bg-flip + accent border + shadow), divider + small uppercase eyebrow "Not sure where to start?" + 2 secondary cards (Build a Conversational UI with `ChatBubbleOvalLeftEllipsisIcon`, Claude Code Course with the actual `/images/logos/claude.svg` brand mark — invert in dark mode). **Back button on intake step.** User: "I dont see a way of going back after hitting start audit". Added "← Back" button at top of `AuditClient.tsx` intake section that resets to step='demo' + reloads demo screenshot/results/mode/productType. User: "cursor doesnt turn to hand" → added `cursor-pointer` (Tailwind preflight resets buttons by default). **Verification.** `npx tsc --noEmit` clean on all modified files (filtered grep). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Live curl tests: `/audit → /` (308), `/audit/upload → /` (308), `/audit/results/test123` (200), `/patterns` (200), `/guides` (200), `/` (200). Sitemap confirmed `/audit` absent. Homepage view-source has WebApplication + FAQPage JSON-LD; no BreadcrumbList. **Outstanding follow-ups.** (a) Subscribe to Beehiiv Automation keyed on `signup_source: 'homepage-hero'` source value (separate dashboard config, code is shipped). (b) Watch GSC weekly post-deploy — homepage 301'd from `/audit` should preserve audit-keyword equity, but expect 4-12 week ranking jiggle per CLAUDE.md SEO section. The homepage's old `/` keyword set ("AI UX patterns library") transfers to `/patterns` which has its own metadata for those terms — equity has somewhere to settle. (c) `/audit/results/[id]` cold-click fallback flipped to `/` but the underlying sessionStorage-only state is still broken on cold clicks (different tab). DB-token migration is separate work — out of scope. (d) Stage B hero rewrite still gated on May 21 Clarity audit-funnel re-export per `project_aiex_repositioning_audit_first.md`. (e) Two pre-existing untracked files left alone per established pattern (`.dwic/`, `scripts/inject-hoang-cta.mjs`). (f) Pre-existing TS errors in `src/app/audit/results/[id]/page.tsx` (Priority indexing, before this session) unchanged. (g) `/news` cold latency floor (~400ms warm, ~900ms cold) is Neon free-tier suspend; production ISR `revalidate=60` mostly hides it from users. Going further would require dropping `content` field from list query (currently used for reading-time + isQuietDay calculations — needs server-side precompute + Newsletter type extension). (h) The /patterns page's `pattern-grid.tsx` is currently in `src/app/pattern-grid.tsx` (not `src/app/patterns/`) — works because the import is relative, but moving it to `patterns/_components/pattern-grid.tsx` would be cleaner (and would keep the App Router route folder organized). Defer. (i) Many recent visual tweaks (font weights, hero composition, mesh gradient, reticles, glass phone frame) are cumulative; if regression suspected, bisect against c7f9c60 (Phase A) for the hero baseline before all the visual iteration.

### Session 2026-05-07 20:51 (MacBook)
- **Pattern:** Audit-first repositioning — Stage A: hero rewrite, courses band, internal-link reactivation, perf + SEO fixes
- **Status:** ✅ Completed
- **Files Changed:** 17
- **Tests Added/Modified:** 0
- **Notes:** Multi-hour strategy + execution session. User opened with "what's really stopping us from being on the top of aiux patterns?" Pulled GSC (6mo + 28d) + Clarity (30d) + Beehiiv (28d) data via skill exports — diagnosed that the perceived "traffic ceiling" was actually a mix of growth (`/guides/claude-code-learning-path` +343% / `/patterns/conversational-ui` +140%) and decline (`/patterns/progressive-disclosure` -75% / `/patterns/confidence-visualization` -39% impressions); aggregate numbers were flat because growth and decline were cancelling. The headline keyword "AI UX patterns" sits at position 23.59 with 1 click in 6 months — unwinnable in <6 months on this domain age vs Shape of AI / Smashing / AIverse. Real growth keyword cluster is "Claude for designers course" at pos 4-6, +343% MoM, 9.8% CTR — winnable but commoditized space against Maven/Smashing/NN/g/IxDF/Reforge. Competitive research run via Explore subagent confirmed the audit tool is our only true moat — nobody else offers free, no-signup, pattern-grounded screenshot audit (closest UI Auditor/UXLens/Mobbin are generic/paid/galleries). 6-12mo window before Figma+Anthropic Code-to-Canvas / Adobe Firefly Learning / Anthropic Claude Design ship designer learning hubs. **Decision: audit-first repositioning, all in.** Memory saved at `project_aiex_repositioning_audit_first.md` + `feedback_data_before_strategy.md` (both indexed in MEMORY.md). Plan file at `~/.claude/plans/whats-really-stopping-us-curious-wand.md`. **Week 1 ships (4):** (1) Nav label "Guides" → "Courses" in `Navbar.tsx`, `/courses/*` → `/guides/*` 302 redirect (302 not 301 because Week 3 will flip canonical the other way) added to `next.config.mjs`. (2) All 5 top-level course titles in `src/data/guides.ts` swapped from "Guide" → "Course": Claude Code Course for Designers, Cursor Course for Designers, GitHub Copilot Course for Designers, GitHub Course for Designers, Claude Design Course; "Build a Conversational UI" left alone (different shape). (3) "Practice in Courses" cross-link card heading renamed in `client-page.tsx`; `cross-links.ts` `GUIDE_TO_PATTERNS` map expanded so all 36 patterns have at least one course mapping (was 20). (4) Meta-rewrite losers fixed in `metadata.ts` — `progressive-disclosure` (CTR collapsed 0.21%→0.09% post Apr-27 rewrite), `privacy-first-design` (chronic 0.08% CTR, 1290 impressions/1 click — repositioned away from "privacy first ai" buyer-guide intent toward "AI privacy UX patterns" designer-intent), `confidence-visualization` (impressions -39%, likely SERP-feature absorption — title aligned to conversational-ui winner format). **Discovered all 36 patterns already had custom meta — the "10 missing" claim from the original Explore was outdated.** **Week 2 ships (5):** (5) `GapCard.tsx` audit-result findings now render internal `<Link>` to `/patterns/[slug]` with anchor "See how {Pattern} solves this →"; new `src/lib/audit/pattern-link.ts` resolves slugs from `gap.resource` URL → name lookup → null fallback (keeps external link if no match). User caught back-nav regression: clicking the link reset the audit to demo state because audit page state lives in component state. Fix: added `target="_blank" rel="noopener noreferrer"` so audit state stays intact; SEO equity preserved (Googlebot follows hrefs regardless of target). (6) `LessonRenderer.tsx` auto-links pattern title mentions in lesson body (paragraphs + lists + intro section), first-occurrence-per-section dedup. (7) `newsletter-detail-client.tsx` linkifies pattern mentions in news article HTML via new `src/lib/pattern-linkify.ts` — DOMParser walk that skips anchors/code/headings/style/script, max one link per pattern per article. (8) Found and fixed two real perf bugs: `OptimizedMedia.tsx` had the same `opacity-0 → opacity-100` race condition that was fixed on `ProductsSection` Apr 29 (cached media stuck invisible because `onLoad` fired before listener attached) — removed the transition entirely; `news-client.tsx` had `isToday()/isNew()` running `new Date()` during SSR (UTC) vs client (user TZ), the documented React #418 cause — added `hydrated` flag so date UI only renders post-hydration. (9) `sitemap.ts` now uses real `pattern.dateModified` (falls back to `datePublished`); category lastModified derives from max of its patterns' dates. No more bogus daily freshness signal. **Week 3 ships (1) + 1 deferred:** (11) Compact Courses band added on homepage between hero and patterns — server-rendered for SEO, 4 tool cards (Claude Code, Claude Design, Cursor, GitHub Copilot) with self-hosted SVG icons (Claude logo not Anthropic per user's call), small left-aligned heading + inline "See all" link, quieter border-only hover treatment so it sits below the audit moat in visual weight. (12) **DEFERRED**: URL move `/guides/*` → `/courses/*`. Originally Week 3. Advisor confirmed deferral after I flagged risk: URL token is a weak SEO signal (title/H1/content already say "Course"), `/guides/claude-code-learning-path` is the highest-clicked page (+343% MoM), 2-4wk ranking dip during 301 transition isn't worth marginal upside, stacking with Week 4's hero/email/PH would destroy attribution. Revisit 3-4wk after Stage A hero stabilizes; ship alone, no stacking. **Stage A hero (Task 13a) shipped this evening with iterations.** User pushed back twice on my caution — first on "wait for May 21" (correctly noting the audit banner was already there and reframing the hero isn't *more* exposure, just *clearer* exposure), second on "H1 rename alone is not a reposition" (correctly noting layout has to match the words). Final shipped state in `page.tsx`: H1 changed to "Audit your designs against 36 AI patterns" (sized down to `text-4xl md:text-5xl lg:text-6xl` with `textWrap: balance` after user feedback that the longer copy felt heavy at `text-7xl`); subhead reverted to original "How the world's best AI products design their experiences..." per user; new `HeroAuditButton.tsx` client component renders large primary "Start your audit →" pill linking to `/audit`, tracks click with `trackAuditEvent('audit_hero_cta_clicked', { source: 'homepage_hero' })` to distinguish from old banner's `'homepage_below_intro'` source; old `<HeroAuditCTA />` banner block dropped from below hero (redundant once hero IS the audit CTA); `InlineNewsletterSignup` removed from hero entirely and relocated to a new section between PatternGrid and SEO text block under heading "Daily AI UX news" (user's call — they explicitly asked for this; pushes us closer to Stage B than originally planned). Course cards in Courses band sized up per user feedback (`p-4 → p-6`, `text-xs → text-sm`, icons `w-5 → w-6`) with relevant tool icons added next to tool labels (Claude logo for Claude Code, claude-design.svg for Claude Design, cursor.svg, githubcopilot.svg). Newsletter signup heading in the new bottom section initially said "Get new patterns daily" — user correctly flagged we don't add patterns daily, we add news daily — changed to "Daily AI UX news". Stage B (full structural rewrite — logo carousel demotion etc) gated on May 21 Clarity audit funnel re-export confirming ≥20 completions / ≥10 paywalls / 14d post-fix. **Files (17 + 3 new):** `next.config.mjs`, `public/llms.txt` (1-line addition for Claude Design course in /llms.txt — pre-existing uncommitted change picked up), `src/app/news/[slug]/newsletter-detail-client.tsx`, `src/app/news/news-client.tsx`, `src/app/page.tsx`, `src/app/patterns/[slug]/client-page.tsx`, `src/app/sitemap.ts`, `src/components/audit/GapCard.tsx`, `src/components/layout/Navbar.tsx`, `src/components/ui/LessonRenderer.tsx`, `src/components/ui/OptimizedMedia.tsx`, `src/data/guides.ts`, `src/lib/cross-links.ts`, `src/utils/metadata.ts`, plus new `src/components/audit/HeroAuditButton.tsx`, `src/lib/audit/pattern-link.ts`, `src/lib/pattern-linkify.ts`. **Verification.** `npx tsc --noEmit` clean on every modified file (filtered grep — pre-existing errors in `src/app/audit/results/[id]/page.tsx` unchanged, unrelated). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout (`localhost:3001` — port 3000 was in use). User reported a Prisma `Can't reach database server at ...neon.tech:5432` error on `/news` mid-session — diagnosed as Neon free-tier auto-suspend (idle DB cold-start), unrelated to today's code changes since none touch `prisma.newsletterDraft.findMany` or `news/page.tsx` server-side fetches. **Tasks remaining (4 of 15):** Task 10 (manual Clarity re-export May 21), Task 12 (deferred URL move), Task 13b (full Stage B hero — gated), Task 14 (subscriber heads-up email — gated), Task 15 (PH + directory submissions — gated). **Outstanding follow-ups.** (a) **Pull Clarity dashboard ~May 21** filtered to date range *after* the early-May audit fix shipped. Decision rules: audit completions ≥30 over 14d → Stage A worked, ship Stage B; <20 → revert hero, fix audit funnel UX; Subscribe events down >30% → newsletter demotion was too aggressive, re-add a higher band. (b) **GSC re-read** for Apr 22 + Apr 27 meta rewrite windows: Day-14 ~May 11, Day-28 ~May 25. Check if `progressive-disclosure` CTR recovered above 0.2%, `privacy-first-design` moved off 0.08%, `confidence-visualization` recovered impressions. (c) **Don't ship more on top of today's stack** for ~14 days — attribution will be cleaner if today's changes stabilize before the next iteration. (d) The 2 untracked working-tree files `.dwic/` and `scripts/inject-hoang-cta.mjs` left alone per established pattern (carried over from prior sessions, intentionally not auto-committed). (e) Pre-existing TS errors in `src/app/audit/results/[id]/page.tsx` (Priority indexing issues) — not introduced today, separate cleanup. (f) Open thread for user: H1 currently reads "Audit your designs against 36 AI patterns" — they floated alternatives ("Audit your design against the best AI design patterns" / blend) but didn't commit. My recommendation was to keep "36" for specificity since "best" is unverifiable puffery. Their call. (g) `HeroAuditCTA.tsx` component file kept in repo for now even though no surface uses it — may delete in a follow-up cleanup pass after grepping for any remaining imports. (h) The deferred URL move (Task 12) is the single biggest remaining structural change in the audit-first reposition; keep it gated on Stage A's signal AND ship alone with a 4-week observation window when it does run. (i) The Newsletter signup section under "Daily AI UX news" still uses `InlineNewsletterSignup variant="hero"` — works visually but the variant prop is misleading; consider renaming to `variant="section"` or extracting a section variant in a future cleanup. (j) `text-balance` on the H1 may not be supported in older Safari versions — degrades gracefully but worth eyeballing on a Safari device.


### Session 2026-05-07 14:01 (MacBook)
- **Pattern:** SEO indexation — robots.txt Googlebot fix + Guides top-nav for crawl-equity
- **Status:** ✅ Completed
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** User flagged GSC showing 63 indexed / 104 not indexed and asked whether the Apr 11 SEO refactor is moving the needle. Walked the GSC "Why pages aren't indexed" breakdown screen-by-screen with the user. **Top buckets diagnosed.** (a) **74 "Discovered - currently not indexed"** — mostly Claude Code learning-path lessons. The sitemap discovered them but Googlebot deprioritized indexing. Diagnosis: crawl-budget starvation on a young/low-authority domain after the Apr 11 ~119-URL drop, not a sitemap or schema bug. (b) **14 "Crawled - currently not indexed"** — included 3× `/api/og/*` endpoints (`patterns?slug=session-degradation-prevention`, `patterns?slug=confidence-visualization`, `newsletter?slug=ai-ux-daily-mar-22-...`) plus real lesson pages (cursor-learning-path, github-learning-path, claude-code-learning-path/create-a-github-account) and news pages. The OG endpoints showing up here was the smoking gun — they shouldn't be crawled at all. (c) **7 "Not found (404)"** — `/patterns/graceful-degradation`, `/patterns/onboarding-flow`, `/patterns/transparent-feedback` already have 301s in `next.config.ts` (verified `// Dead pattern slugs → closest existing patterns` block); last-crawled dates Jan/Nov 2025 predate the redirects. `/$` malformed URL is noise. `/_next/static/.../woff2` is build-artifact noise. Will resolve naturally on recrawl. (d) **2 "Excluded by 'noindex' tag"** — `/privacy` (intentional) + `/guides/v0-by-vercel-learning-path` (verify intent). (e) **2 "Soft 404"** — `/search` (would be fixed by robots fix below) and `/patterns/agent-status-&-monitoring` with literal ampersand in URL. Greppped src/ for `agent-status-&` and `patterns/[^"\` ']*&` patterns — zero source-code references. The bad URL has no current generator in our code; it's stale GSC data from an old build that's since been de-linked. Will fade. (f) **4 "Page with redirect"** — validation `failed` per GSC but the redirects themselves are correct (`/patterns?category=accessibility-inclusion` → `/patterns/category/accessibility-inclusion` query→path migration); the validation flag is misleading. **Bug found in `src/app/robots.ts`.** The Next.js MetadataRoute.Robots config had three groups: (1) `*` with disallows `/api/`, `/admin/`, `/*.json$`, `/*.xml$`, `/.next/`; (2) `Googlebot` with `allow: '/'` + `crawlDelay: 0.5` and **no disallows**; (3) `*` with disallows `/search`, `/favorites`, `/audit/results/`, `/handbook/preview`, `/download/`. Per robots.txt spec, when a user-agent-specific group exists, that bot ignores all wildcard `*` groups entirely. So Googlebot was free to crawl `/api/og/*` and `/search` — exactly the URLs showing up in "Crawled - not indexed" and "Soft 404." **Fix:** extracted shared `disallow` array (10 entries combining all three previous lists), applied it to both the `*` group AND the `Googlebot` group explicitly. Googlebot retains `crawlDelay: 0.5`. Added comment explaining the spec gotcha so future-me doesn't re-introduce the bug. **Audit pivot — pattern→guide links already exist (subagent miss).** The Explore subagent's 4-finding report claimed pattern detail pages had zero links to guide content. User correctly pushed back with screenshot showing `/patterns/confidence-visualization` has a "Practice in Guides" section with 3 guide cards (Cursor / GitHub Copilot / Claude Design). Verified at `src/app/patterns/[slug]/client-page.tsx:300-328`: `relatedGuides` prop is built in `page.tsx:115` via `relatedGuideData`, rendered as a 2-col grid linking to `/guides/${guide.slug}` (overview pages). So pattern pages DO push equity to guides — at depth 2, not depth 3 as I initially feared. Adjusted recommendation: lessons aren't link-orphaned, just sitting at depth 3 from any pattern (`pattern → guide-overview → lesson`) and depth 4 from homepage (`home → /guides → guide-overview → lesson`). The real bottleneck is domain authority + crawl rate-limiting, partially addressable by shortening the path. **Top-nav addition — Guides.** User asked where to place a Guides entry; flagged homepage as "already crowded" (hero + logos + newsletter + audit teaser). Recommended top nav over homepage section: nav placement gives the link **depth 1 from every page on the site** vs. depth 1 from homepage only, plus signals to Google that Guides is a primary content type peer-equal to Patterns/News/Audit. Edited `src/components/layout/Navbar.tsx`: (1) added `AcademicCapIcon` import from `@heroicons/react/24/outline`, (2) added `Guides` link between Patterns and News with the standard nav classes + invisible-bold-fallback for no-shift-on-active styling, (3) added `if (href === '/guides') return pathname.startsWith('/guides')` branch in `isActive()` so /guides routes highlight Guides instead of Resources, (4) removed `pathname.startsWith('/guides')` from the Resources `isActive()` branch (was bucketing /guides under Resources nav highlight before this change). New nav order: `Patterns · Guides · News · Audit · Resources`. Verified `src/app/guides/page.tsx` exists as the route target. **Verification.** `npx tsc --noEmit` clean on both modified files (filtered grep — pre-existing 80+ errors elsewhere unchanged per CLAUDE.md test-mock divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested: started on port 3002 (3000 in use), Ready in 727ms, no compile errors. User confirmed mobile responsive layout at 422px width — 6 icons fit cleanly (logo + 5 nav + search) with `hidden sm:inline` text labels collapsing below `sm` breakpoint. **Outstanding follow-ups.** (a) Recheck GSC in 2-3 weeks (target ~2026-05-28) to see if (i) `/api/og/*` and `/search` drop out of "Crawled - not indexed" / "Soft 404" buckets, (ii) the 74 "Discovered" lessons start indexing as the new top-nav Guides link compounds equity. Realistic expectation: 30-50% of the 74 lessons indexed within 4 weeks; the remaining tail likely needs domain-authority work (backlinks, content depth) not internal-linking work. (b) `/guides/v0-by-vercel-learning-path` is in the "Excluded by noindex" bucket — verify whether that's intentional (draft/coming-soon) or accidental on a real published guide. (c) The `agent-status-&-monitoring` soft-404 has no source in current code so will fade on next Google recrawl; if it persists past 30 days, consider an explicit 301 in `next.config.ts` to `/patterns/agent-status-monitoring`. (d) Apr 22 (`progressive-disclosure`/`conversational-ui`/`privacy-first-design`/`confidence-visualization`/`trust-calibration`/`error-recovery`) and Apr 27 (10 patterns + homepage + `/audit`) meta-rewrite read windows are still open per `project_aiex_seo_bulk_rewrite_apr27.md` — Day 14 sanity check is 2026-05-11, Day 28 read is 2026-05-25. Don't touch those pages until then. (e) `.dwic/` and `scripts/inject-hoang-cta.mjs` left untracked per established pattern (carried over from prior sessions, intentionally not auto-committed). (f) Subagent caught a real lint of the audit logic — never trust an Explore subagent's "absence of feature X" claims without verifying in code; the user's screenshot was load-bearing for the correction. (g) The lesson-discovery story will likely need a second pass once GSC data lands: if "Discovered" stays >50 after 28 days, the next move is content-depth audits on individual lessons (thin content gets deprioritized) rather than more linking changes.

### Session 2026-05-07 10:51 (MacBook)
- **Pattern:** Newsletter — rebalance tier baselines + product-news floor
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** User flagged today's pending-review draft (`AI UX Daily: Shared Workspaces Replace Handoffs, Designers Get Faster Prompts`, draft `cmodri…` style ID — actually `cmoumcq3v…` per the structuredData query) was 4/4 design-pub/opinion items with zero AI lab product news despite Claude AI / OpenAI / Perplexity / Google AI / GitHub / Latent Space all appearing in `qa.duplicateSourceClipped` (i.e., each had ≥3 items in pool that got capped at 2 before Claude saw them). Compared to May 5 + May 6 drafts which each shipped with at least 1 ai-lab or design-tool item — today was the regression. **Diagnosis: two compounding causes.** (1) After Apr 28's narrow-design-pub-50→30 fix, design-pub and ai-lab tied at +30 baseline, but design-pub items naturally stack more design keywords ("UX", "interface", "pattern", "user", "workflow") so they still beat ai-lab on the pre-Claude sort, presenting Claude with a top-heavy design-pub pool. (2) Claude's daily prompt has "Include AT MOST 1 opinion piece per issue" rule (line 1062) but today's selection had BOTH UX Planet AND Lenny's Newsletter — the model wasn't enforcing its own counted cap. **Fix shipped (route.ts ~12 lines).** (a) `SOURCE_TIER_BASELINE`: design-pub 30→25, ai-lab 30→35 with comments dating both narrowings. design-tool stays at 40 so first-party Figma/Framer launches still top. (b) Daily prompt AUDIENCE FILTER: replaced "AT MOST 1 opinion piece" qualitative wording with explicit counted rule ("Count opinion-source URLs (uxdesign.cc, uxplanet.org, lennysnewsletter.com) in your final selection — this count MUST be ≤1"). (c) Daily prompt new PRODUCT-NEWS FLOOR section: "At least 1 of your selected items MUST be concrete product news from an AI lab or design tool" + named the eligible sources (OpenAI, Anthropic/Claude, Google AI, Microsoft AI, Perplexity, Cursor, Notion, Linear, Windsurf, Figma, Framer) + escape hatch ("If the pool genuinely contains zero such items, return fewer total items rather than padding"). (d) Same two prompt rules mirrored to weekly prompt with thresholds adjusted for length (≤2 opinion / ≥2 product news instead of ≤1 / ≥1). **Verification path: tested before pushing per user direction.** Started `npm run dev` locally, hit `/api/cron/generate-newsletter?force=true` against localhost (route uses `after()` so 200 returns instantly while generation runs in background ~18s), polled DB until new draft landed. New draft `cmov0wceb`: pool=27, selected items now Anthropic Claude (10 finance agents launch) + Uber+OpenAI integration + GitHub Copilot (agentic behavior validation) + Intent app (handoff is dead — opinion piece, but now 1 not 2). `qa.designNativeCount` went 4→2, no design-light warning, ai-lab tier appearing in selection where yesterday's prompt skipped them. **Manual reorder of new draft.** User asked to push the remaining opinion piece "Finally, the Handoff is Dead" to last position. The `structuredData.items` array is the source of truth for the selected items list, but the rendered HTML lives in the `content` field (HTML pre-baked at generation time, no live re-render path). Updated both: (1) Prisma update on `structuredData.items` — splice/push reorder, (2) HTML block swap on `content` — anchored items section between `Today in AI Products</h2>` and the spacer before takeaway, split items by the literal separator div HTML (`<div style="text-align: center; margin: 40px 0; ...">· · ·</div>`), repositioned the matching block by `Finally, the Handoff is Dead` regex match, rejoined with same separator. Both fields now render the order: Anthropic → GitHub Copilot → Uber+OpenAI → Intent. **Verification.** `npx tsc --noEmit` clean on the modified file (filtered grep — only the pre-existing line-667 `RegExpStringIterator` ES2015 error documented in CLAUDE.md, unchanged). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Pre-commit hooks ran: husky DEPRECATED warning (cosmetic, `.husky/pre-commit` still has v9 shebang), brand-validation passed (0 violations), design-audit passed. **NOT pushed yet — held per user "dont push yet kets regenerate todays newsleter and see" direction.** The local commit `0553011` was soft-reset before this save so update-memory.sh would see the staged change for accurate stats; will be re-committed and pushed via this /save flow. **Outstanding follow-ups.** (a) Watch tomorrow's 03:00 UTC cron run to confirm the new tier weights + counted opinion cap + product-news floor produce a balanced 1-2 ai-lab / 1-2 design-pub mix without operator intervention. If still skewed in either direction, the next lever is bumping ai-lab from 35 to 40 (matching design-tool) OR penalizing opinion-source items at score time rather than relying on Claude's prompt-side counting. (b) The post-Claude validator (option C from the diagnosis — count opinion URLs and ai-lab/design-tool URLs in final selection, log to `qa.selectionRuleViolation` and surface in admin) is deferred — worth shipping next session as a backstop for "Claude ignores its own rules" failure mode generically. Even with the prompt counted rule, model compliance isn't 100%. (c) `.husky/pre-commit` shebang still v9-deprecated, will fail under v10 — separate cleanup. (d) Two pre-existing untracked files left alone: `.dwic/` (May 5 audit output) and `scripts/inject-hoang-cta.mjs` (script from prior session) — both unrelated to this session's work, intentionally not auto-committed. (e) The HTML block-swap approach is fragile: it depends on the literal separator string staying byte-identical to the renderer output. If `renderStoryCard` ever changes the separator HTML, the regex in this manual reorder will silently fail or do partial work. Worth extracting a shared `regenerateContent(structuredData)` function so future manual edits to selected items don't require parallel HTML editing. (f) Tomorrow's cron will use the new weights + prompt — production effect won't be observable until ~03:00 UTC May 8. If it produces an unbalanced result, revert is `git revert` of the upcoming push commit. (g) The new draft ID `cmov0wceb…` is in `pending_review` with the reordered content — admin should sanity-check the rendered HTML in `/admin/newsletter` matches expectations before publishing.



### Session 2026-05-01 12:13 (MacBook)
- **Pattern:** Audit paywall — modal redesign, gating, free-audit signal, waitlist consolidation, Beehiiv source-tag cleanup
- **Status:** ✅ Completed
- **Files Changed:** 6
- **Tests Added/Modified:** 0
- **Notes:** User reported the post-audit paywall modal looked "very odd" and not premium. Multi-iteration redesign pass on `src/components/audit/PaywallModal.tsx`. **(1) Direction A — compact waitlist.** Replaced the 3-tier pricing-grid (Free grayed-out as "current plan" / Early Access $9 / Individual Pro $19) with a single-column `max-w-md` modal: eyebrow → headline → price line → benefits → email → CTA. Argued against the 3-tier grid in a modal context (user already knows they used their free audit, dimming the actual ask; price comparison softens scarcity since users see the price they're escaping; warning-yellow "Free audits used" badge reads as error state for what should be an invitation). **(2) Premium pass.** User flagged the v1 didn't feel premium against the design system. Iterated: navy-tinted shadow `shadow-[0_24px_60px_-12px_rgba(22,32,54,0.25)]` instead of generic `shadow-2xl`; gradient hairline accent at top edge; soft `background-secondary` gradient defining the hero zone; pulsing scarcity dot ("Early Access · First 50 only" pill with animated ping); `$9` rendered as 5xl tabular-nums display type with `$19` struck-through trailing inline; refined accent-tinted check bullets in 14px circles (instead of generic outline ticks); `backdrop-blur-md` + navy-tinted scrim; disabled button switched from opacity-50 (was washed out gray-purple, looked broken) to explicit `bg-text-disabled`. Brand accent confirmed as navy `#162036` per globals.css, not orange — earlier `[217, 119, 87]` memory was for aiux brand accent in a different context. **(3) Trigger timing fix.** User said the paywall fired "after the fact" — i.e., user uploaded screenshot, hit Analyze, then paywall blocked. Diagnosed: the `useEffect`-based auto-open in `audit-client.tsx` ran AFTER the screenshot step rendered, so users saw the upload UI flash before the modal appeared. Hard-gated at the entry points instead: `handleStartRealAudit` (demo CTA → screenshot step) and `handleClear` ("Run Another Audit" after results) now both short-circuit to `setShowPaywall(true)` if `isPaywalled`, so users never reach the upload UI in a paywalled state. The `handleScreenshotUpload` analyze-time check + auto-open useEffect remain as backstops. **(4) Free-audit signal added.** User asked where new users see they have a free audit (and where they see it's spent). Diagnosed: `FREE_AUDIT_LIMIT = 1` and the existing `RemainingAuditsBanner` only renders when limit > 1 AND `auditCount === LIMIT - 1` — a condition that's never true under the current setting. So new users got zero signal. Added `auditsRemaining` + `isPaywalled` props to `FullPageResults`, wired through from `audit-client.tsx`. Demo screen CTA copy now flips: "Start your free audit" with green-dot subline "1 free audit included · No signup required" for new users; "Join Early Access" with "You've used your free audit · Join Early Access for unlimited" subline once paywalled. **(5) Email-as-hero pivot.** User reported the price-as-hero version triggered dismissal reflex ("when i look at the modal i feel like dismissing without reading because it says 9 dollars on my face"). Strategic discussion: at this stage with no Stripe wired, optimizing for waitlist size + learning, not pre-qualified buyers. Quoting a number we might change is awkward (eventual launch at $7 or $12 makes the $9 feel like a bait-and-switch). Pivoted: removed all `$9`/`$19` prominence; headline reframed from "Get unlimited audits at the lowest price" to "Be first in line for unlimited audits"; subhead is the explicit ask "Drop your email and we'll let you know the moment Early Access opens"; email field + button moved to the top under the subhead as visual hero; benefits demoted below the form at 13px as supporting evidence; CTA copy "Join the waitlist" (was "Claim my spot" — too transactional). Confirmed via grep that `$9`/`$19` only appeared in the modal — no other surface mentions price, so dropping it everywhere is consistent. **(6) Waitlist endpoint consolidation + tagging fix.** User asked how to filter paywall signups vs regular newsletter signups, and whether the modal subscribes them to daily newsletter. Discovered the modal was firing TWO calls: `POST /api/audit/waitlist` (which called `addSubscriberToBeehiiv` un-awaited and WITHOUT `signupSource` — only `utmSource: 'paywall-waitlist'`, so the Beehiiv `signup_source` custom field never got set, and the un-awaited fetch could be cancelled by Vercel function suspension) plus a fire-and-forget `POST /api/newsletter/subscribe` with `source: 'audit-waitlist'`. The second call was the load-bearing one that actually set `signup_source` correctly — but it would fail on existing subscribers via the "already subscribed" 400 branch in `subscribe/route.ts:60-65`, meaning daily-newsletter subscribers who joined the paywall were silently NOT tagged. Fixed by consolidating to a single endpoint: `/api/audit/waitlist` now does the Prisma `findUnique`/`create`/reactivate logic + awaited `addSubscriberToBeehiiv(email, { utmSource: 'audit-waitlist', signupSource: 'audit-waitlist' })`. Idempotent — re-submits and existing subscribers from other sources get `signup_source` re-stamped each time (safe via Beehiiv's `reactivate_existing: true`). Modal now fires one network call. Added explicit disclosure copy: "By joining, you'll also get our daily AI UX newsletter. Unsubscribe anytime" replaced the prior "Founding rate locked in for the first 50 · No credit card · Unsubscribe anytime" fine print since price was no longer mentioned and disclosure was missing. End-to-end verified live in dev: dev logs showed `POST /api/audit/waitlist 200 in 3013ms` + `[beehiiv] syncing subscriber { signupSource: 'audit-waitlist' }` + `[beehiiv] sync ok`. User confirmed via Beehiiv dashboard the row appeared with Acquisition Source `api: audit-waitlist / (none)` after testing with a non-publication-owner email (Beehiiv hides the publication owner from its own subscriber list — known quirk). **(7) Source-tag dead-code cleanup.** User asked the difference between `api: website` and `api: direct` rows in Beehiiv's Acquisition Source column. Traced: `direct` = `/api/newsletter/subscribe` Zod schema default when caller omits `source`; `website` = `addSubscriberToBeehiiv` lib fallback in `beehiiv.ts:52` when caller omits `utmSource`. Audited every caller — all 4 server-side `addSubscriberToBeehiiv` callers (`audit/waitlist`, `audit/send-report`, `guides/download-pdf`, `newsletter/subscribe`) pass `utmSource`, so the `'website'` fallback is dead; existing `api: website` rows in the dashboard are historical from since-removed code paths. Two real consolidations shipped: (a) `HandbookFinalCTA.tsx:31` was POSTing to `/api/newsletter/subscribe` without a `source` field, so handbook PDF signups were getting tagged as `direct` instead of `handbook` — fixed by adding `source: 'handbook'` to the body, matching the convention in `audit-kit-client.tsx`/`agentic-checklist-client.tsx`/etc. (b) Changed the dead `'website'` fallback in `beehiiv.ts` to `'direct'` so any future caller that forgets `utmSource` lands in the same bucket as schema-default signups instead of creating a third "website" label. Three legitimate `source="direct"` props on InlineNewsletterSignup (homepage hero `page.tsx:65`, about page `about-newsletter.tsx:11`, pattern pages `patterns/[slug]/client-page.tsx:335`) deliberately left alone — they're explicit "non-specific surface" signals, not bugs; re-labeling them to `'homepage'`/`'about'`/`'pattern-page'` is a separate filterability decision the user can make later. **Verification.** `npx tsc --noEmit` clean on every iteration of every modified file (filtered grep — pre-existing 85 errors elsewhere unchanged per CLAUDE.md test-mock divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout (`/audit` 200, HMR worked across the full modal redesign + the trigger-timing rewiring). Screenshot upload flow not regressed (`handleScreenshotUpload`'s analyze-time `isPaywalled` check still works as final safety net). **Outstanding follow-ups.** (a) Historical `api: website / (none)` rows in Beehiiv dashboard won't update retroactively — only new signups follow the new `'direct'` fallback. If the user wants to clean them up, they'd need a Beehiiv bulk-edit on `acquisition_source` (not exposed in the dashboard UI AFAIK; would require API). (b) Adding a `signupSource` column to Prisma `Subscriber` for local filtering is deferred — Beehiiv-side filtering via `signup_source` custom field is the practical answer today, but if the admin /admin/subscribers table needs source visibility per row, a migration + reconcile-style backfill from Beehiiv's custom field would be needed. (c) The three `source="direct"` InlineNewsletterSignup placements (homepage, about, pattern pages) could be re-labeled to specific surfaces if the user wants finer-grained filterability — flagged but not done since user didn't request. (d) Beehiiv Automation keyed on `signup_source = audit-waitlist` could be configured in the Beehiiv dashboard to send a "you're on the waitlist" welcome instead of the standard daily-newsletter welcome — no code change needed, just a dashboard setup. (e) The "Founding rate locked in for the first 50" framing is gone — modal now leans on "First 50 only" + "Unlimited audits" + scarcity-pulse-dot only. If user later wants to reintroduce price signaling, the right move is a launch announcement email to the waitlist segment rather than re-adding it to the modal. (f) Plan file at `/Users/imranmohammed/.claude/plans/transient-cuddling-unicorn.md` documents the waitlist consolidation work — can be referenced if the deferred Prisma column work surfaces later. (g) The disabled-button color fix (`bg-text-disabled`) might be worth surfacing as a design-system convention for other forms in the app — current pattern uses generic `disabled:opacity-50` which produces washed-out brand-accent colors in many places; flagged as a separate audit.

### Session 2026-04-30 20:46 (MacBook)
## Architecture Overview

### Core Architecture
- **Next.js 15 App Router**: Modern routing with app directory structure
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety with strict configuration
- **Tailwind CSS**: Utility-first styling with custom design system

### Key Architectural Patterns

#### 1. Pattern-Centric Data Architecture
- Central pattern registry (`src/data/patterns.ts`) imports from individual pattern modules
- Each pattern follows structured format with content, examples, and code samples
- Zod schema validation ensures data integrity (`src/schemas/pattern.schema.ts`)
- Pattern loading utilities handle dynamic imports and validation

#### 2. Context-Based State Management
- `PatternProvider` (`src/contexts/PatternContext.tsx`) provides global pattern state
- Custom hooks (`usePatterns`, `usePattern`, `usePatternsByCategory`) for data access
- Optimized with memoization for performance
- Error boundaries and loading states handled centrally

#### 5. Usage Tracking & Cost Analysis
- **ccusage** integration for Claude Code token usage analysis
- Commands available for monitoring Claude Code costs and usage patterns:
  - `npm run usage` - General usage analysis
  - `npm run usage:daily` - Daily usage breakdown with costs
  - `npm run usage:weekly` - Weekly usage summary  
  - `npm run usage:monthly` - Monthly usage and cost analysis
  - `npm run usage:session` - Session-based usage tracking
  - `npm run usage:blocks` - Block-level usage analysis
  - `npm run usage:json` - JSON output for integration/scripting
- Automatically analyzes existing Claude Code JSONL logs from `~/.claude/projects/`
- Provides detailed cost breakdowns by model (Sonnet-4, Opus-4, etc.)
- Tracks input/output tokens, cache creation/reading, and total costs in USD

#### 3. Component Architecture
- **UI Components** (`src/components/ui/`): Reusable design system components
- **Section Components** (`src/components/sections/`): Page-specific sections
- **Example Components** (`src/components/examples/`): Interactive pattern demos
- **Layout Components** (`src/components/layout/`): Navigation and structure

#### 4. Type-Safe Schema System
- Zod schemas define all data structures with validation
- TypeScript types exported from schemas for consistency
- Safe and throwing validation functions available
- Development helpers for detailed error reporting

#### 6. Newsletter Subscription System
- **Prisma ORM** (Postgres on Neon) for subscriber management (local source of truth, mirrored to Beehiiv)
- **Beehiiv free tier** for subscriber sync + welcome emails (via Automations keyed on `signup_source` custom field) + newsletter delivery (admin composes in Beehiiv dashboard by pasting HTML from our admin UI — Beehiiv Posts API is Enterprise-only)
- **Resend free tier** for transactional emails — audit reports (per-user HTML), admin watchdog alerts, cron failure alerts, "newsletter draft ready" admin pings. ~150 emails/month, well under the 3,000/month cap.
- **No direct transactional sends to subscribers**: every subscriber-facing email is a Beehiiv Automation welcome or a Beehiiv-delivered broadcast. Tokenized PDF downloads happen on-page (no email link).
- **API Routes**: `/api/newsletter/subscribe` (Prisma + Beehiiv sync + `signup_source` custom field), `/api/newsletter/publish` (marks as published + revalidates — admin then copies HTML into Beehiiv), `/api/newsletter/send-update` (returns pattern-update HTML for manual Beehiiv paste), `/api/newsletter/unsubscribe`
- **Soft Delete** active/inactive subscriber management
- **Unsubscribe Tokens** for one-click unsubscribe functionality on our own `/unsubscribe` page; Beehiiv posts use Beehiiv's native unsubscribe footer
- **See** [Newsletter Documentation](docs/NEWSLETTER.md) for complete guide

### Directory Structure

#### Source Code (`src/`)
- `app/` - Next.js 15 app router pages and layouts
  - `api/newsletter/` - Newsletter API routes (subscribe, unsubscribe, publish, send-update)
- `components/` - React components organized by type
- `contexts/` - React context providers and hooks
- `data/` - Pattern data, categories, and utilities
- `hooks/` - Custom React hooks (favorites, search, pagination)
- `lib/` - Shared utilities (Prisma client, Resend client)
- `schemas/` - Zod validation schemas
- `types/` - TypeScript type definitions
- `utils/` - Utility functions and helpers
- `generated/` - Auto-generated code (Prisma client)

#### Pattern Data (`src/data/patterns/`)
- `patterns/` - Individual pattern implementations
- `categories/` - Pattern category definitions
- `examples/` - Example implementations
- `utils/` - Pattern-specific utilities

#### Testing (`src/components/**/__tests__/`)
- Component tests co-located with components
- Jest + React Testing Library
- Snapshot testing for UI consistency
- 100% coverage for critical components (Button, CodeBlock)

## Pattern Development Workflow

### Pattern Structure (36/36 Complete ✅)
Pattern implementation follows this structured format:
1. Each pattern has its own directory in `src/data/patterns/patterns/[pattern-name]/`
2. Consistent structure with index.ts, code-examples.ts, considerations.ts, guidelines.ts, examples.ts, figma-prompt.ts
3. All patterns imported in `src/data/patterns.ts`
4. Patterns validated with `npm run test:patterns`
5. Interactive demos for all patterns with working code previews
6. **Current Status**: All 36 patterns fully completed with comprehensive implementations

### Pattern Structure Requirements
- `id` and `slug` must match and use kebab-case
- Minimum 1 example with image, description, and alt text
- Minimum 1 guideline and 1 consideration
- Code examples should include title, description, and working code
- All images must be optimized and use proper formats

## Testing Strategy

### Current Coverage
- **481 comprehensive tests** across all components and utilities
- **48% test coverage** (statements) - significant progress toward 70% target
  - Statements: 47.82% ✅ (nearly 50%)
  - Lines: 48.28% ✅
  - Functions: 39% ✅
  - Branches: 36.19% ✅
- **✅ 36/36 AI design patterns fully completed** with comprehensive content, interactive demos, and code examples
- **100% component test coverage** - every component has comprehensive tests
- Data validation with 83% coverage: Patterns, Categories
- Advanced test infrastructure with proper mocking for Next.js, framer-motion, and browser APIs
- Coverage thresholds set at 70% (major progress from ~20% baseline)

### Testing Tools
- **Jest** with Next.js integration and advanced mocking
- **React Testing Library** for component testing with user event simulation
- **Comprehensive mocking infrastructure**:
  - Next.js components (Image, Link, useRouter)
  - Framer Motion (motion, useMotionValue, useSpring, useTransform)
  - Browser APIs (scrollIntoView, window properties)
- **Zod** for data validation testing (83% coverage)
- **Snapshot testing** for UI consistency
- **Playwright** configured for e2e testing (not yet implemented)

### Test File Locations
- Component tests: `src/components/**/__tests__/` (100% coverage)
- Example tests: `src/components/examples/__tests__/` (all interactive demos)
- UI tests: `src/components/ui/__tests__/` (all reusable components)
- Section tests: `src/components/sections/__tests__/` (all page sections)
- Provider tests: `src/components/providers/__tests__/` (context providers)
- Data tests: `src/data/__tests__/` (pattern validation)
- Utility tests: `src/utils/__tests__/` (helper functions)
- Hook tests: `src/hooks/__tests__/` (custom React hooks)
- Schema tests: `src/schemas/__tests__/` (Zod validation)

## Build & Performance

### Image Optimization
- Automatic WebP/AVIF generation
- GIF to WebM/MP4 conversion for animations
- Responsive image sizing with Next.js Image
- Aggressive caching (1 year TTL)

### Bundle Optimization
- Custom webpack configuration for chunk splitting
- Separate bundles for: framework, motion, syntax-highlighter, search
- Tree shaking and dead code elimination
- Turbo mode in development

### Performance Monitoring
- Vercel Speed Insights integration
- Build metrics tracked in `build-metrics.json`
- Core Web Vitals optimization

## Development Best Practices

### Working Directory Rules
- **Stay in current directory after `/clear` command** - Do not change directories unless explicitly requested by the user
- Use absolute paths when necessary rather than changing directories
- Maintain context of the current working directory throughout the session

### Code Style
- Use existing component patterns and design system
- Follow TypeScript strict mode requirements
- Validate all data against Zod schemas
- Implement proper error boundaries and loading states

### Pattern Development
- Always validate new patterns with `npm run test:patterns`
- Use the AI pattern generator for consistent structure
- Include interactive demos when possible
- Ensure accessibility compliance (alt text, semantic HTML)

### Testing Requirements
- Write tests for all new components
- Use React Testing Library best practices
- Mock external dependencies (Next.js components, APIs)
- Maintain coverage thresholds

### Performance Considerations
- Optimize images before adding to `public/images/`
- Use Next.js Image component for all images
- Implement lazy loading for heavy components
- Monitor bundle size impact of new dependencies

## AI-Powered Development

This project includes several AI agents for automated development tasks:

### Pattern Generator Agent
- Generates consistent pattern structures
- Creates examples and code samples
- Validates against schemas automatically

### Component Testing Agent
- Generates comprehensive test suites
- Follows testing best practices
- Creates snapshots and interaction tests

### Design Consistency Agent
- Analyzes design system usage
- Generates style guides
- Fixes inconsistencies automatically

### Project Progress Agent (NEW)
- **Monitors all other AI agents** and tracks their outputs
- **Automatically updates task status** when agents complete work
- **Provides intelligent progress reporting** with agent coordination
- **Suggests next priority actions** based on current project state
- **Maintains project status files** (docs/status.md, tasks/tasks.json)
- **Cross-agent communication** - ensures agents work together effectively

#### Agent Integration Features
- **Pattern tracking**: Detects when patterns are updated (12/24 fully updated, 12 in progress)
- **Test monitoring**: Tracks test generation and coverage improvements
- **Design analysis**: Integrates design consistency reports and fixes
- **Build health**: Monitors TypeScript errors and build metrics
- **Smart recommendations**: Suggests optimal sequence of agent execution

These tools are accessible via npm scripts and help maintain code quality and consistency at scale. The Progress Agent acts as a coordination layer that ensures all agents work together effectively and maintains accurate project status.

### Recent Major Achievements (Latest Session)
- **Dramatically improved test coverage from ~20% to 48%**
- **Fixed all major component test failures** with proper mocking infrastructure
- **Generated comprehensive tests for 6+ additional components**
- **Implemented robust test infrastructure** for complex animations and interactions
- **All 481 tests now have proper mocking** for Next.js, framer-motion, and browser APIs

## Known Issues & Learnings

This section documents issues we've encountered and their solutions, so Claude remembers them in future sessions.

### Cron Jobs & Scheduled Tasks

| Issue | Date | Solution |
|-------|------|----------|
| **Vercel Hobby cron doesn't execute** | Jan 2026 | Vercel free/hobby tier cron jobs don't reliably trigger. Use **cron-job.org** (free) as external trigger instead. `vercel.json` must NOT have `crons` — removed Mar 29 2026. |
| **cron-job.org timeout kills newsletter generation** | Mar 2026 | Newsletter route fetches RSS + calls Claude API. **Fix (Mar 29):** switched Claude model from Sonnet to Haiku (5-10x faster), reduced RSS timeouts from 5s to 3s. Generation now fits well within 60s. Uses `after()` to respond instantly to cron-job.org while running generation in background. |
| **Duplicate cron runs from dual triggers** | Mar 2026 | **Root cause of "every other day" failures.** Vercel Hobby crons in `vercel.json` fired ~50% of days, racing with cron-job.org and causing silent failures via the `after()` race window. **Fix (Mar 29):** removed `crons` from `vercel.json` entirely — cron-job.org is the SOLE trigger. Also added duplicate re-check before DB insert as safety net. **DO NOT re-add crons to vercel.json.** |
| **Vercel 60s function timeout** | Mar 2026 | Vercel Hobby max function duration is 60s (set in `vercel.json`). Newsletter generation must complete within this. If timeouts recur: (1) check Claude model is Haiku not Sonnet, (2) check RSS timeout is 3s not 5s, (3) consider reducing RSS_SOURCES count. |
| **Newsletter skewed dev-focused; Vercel kept appearing 2-3x per issue** | Apr 2026 | Pool was 19/20 dev/AI sources with only Figma as design publication; flat `+30` AI_PRODUCT_SOURCES baseline gave Vercel and Figma equal priority; Claude's `max 2 per company` rule was bypassed because it operates on its generated `product` field (Vercel customer cases get attributed to "Zo Computer", "GitBook" etc.). **Fix (Apr 20):** added 7 design publications (NN/g, Smashing, UX Collective, A List Apart, UX Planet, TLDR Design, Lenny's Newsletter) + 1 curator (Latent Space); replaced flat baseline with `SOURCE_TIER_BASELINE` map (design-pub +50 → tech-news +0); added conditional infra-keyword penalty (-15 if no design keyword); pre-Claude `MAX_ITEMS_PER_SOURCE = 2` cap on the pool before Claude sees it; `isDesignNativeItem()` runs at publish time and flags `qa.designLightWarning` on `structuredData` for the admin reviewer. Tightened all 3 prompts (daily, weekly, weekly-compilation) to explicitly target designers and drop strained takeaways. **Sources tried but dropped:** Framer (no public RSS at any standard path — `/blog/rss.xml`, `/blog/feed/`, `/blog/atom.xml` all 404), all 4 candidate Reddit subreddits (r/UXDesign, r/userexperience, r/web_design, r/Figma all return 403 from rss-parser even with descriptive UA — Reddit gates on IP reputation, not just UA). Revisit Reddit via an aggregator (Feedly bridge, RSS.app, or static-feed GitHub Action) if community voice is still missing after a few issues. |
| **Regenerating today's weekly with new logic when daily items are stale** | Apr 2026 | Weekly normally compiles from the past 7 daily newsletters (`getDailyNewsletterItems(7)`). After source/scoring changes, those daily items still reflect the old pipeline. Use `?forceRSS=true` on a weekly run to bypass the compilation path and pull a fresh RSS pool through the new tiered scoring. Combine with `?force=true` to delete an existing draft for today: `curl -H "Authorization: Bearer $CRON_SECRET" "https://www.aiuxdesign.guide/api/cron/generate-newsletter?type=weekly&force=true&forceRSS=true"`. |

**cron-job.org Setup:**
- Daily newsletter: `0 3 * * *` (3 AM UTC / 8:30 AM IST) → `https://www.aiuxdesign.guide/api/cron/generate-newsletter`
- Weekly newsletter: `0 2 * * 1` (2 AM UTC / 7:30 AM IST Mon) → `https://www.aiuxdesign.guide/api/cron/generate-newsletter?type=weekly`
- Requires `Authorization: Bearer <CRON_SECRET>` header

**Newsletter Troubleshooting Checklist:**

When newsletter doesn't run or emails don't send:

1. **Check cron-job.org has correct CRON_SECRET**
   - Must use the PRODUCTION value from Vercel environment variables
   - NOT the local `.env.local` value (they're different!)

2. **Check cron schedule is correct**
   - Daily: `0 3 * * *` (3 AM UTC = 8:30 AM IST)
   - Weekly: `0 2 * * 1` (2 AM UTC Monday = 7:30 AM IST)

3. **Check database for recent newsletters**
   ```bash
   # Query last 5 newsletters
   DATABASE_URL="..." node -e '
   const { PrismaClient } = require("./src/generated/prisma");
   const prisma = new PrismaClient();
   prisma.newsletterDraft.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
     .then(n => n.forEach(x => console.log(x.createdAt, x.type, x.status, x.title.slice(0,40))))
     .finally(() => prisma.$disconnect());
   '
   ```

4. **Manual trigger (use production CRON_SECRET)**
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     "https://www.aiuxdesign.guide/api/cron/generate-newsletter"
   ```

5. **Check Resend dashboard** for transactional email logs (audit reports, admin alerts): https://resend.com/emails

6. **Check Beehiiv dashboard** for subscriber sync + newsletter delivery: https://app.beehiiv.com

7. **Common issues:**
   - 401 Unauthorized → Wrong CRON_SECRET in cron-job.org
   - No newsletter created → Check if "quiet day" (no news) or duplicate prevention blocked it
   - Vercel Runtime Timeout → Claude model must be Haiku (not Sonnet), RSS timeout must be 3s. Check `route.ts` lines ~20 and ~1034
   - "Every other day" failures → Someone re-added `crons` to `vercel.json`. Remove them — cron-job.org is the sole trigger
   - Transactional emails not sent → Check `RESEND_API_KEY` is set + valid. Resend free tier caps at 100/day + 3,000/month — at normal volumes we use ~5%.
   - Subscriber not synced to Beehiiv → Check BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID
   - Admin clicks Publish but newsletter doesn't email subscribers → That's expected. Admin must click "Copy HTML" then paste into a new Beehiiv post and send from Beehiiv. Beehiiv free tier has no Posts API for automation.
   - Welcome email not arriving after signup → Beehiiv publication-level welcome emails must be enabled + Automations keyed on `signup_source` custom field must be configured (values: `direct`, `handbook`, `audit`, `audit-kit`, `news`, `guides`, `agentic-checklist`).

### Deployment & Infrastructure

| Issue | Date | Solution |
|-------|------|----------|
| *Add future issues here* | - | - |

### API & External Services

| Issue | Date | Solution |
|-------|------|----------|
| **Anthropic has no RSS feed** | Dec 2025 | Scrape `anthropic.com/news` page directly instead of using RSS parser |

### Performance & Web Vitals

The recurring class of issue. Every entry below is a real incident we hit and fixed — consult this table FIRST during any perf investigation, before forming new hypotheses.

| Issue | Date | Solution |
|-------|------|----------|
| **Lab vs field gap is real** | Feb 2026, Apr 2026 | Lighthouse lab scores routinely diverge from real-user experience on this codebase. Case study: `/agent-readability-audit-kit` showed **100/100 Performance, 0.5s LCP on LHCI desktop preset**; the same page on **LHCI mobile preset** showed **83/100, 4.57s LCP** (9x delta); Microsoft Clarity real-user data for the same URL and day showed **63/100, 106s LCP** (a further 23x delta vs lab mobile). Three lessons: (1) **Always run Lighthouse with mobile preset** — desktop hides CSR/hydration issues. (2) Lab tests use ideal hardware/network; real users don't. (3) **Always cross-check field data (Vercel Speed Insights tab + Microsoft Clarity URL export) before declaring a perf fix successful.** A green lab score is necessary but not sufficient. |
| **`adjustFontFallback: false` causes site-wide CLS** | Apr 2026 | With `display: swap`, the fallback font's metrics didn't match Satoshi → text reflowed when Satoshi loaded. Set `adjustFontFallback: 'Arial'` in the `next/font/local` config so Next generates a size-adjusted `@font-face` that matches Satoshi metrics — eliminates layout shift on swap site-wide. **Never set this to `false`.** |
| **Manual `<link rel="preload">` conflicts with `next/font` `preload: true`** | Apr 2026 | `next/font/local` with `preload: true` already emits scoped preloads on the pages that use each weight. Manual `<link rel="preload">` tags in `layout.tsx` preload globally even when unused, triggering "preloaded but not used within a few seconds" console warnings and wasting header bytes. **Don't double-preload fonts.** |
| **Carousel `priority={current === 0}` mis-promotes below-fold media to LCP** | Apr 2026 | `Carousel.tsx` had `priority={current === 0}` which made the first slide (often a 4-16MB MP4) eager-load even though the carousel sits well below the Problem/Solution sections on pattern pages. Browser then mis-promoted the carousel video to LCP candidate. **Drop `priority` on below-fold carousels.** Rely on the existing `IntersectionObserver` in `OptimizedMedia.tsx` to gate rendering until scrolled into view. |
| **`<video autoPlay>` without `preload="metadata"` downloads full file eagerly** | Apr 2026 | Even when not yet visible, autoplay videos default to `preload="auto"` which fetches the entire file. Set `preload="metadata"` on every `<video>` so only container/codec info loads until autoplay actually starts. Saved ~10MB on initial paint per pattern page. |
| **Oversized carousel media in `public/images/examples/`** | Apr 2026 | 10 MP4s were 4-16MB each (raw exports at 2772×1454). Re-encode with `ffmpeg -vf "scale='min(1200,iw)':-2" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart -an` for ~90% reduction. Animated `.webp` files: re-compress with `sharp({ animated: true }).webp({ quality: 75, effort: 6 })`. **Always run media through this pipeline before committing.** Keep the original `.gif` files in place as `<video onError>` fallbacks — `OptimizedMedia.tsx` checks for them. |
| **Microsoft Clarity dev/preview pollution masks real issues** | Apr 2026 | Clarity tag was firing on `localhost:3000`, polluting production metrics with dev sessions. Gate with `{process.env.NODE_ENV === 'production' && <ClarityScript />}` AND a runtime hostname check excluding `localhost`, `127.0.0.1`, `*.local`, `*.vercel.app`. To clean up existing dev sessions in the dashboard: Clarity → Filters → URL `does not contain "localhost"`, save as default segment. |
| **framer-motion creeps into the homepage critical-path bundle** | Mar 2026 | A single `motion.div` import in any component reachable from the homepage (e.g., `InlineNewsletterSignup`, `UnifiedSearchBar`, `FilterPills`) pulls the full ~85KB framer-motion library into the initial JS bundle. CSS transitions are sufficient for hero/social-proof areas. **Audit the homepage component tree before adding framer-motion to anything reachable from `src/app/page.tsx`.** Use `npm run build:analyze` to verify bundle impact. |
| **`ssr: false` on above-fold dynamic imports empties the hero on first paint** | Apr 2026 | `dynamic(() => import('./CompanyLogoCarousel'), { ssr: false })` left a hole where the LCP element should be, killing the homepage LCP. Re-enable SSR for above-fold dynamic imports — only use `ssr: false` for genuinely interactive-only widgets below the fold. |
| **Hydration mismatch from date-based conditionals (React error #418)** | Apr 2026 | `isToday(date)` evaluates differently on server vs client (server is UTC, client is user's TZ), causing React hydration error #418 on the news page. The whole subtree re-renders, blocking interactivity. Defer date-based UI behind a `hydrated` state flag set in `useEffect(() => setHydrated(true), [])`. |
| **Missing ISR on dynamic routes hits cold serverless every request** | Mar 2026 | `/patterns/[slug]/page.tsx` had no `revalidate` export, so every request cold-started a serverless function. Add `export const revalidate = 3600` to all content pages. Results land in the edge cache and field TTFB drops dramatically. |
| **Fully client-rendered "page = `<Client />`" pattern has catastrophic LCP** | Apr 2026 | `/agent-readability-audit-kit/page.tsx` returned only `<AuditKitClient />` — no SSR'd content. Real users saw 106s LCP because nothing renders until JS parses, hydrates, and framer-motion completes its initial-state transitions. **Always SSR the hero/title/H1 in the server `page.tsx`. Only the interactive widget needs `'use client'`.** Same fix applies to news article pages (`/news/[slug]`). |
| **Animated `.webp` can be 15MB** | Apr 2026 | `ada-health.webp` (animated, 1074×602) was 15MB raw. Sharp recompress: `sharp(src, { animated: true }).webp({ quality: 75, effort: 6 })` → 649KB. **Treat animated webp like video — needs aggressive compression, never raw export.** |

**Performance Troubleshooting Checklist**

When perf scores drop or a Speed Insights / Clarity metric regresses:

1. **Check the daily LHCI workflow first** — GitHub → Actions → "Performance" → latest run.
   If there's an open issue tagged `performance`, start there. The issue body links to the LHCI report and tells you which URL+metric breached.

2. **Cross-check lab vs field**:
   - Lab: GH Actions LHCI artifact + `npm run perf-audit -- --compare`
   - Field: Vercel dashboard → Speed Insights tab + Microsoft Clarity URL performance export
   - **Lab green + field red** → real-user issue (slow networks, mobile devices, font rendering variance)
   - **Both red** → structural issue, easier to reproduce

3. **Consult the Performance & Web Vitals table above** — chances are it's a recurring failure mode with a documented fix. The Apr 10 incident took an hour to investigate from scratch; with this table, it should take 10 minutes next time.

4. **Look for the usual suspects** in this order:
   - New media asset under `public/images/examples/`? Check size with `ls -lh`. Anything >2MB needs the ffmpeg/sharp pipeline (see Issue #6 above).
   - framer-motion imported into a homepage-reachable component? (Issue #8)
   - `'use client'` added to a page that renders the LCP element? (Issue #12)
   - `adjustFontFallback` changed? (Issue #2)
   - `priority` added to `<Image>` / `OptimizedMedia` below the fold? (Issue #4)
   - New `<video>` tag without `preload="metadata"`? (Issue #5)
   - `dynamic()` import with `ssr: false` on above-fold content? (Issue #9)

5. **If genuinely new** (not in the table above), fix it, then **add the new lesson to the Performance & Web Vitals table before closing the investigation**. This is the contract — every new failure mode gets documented so the next investigation starts smarter.

**Performance Monitoring Setup**

Three layers run automatically:

- **Vercel Speed Insights** — wired in `src/app/layout.tsx` via `<SpeedInsights />` from `@vercel/speed-insights/next`. Automatic p75 mobile/desktop Core Web Vitals per route. No env var, no config. Dashboard: Vercel project → Speed Insights tab.

- **Lighthouse CI** — `.github/workflows/perf.yml` runs nightly at 04:00 UTC (after the newsletter cron at 03:00) and on every PR that touches `src/`, `public/`, `next.config.*`, or the LHCI configs. Audits 8 representative URLs against `budget.json`. On schedule failure, opens a GitHub issue tagged `performance` with a link to the LHCI report and a pointer back to this section. Manual trigger: Actions → "Performance" → "Run workflow".

- **Microsoft Clarity** — already wired (production-only, gated against dev/preview hosts). Use for session recordings and ad-hoc URL performance exports when investigating specific incidents.

**Adjusting budgets**: edit `budget.json` at the repo root and commit. LHCI picks it up on the next run. Tighten budgets gradually as the site improves; loosen them only with a written justification (in the commit message, ideally).

**Claude Code skills for perf work**: this repo has a project-specific `.claude/skills/perf-check/` skill that auto-triggers on perf-related phrases and points Claude at this section of CLAUDE.md. Generic perf expertise comes from [Addy Osmani's web-quality-skills](https://github.com/addyosmani/web-quality-skills) installed in `~/.claude/skills/` (6 skills: `web-quality-audit`, `performance`, `core-web-vitals`, `accessibility`, `seo`, `best-practices`). Install with `git clone https://github.com/addyosmani/web-quality-skills ~/.claude/skills/addyosmani-web-quality`.

### SEO Troubleshooting

Recurring failure modes from past SEO review sessions. Consult this before forming hypotheses.

| Issue | Date | Solution |
|-------|------|----------|
| **"No SEO improvements" framing conflates 4 different metrics** | Apr 2026 | "Improvements" can mean: (a) indexed page count, (b) impressions, (c) clicks, (d) average position. The diagnostic path differs for each. Always ask which one the user means. Apr 22 investigation found impressions +35% / clicks +4% over 28d — the "no improvement" read came from watching clicks only, missing that the real problem was a CTR-collapse downstream of successful ranking growth. |
| **Direction-of-change tax on GSC comparison exports** | Apr 2026 | Comparison CSVs order columns as `Last N days Clicks, Previous N days Clicks, ...` — recent-first, older-second. Counterintuitive. `analyze.js` in `.claude/skills/seo-review/` normalizes this to chronological `prev → last` output. When reading raw CSVs by hand, verify column meaning from the header before reasoning about deltas. Apr 22: misread direction on the (1) export, concluded "no growth"; re-checking on the (2) export with clear headers flipped the entire narrative. |
| **CTR appears to drop when impressions grow faster than clicks** | Apr 2026 | When page-2 URLs get promoted to pos 18-22 (e.g., from 28 → 18 on conversational-ui), they add impressions at naturally-lower CTR positions, dragging aggregate CTR down even if per-page CTR is fine. A dropping aggregate CTR isn't a red flag on its own — check per-page to see if specific pages genuinely under-convert their ranking. |
| **Page-1 rankings with <1% CTR are the real leak** | Apr 2026 | Positions 1-10 should have 2-30% CTR depending on rank. If a page sits at pos 5-7 with 0.1-0.5% CTR across 1000+ impressions, the title/description isn't winning against competitors in SERP. Rewrite meta. The Apr 22 skill flagged 13 such pages; manual review caught only 6. Use the skill first. |
| **"Discovered - not indexed" isn't always a bug** | Apr 2026 | Google holds ~30-50% of discovered URLs out of the index for low-authority sites — not a technical problem, a priority signal. 77 such URLs per Apr 16 coverage. Fixing on-page SEO won't move these; backlinks, internal linking, and content quality improvements do. Stop shipping new content until this number decreases. |
| **Intent mismatch on high-impression queries** | Apr 2026 | "privacy first ai" at pos 22 (330 imp, 0 clicks) vs. our "Privacy-First AI Design — Data Protection & User Consent" title. Users searching "privacy first ai" want product recommendations (ProtonAI, DuckDuckGo's AI) or a checklist, not a design-pattern taxonomy. Match query intent, not keyword presence. |
| **CWV field data is a ranking signal on a 28-day lag** | Apr 2026 | Google uses rolling 28-day p75 field Core Web Vitals. After fixing perf regressions (e.g., the Apr 22 `/news` ISR + audit-kit framer-motion + lazy chat-previews fixes), expect ranking signal recovery in 2-3 weeks, not immediately. |
| **Guide lesson queries have tiny search volume** | Apr 2026 | "Claude for designers course" = 62 imp/month. "Claude code for designers course" = 36 imp/month. Even winning these queries cleanly generates <100 clicks/month per guide. Demand ceiling is a distribution problem, not an SEO problem. Stop optimizing meta on guide index pages; ship the lessons and let individual long-tail queries carry them. |

**SEO Troubleshooting Checklist**

When GSC performance "isn't improving":

1. **Run the skill first**: `node .claude/skills/seo-review/analyze.js <folder>` against a GSC comparison export (not a plain single-period export). The skill catches patterns humans miss.

2. **Classify the problem**: indexation (Coverage report) vs. ranking (avg position) vs. CTR (imp/clicks ratio per page) vs. demand (low query volume). Each has a different playbook.

3. **Cross-check CWV**: a page with a ranking regression may be caught in the 28-day CWV window from a perf issue. Check `gh issue list --label performance --state open` to see if the page is in the LHCI breach list.

4. **Check timelines honestly**:
   - Sitemap → crawl: 1-7 days
   - First crawl → indexation: 7-30 days (often longer for thin pages)
   - Indexation → stable ranking: 4-12 weeks of ranking jiggle
   - Content refresh → re-ranking: 2-8 weeks
   - Meta rewrite → visible CTR delta: 14-21 days

5. **If stuck on "discovered not indexed"**: the fix is authority signals (backlinks, internal linking from high-authority pages, original cite-able research) and content quality, not more URLs.

**SEO Monitoring Setup**

- **GSC Performance export (manual, weekly or biweekly)** — Set to comparison mode (toggle "Compare" → "Previous period") before exporting. Drop the folder path to Claude and invoke `/seo-review` or just mention "check GSC".
- **GSC Coverage report (monthly)** — Check indexed page count, "discovered not indexed" bucket, "crawled not indexed" bucket. Manual review in GSC UI.
- **LHCI nightly + Clarity field data** — Automated. See Performance & Web Vitals section above.

**Claude Code skill for SEO work**: this repo has `.claude/skills/seo-review/` which standardizes the GSC comparison CSV diff analysis. Script at `analyze.js`, entrypoint at `SKILL.md`. Auto-triggers on SEO-review phrases. Pairs with Addy Osmani's generic `seo` skill (installed in `~/.claude/skills/` with the other web-quality skills) for keyword research and on-page SEO best practices.

### Adding New Issues

When you encounter a problem, document it here with:
1. **What failed** - Clear description of the issue
2. **Date** - When it was discovered
3. **Solution** - How it was fixed
4. **Category** - Add to appropriate section above
