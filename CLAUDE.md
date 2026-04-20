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
### Session 2026-04-20 19:27 (MacBook)
- **Pattern:** Conversational UI guide — Clarity Score 58 → engagement fix
- **Status:** ✅ Completed (commit + push pending)
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** Acted on a Clarity URL-performance CSV (`Clarity_aiux_URL performance_04-20-2026 06 50 PM.csv`, 2-day window 2026-04-19→20) that flagged all 11 `/guides/conversational-ui-guide/*` URLs at Clarity Score **58** and `/patterns/conversational-ui` at **65.4**, while every other route scored 86–91. **Key diagnostic**: the 11 lesson URLs shared identical metrics to 3 decimal places (LCP 645.764ms, INP 176ms, CLS 0) — all CWV green. The low score is driven by Clarity's UX-quality signals (quick-backs, dead clicks, rage clicks, JS errors), not by performance. This reframed the whole plan — the original hypothesis of "add images + flesh out content depth" got invalidated by a benchmark audit of the Claude Code guide: 23 lessons, **1 image total, zero interactive previews**, succeeds because each lesson intro is 27–39 words answering the slug's implied question directly ("Claude Code needs an API key to connect to the Claude AI service…"). Conversational UI guide's 11 intros were all essay-style warm-ups ("Before building X, you need to understand…", "Now let's build", "You now have all the pieces", "The next frontier is…") that miss the search/LLM-citation intent. **Real lever**: intent-matching first paragraph. Fixed in two surgical passes. **(1) `src/data/guides.ts` — rewrote all 11 conversational UI lesson intros** at the `{ type: 'intro', content: '...' }` blocks (lines ~5639, 5776, 5863, 5944, 6025, 6120, 6238, 6369, 6462, 6557, 6725). Each new intro is 37–42 words, answers the slug's question in sentence one, optionally adds a contrast or stat in sentence two, and tees up what the body delivers — never opens with "Before…" / "Now…" / "This lesson covers…". Examples: L1 ("what-is-conversational-ui-and-what-it-isnt") now opens *"A conversational UI is any interface where users shape outcomes through natural-language turns…"* (was *"Before building a conversational interface, you need to understand the landscape…"*). L6 ("managing-conversation-context") leads with specific numbers — *"Every AI model has a context window — GPT-4 holds ~128K tokens, Claude ~200K — but the design work is deciding what to keep, summarize, or drop without users noticing."* L11 ("agentic-conversational-ui…") cut the abstract "next frontier" framing for concrete stakes — *"An agentic chat doesn't just answer — it sends emails, runs code, or modifies files on the user's behalf."* **(2) `src/components/guides/ConversationalUIBot.tsx` — removed the rage-click trigger from the bot embedded on `/patterns/conversational-ui`** (via `CodeExampleBlock` case `'conversational-ui-guided'`, line 554). Prior behavior: users typed free-form questions (expecting a real AI since the input placeholder said "Ask about building a chat UI…"), got a generic "I'm a guided chatbot, so I work best with the suggested prompts" fallback → rage click / quick back. Fix: updated welcome message to say *"scripted demo of the conversational UI patterns you're here to read about… (no real model)"*, changed input placeholder from `"Ask about building a chat UI..."` → `"Type or pick a topic below (scripted demo)"` to set expectation pre-click, rewrote the fallback response to acknowledge the off-script question + route users to `/audit` (which does hit Claude) + link to the full guide. Adds 2 contextual links to fallback so it's not a dead end. **Ruled out during audit** (Task 1 of plan): shared components (`OnThisPage.tsx`, `GuideSidebar.tsx`, `src/components/ui/LessonRenderer.tsx`) are clean — real `<Link>`/`<a>` everywhere, no hydration risks (no date/time or `window`-gated rendering in shared guide tree), `CopyButton` has `document.execCommand('copy')` fallback, `CodePreviewBlock` tab toggles work. The `image`-type LessonRenderer fallback at lines 666–674 renders a dashed "Image coming soon" placeholder that would be a dead-click magnet if any conversational UI lesson had a `src`-less `image` section — but grep confirmed **zero image sections** exist in lines 5599–7176, so no risk. Prior Explore agent claim of "2 stub lessons" was wrong — awk-counted all 11 lessons have 10–37 sections each, 81–459 lines (L11 is the longest at 459 lines / 37 sections). `ConversationalUIBot` only loads on the pattern page (via dynamic import in `CodeExampleBlock.tsx` line 71–74), confirming why the pattern page scores differently (65.4) than the guide pages (58) — they share no unique components beyond sitewide layout. **Verification**: `npx tsc --noEmit` clean on both modified files (pre-existing 85 errors elsewhere in repo unrelated to this change). `npm run test:patterns` — 5/6 passing, the 1 failing test (`all pattern thumbnails should exist`) is pre-existing on master (verified via `git stash` round-trip), unrelated to this change, and concerns `predictive-anticipation`, `progressive-enhancement`, `privacy-first-design`, `selective-memory`, `session-degradation-prevention` thumbnails. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev-server smoke test and human-click dead-click verification left to deploy. **Scope not touched**: Step 4's "add 1 image per lesson" deliberately deferred to optional Step 7 — the Claude Code benchmark (1 image total across 23 lessons, scores well) suggests images aren't the lever, so deferred until the 7-day Clarity recheck proves or disproves that theory. Guide monolith split (`src/data/guides.ts` is 7,176 lines shipping all 5 guides on every lesson page) left out — HTML payload isn't the flagged issue, CWV green confirms it. **Success metric for 2026-04-27 recheck**: pull the same URL performance CSV; target 58 → 80+ across the 11 guide URLs + 65.4 → 80+ on the pattern page. If still red, the next lever is images (Step 7) followed by a deeper Clarity drill-down into the specific UX-quality signals (heatmaps, session recordings) to find the exact dead-click zones. **Plan file**: `/Users/imranmohammed/.claude/plans/twinkly-crafting-zephyr.md` (reviewed approach twice as new evidence came in — first the CSV CWV-green reveal, then the Claude Code benchmark flipping the image hypothesis — plan edited in-place each time). **User-flagged item for future sessions**: the Clarity Score's 2-decimal-place duplication across URLs likely reflects small sample sizes over a 2-day window; revisit with a 14-day or 30-day Clarity window next time to get real per-URL signal.

