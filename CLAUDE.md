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
### Session 2026-05-18 22:41 (MacBook)
- **Pattern:** XAI pattern-page redesign pilot — replace generic "AI Design Prompt" + "Guidelines & Considerations" with opinionated `judgmentCall` + `takeaways` + "Add this pattern to your product" CTA; re-task the live demo from sentiment to a scripted loan-decision scenario; delete FAQ; em-dash cleanup across user-visible copy
- **Status:** ✅ Completed (XAI only; other 35 patterns untouched, all new fields optional)
- **Files Changed:** 10
- **Tests Added/Modified:** 0
- **Notes:** Multi-hour pattern-page redesign session. User asked how pattern pages could be made "actionable instead of just a reading library." Started in plan mode, ran an Explore agent to map the pattern-page anatomy (12 sections from `/Users/imranmohammed/aiex/src/app/patterns/[slug]/client-page.tsx`, data dir at `src/data/patterns/patterns/<slug>/`, demo wiring through `componentId` switch in `src/components/ui/CodeExampleBlock.tsx:577`, FAQ JSON-LD in `src/utils/structuredData.ts:46`). My first plan proposed a generic 4-tab Claude Code/Cursor/v0/Figma prompt pack across all 36 patterns + per-takeaway artifact disclosures. **User course-corrected mid-plan** by pasting `/Users/imranmohammed/Desktop/pattern-page-final-spec.md` — an opinionated XAI-specific brainstorm rejecting the generic infra approach: re-task the existing demo (not delete it), replace prompt with prescriptive judgment copy, replace 18 guidelines/considerations bullets with 4 ranked moves, delete FAQ outright. Pivoted approach. **Ship 1 — XAI pilot (8 file edits).** (a) `src/types/index.ts` added 3 optional types: `JudgmentCall` ({explainWhen, dontWhen, trap}), `Takeaway` ({heading, body}), `installPrompt: string` on PatternContent; plus `hideFAQ?: boolean` on Pattern. All additive optional, other 35 patterns render unchanged. (b) `src/data/patterns/patterns/explainable-ai/index.ts` populated with judgmentCall block (3 explain-when + 3 don't-when + 1 trap paragraph), 4 takeaways (decide-what-user-can-do-first / ranked-drivers / legible-confidence / give-an-exit), `hideFAQ: true`, and rewrote `examples[0].description` from a label ("Claude AI step-by-step reasoning process") to a decision caption ("Notice the choice: reasoning is expandable, not forced inline…"). Deleted the entire `figmaPrompt` block from XAI per brainstorm's "delete the generative prompt block entirely." (c) `src/components/Pattern/JudgmentCallBlock.tsx` — NEW component, 3-panel layout: green "Use it when" / red "Don't, or minimize, when" / amber "The trap" full-width footer. (d) `src/components/Pattern/TakeawaysList.tsx` — NEW component, initially rendered as 4 separate cards then per user feedback ("too many cards, make it one block") consolidated to single bordered card with hairline dividers between the 4 numbered points. (e) `src/components/Pattern/InstallPatternCTA.tsx` — NEW component, the centerpiece "Add this pattern to your product" CTA: accent-bordered card with eyebrow ("Apply with Claude Code"), H3, body, single big primary copy button using `CommandLineIcon` from heroicons (not generic clipboard, per user "update the copy icon to be more relevant"), and a collapsed "Inspect before you copy" disclosure showing the full prompt in a mono block. Inline clipboard handler with `navigator.clipboard` fallback to `document.execCommand('copy')`. Fires Clarity event `install_prompt_copied` with `pattern_title` tag via direct `window.clarity('event', ...)` + `window.clarity('set', ...)` calls — skipped both `trackEvent` (local-only, strict union type didn't match) and `trackAuditEvent` (audit-namespaced). (f) `src/app/patterns/[slug]/client-page.tsx` — dynamic-imported the 3 new components; wrapped TakeawaysList and InstallPatternCTA in a single section under shared H2 "Take it into your own product"; layout is `grid-cols-1 lg:grid-cols-3` with takeaways on cols-2 left and CTA on col-1 right (sticky `lg:top-24` so the CTA stays visible while user scrolls the 4 takeaways on desktop, full-width stacked on mobile); conditional fallback to the original 2-col Guidelines/Considerations block when `takeaways` is absent. Replaced the conditional render of `figmaPrompt` with `judgmentCall` (judgmentCall present → render JudgmentCallBlock; else fall back to figmaPrompt). Gated FAQ visible section on `!pattern.hideFAQ`. (g) `src/utils/structuredData.ts` `generateFAQSchema` returns null when `pattern.hideFAQ` truthy — keeps visible block and JSON-LD in lockstep so Google doesn't penalize "structured data without visible content." (h) `src/components/audit/InlineAuditCTA.tsx` reworded from "See this pattern in your product / Upload a screenshot and find out which of the 36 patterns your AI interface uses" to "Check if your product already has this pattern / Upload a screenshot. We'll tell you which of the 36 patterns your AI interface uses and where the gaps are." Reframes the audit CTA as diagnostic, pairs with the install CTA above as build-or-diagnose. **Ship 2 — demo re-task (`src/components/examples/ExplainableAiDemo.tsx`, 612 lines replaced).** Original component ran live sentiment analysis on user text (positive/negative/neutral + confidence + factor weights). Per brainstorm Section 2 ("the page's best asset demonstrates the pattern with the one example that undercuts the pattern"), rebuilt as scripted loan-decision scenario with 3 canned applicant profiles (Sarah/Marcus/Priya = approved/conditional/declined). Each scenario has ranked drivers (weight-sorted, capped to 3), legible confidence sentence ("matches 1,200 similar cases with a 1.2% default rate" not "0.87"), explicit "what the model actually did" disclosure guarding against fake transparency, actionable "what you can do" next-steps list mapping explanation→action, and visible "This looks wrong → appeal to a human reviewer" exit with inline confirmation card. **Demo iteration round 2** per user "lets atleast make it interactive instead of being so in your face": converted from all-sections-expanded-by-default wall to a 4-step progressive disclosure flow: (1) scenario picker / (2) decision card always visible / (3) collapsed pull-on-demand disclosures ("Why was this approved?", "How confident is this?", "What can I do now?", "How was this actually decided?") that the user opts into / (4) appeal exit always available regardless of how deep the user went. Per-scenario open-state stored in `Record<string, Set<DisclosureKey>>` so switching between Sarah/Marcus/Priya doesn't carry over which disclosures were open. The progressive-disclosure shape physically enacts the page's own caption ("reasoning is expandable, not forced inline — you opt into depth, you're not taxed with it"); demo and editorial copy now say the same thing. **Code-examples.ts alignment.** Reader-facing code listing in Implementation section was still the old sentiment source. Rewrote `src/data/patterns/patterns/explainable-ai/code-examples.ts` to a trimmed `LoanDecisionExplainer` component (~85 lines) matching the live demo shape — ranked drivers, sentence-confidence, model disclosure, ranked next steps, appeal exit. Title was first "Loan-decision explainer (trimmed)" — user flagged "what does trimmed mean?" — dropped the parenthetical. **Em-dash sweep.** User flagged "too many em dashes across the page remove" — ran systematic replacement across all touched files (InlineAuditCTA, JudgmentCallBlock, explainable-ai/index.ts, ExplainableAiDemo). Most em dashes → commas (in-flow modifiers), some → periods (sentence breaks). Profile labels "Sarah — auto loan" → "Sarah · auto loan" (middle dot). Two bulk replaces (`% — ` → `%,` and `months — ` → `months,`) lost the trailing space and produced strings like "18%,well below" + "6 months,both currently met" — caught all 5 in a follow-up `grep -nE ",[^ 0-9]"` sweep and fixed individually. All user-visible em dashes cleared; remaining em dashes are only in code comments (JSDoc, inline `//`, JSX `{/* */}`). **Layout iteration log.** User pasted screenshot at 10:27pm showing the takeaways as 4 separate cards in left column, install CTA as standalone card on right — said "too many cards we have a card for each point lets just make it one block with all the points." Refactored TakeawaysList from `<li className="bg-surface-primary border ... rounded-lg shadow-sm">` per item to a single bordered `<ol className="... divide-y divide-gray-200">` parent with `<li className="p-6 md:p-7 flex gap-5">` inside. One block, hairline dividers, much calmer visually. **Three plan-mode entries + exits during the session.** First plan: full pilot redesign across all 36 patterns. Second plan (after brainstorm): XAI-only pilot. Third plan (after user pushback on takeaway theory): "Add this pattern to your product" install-prompt CTA refinement. Each ExitPlanMode triggered approval; each plan file rewrite kept the file at `/Users/imranmohammed/.claude/plans/the-pattern-pages-we-wiggly-diffie.md` as the durable record. **One AskUserQuestion called and rejected** mid-third-plan ("Which part of the proposed 'Do this in your product' addition doesn't land for you?") — user said "im not talking about the demo im talking about the pattern itself" which reframed the install prompt to be pattern-level (encode the 4 moves as constraints + tell Claude to find AI decision surfaces in user's repo), not demo-level (clone the loan UI). Better framing, that's what shipped. **Verification.** `npx tsc --noEmit` clean for every touched file at every step (filtered grep; pre-existing 80+ test-mock errors elsewhere unchanged per CLAUDE.md). One pre-existing error on `src/utils/structuredData.ts:55` (`pattern.products` does not exist on Pattern) was already present and is unrelated to this session. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server started via `npm run dev` (background job `bcrv4k584`, port 3000 reclaimed by killing 2 stale PIDs 2497 + 23595 first; Next 15.5.7 Turbopack ready in 680ms). All HTTP 200 on `/patterns/explainable-ai`. New section anatomy confirmed via python h2 extraction: What is → Problem → Solution → Real-World Examples → Implementation → When to use Explainable AI (XAI), and when it backfires → Take it into your own product → More in Trustworthy & Reliable AI → Practice in Courses. "Add Explainable AI (XAI) to your product" is now an H3 inside the right column of the Take-it section, not a standalone H2. Verified `/patterns/adaptive-interfaces` (no `installPrompt`, no `judgmentCall`, no `takeaways`, no `hideFAQ`) renders identically to today — 0 matches for "Add Adaptive" or "Apply this in your own codebase" — proving the conditional render keeps the other 35 patterns intact. **Outstanding follow-ups.** (a) **End-to-end test the install prompt against a real repo.** Copy the XAI install prompt, paste into Claude Code in a separate scratch repo containing at least one AI decision surface (recommendation card, classification output), confirm Claude produces a coherent refactor plan + asks before adding dependencies + outputs the requested Markdown report (Surfaces updated / Surfaces flagged / New endpoints added). This is the load-bearing quality check; the prompt is the whole feature. (b) **7-day Clarity recheck targeting ~2026-05-25** for the new `install_prompt_copied` event with `pattern_title` tag. The bet is that XAI's copy rate clears any of the 4 high-traffic patterns (Conversational UI, Adaptive Interfaces, Progressive Disclosure, Confidence Visualization) — if so, that's the green light to author install prompts for the next 5 GSC traffic leaders. If copy rate is near zero, either the CTA placement isn't working or readers see it as too aggressive and the framing needs softening. (c) **Author install prompts + judgmentCall + takeaways + hideFAQ for the next 5 GSC traffic leaders** once XAI signals positive. Per `feedback_data_before_strategy.md`, wait for the Clarity data before scaling. Don't author 36 prompts speculatively. (d) **Refactor `trackAuditEvent` into a more generic `trackClarityEvent`** — the audit-namespaced wrapper forced me to fire Clarity events directly from `InstallPatternCTA` (skipping the typed wrapper). Worth a small refactor next session that opens to add new event types: split `AuditEvent` into a base `ClarityEvent` union with `audit_*` and `pattern_*` sub-unions. Not blocking; current direct-firing works. (e) **The `pattern.products` pre-existing TS error on `structuredData.ts:55`** is real — likely a stale ref from when `Pattern` had a `products?: string[]` field. Worth either restoring the field or fixing the reference. Not in this session's scope. (f) **`bcrv4k584` dev server still running** on port 3000 — caller may want to kill before next session via `lsof -ti:3000 | xargs kill`. (g) **Pre-existing untracked files left alone** per the established session pattern: `.claude/worktrees/`, `.dwic/`, `docs/building-trust-into-an-llm-audit-tool.md`, `docs/medium-ux-collective-aiux-audit-story.md`, `public/llms.gist`, `scripts/inject-hoang-cta.mjs`. (h) **Pre-existing unstaged changes left alone**: deleted `public/aiuxdesign.gist.design` (284 lines) and modified `public/llms.txt` — both belong to the in-progress gist-positioning workstream from prior sessions (flagged in May 13/14/15/18 sessions as well). (i) **`update-memory.sh` stray `0` line recurred** (tenth+ time per `feedback_save_script_ordering.md`) — hand-cleaned in this Notes block; script's `git status | wc -l` stats step still leaks. (j) **Pattern files now reference 3 new optional types but the data files for the other 35 patterns are untouched.** As we go pattern by pattern, the same shape gets authored: `judgmentCall` + `takeaways` + `hideFAQ` + `installPrompt`. The reusable components (`JudgmentCallBlock`, `TakeawaysList`, `InstallPatternCTA`) are pattern-agnostic so only data + per-pattern editorial copy changes. (k) **Plan file `/Users/imranmohammed/.claude/plans/the-pattern-pages-we-wiggly-diffie.md`** captures the final shape and verification checklist; reference on next session for the template to author against. (l) **First-iteration "Do this in your product" per-takeaway disclosure idea was rejected** — user said "i dont understand how will this help", then in chat clarified the right shape is one CTA per pattern (matches how audit works: one action one artifact, not four sub-fixes the reader has to assemble). Cheaper to author across 36 patterns later too. The per-takeaway idea is dead; don't revive it next session. (m) **Sarah/Marcus/Priya canned scenario data** is editorial and benefits from a domain-expert review pass before scaling the pattern across other regulated-domain examples (credit-decision math, DTI thresholds, APR bands). Current numbers are plausible-feeling but not researched against actual underwriting standards; if the demo gets challenged on accuracy, swap to a content-moderation or triage scenario which has less consumer-facing scrutiny.

### Session 2026-05-18 19:49 (MacBook)
- **Pattern:** Audit empty-state diagnostic deepening — surfaceDescription capture on AuditSample, productDescription pass-through into prompts, intent-driven pattern recommender (full version), and Clarity instrumentation for failure path
- **Status:** ✅ Completed
- **Files Changed:** 9
- **Tests Added/Modified:** 0
- **Notes:** Session opened with user showing the live `/admin/audit-samples` dashboard — 5 audits in 14 days, 100% `empty_gaps`, 0/36 score, all `productType=other`. Walked the user through prior diagnosis (May 13 + May 15 sessions concluded "pipeline healthy, leak is product-fit at entry"); confirmed against current code path that `outcome: results.topGaps.length === 0 ? 'empty_gaps' : 'success'` (route.ts:242) is firing as designed for non-AI surfaces. Built `scripts/analysis/audit-sample-iphash.ts` to group rows by `ipHash + userAgent`; result confirmed 4 distinct hashes / 5 rows / 4 machines — 2 rows from one Mac Chrome 147 back-to-back at 20:40/20:41 IST (user's own testing per May 15 session note) + 3 distinct Windows users on May 13/15/16. Small but real sample. **Real diagnostic gap caught**: `AuditSample` table stored counts but not the model's actual `surfaceDescription` text, so we couldn't tell whether the 3 Windows users uploaded non-AI surfaces (May 15 empty-state UX is the right fix) or real AI surfaces that the "Other" prompt was mis-routing (a real bug). User said "ship the surfaceDescription capture". **Ship 1 — surfaceDescription capture (5 files).** (a) `prisma/schema.prisma:67` added `surfaceDescription String?` to `AuditSample`. (b) `src/lib/audit/sample.ts` accepts `surfaceDescription` in `RecordAuditSampleInput` and truncates to 500 chars via new `SURFACE_MAX` constant. (c) `src/app/api/patterns/analyze/route.ts` both exit paths (context-first line 252 + legacy line 297) now pass `surfaceDescription: results.surfaceDescription || null` (context-first) or `results.componentDescription || null` (legacy). (d) `src/app/admin/audit-samples/samples-client.tsx` added "Surface" column to admin table (column 4, between Device and Patterns), expanded `Sample` type, bumped table colSpan from 9 to 10 for empty state. (e) Ran `npx prisma db push --skip-generate` + `npx prisma generate`; schema synced to Neon in 2.83s. **Ship 2 — productDescription pass-through (2 files).** User followed up: "ship the productDescription pass-through too" — the context-first flow already collects `productDescription` and `aiRole` at the product-type step but the prompt builder only took `productType`. (a) `src/lib/audit/prompts.ts:136` `buildUserPrompt` now takes optional `productDescription`; when present, appends one sentence to the prompt: `"The user describes their product as: <text>. Use this to inform which patterns from the library are in scope, but evaluate strictly against what is visible in the screenshot. If the user's description and the screenshot disagree, trust the screenshot."` (b) `src/app/api/patterns/analyze/route.ts:133` passes `productDescription` straight through from request body. All 10 prompt snapshot tests still pass — the description sentence only fires when one is passed, so byte-identical output otherwise. **Ship 3 — full intent-driven pattern recommender.** User asked "should we offer a hook of offering what they're trying to design and then surface relevant patterns" — gated as exploratory. After laying out the small-vs-full tradeoff, user said "ship the full version". (a) `prisma/schema.prisma:77-90` added new `PatternIntent` model: `intent`, `source` (default `audit_empty_state`), `productType`, `suggestedPatterns` (JSON string of slugs), `latencyMs`, `ipHash`, `userAgent`; indexed on `createdAt + source`. (b) New `src/app/api/audit/suggest-patterns/route.ts` (160+ lines): accepts intent text 8-1000 chars, rate-limits at 10/hr/IP via `checkRateLimit` (4-arg signature: identifier + endpoint + limit + windowMs), calls Claude Haiku (`claude-haiku-4-5-20251001`, temperature 0, max_tokens 1024) with full 36-pattern library in system prompt formatted as `- ${title} (${slug}) — ${description}`, Zod-validates response (`SuggestionSchema` requires array of 1-6 with slug/title/why), filters to valid slugs only, returns 3-5 ranked suggestions with title + category + description + per-intent "why" sentence. Uses `after()` to log row to `PatternIntent` post-response via fire-and-forget Prisma call. **Brace-balanced JSON extraction**: `extractJson()` handles both markdown-fenced and bare-JSON responses. (c) `src/lib/audit/analytics.ts` added 3 new `AuditEvent` union members: `audit_intent_submitted` (with `length` property), `audit_intent_suggestions_returned` (with `count`), `audit_intent_pattern_clicked` (with `slug`). (d) `src/components/audit/FullPageResults.tsx` `EmptyAuditState` rewritten substantially: new `IntentSuggestion` interface, 4 new React `useState` calls (intent, submitting, suggestions, suggestError, statusIndex), `handleSuggest` POSTs to `/api/audit/suggest-patterns`. **Ship 4 — Clarity failure event.** User asked "okay all of this is trackable in clarity?" — walked through the 5 events firing, flagged the 2 gaps (no failure event + session-scoped tag overwrite caveat). User said "ship it". Added `audit_intent_suggestions_failed` to `AuditEvent` union and to both failure branches of `handleSuggest` with `status` + `reason` properties for funnel segmentation. **UI iteration — many rounds of layout work.** Initial render had 2 stacked cards in a `max-w-2xl` column = long vertical scroll. User: "rearrange so there is no need to scroll". (a) Bumped to `max-w-6xl` 2-col grid (empty-state left, intent form right); when suggestions arrive, becomes `lg:grid-cols-3` with suggestions panel as third column. (b) User: "first card needs more horizontal space and only one card and then Tell us... below... same horizontal space as the 5 relevant patterns" — restructured to `max-w-5xl` stacked full-width cards, each with internal 5-col grid for horizontal use of space: card 1 = 3/5 left (icon + H2 + body + CTA) + 2/5 right (what-we-saw panel + works-best-on pills), card 2 = 2/5 left (heading + description) + 3/5 right (textarea + submit); suggestions render as `sm:grid-cols-2 lg:grid-cols-3` grid inside card 2 with hairline divider. (c) User: "increase width and accessible text" — bumped to `max-w-7xl`, complete typography pass: H2/H3 `text-3xl sm:text-4xl`, body `text-lg`, pattern card title `text-lg`, pattern card body `text-base`, pills `text-base`, eyebrows `text-sm`, char counter + free-audit line `text-base`; eliminated every `text-[10px]`/`text-[11px]`. Bumped card padding to `p-8 sm:p-12 lg:p-14`. Added `min-h-[360px]` and `items-center` to card 1's inner grid for height + vertical centering. Sparkle icon container 14×14 (was 10×10). Thumbnail 24×24 (was 16×16). (d) User: "try another screenshot has too much primary weight" — flipped to secondary outline button (transparent bg, `border border-border-primary`, `text-text-primary`, hover lifts to `bg-background-secondary`) so visual primary weight goes to "Show me relevant patterns". (e) Em-dash removal pass: 2 user-visible em dashes converted to commas in card 1 body and card 2 description. (f) User: "replace sparkle, looks like AI slop" — swapped `SparklesIcon` → `DocumentMagnifyingGlassIcon` (semantically "we examined your screenshot"). (g) User: "no feedback after find patterns clicked" — built inline loading panel that swaps in below the form: pulsing accent dot with `animate-ping` halo + rotating status text (4 messages, every 1800ms, stops at last: "Reading your intent…" → "Scanning 36 patterns…" → "Matching against your use case…" → "Ranking by relevance…") + 3 skeleton pattern cards with `animate-pulse` in same 3-col grid the real results occupy. `aria-live="polite"` on status row. (h) Briefly added explicit 3 animated dots via Tailwind keyframe extension; user reverted: "remove the three dots I think we had it naturally" — kept the natural `…` ellipsis baked into each message string, rolled back the keyframe from `tailwind.config.mjs`. **Verification.** `npx tsc --noEmit` filtered clean for all touched files (pre-existing 80+ errors elsewhere unchanged per CLAUDE.md test-mock divergence). All 16 prompt tests pass (10 snapshots) since `buildUserPrompt` change is byte-identical when no description passed. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server started via `npm run dev` (background job `b0j0pnlmp`, Next 15.5.7 Turbopack, Ready in 745ms, http://localhost:3000). **Two new diagnostic scripts**: `scripts/analysis/audit-sample-iphash.ts` (this session) groups AuditSample rows by ipHash + userAgent to detect self-testing vs real users. **Outstanding follow-ups.** (a) **Watch new Clarity events post-deploy**: `audit_empty_state_shown` (with `hasSurfaceDescription` property to see if surfaceDescription is now populating for real users) × `audit_intent_submitted` × `audit_intent_suggestions_returned` (success rate) × `audit_intent_suggestions_failed` (failure rate, segmented by `status` tag) × `audit_intent_pattern_clicked` (CTR on suggestions). (b) **`/admin/audit-samples` "Surface" column will start populating from this deploy forward** — the 5 historical rows are NULL but new audits will fill it. After 7 days check whether `productType=other` rows with real surfaces (chat threads / code assistants) cluster — if yes, the "Other" prompt productCaveat needs strengthening; if no, the May 15 empty-state UX is the right fix and we just need upstream prevention (ScreenshotUpload examples). (c) **`PatternIntent` admin viewer not yet built** — current way to read what people are typing is `SELECT intent, suggested_patterns, created_at FROM "PatternIntent" ORDER BY created_at DESC` against Neon directly. Worth a dedicated admin page if intent volume picks up. (d) **`AUDIT_SAMPLE_IP_SALT` env var** still falls back to `HANDBOOK_TOKEN_SECRET`; PatternIntent reuses the same `hashIp` pattern. Both safe with fallback but a dedicated salt is hygiene. (e) **Six pre-existing untracked files left alone** per established session pattern: `.claude/worktrees/`, `.dwic/`, `docs/building-trust-into-an-llm-audit-tool.md`, `docs/medium-ux-collective-aiux-audit-story.md`, `public/llms.gist`, `scripts/inject-hoang-cta.mjs`. (f) **Two pre-existing unstaged changes left alone**: deleted `public/aiuxdesign.gist.design` (284 lines) and modified `public/llms.txt` — both belong to the in-progress gist-positioning workstream from prior sessions, not this save (flagged in May 13/14/15 sessions as well). (g) **`update-memory.sh` stray `0` line recurred** (ninth+ time per `feedback_save_script_ordering.md`) — hand-cleaned in this Notes block; the script's `git status | wc -l` stats step still leaks. (h) **Dev server `b0j0pnlmp` still running** on port 3000 — caller may want to kill before next session via `lsof -ti:3000 | xargs kill` or by killing background job. (i) **Rate-limit on `/api/audit/suggest-patterns`** is 10/hr/IP via in-memory map — fine for current volume but will reset on serverless cold start. If suggestion volume picks up materially, swap to a persistent Redis-backed limiter (no infra for that today). (j) **`PatternIntent.suggestedPatterns` is a JSON-stringified array of slugs** — chose string over native Postgres array for portability with the Prisma schema; query-side parsing is `JSON.parse(row.suggestedPatterns)`. (k) **Smoke test instructions given to user**: clear `localStorage.removeItem('aiux_audit_count')`, upload non-AI screenshot, expect empty-state card with "What we saw" panel populated (this is new — proves the surfaceDescription capture pipeline through to UI), thumbnail visible, "Try another screenshot" as secondary button; type intent ≥8 chars in card 2 textarea, click "Show me relevant patterns", watch loading panel (pulsing dot + rotating message + 3 skeleton cards), confirm 3-5 pattern cards render in 3-col grid with per-intent "why" sentence, click a card → opens `/patterns/[slug]` in new tab; query Neon to confirm `PatternIntent` row written with intent text + suggested slugs JSON. (l) **Heroicon swap** (`SparklesIcon` → `DocumentMagnifyingGlassIcon`) only applied to the EmptyAuditState card — `SparklesIcon` is still imported and used elsewhere in `FullPageResults.tsx`, so the import stays.


### Session 2026-05-15 20:41 (MacBook)
- **Pattern:** Audit free-tier strategy reversal — Clarity diagnostic → AuditSample query → empty-state UX ship + don't-decrement-on-empty fix + Clarity role=test tagging
- **Status:** ✅ Completed
- **Files Changed:** 5
- **Tests Added/Modified:** 0
- **Notes:** User opened with proposal to bump `FREE_AUDIT_LIMIT` 1→4 and cap screenshots/audit 4→2 ("allow three screenshots so user gets hang of how it works"). Memory flagged `feedback_data_before_strategy.md` rule: pull data before strategy shifts. Walked Clarity CSV at `/Users/imranmohammed/Desktop/aiuxseo/Clarity_aiux_Dashboard_05-15-2026 06 53 PM.csv` (May 2–15, 14d, Exclude admin, Real-users segment). **Five-ratio read vs Apr 20–29 baseline** (`project_aiex_audit_clarity_baseline.md`): hook rate 30%→16.2% (collapsing), upload completion 100%→50% (new leak), **value rate 60%→16.7%** (catastrophic, but see below), engagement n/a (chat_sent=0), paywall `shown=1` over 14 days. **The decisive number**: `audit_paywall_shown=1` proves the paywall is not the bottleneck — users bounce far upstream. The proposed lever (more free audits) addresses a leak that isn't there. User confirmed 2 of the events were their own testing (untagged because admin role-tagging only fires on `/admin/*` visits per layout.tsx:82-98). Advisor confirmed: kill the proposal, pivot to diagnostic. **Wrote plan to `~/.claude/plans/we-have-given-one-mutable-reddy.md`** (4 audits × 2 screenshots PARKED — revisit only when value rate ≥ 60% on ≥ 50/week sample). **Step 1: AuditSample diagnostic.** Built `scripts/analysis/audit-sample-diagnostic.ts` — one-shot tsx script mirroring `/api/admin/audit-samples?days=14` aggregation logic so we can answer the empty-vs-error question without round-tripping through admin UI. Queries Neon via the generated Prisma client + dotenv, groups by `outcome`, pulls avg patterns/gaps/imgs/latency per outcome, prints last 10 error rows with truncated `errorDetail`. Run: `npx tsx scripts/analysis/audit-sample-diagnostic.ts 14`. **Result**: 2 rows total (table only deployed May 13 per May 13 session — 2 days of data), **both = `empty_gaps`**, applicablePatternCount=0, gapCount=0, no parse_error/api_error in window, latency ~7.3s healthy. Tiny sample, but direction is unambiguous: **pipeline is healthy; users are uploading screenshots the audit correctly classifies as "no AI patterns apply" per the intentional Apr 28 prompt restructure (commit 5277360) that returns empty for non-AI surfaces**. The leak is product-fit at entry, not regression. **Step 2: Clarity role-tagging fix.** `src/app/layout.tsx:82-98` previously only set `localStorage.setItem('aiux:role', 'admin')` when path matched `/admin/*` — user's own testing from `/` was untagged, polluting "Real users" segment. Added `?role=test` query-param handler: visit `/?role=test` once, future sessions are excluded via "role != admin AND role != test" segment. **Step 3: User asked "what does empty-state UX is the leak mean?" + asked for proposals.** Walked through 3 options (honest empty state + don't-decrement / disambiguate via `applicablePatterns` field / chat salvage), recommended Option A. User: "lets ship A + the dont decrement fix now". **Shipped (4 file edits).** (a) `src/components/audit/AuditClient.tsx:135` — gated `incrementAuditCount()` on `gapsFound > 0` so empty runs don't burn free-tier credit. Added comment explaining the rationale. (b) `src/lib/audit/analytics.ts` — added 2 new `AuditEvent` union members: `audit_empty_state_shown` (fires on mount in EmptyAuditState useEffect with `hasSurfaceDescription` property) and `audit_empty_state_retry_clicked` (fires on Try Again button). (c) `src/components/audit/FullPageResults.tsx` — new internal `EmptyAuditState` component (~80 lines, defined right above the main exported component for locality). When `noFindings && !showDemoCTA`, the main render path short-circuits with an early return. Card shows: SparklesIcon header chip + "This doesn't look like an AI product surface" H2 + explanatory body + the existing `surfaceDescription` (echoed back so the user sees the audit understood their screenshot) + thumbnail of `heroScreenshotUrl` at 70% opacity with "Your upload" caption (proves we received it — addresses the "is the tool broken?" concern from the original diagnosis) + "Works best on" 3-item list (Chat threads / Code assistants / AI-powered features) + primary "Try another screenshot" button (calls `onNewAudit` → `handleClear` → resets to upload step) + reassurance line "This run didn't count against your free audit." Added 2 new heroicons imports (`ArrowPathIcon`, `SparklesIcon`) and 1 useEffect for the on-mount analytics event. **Verification.** `npx tsc --noEmit` returned 79 lines of errors — ALL pre-existing (`.next/types/app/audit/page.ts` 2x + `scripts/newsletter/merge-newsletter-duplicates.ts` 3x + the documented 80+ test-mock divergence). No new errors from this session's edits. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server started via `npm run dev` (background job `bpuwdnosd`) — Ready in 817ms, Next 15.5.7 + Turbopack, http://localhost:3000. Smoke testing instructions given to user: clear `localStorage.removeItem('aiux_audit_count')`, upload non-AI screenshot (landing page, billing screen), expect new empty-state card with thumbnail + Works-best-on list + Try Again button; click Try Again → resets to upload step; verify `aiux_audit_count` still `"0"` (empty run did not decrement); upload chat-thread screenshot next → normal results flow, count goes to 1. **Memory updates.** Appended Week-3 row to `project_aiex_audit_clarity_baseline.md` with: raw event counts for May 2–15, five-ratio comparison vs Apr 20–29, sample-size caveat (37/week, <50/week threshold so directional only), AuditSample DB read summary, the `feedback_data_before_strategy.md` reasoning trail (why proposal was killed), revisit conditions, and pointer to the diagnostic script. **Tasks completed (4 of 4).** Task #1: Query AuditSample → empty_gaps × 2 in 14d window, no errors. Task #2: Role-tagging — `?role=test` query param shipped in layout.tsx. Task #3: Memory updated. Task #4: Empty-state UX + don't-decrement shipped. **Outstanding follow-ups.** (a) **Beehiiv dashboard config (carried)**: still need Automations for `homepage-hero-pre-audit`, `audit`, `audit-waitlist` signup sources per May 12 session — separate dashboard work, no code. (b) **Watch new Clarity events post-deploy**: `audit_empty_state_shown` × `audit_empty_state_retry_clicked` × follow-on `audit_session_completed` with `gapsFound > 0` will tell us whether the retry path actually converts empty-state users into successful audits. If conversion is poor, the next ship is the upstream prevention I described in chat (ScreenshotUpload "works for / doesn't work for" example thumbnails). (c) **AuditSample recheck ~2026-05-25**: by then the table should have ≥20 rows; rerun `npx tsx scripts/analysis/audit-sample-diagnostic.ts 14` and see if `empty_gaps` remains dominant. If yes → ship the ScreenshotUpload upstream fix. If error rate climbed → real regression hunt against May 13–15 commits. (d) **4 audits × 2 screenshots proposal stays parked** per plan file decision rule: revisit only when value rate ≥ 60% AND ≥ 50/week sample. (e) **Sample-screenshot one-click buttons** in the empty state were explicitly deferred in chat — would require packaging stock demo image base64 payloads and a preload-then-POST flow; worth adding only if the plain Try-Again button underperforms. (f) **Five pre-existing untracked files left alone** per established session pattern: `.claude/worktrees/`, `.dwic/`, `docs/building-trust-into-an-llm-audit-tool.md`, `docs/medium-ux-collective-aiux-audit-story.md`, `public/llms.gist`, `scripts/inject-hoang-cta.mjs`. (g) **Two pre-existing unstaged changes left alone**: deleted `public/aiuxdesign.gist.design` (284 lines) and modified `public/llms.txt` — both belong to the in-progress gist-positioning workstream from prior sessions, not this save (flagged in May 14 session as well). (h) **`update-memory.sh` stray `0` line recurred** (eighth+ time per `feedback_save_script_ordering.md`) — hand-cleaned in this Notes block; the script's `git status | wc -l` stats step still leaks a bare count line into the session entry. Worth a dedicated patching session. (i) **Dev server `bpuwdnosd` still running** on port 3000 — user may want to kill before next session via `lsof -ti:3000 | xargs kill`. (j) **`auditCount` increment now skips empty runs** — but the corresponding `audit_session_completed` analytics event still fires for empty runs with `gapsFound: 0`, which means historical funnel ratios (Clarity hook → upload → session_completed) remain comparable. The new signal lives in `gapsFound` property for segmentation.


### Session 2026-05-14 11:17 (MacBook)
- **Pattern:** Daily newsletter email layout — promotion block reordered, "Keep exploring" footer CTA removed
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** User asked to move the announcement banner ("Three things new at aiuxdesign.guide" — audit/courses/patterns promo + volunteer ask) from above the stories to below the "Today's Idea" takeaway block, and to delete the trailing "Keep exploring / Free AI UX learning guides for designers / Explore all guides →" CTA section from the footer. Both edits in `src/app/api/cron/generate-newsletter/route.ts`: (1) `renderFooterCTA` trimmed — dropped the centered Keep-exploring block (lines 1290-1294 from prior state) so the footer now goes straight to the wordmark + "Curated by Imran" + "Read past issues →" line; (2) in `generateHTML` body template, swapped order so flow is now masthead → section header → stories → 56px spacer → `${takeaway}` (Today's Idea dark callout) → `${renderAnnouncementBanner()}` (promo block) → `${renderFooterCTA('daily')}`. **Weekly newsletter untouched** — `generateWeeklyHTML` doesn't render the announcement banner (only the daily template calls it), so the weekly layout is unchanged. **Regeneration required.** Clarified to user that HTML is rendered once at draft creation and stored on `newsletterDraft` row — existing drafts have the old layout baked in. New layout only applies to drafts generated after deploy. User asked to "regenerate today's draft" but flagged that hitting the production cron endpoint with `?force=true` would use **currently deployed** code (old layout) and waste a Claude API call — sequence has to be: commit + push → wait for Vercel deploy → then `curl -H "Authorization: Bearer $CRON_SECRET" "https://www.aiuxdesign.guide/api/cron/generate-newsletter?force=true"`. User has not yet confirmed which deploy path; this save commits the change so it can ship next. **Outstanding follow-ups.** (a) **Force regenerate after deploy** — user needs to re-run the force regenerate curl once Vercel deploy completes; the existing today's draft will need to be deleted first (the `?force=true` flag handles that — the route checks for existing draft and deletes before regenerating per CLAUDE.md Apr 2026 weekly regen note). (b) **Stage A 7-day audit Clarity recheck still on for ~2026-05-20** per yesterday's session — single-CTA hero went live May 13. (c) **Pre-existing untracked files left alone** per established session pattern: `.claude/worktrees/`, `.dwic/`, `docs/building-trust-into-an-llm-audit-tool.md`, `docs/medium-ux-collective-aiux-audit-story.md`, `public/llms.gist`, `scripts/inject-hoang-cta.mjs`. (d) **Pre-existing unstaged changes left alone**: deleted `public/aiuxdesign.gist.design` (284 lines) + modified `public/llms.txt` (+6) — both look like a separate in-progress gist-positioning workstream from prior sessions, not part of this save. (e) **`update-memory.sh` emitted a stray `0` line again** (seventh+ recurrence per `feedback_save_script_ordering.md`) — hand-cleaned in this Notes block; the script's `git status | wc -l` stats step still leaks. Worth patching in a dedicated session.


### Session 2026-05-13 14:59 (MacBook)
- **Pattern:** Homepage hero tightening — strip email form, single CTA, slop-framing eyebrow, larger H1/eyebrow type, copy clarity
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** User shared Clarity dashboard CSV for May 8-13 (post-May-8 audit-page → homepage promotion, 6-day window). **Read.** 664 total sessions / 247 bots = 417 real; homepage #1 page at 123 sessions; scroll depth 67.76%; active time 64s vs total 188s (open-tab-then-leave signature); funnel: 42 audit_demo_viewed (10%) → 5 audit_demo_start_real_clicked (1.2%) → 2 audit_session_completed (0.5%); 8 Submit form events (1.9%); no rage clicks, 45 dead clicks (6.78%); 0 audit_paywall_shown / 0 audit_chat_message_sent / 0 audit_hero_cta_clicked (the last is dead code per yesterday's audit). CLS regression confirmed at 0.1255 (above 0.1 threshold). **Diagnosis.** Hero `DemoStartForm` paired the audit CTA with an email opt-in inside one component (email field + checkbox + "Start your audit" button) — pressing the button did two things at once (start audit + maybe subscribe), splitting attention so neither CTA won. Scroll-depth data confirmed users *see* the hero (67.76% past the fold) but don't act on it. Projection on current pace: 12-18 real audit starts by May 22 vs the ≥20 Stage A gating threshold in `project_aiex_repositioning_audit_first.md` — below threshold. **Clarity replay artifact diagnosed.** User shared a screenshot of giant blue rounded rectangles filling the viewport on session recordings, asked if it was a view bug. Confirmed: Clarity replay artifact, not real UX. Mechanism: Clarity captures DOM at session time but fetches CSS at replay time; when replay can't load the stylesheet (CDN cache miss, CORS, expired chunk hash from redeploy, slow load), it falls back to inline/UA defaults. What user saw was the `LaptopFrame` + `PhoneFrame` bezels rendering without `rgba` glass background + `backdropFilter` + flex layout — translucent frames become giant solid-blue rounded rectangles with white inner screens. Two confirming signals: top broken session had Clicks=0 Pages=1 Duration=00:01 (user bounced in <2s, never saw the unstyled render personally); pre-existing MEMORY.md lesson "Hotjar recordings: Can show broken pages due to CSS replay issues — not always the real user experience" documents the same class. Same root cause, different tool. Not a real user bug. **Brainstorm shipped: Option A from a 4-option lineup.** Walked through (A) strip email form, single CTA; (B) direct-upload hero (dropzone); (C) make demo itself the conversion with "Now try yours" affordance on laptop frame; (D) show a result not a tool. Recommended A — it's reversible in one revert, cleanest signal in 7 days, and B restructures the entry flow which is too aggressive on only 5 audit-start data points. **Shipped: single-CTA hero in 5 iterations.** (1) `DemoStartForm` reduced from 95 lines to 22 lines — removed email input + opt-in checkbox + `/api/newsletter/subscribe` fire-and-forget call + email validation state + 3 `useState` calls. Kept `onStart` contract + `auditsRemaining` indicator pill so `audit_demo_start_real_clicked` tracking at the caller (line 501) still fires. Net: hero now has exactly one decision. Newsletter capture moves to (a) `SaveResultsCard` post-audit and (b) the dedicated "Daily AI UX news" section further down the page. (2) Button initial sizing was `px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg` with `shadow-lg shadow-accent-primary/20` and copy "Audit your design — free" — user flagged "huge and spammy with an em dash." (3) Dropped to `px-6 py-3 text-sm` no shadow — user: "now that looks very tiny." (4) Split the difference at `px-8 py-3.5 text-base` — landed. (5) Copy tightening: button "Audit your design — free" → "Audit your design" (em dash removed; "free" already conveyed by eyebrow + pill); subhead "Score AI interfaces against 36 patterns. Get next steps from Claude." → "Score AI interfaces against 36 proven patterns and get specific fixes you can ship today." (single sentence, ship-ready framing chosen from a 5-option lineup; "Claude" name dropped — the brand is the audit not the model). **SEO concern handled explicitly.** User shared GSC screenshot showing homepage `/` ranking with title "AI UX Audit: Free Tool to Score Designs Against 36 Patterns" at 27 clicks +8% MoM. Explained the three-layer distinction: `<title>` tag (in `page.tsx:10` metadata — primary ranking + CTR signal, untouched), `<h1>` (visible — secondary signal), OG title (social shares — zero SEO weight). Real-world precedent: Linear ships title-tag ≠ visible-H1 by design. Recommendation locked: keep metadata + JSON-LD untouched, change only the visible hero copy. User initially asked about rotating between two H1 phrases (kinetic typography between "Free AI UX Audit Tool" and "Catch AI slop before it ships" cycling back). Pushed back honestly with four reasons: (a) CLS already at 0.1255 above threshold + the two phrases have very different widths (21 vs 30 chars) so rotation would shift layout on every cycle pushing CLS further red; (b) active time = 64s so most visitors only see half the cycle; (c) fights the "calibrated measurement instrument" editorial precision aesthetic established by the corner reticles + hairline rules; (d) un-measurable — can't tell which framing converted better when every visitor sees both. Offered better mechanism: eyebrow gets one message, H1 gets the other — both visible at once, zero CLS, zero SEO risk, no JS. User confirmed approach. **Eyebrow swap.** "Free · No signup required" → "Stop shipping AI slop" (uppercase via existing class makes it confident). The "no signup" utility message wasn't lost — already lives in the `auditsRemaining` pill below the button (`{n} free audit · No signup`). H1 "Free AI UX Audit Tool" kept intact so the in-H1 keyword density for the ranked phrase ("AI UX audit tool") stays — losing it from the H1 would have meant ~1-3 position slippage over 4-6 weeks (recoverable but unnecessary). **Type scale bump.** User: "we can increase the sizes of eyebrow and the title... look okay but can be impactful if increased size what say?" Bumped each one breakpoint: eyebrow `text-xs` → `text-sm` (12→14px) + hairline rules `w-6` → `w-8` (24→32px) to balance the larger text; H1 `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` → `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` (30→36→48→60 becomes 36→48→60→72px); H1→subhead spacing `mb-4 sm:mb-5` → `mb-5 sm:mb-6` so larger H1 breathes. Type tone is now confident-not-shouty; doesn't shift CLS because `next/font` `adjustFontFallback: 'Arial'` matches Satoshi metrics on swap (per the documented CLS-prevention pattern in CLAUDE.md Perf Issue #2). **Verification.** `npx tsc --noEmit | grep FullPageResults` returned zero output (clean). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live at `http://localhost:3001` (port 3000 occupied by stale process PID 76774, background job `b7v6xt22t`). HMR clean across each edit. **Outstanding follow-ups.** (a) **7-day Clarity recheck targeting ~2026-05-20.** Compare `audit_demo_start_real_clicked` rate against the May 8-13 baseline (5 starts in 6 days = ~0.83/day or 1.2% of real sessions). Target: 2-3× lift to ~2.0-2.5/day = ~14-20 starts in a 7-day window. Decision rules: ≥15 starts in 7d → ship Stage B hero + revisit gating threshold; 8-14 starts → directional positive, hold and iterate copy; <8 starts → framing isn't the issue, move to Option C from the brainstorm (demo→action affordance on laptop frame). (b) **Watch total newsletter signups across all surfaces** (`/api/newsletter/subscribe` aggregated by `signup_source`). Expected: `homepage-hero-pre-audit` goes dormant (no new rows post-deploy), `audit` + `audit-waitlist` + `audit-report` cohorts pick up slack via post-audit surfaces. If total drops >30% vs May 8-13 baseline, the post-audit capture isn't compensating and we need to re-introduce a non-hero newsletter prompt (e.g., promote the "Daily AI UX news" section higher up). (c) **CLS regression at 0.1255** still open from yesterday's session — separate fix; multi-device hero composition needs explicit dimensions or `content-visibility: auto`. Today's H1/eyebrow size bump doesn't add CLS load (text loads at final size via `adjustFontFallback`). (d) **Dead `audit_hero_cta_clicked` event cleanup** still open from yesterday's session — remove from `AuditEvent` union in `src/lib/audit/analytics.ts:7` + delete orphan test `src/components/audit/__tests__/HeroAuditCTA.test.tsx`. Worth a broader grep audit of other unreachable events (`audit_remaining_banner_shown`, `audit_save_nudge_shown`) since `FREE_AUDIT_LIMIT = 1` makes the remaining-banner unreachable too. (e) **Five pre-existing untracked files left alone** per established session pattern: `.claude/worktrees/`, `.dwic/`, `docs/building-trust-into-an-llm-audit-tool.md`, `docs/medium-ux-collective-aiux-audit-story.md`, `scripts/inject-hoang-cta.mjs`. (f) **`update-memory.sh` emitted a stray `0` line again** (sixth recurrence per `feedback_save_script_ordering.md`) — hand-cleaned in this Notes block; the script's `git status | wc -l` stats computation still leaks the count line into output. Worth patching when there's a separate session for it. (g) **Stage A gating revisit.** The Stage A → Stage B hero rewrite gate in `project_aiex_repositioning_audit_first.md` was originally "≥20 audit completions in 14d post-fix." Today's hero changes reset that observation window — the May 21 recheck should now compare against the May 13 deploy date for clean attribution. If the recheck shows the threshold met, Stage B (full structural rewrite — logo carousel demotion, etc.) goes live. (h) **Dev server `b7v6xt22t` still running on port 3001** — caller may want to kill before next session.

### Session 2026-05-13 13:54 (MacBook)
- **Pattern:** Audit funnel observability — AuditSample DB table + admin viewer + Clarity baseline reconciliation post-May-8 promotion
- **Status:** ✅ Completed
- **Files Changed:** 7
- **Tests Added/Modified:** 0
- **Notes:** User asked to "check Clarity baseline for audit" — Week 1 baseline (Apr 20-29, recorded in `project_aiex_audit_clarity_baseline.md`) had a scheduled May 6 recheck that hadn't happened. Walked through three Clarity dashboard CSVs user exported (Apr 30 - May 13 combined, then split: Apr 30 - May 7 pre-promotion + May 8 - May 13 post-promotion). **Clarity read.** Five-ratio comparison vs Week 1 baseline: hook rate dropped 30% → 16.7% (combined 14d), upload completion 100% → 53.8%, value rate collapsed 60% → 14.3%, engagement undefined (chat_sent=0), paywall_dismissal not triggered. Identified the May 7/8 `/audit → /` homepage promotion (commits `6ed7dda` + `9981887`) as a confound — the window straddled it. User then re-pulled CSVs split at the promotion date. Post-split read: pre-promotion (Apr 30 - May 7) hook 27.8% stable, but value rate **0%** (0/3 gap_found) even before homepage promotion — the leak pre-dated the promotion. Post-promotion (May 8 - May 13) saw 3.5× lift in demo_viewed (~2.25/day → ~7.0/day) and INP dropped 392ms → 176ms but CLS regressed to 0.1255 (above Google's 0.1 threshold — multi-device hero is shifting layout). **Event wiring audit.** User asked to dig into why `audit_chat_message_sent`, `audit_paywall_shown`, and `audit_hero_cta_clicked` were all zero. Findings: (1) `audit_chat_message_sent` wired correctly in `FullPageResults.tsx:301` + `ResultsPanel.tsx:238` — but chat UI only renders after a gap is found, and `audit_gap_found = 1` in 14d means at most 1 user had access to chat. NOT a wiring bug. (2) `audit_paywall_shown` wired in `PaywallInlineCapture.tsx:18` (mounts when `isPaywalled=true`, requires audit count ≥ FREE_AUDIT_LIMIT=1) — `audit_session_completed = 2` total in 14d means at most 2 users could've been paywalled on a return visit, neither returned. NOT a wiring bug. (3) **Real bug confirmed**: `audit_hero_cta_clicked` is dead code — the May 8 Phase B promotion deleted both `HeroAuditButton.tsx` and `HeroAuditCTA.tsx` (per the May 8 session note "deleted...HeroAuditButton.tsx"), but the event remains in the `AuditEvent` union at `src/lib/audit/analytics.ts:7` + orphan test file at `src/components/audit/__tests__/HeroAuditCTA.test.tsx` references the deleted component. The 3 Clarity hits Apr 30-May 7 were the last firings before deletion shipped. Flagged for cleanup, not patched this session. **The real diagnostic gap.** User asked to write a Prisma query to inspect AuditSession rows for Apr 30-May 13 to disambiguate "API errored" vs "audit returned empty topGaps legitimately." Before writing it I checked the schema — **there is no `AuditSession` table**. Audit results live in component state + sessionStorage only (consistent with May 8 note "DB-token migration is separate work — out of scope" and May 11 Week 4 plan item "Prisma `AuditSession` table + `/admin/samples` viewer; deferred until eval framework matures"). Caught the assumption before committing to a script against a non-existent table. **Decision: ship the deferred AuditSample table now.** The May 11 gating condition ("deferred until eval framework matures") is met — eval framework exists, lint of last week's leak proves the diagnostic gap is load-bearing. Built it in a single change set, ~90 min: (1) Added `AuditSample` Prisma model with 3 indexes (createdAt, outcome, productType) — fields capture outcome, productType, deviceType, score, maxScore, applicablePatternCount, gapCount, criticalMissingCount, errorReason, truncated errorDetail (2KB), latencyMs, salted-SHA256 ipHash (16 chars), truncated userAgent (200 chars). **PII-safe by design** — no screenshots, no email, no raw IP, just enough metadata to slice by cohort. (2) New `src/lib/audit/sample.ts` — `recordAuditSample()` helper with internal `hashIp()` (uses `AUDIT_SAMPLE_IP_SALT` env → falls back to `HANDBOOK_TOKEN_SECRET` → constant); swallows write errors so DB suspension doesn't break user requests; truncates errorDetail/UA defensively. (3) Wired into `src/app/api/patterns/analyze/route.ts` at every exit path via `after()` from `next/server` (fire-and-forget, non-blocking): rate_limited, bad_request (missing image), parse_error (Zod fail returning 502), success (gapCount > 0), empty_gaps (auto-detected when `results.topGaps.length === 0` for context-first OR `criticalMissing.length === 0 && empty patterns` for legacy), api_error (500 catch). Each call captures `latencyMs` from `startedAt = Date.now()` at function entry. (4) New `src/app/api/admin/audit-samples/route.ts` admin-auth-gated GET — accepts `days` (1-90, default 14), `outcome` filter, `productType` filter, `limit` (default 200, max 1000); returns `samples` array + `stats` object (windowDays, total, byOutcome map, successRate, emptyGapsRate, errorRate, avgScore/avgMaxScore/avgGapCount/avgLatencyMs across success rows only). Uses `prisma.auditSample.groupBy({ by: ['outcome'] })` for the cohort counts in a single query. (5) New `/admin/audit-samples` page: server component does `checkAdminAuth()` → client component renders 8 StatCards (Total, Success rate, Empty-gaps rate with yellow border if >20%, Error rate with red border if >5%, Avg score, Avg gaps, Avg latency, Window) + outcome breakdown chips + filterable table (window: 1d/7d/14d/30d/90d; outcome: all/success/empty_gaps/parse_error/api_error/rate_limited/bad_request). Table shows: timestamp, outcome chip (color-coded), product type, device, pattern count, gap count, score/maxScore, latency in seconds, error reason with full errorDetail in `title` tooltip on hover. (6) Added "Audit Samples" link to `src/app/admin/admin-nav.tsx`. (7) Ran `npx prisma generate` clean. `npx tsc --noEmit` returned no errors related to any of the new/modified files. (8) User ran `npx prisma db push` — synced to Neon in 2.31s. Table is live in production schema. **Verification.** `npx tsc --noEmit` filtered grep clean (pre-existing 80+ errors elsewhere unchanged per CLAUDE.md test-mock divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. After deploy, `/admin/audit-samples` will start accumulating rows on every audit call from this point forward — Week 2+ Clarity reads will now be triangulated by direct DB telemetry. **Outstanding follow-ups.** (a) **Dead `audit_hero_cta_clicked` cleanup** — remove from `AuditEvent` union in `src/lib/audit/analytics.ts:7`; delete orphan test `src/components/audit/__tests__/HeroAuditCTA.test.tsx`. Worth a broader grep audit of other unreachable events (`audit_remaining_banner_shown`, `audit_save_nudge_shown`) since the `FREE_AUDIT_LIMIT = 1` setting makes the remaining-banner unreachable too. (b) **CLS regression on May 8 multi-device hero** (0.034 → 0.1255 above 0.1 threshold) — the laptop+phone composition in `FullPageResults.tsx` likely needs explicit dimensions on the device frames or `content-visibility: auto`. Worth a separate session if Vercel Speed Insights confirms in the next 7d field data window. (c) **Client-side abandonment instrumentation** — current `recordAuditSample` only fires on API calls; users who hit `audit_demo_start_real_clicked` but bail before pressing Analyze are invisible. A `/api/audit/track-abandon` ping on `beforeunload` would close the loop, but worth waiting to see what the DB data shows over the next 7-14 days before building it. (d) **`AUDIT_SAMPLE_IP_SALT` env var** — currently falls back to `HANDBOOK_TOKEN_SECRET`. If user wants a dedicated salt (best practice: don't reuse signing secrets for hashing IPs), set `AUDIT_SAMPLE_IP_SALT` to a fresh random string in Vercel env vars; existing rows will need re-hashing if you want consistency across the salt change, but for forward-only cohort analysis the fallback is fine. (e) **Empty-gaps detection edge case** for legacy flow — the heuristic `criticalMissing.length === 0 && Object.keys(patterns).length === 0` may misclassify legacy responses that have patterns but no critical-missing (the typical "all green" success case). Worth re-evaluating after first week of data; if the empty_gaps rate is suspiciously high among legacy rows, narrow the heuristic to only apply when `productType` is null AND no patterns AND no critical-missing. (f) **Vercel logs alternative** — confirmed no log drain (Axiom/Datadog) configured per `.env*` grep; Vercel Hobby retains only ~1h of runtime logs via CLI. The `AuditSample` table is now the system of record for analyze-route outcomes; future incidents go to /admin/audit-samples first. (g) **Migration choice** — used `npx prisma db push` (no migration file) rather than `npx prisma migrate dev --name add_audit_sample` for speed. For production hygiene, the next session that touches schema should consolidate by running `prisma migrate dev` against the current state, which will pick up the `AuditSample` table as a "first migration." Currently safe because schema and DB are in sync. (h) **Five pre-existing untracked files left alone** per established pattern: `.claude/worktrees/`, `.dwic/`, `scripts/inject-hoang-cta.mjs`, `docs/building-trust-into-an-llm-audit-tool.md`, `docs/medium-ux-collective-aiux-audit-story.md`. (i) **`update-memory.sh` again emitted a stray `0` line** into the new session block (fifth recurrence per `feedback_save_script_ordering.md`) — hand-cleaned in this Notes block; the script's `git status` parsing in the stats computation still leaks a count line into the output.


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