### Session 2026-04-17 21:53 (MacBook)
- **Pattern:** Homepage audit CTA visual upgrade + gist.design dogfood experiment
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Two-part session. **(1) Homepage audit CTA visual upgrade.** Recent Clarity data showed only 4/1,390 completions and a 0.65% CTR on the tiny "Try the free AI UX audit →" text link sitting between the newsletter hero and the pattern grid on `/`. Replaced `src/components/audit/HeroAuditCTA.tsx` with a full-width (max-w-7xl parent), single-line, entirely-clickable bordered card: animated icon tile on the left (inline SVG of a schematic UI with three content lines + a glowing accent-colored scan bar sweeping top↔bottom on a 2.5s `ease-in-out` keyframe loop, `motion-safe:` gated so reduced-motion users see a still icon, plus a small `animate-pulse` dot in the corner), title + one-line tagline in the middle, arrow on the right that nudges `translate-x-0.5` on group-hover. All colors via existing design tokens (`bg-surface-primary`, `border-border-primary`, `text-accent-primary`, etc.) — no hardcoded hex, dark mode automatic. Preserved the existing `trackAuditEvent('audit_hero_cta_clicked', { source: 'homepage_below_intro' })` event name so Clarity before/after comparison stays clean. Kept the card as a secondary CTA (not a card that "sits in the air" per user direction — single horizontal strip matching the width of the pattern grid below). No new imports → zero bundle impact, which matters for homepage per CLAUDE.md Perf Issue #8 (framer-motion inflates critical path). Went CSS-only intentionally for that reason. Net 67 insertions / 15 deletions, single file. **(2) gist.design dogfood experiment — outcome: kill the 36-file plan.** GitHub issue #25 (P3, open) proposed generating 36 `.gist.design` files, one per pattern, to dogfood gist.design on aiuxdesign.guide. Ran two cheap experiments to decide before investing effort. **Test A (product level)** — 6 positioning questions about aiuxdesign.guide asked cold in ChatGPT + Claude, then again with `public/aiuxdesign.gist.design` (the one existing file, created 2026-03-30) pasted in as context. Cold answers were already substantively correct across both tools on pattern count (36), interactive-demo framing, free/no-signup, competitor differentiation. File-loaded answers added color (e.g., Claude mentioned the "28→36 via 8 agentic patterns added Feb 2026" history, rate limit details) but flipped 0 wrong cold answers to right. **Test B (pattern level, the decisive one)** — unambiguous query "I'm building an AI writing assistant, users want to review AI edits before they're applied, what pattern + UI + cite sources" asked cold in ChatGPT + Claude. Neither cited aiuxdesign.guide. ChatGPT cited LinkedIn + uxstudioteam.com + arXiv. Claude cited Microsoft HAX Toolkit Guideline 9 + Amershi et al. CHI 2019 + VS Code docs + Tiptap + Hygraph + Orwellix + Notion AI. Both produced substantively correct, well-sourced answers — aiuxdesign.guide simply doesn't win retrieval against first-party tool docs + HCI research for pattern-level queries. **Conclusion:** bottleneck is retrieval authority, not content format. A `.gist.design` file the LLM never fetches adds zero value. Per-pattern files would be a detour. Saved `project_aiex_gist_design_experiment.md` to `~/.claude/projects/-Users-imranmohammed/memory/` and linked it from MEMORY.md active follow-ups. **Side artifact:** benchmarked the current `/patterns/human-in-the-loop` page against Claude's cold answer from Test B — structure is present (Problem/Solution/Examples/Guidelines/Considerations/Demo/Related/Guides) but substance is thin: "Real-World Examples" section has the header but only 3 generic products named inline (Grammarly, "content moderation tools", "medical AI") vs. Claude's 6 specific products with links (VS Code, Tiptap, Hygraph, Orwellix, Notion AI, Word Track Changes). Zero research citations vs. Claude's HAX Guideline 9 + Amershi CHI 2019. Doesn't split edit-review (diff/accept-reject) vs. generate-and-insert (Notion AI Replace/Insert) — Claude noted this as worth two entries. Demo is content moderation, narrower than most-searched intent. Proposed A/B: improve HITL + 2 other high-traffic patterns to Claude's benchmark depth (~2–3 hrs each), wait 30 days, check GSC impressions + whether LLMs start citing. If yes, replicate across rest of 36. If no, moat is elsewhere (backlinks, original research) and per-pattern files would have been a detour anyway. **Issue #25 to be closed/parked with rationale** (not closed in this session — left as explicit user action). **Verification:** dev server ran cleanly on port 3000, HMR picked up the component change without errors. Did not run `npm run build` per feedback memory `feedback_dont_build_during_dev.md`. TypeScript check against the modified file only (not full repo) via `tsc --noEmit` filter — clean on HeroAuditCTA.tsx. No other files touched this session. Open items for next pickup: close/park issue #25, start HITL page depth improvements against Claude's answer as the benchmark (fill Real-World Examples with 6 named products + screenshots, add Research & References block with HAX Guideline 9 and Amershi 2019 links, add "Two contexts" callout splitting edit-review from generate-and-insert, consider broadening or swapping the demo).

### Session 2026-04-17 16:27 (MacBook)
- **Pattern:** Audit tool v2 — intake simplification + results redesign
- **Status:** ✅ Completed
- **Files Changed:** 13
- **Tests Added/Modified:** 0
- **Notes:** Major audit tool overhaul driven by 0.3% completion rate (4/1,390 sessions). **Phase 1 — Simplified intake:** removed product-detail step (description + branched questions), flow now product-type → screenshot → analyze (2 steps instead of 3). Deleted BranchedFollowUp.tsx. Updated buildUserPrompt to infer product context from screenshot alone. Changed API isContextFirst check from `!!(productType && productDescription)` to `!!productType`. **Phase 2 — Results redesign:** replaced floating sidebar with full-page split-view results — screenshot sticky on left, findings scrollable on right. Added letter grade scoring (A-F with color-coded ring via new scoring.ts utility). Created LetterGrade.tsx, GapCard.tsx (severity badges: Critical/Warning/Good), and FullPageResults.tsx. Top 3 issues shown, rest collapsed under "Show N more". Issues/Chat tab toggle at top of right column — clicking Chat auto-sends opening message summarizing top 3 priorities with full scan context. **Scanning animation:** uploaded screenshot as dimmed/blurred background with pattern checklist (8 fixed slots cycling through 30 patterns), progress bar, and AI product logo marquee ticker. **Example preview:** screenshot upload step now split-view — upload on left, example audit result card on right (per-product-type sample with mini letter grade + 3 findings). Updated demo-audit.ts with topGaps/quickWins for new results layout. Also updated /start command to check GitHub project board, fixed cursor-pointer on /news filter chips. Updated start command to pull + show project board priorities instead of full CLAUDE.md session reading.

### Session 2026-04-17 16:24 (MacBook)
- **Pattern:** /news page stale cache fix
- **Status:** ✅ Completed (commit + push pending)
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** User reported `/news` was showing only the 2 static Dec 2025 entries instead of the expected last 30 days, and fewer product pills than before. Thorough diagnosis ruled out the workflow gap I initially suspected: admin UI "Show all" confirmed 7 drafts had been correctly published from the `/admin/newsletter` review flow for Apr 12–17 (plus one `rejected` on Apr 11). Admin workflow + daily cron + publish action were all intact. Bug was strictly in the `/news` render path: `src/app/news/page.tsx:20` had `export const revalidate = 3600` (ISR, 1h TTL) and `publish/route.ts:35` called `revalidatePath('/news')` on each publish, but production HTML stayed frozen for ~60+ days regardless. Two plausible mechanics (didn't need to differentiate since both are fixed by the same change): (a) `revalidatePath` not punching through Vercel's edge CDN layer on top of the Next.js data cache, or (b) `getPublishedDrafts()` silently failing at regeneration time and the `catch` block at lines 64-67 returning `[]` without any Vercel-visible alarm, leaving fresh regenerations as stale as the prior one. **Fix shipped:** flipped `revalidate = 3600` → `export const dynamic = 'force-dynamic'` so every `/news` request hits Postgres fresh (trivial cost — one indexed SELECT, low-QPS page). Also upgraded the catch-log from `"Failed to fetch..."` to `"CRITICAL: ... /news will render stale static fallback only."` so any future Prisma failure on this path shows up immediately in Vercel function logs instead of masquerading as a working page. Kept everything else unchanged per explicit user confirmation: cron still writes `pending_review` (manual review gate preserved), admin UI untouched, Dec 2025 static seeds preserved as historical fallback, publish route's `revalidatePath` calls left in place (harmless no-ops for `/news` now but still correct for `/news/${slug}` per-article pages). Product filter pills self-heal — they're derived from newsletter content via `extractProducts()` against the 13-entry `PRODUCT_KEYWORDS` map in `page.tsx:22-36`, so once April drafts flow through, pills for OpenAI/Figma/etc. will appear automatically. Also broadened `.gitignore` pattern `.env.vercel` → `.env.vercel*` because an earlier `vercel env pull` attempt left a `.env.vercel.prod` secrets file uncommitted that wasn't matched by the existing pattern. **Diagnosis detour worth noting:** initially hypothesized the workflow gap (cron writes `pending_review`, admin must publish) had broken after the Apr 14 Beehiiv migration. Was wrong — user corrected twice ("I review every news entry and click publish", "why are we touching admin"), and the admin UI screenshot proved it. Real root cause only surfaced after getting into the admin UI state. Git archaeology then confirmed `pending_review` default has been in place since commit `0a8de0d` (original newsletter system) — so the "30-days auto-appearing" wasn't a regression from any recent refinement; it had always been downstream of a working admin publish + working ISR revalidation, and the ISR side is what broke. **Still pending locally (not touched this session):** 8 uncommitted audit-area files (new `FullPageResults.tsx`, `GapCard.tsx`, `LetterGrade.tsx`, `scoring.ts`; deleted `BranchedFollowUp.tsx`; modified `audit-client.tsx`, `ScreenshotUpload.tsx`, `demo-audit.ts`, `prompts.ts`, `types/audit.ts`) — unrelated mid-flight work from a prior session, left untouched and to be committed separately. **Verification once deployed:** `curl https://www.aiuxdesign.guide/news | grep -oE 'Apr [0-9]+'` should return hits for Apr 17/16/15/14/13/12; page heading flips to "Last 30 days" since `hasRecentNewsletters` will evaluate true; next Publish click in admin should surface on `/news` without the 1-hour cache wait.

### Session 2026-04-16 23:34 (MacBook)
- **Pattern:** Project prioritization + homepage hero + SEO + AI discoverability
- **Status:** ✅ Completed (3 commits, push pending)
- **Files Changed:** 6
- **Tests Added/Modified:** 0
- **Notes:** Set up GitHub Projects board ("aiex Roadmap") with priority fields (P0-P3) and status columns. Seeded board from memory follow-ups: 8 issues total, closed 5 duplicate LHCI regression issues. Analyzed Clarity CSV export (Apr 2-16): confirmed INP fix worked (1,100ms→224ms, closed #19), audit funnel has only 4/50 completions (too early for gating), identified React #418 hydration error (7 sessions) and setProductFilter bug (2 sessions). Fixed /news page CLS (0.1045→should pass): rewrote isToday()/isNew() to use UTC consistently eliminating hydration gate, enabled SSR for InlineNewsletterSignup and fixed placeholder height mismatch (48px→152px), fixed setProductFilter typo. Bumped LHCI workflow Node.js 20→22. Restored newsletter signup to homepage hero as primary CTA — data showed signups dropped 55% (11/wk→5/wk) after Apr 1 switch to audit CTA. Audit CTA demoted to subtle text link below intro. SEO paragraph moved below pattern grid. Optimized meta titles/descriptions for 8 high-impression zero-click patterns from GSC data (progressive-disclosure pos 5.85, adaptive-interfaces pos 4.92, context-switching pos 4.96, etc.) — rewrote to match exact search query language. Created /llms.txt with all 36 patterns, 5 guides, tools, and resources for AI tool discoverability (site already gets traffic from ChatGPT 32, Perplexity 29, Gemini 14, Claude 13 sessions). Created #25 for .gist.design dogfood experiment (P3).

### Session 2026-04-16 19:44 (MacBook)
- **Pattern:** Dynamic OG image generation for all page types
- **Status:** ✅ Completed (1 commit, push pending)
- **Files Changed:** 11
- **Tests Added/Modified:** 0
- **Notes:** Built dynamic Open Graph image generation system to fix missing GSC thumbnails. GSC Insights showed ~15 pages with no thumbnail previews — root cause was either empty `thumbnail` fields (6 agentic patterns) or product screenshot GIFs/PNGs at wrong dimensions being rejected by Google/social platforms. Created 3 OG API routes following the existing newsletter OG pattern (`@vercel/og` ImageResponse + Satori): **(1) `/api/og/patterns?slug=...`** — 36 pattern pages, each with category-specific Lucide icon (Brain, Shield, MessageCircle, Zap, Lock, Heart, Users, ShieldAlert) centered in concentric rings over a straight wireframe grid mesh. **(2) `/api/og/guides?slug=...`** — 5 guide pages, each with actual brand logo SVG (Anthropic "A" for Claude Code, Cursor hexagon, GitHub Copilot visor, GitHub octocat, MessageCircle for Conversational UI) using fill-based rendering. **(3) `/api/og/page?slug=...`** — 5 standalone pages (news, handbook, agent-readability-audit-kit, agentic-ux-checklist, prompts), each with a relevant Lucide icon (Newspaper, BookOpen, ClipboardCheck, CheckSquare, Sparkles). All cards share identical design: black bg (#0a0a0a), Satoshi font (TTF loaded for Satori), WCAG AAA accessible text hierarchy (#ffffff title 19.4:1, #d4d4d4 body 12.1:1, #b0b0b0 tertiary 8.5:1), straight wireframe grid on right side, concentric rings + large 80px icon, divider + branded footer. Consulted dwc color-specialist MCP for accessibility — original grays (#555555, #888888) failed WCAG AA; fixed all text to AAA. Brand color validated as navy #162036 (not purple) — too dark for accent on dark OG bg, so went monochrome white-on-black matching the PDF handbook aesthetic. Shared utilities extracted to `src/app/api/og/shared.ts` (colors, icons, grid generator, font loader). Metadata wired: `src/utils/metadata.ts` (patterns), `src/app/guides/[slug]/page.tsx` (guides), plus 5 individual page files. All routes return 200, zero new TS errors. Cache headers set to 7-day edge cache. **Coverage:** 46 pages now have unique branded OG cards (36 patterns + 5 guides + 5 standalone), newsletter articles already had dynamic OG, 6 index/landing pages use static og-home.png (appropriate), 2 noindex pages skipped.

### Session 2026-04-16 14:05 (MacBook)
- **Pattern:** GSC coverage fixes + guide↔pattern cross-linking
- **Status:** ✅ Completed (1 commit, push pending)
- **Files Changed:** 13
- **Tests Added/Modified:** 0
- **Notes:** Analyzed GSC coverage export (Apr 16) showing 54 indexed / 98 not-indexed pages. Impressions healthy at 5x growth (200→1,000+/day). The 98 not-indexed broke down into 7 categories; implemented fixes for the 4 actionable ones. **(1) 404 fixes:** Added 3 redirects in `next.config.mjs` for deleted audit sub-routes (`/audit/context`, `/audit/upload`, `/audit/analyze` → `/audit`). Deleted orphaned `/prompt-builder/` directory (88 LOC — redirect in next.config.mjs already handled it, the page file was dead weight). Added `dynamicParams = false` to 4 static routes (`patterns/[slug]`, `patterns/category/[slug]`, `guides/[slug]`, `guides/[slug]/[lesson]`) so unknown slugs return proper 404 instead of attempting to render and producing soft 404s. **(2) Soft 404 fixes:** Updated `robots.ts` to block `/audit/results/`, `/handbook/preview`, `/download/` — session-dependent pages that render empty for Googlebot (top candidate for the 2 soft 404s in GSC). **(3) Crawled-not-indexed cleanup:** Added `robots: 'noindex, follow'` to `/privacy` and `/terms` metadata. Removed `/privacy`, `/terms`, and `/aiuxdesign.gist.design` (a static file, not a page) from `sitemap.ts` — frees crawl budget for the 77 discovered-but-not-yet-indexed lesson pages. **(4) Cross-linking for indexing acceleration:** Created `src/lib/cross-links.ts` with bidirectional mapping of 5 guide courses to ~36 related pattern slugs (semantically curated, much richer than the sparse 2-3 pattern `relatedPatterns` arrays on each guide). Added "Practice in Guides" section to pattern pages (`client-page.tsx`) — shows 1-5 linked guide course cards between "More in Category" and "Newsletter Signup". Added "Related Patterns" section to lesson pages — shows 3 linked pattern cards between the lesson body and newsletter CTA. This creates ~180 new internal links from indexed pattern pages to guide courses, plus ~200 links from lesson pages back to pattern pages — bidirectional link equity that helps Google discover and crawl the 77 pending lesson URLs faster. **Issues left as-is:** 4 "page with redirect" (old URLs naturally draining from index, no action needed), 1 "excluded by noindex" (intentional — likely `/unsubscribe`), 1 "alternate with canonical" (expected canonicalization behavior), 77 "discovered - not indexed" (will self-resolve in 2-4 weeks as Google crawls, now accelerated by cross-linking). **Next steps:** After deploy, validate fixes in GSC → Coverage → click each issue type → "Validate Fix". Check back in 1-2 weeks for indexing progress on the 77 lesson pages.
0

### Session 2026-04-16 12:12 (MacBook)
- **Pattern:** Newsletter email template redesign
- **Status:** ✅ Completed (1 commit, push pending)
- **Files Changed:** 3 (route.ts, globals.css, .gitignore)
- **Tests Added/Modified:** 0
- **Notes:** Completed the newsletter UI polish that was left uncommitted from a previous session. Refactored both daily and weekly email HTML rendering from hardcoded inline strings into modular helper functions (`renderMasthead`, `renderStoryCard`, `renderDarkCallout`, `renderFooterCTA`, `wrapEmailShell`) with a brand-aligned color palette mapped to design tokens (`EMAIL_INK #162036`, `EMAIL_TEXT #20294C`, `EMAIL_MUTED #64748b`, dark mode variants with WCAG AA contrast on navy). Visual changes: Designer's Takeaway restyled as blockquote with curly quotes and "— Designer's Takeaway" attribution label; pattern links changed from filled badges to outlined pill chips with "PATTERN" small-caps kicker; story separators bumped from 14px/#94a3b8 to 18px/#64748b for visibility; dark callouts use 16px border-radius; footer adds "Curated by Imran" byline + "Read past issues" link; both daily ("Today's Idea") and weekly ("Steal this week" + "Pattern deep-dive") callouts use shared `renderDarkCallout()` helper. Dark mode CSS fixes in globals.css: added overrides for inline links (`a[style*="color: #162036"]` → `#93c5fd`) and table cells (`td[style]` → `#94a3b8`), updated pattern chip selector from `a[href^="/patterns"]` to `a[href*="/patterns/"]` for outlined style, updated CTA button color from `#0f172a` to `#162036`; all applied to both `html[data-theme="dark"]` and `@media (prefers-color-scheme: dark)` blocks. Dead code removed: `getProductColor()` (34 lines), `getPatternBgColor()` (23 lines), `EMAIL_TINT` constant — all unused after template refactor. Also removed `ICON_CURSOR_CLICK` and `ICON_ACADEMIC_CAP` constants (replaced by shared section headers). Generated full daily + weekly preview HTML files (gitignored) for visual QA. User confirmed custom font (Satoshi) not worth adding to email — system font stack is correct since Gmail/Outlook strip `@font-face`. Net: +196/-116 lines across 3 files. All future newsletter generations (daily cron at 3 AM UTC, weekly Monday 2 AM UTC) will automatically use the new design.

### Session 2026-04-14 22:02 (MacBook)
- **Pattern:** Paywall funnel — instrumentation, threshold drop to 1, hydration fix, auto-open on mount
- **Status:** ✅ Completed (2 commits, both pushed)
- **Files Changed:** 3 (this commit) + 6 (prior commit 54fa53a)
- **Tests Added/Modified:** 0
- **Notes:** Implemented the paywall fix documented in `/Users/imranmohammed/Desktop/aiuxpaywall/aiux-paywall-funnel-fix.md`. Spec claimed the fake-door paywall was "not wired up" — reading the code disproved that: modal, `audit_paywall_shown` event, waitlist API + Beehiiv sync all already existed and fired correctly. Real problem was *under-exposure* — `FREE_AUDIT_LIMIT=3` meant the wall fires on audit #4, and Clarity showed only 4 `audit_session_completed` events across ~1,390 sessions over Apr 5–14. Nobody was reaching it. Two commits shipped. **(1) `54fa53a` — Instrumentation + copy derivation (no behavior change).** Created `src/lib/audit/constants.ts` so the threshold can be imported by both the server `page.tsx` and the client `useAuditCount` hook without dragging `'use client'` into the server component. Typed as `: number` to prevent TS literal-narrowing killing `=== 1` / `> 1` guards. Added `audit_paywall_dismissed` to the `AuditEvent` union. `PaywallModal`: new optional `auditCountAtTrigger` prop; `audit_paywall_shown` now fires with `{ audit_count_at_trigger }` metadata so we can distinguish the threshold=3 era from threshold=1 era in Clarity; new `handleDismiss` wraps `onClose` and fires `audit_paywall_dismissed` unless `success === true`, wired to backdrop/X/Escape but not to the success-screen "Got it" (no false rejection signal after conversion). Copy made limit-agnostic: Free tier TIERS description derived from constant (`${N} lifetime audit${s}`), paywall heading changed to "You've used all your free audits". `audit-client.tsx`: nudge conditions (`RemainingAuditsBanner`, `SaveReportNudge`) short-circuited with `FREE_AUDIT_LIMIT > 1 && auditCount === FREE_AUDIT_LIMIT - 1` — self-adjusts if threshold is later tuned back up, and skips entirely at threshold=1 where the paywall *is* the nudge. FAQ JSON-LD in `page.tsx` reworded from "daily limit of 3 analyses" to a limit-agnostic phrasing. **(2) Commit 2 (this save) — Lower threshold to 1 + marketing chip + SSR hydration fix + auto-open on mount.** Flipped the constant 3→1. Discovered a runtime `NotFoundError: Failed to execute 'removeChild' on 'Node'` during local testing — my Commit 1 had replaced the hardcoded chip string with interpolated JSX (`{FREE_AUDIT_LIMIT} free audit{FREE_AUDIT_LIMIT === 1 ? '' : 's'} included`), which React's JSX transform emits as four children. At SSR, that rendered as multiple text nodes separated by `<!-- -->` comment markers (confirmed via curl). At threshold=1 the ternary also produced an empty text node sandwiched between comment markers. The client effect in `audit-client.tsx` does `chipEl.textContent = ...` which wipes all children including the markers; React's fiber tree still held references to the original nodes, so on next reconciliation (HMR/parent state change) `parent.removeChild(trackedChild)` threw because the node was no longer a child. Fix: pre-compute the label as a single server-side string and pass as one JSX expression, restoring the single-text-node invariant. User then flagged the chip copy as "transactional" — pushed for marketing-toned phrasing. Replaced the whole state model: pre-audit → "Claim your free audit" (singular at N=1, "Claim your N free audits" at N>1); partially used → "{remaining} free audit{s} left"; exhausted → hide the chip entirely via `style.display = 'none'`. User also correctly flagged the original funnel UX as bad: forcing an already-exhausted returning user through product type → description → upload → Analyze → paywall wastes their time. Added a useRef-gated `useEffect` in `audit-client` that auto-opens the paywall modal once per mount when `isPaywalled && step === 'product-type' && !isDemoMode`. Dismissal remains free — after X/backdrop/Escape, the ref stays set and the modal doesn't re-pop, so the user can browse the site. Existing analyze-button gates still fire if they try to audit anyway. Fresh page mount = fresh ref = modal re-opens. **Recognition model noted**: entirely `localStorage['aiux_audit_count']`, browser-local. No auth. A user with DevTools or incognito gets unlimited resets. Intentional for a fake-door test — building real per-user enforcement costs weeks and tells us nothing beyond "does the wall convert." Server-side `/api/patterns/analyze` has an IP-based 1/min rate limit independent of this counter. **Analytics tradeoff recorded**: three events (`shown` with `audit_count_at_trigger` metadata, `dismissed`, `waitlist_signup`) all fire across both commits. Clarity-derived "saw paywall but didn't submit in this session" gives us the rejection signal equivalent. `shown` event volume now has a different meaning than before — used to fire only after 3 intake steps + Analyze click (high-intent), now also fires on page-load auto-open for all exhausted returning visitors. Counts will jump; segment by `audit_count_at_trigger` in Clarity to isolate engaged-flow vs entry-gated exposures. **Verification**: `npx tsc --noEmit` clean on all modified files (0 new errors, 85 pre-existing elsewhere are test mocks + standalone scripts with different tsconfig + widened unions with stale consumers). Local dev server (port 3001) served `/audit` with 200; curl verified SSR chip renders as a single-text-node `>Claim your free audit</span>` with no comment markers. Interactive browser walkthrough handed to user — they confirmed reset flow works (`localStorage.setItem('aiux_audit_count','1'); location.reload()` gives them the exhausted state), saw the "new chip" (aka the auto-opened paywall + hidden chip), and surfaced the bad-UX concern that drove the auto-open-on-mount change. **Still pending from spec**: homepage audit CTA diagnosis (Task 3 of the spec — CTR 0.65% vs checklist form 16 submits; spec says flag, don't change in this PR). Also pre-existing `paywall-waitlist` not in `NEWSLETTER_SOURCES` enum in `src/types/newsletter.ts` — Zod doesn't catch it at runtime but TS doesn't flag it at build — surfaced during exploration, out of scope for this PR. **Success metrics to watch at 7 days post-deploy**: `audit_paywall_shown` volume (pre-deploy was ~0 functional exposures; post-deploy expect substantial jump); `dismissed/shown` ratio (expect 60–80% industry baseline); `waitlist_signup/shown` (target >20% per spec); Beehiiv `paywall-waitlist` tag count should match `waitlist_signup` ±1. If `shown` stays single-digits even at threshold=1, problem is homepage CTA, not threshold.

### Session 2026-04-14 20:13 (MacBook)
- **Pattern:** /audit page LCP fix — SSR the intake hero
- **Status:** ✅ Completed (shipped locally, push pending)
- **Files Changed:** 6
- **Tests Added/Modified:** 0
- **Notes:** Targeted fix for the Clarity-reported regression on `/audit` (LCP 8.1s, CLS 0.14, dead clicks 12.82% across 39 sessions / 2 perf samples in the last 7 days). The root cause matched CLAUDE.md Issue #12 ("Fully client-rendered 'page = `<Client />`' pattern has catastrophic LCP") — the H1 "Free AI UX Audit Tool" + subtitle + info chip all lived inside `AuditClient` which is `'use client'`, so the LCP element only painted after JS parse + hydrate. The misleading `loading.tsx` compounded it: the skeleton showed the *results-view* layout (dark gradient + upload area) even though users land on the *intake-view* (light bg + H1 + product-type cards), so navigations from elsewhere on the site flashed the wrong shape before settling into the real hero. User pushed back with a good strategic question — "what if every step is a url on its own?" — and I walked through the tradeoffs: URL-per-step would win on bundle-per-step + browser back/forward + funnel analytics + dead-click window, but it doesn't actually fix step-1 LCP (which is the landing page's problem regardless), would introduce sessionStorage or URL-param state fragility (the exact failure mode the legacy `/audit/{context,upload,analyze}` pages shipped with — they exist in the repo as dead code from an earlier rewrite attempt), and the 2-pageview Clarity sample isn't enough signal to justify the refactor scope. We aligned on the smaller pragmatic fix. **Changes made:** (1) `src/app/audit/page.tsx` — added SSR'd `<section id="audit-intake-hero">` above `<AuditClient />` containing the chip (`id="audit-intake-chip"`, defaulting to "3 free audits included"), H1 ("Free AI UX Audit Tool"), and subtitle. All three render as plain server HTML text nodes now, before any client JS touches the page. (2) `src/app/audit/audit-client.tsx` — removed the duplicate chip/H1/subtitle markup from the step-1 render branch; added two effects: `useEffect([step])` that hides `#audit-intake-hero` via `style.display = 'none'` when `step !== 'product-type'` and restores it on back-navigation, plus `useEffect([auditCount, auditsRemaining])` that rewrites the chip's `textContent` post-hydration for return visitors whose localStorage shows prior audits (`"${auditsRemaining} of 3 free audits remaining"` vs the default). Top padding on the client step-1 section shrunk from `pt-8 sm:pt-12 md:pt-16` → `pt-4 sm:pt-6 md:pt-8` since the hero above now owns the top breathing room; step-2/3 keep the original larger padding since the hero is hidden. (3) `src/app/audit/loading.tsx` — complete rewrite from the dark-gradient results-view skeleton to an intake-hero skeleton (light bg, chip placeholder, H1 placeholder, subtitle lines, 5 card placeholders in the 2/3/5-col grid matching `AnchorQuestion.tsx`, demo link placeholder). Navbar skeleton kept. (4) Deleted three legacy pages: `src/app/audit/context/page.tsx` (260 lines), `src/app/audit/upload/page.tsx` (179 lines), `src/app/audit/analyze/page.tsx` (135 lines). All three used the old `ProductType` enum (`chatbot | content | code | image | analytics | other`) not the current one (`chat-interface | ai-agent | recommendation-system | content-generation | other`), relied on sessionStorage for cross-page state, and had zero external inbound links (verified via grep — only the three files referenced each other, plus one mention in `docs/pattern-audit-claudecode-guide.md` describing the old architecture, untouched). Sitemap (`src/app/sitemap.ts`) only lists `/audit`, so no SEO impact from deletion. **Net churn:** 91 insertions, 635 deletions across 6 files — dominated by the 574 lines of legacy-page deletion. **Verification:** TypeScript check (`npx tsc --noEmit`) — 3 new errors in `.next/types/validator.ts` pointing at the deleted `page.js` stubs (stale Next.js cache, regenerates on next build), all other errors pre-existing. Dev server (port 3001, since port 3000 was held by a prior session's process — user has "kill localhost dev server" on their to-do from earlier today) served `/audit` with 200. Did NOT open a browser to interactively test — left that to the user. **Architectural notes for future sessions:** (a) The DOM-manipulation pattern for hiding server-rendered content (`document.getElementById('audit-intake-hero').style.display = 'none'`) mirrors the existing approach for `#audit-social-proof` in the same file — consistent with local conventions, but imperative. If this scales further, a context-provider pattern with conditional rendering would be cleaner. (b) There's one frame of potential double-content visibility when transitioning from step 'product-type' → 'product-detail' (state updates → re-render → paint → useEffect fires → hero hides), but in practice it's imperceptible on a user-initiated click. Used `useEffect` not `useLayoutEffect` to avoid SSR warnings. (c) The chip's post-hydration text update is done via `textContent` mutation rather than React state — chosen specifically to avoid a hydration mismatch, since React will never diff server-rendered content against a client render (the chip is outside `AuditClient`'s React tree). (d) URL-per-step remains a valid future direction if dead clicks stay high after measurement — deferred with justification, not rejected. **Not touched:** INP 260ms (separate concern, needs profiling), the interactive cards themselves (`AnchorQuestion` still client-only), modals/results/paywall (already correctly lazy-loaded via `dynamic()`), `SocialProof` (already server-rendered). **Measurement plan:** wait 5-7 days after deploy for a larger Clarity sample before declaring fixed — 2 pageviews is too noisy to trust. Expected field LCP recovery: 8.1s → somewhere in the 2-4s range on mobile, limited by font load + the `bg-grain` background + 51% ChromeMobile traffic on slower devices. CLS should drop sharply since the main shift source (skeleton→intake swap) is gone.

### Session 2026-04-14 17:58 (MacBook)
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

### Adding New Issues

When you encounter a problem, document it here with:
1. **What failed** - Clear description of the issue
2. **Date** - When it was discovered
3. **Solution** - How it was fixed
4. **Category** - Add to appropriate section above
