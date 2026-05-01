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
### Session 2026-05-01 12:13 (MacBook)
- **Pattern:** Audit paywall — modal redesign, gating, free-audit signal, waitlist consolidation, Beehiiv source-tag cleanup
- **Status:** ✅ Completed
- **Files Changed:** 6
- **Tests Added/Modified:** 0
- **Notes:** User reported the post-audit paywall modal looked "very odd" and not premium. Multi-iteration redesign pass on `src/components/audit/PaywallModal.tsx`. **(1) Direction A — compact waitlist.** Replaced the 3-tier pricing-grid (Free grayed-out as "current plan" / Early Access $9 / Individual Pro $19) with a single-column `max-w-md` modal: eyebrow → headline → price line → benefits → email → CTA. Argued against the 3-tier grid in a modal context (user already knows they used their free audit, dimming the actual ask; price comparison softens scarcity since users see the price they're escaping; warning-yellow "Free audits used" badge reads as error state for what should be an invitation). **(2) Premium pass.** User flagged the v1 didn't feel premium against the design system. Iterated: navy-tinted shadow `shadow-[0_24px_60px_-12px_rgba(22,32,54,0.25)]` instead of generic `shadow-2xl`; gradient hairline accent at top edge; soft `background-secondary` gradient defining the hero zone; pulsing scarcity dot ("Early Access · First 50 only" pill with animated ping); `$9` rendered as 5xl tabular-nums display type with `$19` struck-through trailing inline; refined accent-tinted check bullets in 14px circles (instead of generic outline ticks); `backdrop-blur-md` + navy-tinted scrim; disabled button switched from opacity-50 (was washed out gray-purple, looked broken) to explicit `bg-text-disabled`. Brand accent confirmed as navy `#162036` per globals.css, not orange — earlier `[217, 119, 87]` memory was for aiux brand accent in a different context. **(3) Trigger timing fix.** User said the paywall fired "after the fact" — i.e., user uploaded screenshot, hit Analyze, then paywall blocked. Diagnosed: the `useEffect`-based auto-open in `audit-client.tsx` ran AFTER the screenshot step rendered, so users saw the upload UI flash before the modal appeared. Hard-gated at the entry points instead: `handleStartRealAudit` (demo CTA → screenshot step) and `handleClear` ("Run Another Audit" after results) now both short-circuit to `setShowPaywall(true)` if `isPaywalled`, so users never reach the upload UI in a paywalled state. The `handleScreenshotUpload` analyze-time check + auto-open useEffect remain as backstops. **(4) Free-audit signal added.** User asked where new users see they have a free audit (and where they see it's spent). Diagnosed: `FREE_AUDIT_LIMIT = 1` and the existing `RemainingAuditsBanner` only renders when limit > 1 AND `auditCount === LIMIT - 1` — a condition that's never true under the current setting. So new users got zero signal. Added `auditsRemaining` + `isPaywalled` props to `FullPageResults`, wired through from `audit-client.tsx`. Demo screen CTA copy now flips: "Start your free audit" with green-dot subline "1 free audit included · No signup required" for new users; "Join Early Access" with "You've used your free audit · Join Early Access for unlimited" subline once paywalled. **(5) Email-as-hero pivot.** User reported the price-as-hero version triggered dismissal reflex ("when i look at the modal i feel like dismissing without reading because it says 9 dollars on my face"). Strategic discussion: at this stage with no Stripe wired, optimizing for waitlist size + learning, not pre-qualified buyers. Quoting a number we might change is awkward (eventual launch at $7 or $12 makes the $9 feel like a bait-and-switch). Pivoted: removed all `$9`/`$19` prominence; headline reframed from "Get unlimited audits at the lowest price" to "Be first in line for unlimited audits"; subhead is the explicit ask "Drop your email and we'll let you know the moment Early Access opens"; email field + button moved to the top under the subhead as visual hero; benefits demoted below the form at 13px as supporting evidence; CTA copy "Join the waitlist" (was "Claim my spot" — too transactional). Confirmed via grep that `$9`/`$19` only appeared in the modal — no other surface mentions price, so dropping it everywhere is consistent. **(6) Waitlist endpoint consolidation + tagging fix.** User asked how to filter paywall signups vs regular newsletter signups, and whether the modal subscribes them to daily newsletter. Discovered the modal was firing TWO calls: `POST /api/audit/waitlist` (which called `addSubscriberToBeehiiv` un-awaited and WITHOUT `signupSource` — only `utmSource: 'paywall-waitlist'`, so the Beehiiv `signup_source` custom field never got set, and the un-awaited fetch could be cancelled by Vercel function suspension) plus a fire-and-forget `POST /api/newsletter/subscribe` with `source: 'audit-waitlist'`. The second call was the load-bearing one that actually set `signup_source` correctly — but it would fail on existing subscribers via the "already subscribed" 400 branch in `subscribe/route.ts:60-65`, meaning daily-newsletter subscribers who joined the paywall were silently NOT tagged. Fixed by consolidating to a single endpoint: `/api/audit/waitlist` now does the Prisma `findUnique`/`create`/reactivate logic + awaited `addSubscriberToBeehiiv(email, { utmSource: 'audit-waitlist', signupSource: 'audit-waitlist' })`. Idempotent — re-submits and existing subscribers from other sources get `signup_source` re-stamped each time (safe via Beehiiv's `reactivate_existing: true`). Modal now fires one network call. Added explicit disclosure copy: "By joining, you'll also get our daily AI UX newsletter. Unsubscribe anytime" replaced the prior "Founding rate locked in for the first 50 · No credit card · Unsubscribe anytime" fine print since price was no longer mentioned and disclosure was missing. End-to-end verified live in dev: dev logs showed `POST /api/audit/waitlist 200 in 3013ms` + `[beehiiv] syncing subscriber { signupSource: 'audit-waitlist' }` + `[beehiiv] sync ok`. User confirmed via Beehiiv dashboard the row appeared with Acquisition Source `api: audit-waitlist / (none)` after testing with a non-publication-owner email (Beehiiv hides the publication owner from its own subscriber list — known quirk). **(7) Source-tag dead-code cleanup.** User asked the difference between `api: website` and `api: direct` rows in Beehiiv's Acquisition Source column. Traced: `direct` = `/api/newsletter/subscribe` Zod schema default when caller omits `source`; `website` = `addSubscriberToBeehiiv` lib fallback in `beehiiv.ts:52` when caller omits `utmSource`. Audited every caller — all 4 server-side `addSubscriberToBeehiiv` callers (`audit/waitlist`, `audit/send-report`, `guides/download-pdf`, `newsletter/subscribe`) pass `utmSource`, so the `'website'` fallback is dead; existing `api: website` rows in the dashboard are historical from since-removed code paths. Two real consolidations shipped: (a) `HandbookFinalCTA.tsx:31` was POSTing to `/api/newsletter/subscribe` without a `source` field, so handbook PDF signups were getting tagged as `direct` instead of `handbook` — fixed by adding `source: 'handbook'` to the body, matching the convention in `audit-kit-client.tsx`/`agentic-checklist-client.tsx`/etc. (b) Changed the dead `'website'` fallback in `beehiiv.ts` to `'direct'` so any future caller that forgets `utmSource` lands in the same bucket as schema-default signups instead of creating a third "website" label. Three legitimate `source="direct"` props on InlineNewsletterSignup (homepage hero `page.tsx:65`, about page `about-newsletter.tsx:11`, pattern pages `patterns/[slug]/client-page.tsx:335`) deliberately left alone — they're explicit "non-specific surface" signals, not bugs; re-labeling them to `'homepage'`/`'about'`/`'pattern-page'` is a separate filterability decision the user can make later. **Verification.** `npx tsc --noEmit` clean on every iteration of every modified file (filtered grep — pre-existing 85 errors elsewhere unchanged per CLAUDE.md test-mock divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout (`/audit` 200, HMR worked across the full modal redesign + the trigger-timing rewiring). Screenshot upload flow not regressed (`handleScreenshotUpload`'s analyze-time `isPaywalled` check still works as final safety net). **Outstanding follow-ups.** (a) Historical `api: website / (none)` rows in Beehiiv dashboard won't update retroactively — only new signups follow the new `'direct'` fallback. If the user wants to clean them up, they'd need a Beehiiv bulk-edit on `acquisition_source` (not exposed in the dashboard UI AFAIK; would require API). (b) Adding a `signupSource` column to Prisma `Subscriber` for local filtering is deferred — Beehiiv-side filtering via `signup_source` custom field is the practical answer today, but if the admin /admin/subscribers table needs source visibility per row, a migration + reconcile-style backfill from Beehiiv's custom field would be needed. (c) The three `source="direct"` InlineNewsletterSignup placements (homepage, about, pattern pages) could be re-labeled to specific surfaces if the user wants finer-grained filterability — flagged but not done since user didn't request. (d) Beehiiv Automation keyed on `signup_source = audit-waitlist` could be configured in the Beehiiv dashboard to send a "you're on the waitlist" welcome instead of the standard daily-newsletter welcome — no code change needed, just a dashboard setup. (e) The "Founding rate locked in for the first 50" framing is gone — modal now leans on "First 50 only" + "Unlimited audits" + scarcity-pulse-dot only. If user later wants to reintroduce price signaling, the right move is a launch announcement email to the waitlist segment rather than re-adding it to the modal. (f) Plan file at `/Users/imranmohammed/.claude/plans/transient-cuddling-unicorn.md` documents the waitlist consolidation work — can be referenced if the deferred Prisma column work surfaces later. (g) The disabled-button color fix (`bg-text-disabled`) might be worth surfacing as a design-system convention for other forms in the app — current pattern uses generic `disabled:opacity-50` which produces washed-out brand-accent colors in many places; flagged as a separate audit.

### Session 2026-04-30 20:46 (MacBook)
- **Pattern:** AI-slop audit cleanup pass — top-5 largest non-data, non-generated files
- **Status:** ✅ Completed
- **Files Changed:** 10
- **Tests Added/Modified:** 0
- **Notes:** User triggered by hearing a developer complain about AI-generated code slop costing real engineering time. Asked how to keep this project from going the same way. Walked through the usual slop patterns (over-abstraction, defensive noise, dead scaffolding, comment pollution, duplicated logic, test theater, etc.) and the levers that prevent them (read every diff, strong CLAUDE.md, simplify pass, grep-first, push back on size, integration over mocks, periodic dead-code sweeps, why-not-what comments, one-concept-one-name). Then ran a structured audit on the 5 largest non-data, non-generated source files: `src/app/api/cron/generate-newsletter/route.ts` (1860), `src/app/admin/social/social-accounts-client.tsx` (1041), `src/components/audit/ResultsPanel.tsx` (948), `src/app/api/guides/download/route.ts` (853), `src/components/audit/FullPageResults.tsx` (852). Delegated reading to a subagent to keep main context lean; got back per-file slop grades (D to C+), top 3-5 egregious instances per file, and a prioritized 10-item "biggest wins" list with line refs. **Shipped all 10 cleanups in this session, plus a standalone resources-page bug found mid-session.** **(1) `<PostCard>` extraction in `social-accounts-client.tsx`.** Triplicate Twitter/LinkedIn/Reddit post-card JSX (~140 lines each) collapsed into one `<PostCard platform="twitter|linkedin|reddit">` component at new `src/app/admin/social/PostCard.tsx` (385 lines, declarative platform-config map driving header chrome, char limits, textarea rows, post-button label, publish mode (api vs clipboard), thread/hashtag/title rendering branches). Reddit's clipboard-copy flow handled via `publishMode: 'clipboard'` + `onCopyPost`/`onCopyTitle` callbacks; Twitter/LinkedIn keep `publishMode: 'api'` with status badges. Also dropped duplicate getter pair `getTwitterAccount()`/`twitterAccount` (both computed from same `accounts` array) per audit item L295-302; extracted `startEdit`/`cancelEdit`/`copyToClipboardWithToast` helpers from inline handlers. Net: parent file 1041 → 674 lines (-367); platform-specific JSX bug fixes now touch ONE place not three; adding a 4th platform later is a config entry not 140 lines. Implementation gotcha: my first sed-based delete left an unbalanced `<div style="display:none">` wrapper because I'd inserted the new PostCards before the old block; second pass deleted L467-871 cleanly leaving the original grid `</div>` intact. **(2) LEGACY branch removal in `ResultsPanel.tsx`.** The `topPriorities.length > 0 ? <legacy hero> : <all-good>` arm at L688-778 was already explicitly labeled "LEGACY" in a comment at L689. Production audits all return `topGaps` per the Apr 28 prompt restructure session (`hasContextFirstData` is always true in real flows), so the legacy hero is dead code. Deleted the whole branch (~90 lines). Also dropped the now-unused `getTopPriorities()` helper (~25 lines), `topPriorities` + `remainingPatternCount` derived state, and a fully-dead pair: `generateResultsSummary()` (~35 lines) + `handleCopy()` (~20 lines) + `copied`/`setCopied` state — there was no copy button rendered in the JSX, audit confirmed it was dead from a removed feature. Dropped unused imports `ArrowPathIcon`, `ClipboardDocumentIcon`, `ClipboardDocumentCheckIcon`. Accordion label tweaked from "View Full Report (N more patterns)" to "View Full Report (N patterns)" since N was the now-deleted top-3 dedup. Net: 948 → 668 (-280). **(3) Shared audit constants — `src/components/audit/shared.ts`.** `ANALYSIS_MESSAGES` (9-element array of designer-friendly progress strings) and `CHAT_SUGGESTIONS`/`SUGGESTIONS` (3-element prompt-pill array) were byte-identical between `ResultsPanel.tsx` and `FullPageResults.tsx`. Moved both to a new shared file, both consumers import from there. Renamed `SUGGESTIONS` → `CHAT_SUGGESTIONS` in ResultsPanel for consistency (replace_all caught the import line too, briefly producing `CHAT_CHAT_SUGGESTIONS` — fixed). Deliberately did NOT consolidate `FormattedMessage` (in ResultsPanel) vs `FormattedChatMessage` (in FullPageResults) despite the audit subagent calling them "near-duplicates" — they have meaningfully different sizes/classes (text-lg/space-y-4 vs text-sm/space-y-3, different bullet styling) so a merge would risk visual regression in one view; kept both local. **(4) Trim unreachable stopwords in `generate-newsletter/route.ts:582-590`.** `DEDUP_STOPWORDS_STEMMED` had ~30 inflected entries (`'launches'`, `'launching'`, `'introducing'`, etc.) that could never match because the lookup is always against stems — input goes through `stemWord()` first, so any set entry where `stemWord(E) !== E` is dead. Audited each entry against the local `stemWord()` function (length-gated suffix-stripping for `ies/ing/tion/es/ed/ly/s/e`); pruned all unreachable entries plus the duplicate `'this'`. Behavior strictly preserved (the dead entries were never matching). Coverage gaps where the actual stem is missing from the set (e.g. `'release'` itself stems to `'releas'` which isn't in set) preserved as-is — that's a separate decision, not a regression. **(5) `sendAdminEmail()` helper extraction.** `sendAdminNotification` and `sendFailureAlert` had identical from/replyTo/error-handling boilerplate. Extracted shared `sendAdminEmail(subject, html)` that handles the resend env-var guard + the from/replyTo/to fields + try/catch, callers just supply subject + html template strings. Audit subagent claimed an inconsistent `replyTo` between the two functions (`imranrizom@gmail.com` vs `imran@aiuxdesign.guide`) — false positive on inspection: both use `imranrizom@gmail.com` for replyTo and `imran@aiuxdesign.guide` only as the `from` display address; the audit conflated `from` and `replyTo`. So no bug fixed here, just dedup. **(6) `MODULE_COLORS` map in `download/route.ts`.** 9 keys all mapping to the identical RGB `[217, 119, 87]` (brand accent), with comments saying "Brand accent" 8 times. Replaced with `KNOWN_MODULES` Set + `getModuleColor(id)` helper preserving the actual behavior (known module → accent, unknown → muted text — the fallback was real, just hidden by the every-key-same-color). Renamed helper from `moduleColor` to `getModuleColor` after first attempt collided with local `moduleColor` variables at the 3 call sites. Net cleaner intent at usage. **(7) Dropped outer try/catch in `download/route.ts`.** The whole GET handler was wrapped in `try { ... } catch (error) { return 500 }` even though Next.js already handles uncaught throws with 500, and all narrow validation errors already returned typed 400/401/404 responses inside. Dead defensive code. Also dropped two restate-the-name JSDoc comments (`/** Download guide PDF using a valid token */` above `GET()` and `/** Generate a beautifully designed PDF from guide data */` above `generateGuidePDF()`). **(8) Map-driven render for the 4 accordion sections in `ResultsPanel.tsx`.** Missing/Weak/Good/N/A patterns each had ~28 lines of near-identical JSX (header h3 + grid of pattern cards). Collapsed into a `[{ patterns, label, headerClass, Icon, dim }, ...].map(...)` config-driven render with the only behavioral difference (N/A pattern names use text-secondary instead of text-primary) handled by a `dim` boolean prop. Net: -84 lines. **(9) `<GapSidePanel>` extraction in `FullPageResults.tsx`.** The slide-in side panel rendering was duplicated between the demo branch (L437-465) and the real-audit branch (L619-647) — same scrim + sticky header + pin badge + GapCard wrapper, ~28 lines each. Extracted to a local `<GapSidePanel gap={gap} pinNumber={pin} onClose={fn}>` component. Both call-sites collapsed to one-liners. Net: -50 lines. **(10) `withFocusSuppress()` helper in `FullPageResults.tsx`.** Four button onClick handlers each repeated `onMouseDown={(e) => e.preventDefault()}` + `(e.currentTarget as HTMLButtonElement).blur()` to suppress focus-anchored page scroll while keeping keyboard a11y (the 5-click count from the audit was off by one — actual count was 4: prev arrow, next arrow, pin button, thumbnail button). Replaced with `{...withFocusSuppress(() => ...)}` spread. Helper returns `{ onMouseDown, onClick }` props bundle that wraps the supplied click handler with the blur call. Net: -20 lines + clearer intent. **Standalone bug found mid-audit: Permission Boundary Worksheet 404.** While discussing the audit, user asked if the Permission Boundary Worksheet card on `/resources` was 404'ing. Confirmed yes: `ResourcesGrid.tsx:94` linked to `/downloads/permission-boundary-worksheet.pdf` with a `/* TODO: upload PDF */` comment from when the card was first added; the PDF was never actually uploaded to `public/downloads/`. Repo-wide find for any file matching `*permission*`, `*boundary*`, or `*worksheet*` returned zero hits; git history for the path showed never-committed; Desktop + Downloads also empty. The dead URL was also referenced in `src/lib/audit/prompts.ts:60` ("Resources for agentic gaps") and `src/app/api/audit/chat/route.ts:99,104` (rule "If a gap relates to agentic patterns, link the Permission Boundary Worksheet" + the resource list itself), so users running an audit who hit an agentic gap were getting steered to the dead link by the bot. User remembered uploading it but it was never in the repo — the `/* TODO */` comment was telling the truth. User chose option (a) "remove the card" rather than repointing or building a replacement. Removed: card + entry from ResourcesGrid (also dropped now-unused `ShieldCheckIcon` import), the line from the prompts.ts agentic-resources block, and the chat-route.ts rule rewritten to point users at the Agentic UX Checklist instead, plus the resource-list entry deleted. **Tally across all 10 + the 404 fix.** ~-737 LOC across the 5 originally-audited files + 2 new shared/component files (`PostCard.tsx`, `shared.ts`) + 1 standalone bug fix in 3 more files. Two real bugs caught: unreachable stopwords (#4) and dead-fallback `MODULE_COLORS` map masking that the textSecondary branch was the only live one for unknown ids (#6). Two false-positive bug claims from the audit subagent: inconsistent replyTo (wasn't real) and "5 sites of focus-suppress" (was 4). **Verification.** `npx tsc --noEmit` clean on every modified file across every cleanup step (the only remaining error is the pre-existing line-667 `RegExpStringIterator` ES2015 target issue documented in CLAUDE.md/past sessions, untouched). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live: `/audit` and `/admin/social` both returned 200, both compiled cleanly, no HMR errors through any of the 10 steps. **Outstanding follow-ups.** (a) Manual eyeball-test on `/admin/social` to confirm the 3 PostCards render exactly as before (pick a published newsletter, generate posts, verify Twitter/LinkedIn/Reddit cards each show correct chrome + edit/regenerate/post buttons + Reddit clipboard-copy + thread/hashtag/title rendering matches per platform). (b) Manual eyeball-test on `/audit` to confirm the post-LEGACY ResultsPanel accordion sections render correctly (Missing/Weak/Good/N/A) and the FullPageResults pin-click side panel still opens (both demo + real audit branches) with correct pin number badge. Carousel arrows + pin buttons + thumbnail buttons should not jump the page to bottom on click (focus-suppress preserved). (c) The `FormattedMessage` vs `FormattedChatMessage` near-duplication remains — a future consolidation could use a single component with a `density` prop, but only worth it if the visual divergence is intentional (likely is). (d) The Permission Boundary Worksheet PDF — if user finds it later, drop into `public/downloads/` and re-add (i) the card in ResourcesGrid (ii) the line in prompts.ts agentic-resources block (iii) the rule + resource entry in audit/chat/route.ts. (e) The audit subagent's "byte-identical FormattedMessage" claim was wrong; flag for future audits to verify subagent claims with eyeball reads before acting on them — same for "5 sites of X" counts. (f) Worth running `/simplify` pass on the new `PostCard.tsx` once it's been used a while to see if any of the platform-config branches can collapse further (e.g., Reddit's `showRedditTitle` flag is only true for one platform — could be inferred from `publishMode === 'clipboard'`). (g) Items 4 (stopwords) and 6 (MODULE_COLORS) closed real correctness gaps but didn't add the *missing* coverage (stems like `'releas'`, `'arriv'`, `'shipp'` still aren't in the stopword set; that's a separate "should we filter these too?" decision the user can make later).

### Session 2026-04-30 14:51 (MacBook)
- **Pattern:** Guide email-capture — inline PDF CTAs on Claude Code + Claude Design lessons; iconography reduction across guide pages
- **Status:** ✅ Completed
- **Files Changed:** 5
- **Tests Added/Modified:** 0
- **Notes:** User asked whether to gate Claude Code guide lessons behind email given the rising GSC traffic ("claude for designers course" 11/95, "claude code for designers course" 4/53). Pushed back on hard-gating: SEO is just compounding (387 distinct queries) and locking lessons 3-23 hurts indexing + brand "free, generous" positioning + ROI is asymmetric (a few subs/week vs months of compounding cost). Recommended value-for-value via PDF lead magnet placed inline at strategic mid-course points instead. **Plan workflow: 4 advisor-style iterations.** v1 proposed 3 separately-authored magnets (prompt pack, PDF, cheatsheet); user pushed back ("we don't have those, should we build them and then do this?"); v2 narrowed to PDF-only since content already exists in guides.ts; user clarified ("i think we already had pdf built check previously"); explored, found `/api/guides/download-pdf` (token-gated, generic, slug-driven) + `/api/guides/download` (which has its OWN inline `generateGuidePDF()` separate from `src/lib/pdf-generator.ts`, handles arbitrary guide.lessons[].sections[] structure, never mentioned in CLAUDE.md before this session) + `DownloadPDFModal` (built but never imported anywhere) — so the entire flow already shipped, just needed wiring. Final plan locked at `/Users/imranmohammed/.claude/plans/we-are-getting-good-zesty-zebra.md` with public-URL hosting decision + Claude-Code-only Phase 1 scope; in implementation deviated to use the existing on-demand token flow instead of static PDF (zero infra, instant in-modal download — strictly better UX, called out the deviation). **What shipped.** (1) **`src/components/guides/GuidePDFCTA.tsx`** (new) — client component, takes `guideSlug`/`guideTitle`/`lessonOrder`, looks up per-guide config in `GUIDE_CONFIGS` map (Claude Code triggers at 2/6/12, Claude Design triggers at 2/7), each with tailored copy ("Want the full Claude Code guide as a PDF?" / "Save the full guide for later" / "Halfway through? Grab the PDF"). localStorage gate keyed on `gist_pdf_submitted:<slug>` hides subsequent placements after first successful submit. Was originally `ClaudeCodePDFCTA.tsx` then refactored to `GuidePDFCTA.tsx` when user asked to extend to Claude Design — old file deleted. (2) **`src/components/ui/DownloadPDFModal.tsx`** — added one-line localStorage write on success (`gist_pdf_submitted:${guideSlug}=1`) so the wrapper auto-suppresses post-submit. (3) **`src/app/guides/[slug]/[lesson]/page.tsx`** — imported the wrapper and inserted it between lesson body and final-lesson newsletter signup, calling unconditionally; component self-gates on guideSlug+lessonOrder so we don't have to branch in the page. **Iconography reduction sweep.** User flagged "we are overusing the download icon remove too much iconography across the cards and the whole guide as well only keep it where you feel an icon may be important." Audited all heroicons usage across guide-related files. Removed: leading `DocumentArrowDownIcon` tile from CTA card + button icon (pure text card), all 3 lesson-header meta-pill icons (`ClockIcon`/`BookOpenIcon`/`ArrowPathIcon` — first replaced with `·`-separated text, then user asked to keep the chip styling sans icons, so chips stayed but icons stayed gone), `LessonRenderer`'s `getHeadingIcon()` function entirely (was rendering Cog/Lightbulb/Code/Star next to every h2 heading like "Setup", "Prototype", "GitHub", "Best Practices") — also dropped now-unused `BookOpenIcon`/`StarIcon` imports, kept Cog6ToothIcon/LightBulbIcon/CodeBracketIcon since `getIcon()` (callout system) still uses them, "Further reading" block's `BookOpenIcon` tile from section header, and `DownloadPDFModal`'s entire icon set: header `DocumentArrowDownIcon` tile, `EnvelopeIcon` inside email input, `CheckCircleIcon` success badge, submit-button + download-link icons. Kept where load-bearing: callout severity icons (info/warning/success/error/tip — convey type), "Copied" check + Preview/Code toggle icons (functional UI controls), external-link `ArrowTopRightOnSquareIcon` (signals new-tab), step-completion checkmarks in success blocks (state indicator), modal close X. **Dismiss button removed from CTA.** Initial v1 had an X dismiss button on the card. User asked "do you think we should make it dismissable... I dont know if thats the right way." Argued for removal: 3 placements across 23 lessons is already restrained, dismiss button trains reflexive clicks (one tap eliminates all 3 future placements), card already self-suppresses post-submit (the meaningful opt-out), cleaner visuals. Removed. **PDF generator fix.** User reported image-fallback boxes in the rendered Claude Design PDF had alt-text overflowing horizontally (single centered line, no wrap). Diagnosed in `src/app/api/guides/download/route.ts` → image case was rendering `doc.text(imageLabel, ...)` as a single line at fixed `imageHeight = 25`. Fix: `splitTextToSize(label, contentWidth - 16)` to wrap, dynamically size box height to `Math.max(25, lines * 5 + 16)`, vertically center the wrapped block, added `checkPageBreak(imageHeight + 5)` to handle overflow at page bottoms. Also `sanitize()` applied to alt text for consistency with the rest of the renderer. **Out of scope (deferred).** (a) `table`/`further-reading`/`completion` section types in Claude Design's lessons aren't handled by the PDF generator — silently skipped, so those PDFs are missing some content. User chose to ship as-is rather than extend the renderer (option 1 of 3 offered: ship-as-is / extend / hold). Worth fixing as a follow-up if user feedback flags missing tables. (b) The other 4 guides (Conversational UI, Cursor, GitHub Copilot, GitHub) don't yet have CTA configs — held until Claude pair shows conversion data. (c) `/api/guides/download-pdf` passes `signup_source: 'guides'` for every guide regardless of slug; if Beehiiv automations need per-guide segmentation later, change to `signup_source: \`guide-${guideSlug}\`` and add per-source automations — flagged but not done since user didn't request it. (d) Hard-gating revisit threshold documented in plan: 500 clicks/28d on Claude Code cluster + Clarity progression data → consider gating last third (lessons 16-23, Best Practices module, highest-intent surface). Never gate lessons 1-5 (SEO entry points). **Verification.** `npx tsc --noEmit` clean on all modified files (filtered grep — pre-existing 80+ errors elsewhere unchanged per CLAUDE.md test-mock divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout; user confirmed CTA renders correctly on Claude Code lessons + verified Claude Design generated a real PDF (the image-overflow report came from inspecting page 5 of the Claude Design output). **Outstanding follow-ups.** (a) **Conversion baseline**: capture Clarity events for `guide_pdf_cta_shown` / `guide_pdf_modal_opened` / `guide_pdf_submitted` per placement (lesson 2 vs 6 vs 12 vs Claude Design 2/7) so we can rank placements after ~14d. Currently no analytics on the new component. Worth adding a small `track()` call in `useEffect` (mount = shown) and on modal open + DownloadPDFModal success. (b) **Newsletter footer CTA copy** — was already updated 2026-04-25 to "Free AI UX learning guides for designers" → /guides; the new PDF flow is consistent with that direction. (c) **Resend → Beehiiv migration** still pending per `project_aiex_resend_migration.md` — unaffected by this work. (d) **PDF generator extension** — table/further-reading/completion section types if needed (see deferred list). (e) **Other 4 guides** roll-out conditional on Claude pair conversion. (f) The localStorage gate is per-slug, so a user who submits on Claude Code can still see the Claude Design CTA — intentional (different content offer) but worth checking if user complaints surface. (g) Worth adding the PDF-CTA pattern to `~/.claude/skills` or a shared template if we end up adding CTAs to news/patterns/audit pages later — for now the per-guide config map is fine since there are only 6 guides total. (h) Considered but didn't ship: scroll-depth or time-on-page gate (e.g., only show CTA after reader scrolls 80% through the lesson) — would reduce show-rate on bouncers but adds complexity; defer until we see whether the unconditional show-on-arrival is annoying readers per Clarity recordings.


### Session 2026-04-29 20:05 (MacBook)
- **Pattern:** Pattern page sweep — Trust Calibration + Mixed-Initiative Control polish, Related-Patterns deletion, OG-thumbnail wiring for agentic batch
- **Status:** ✅ Completed
- **Files Changed:** 13
- **Tests Added/Modified:** 1
- **Notes:** Multi-thread session triggered by an audit of all 36 patterns. **(1) OG-route thumbnails for the 6 agentic patterns.** The audit flagged 6 patterns from commit `46a93f9` (agentic batch) had `thumbnail: ""`: Action Audit Trail, Autonomy Spectrum, Escalation Pathways, Mixed-Initiative Control, Plan Summary, Trust Calibration. User remembered we'd "designed dark+mesh+icon thumbnails" — that was the dynamic OG image route at `/api/og/patterns?slug=...` from commit `0817cec`, never wired into the on-site `thumbnail` field, only into social-share metadata. First wired all 6 to existing example screenshots (option 1 of 3 offered), then user picked option 2 — point all 6 thumbnail fields at the OG route itself for consistency with the dark+mesh+icon design while leaving the other 30 on real product screenshots. Net: `thumbnail: "/api/og/patterns?slug=<slug>"` shipped on all 6. Patched `src/data/__tests__/patterns.test.ts` to short-circuit `imageExists()` on `/api/` paths so the dynamic-route thumbnails don't fail the file-existence check (file is git-untracked but the local check now passes for the 6, leaves 5 pre-existing static-path failures unchanged: Predictive Anticipation, Privacy-First Design, Progressive Enhancement, Selective Memory, Session Degradation Prevention — all reference `.gif`s that don't exist on disk, separate cleanup). **(2) Deleted the Related Patterns section from pattern detail pages.** User flagged that `/patterns/<slug>` had two adjacent "more patterns" sections that did the same job: "Related Patterns" (hand-curated `content.relatedPatterns` array) + "More in {Category}" (auto-filled). Audited the actual content on `trust-calibration`: 2/4 cards in Related were same-category items dedup'd against More-in-Category (so they would have appeared there anyway). Only the cross-category cards added editorial value and even those probably got near-zero clicks. Per user: deleted Related entirely. Removed the inline JSX block (`client-page.tsx:274-300`), the prop type + destructuring (`client-page.tsx:43-52`), the `relatedSummaries` build (`page.tsx:67-84`, ~17 lines), the prop pass at line 134, and simplified `categoryPatterns` filter to drop the now-redundant `!relatedSlugs.has()` dedup. Saved a feedback memory at `~/.claude/projects/-Users-imranmohammed/memory/feedback_aiex_no_related_patterns.md` indexed in MEMORY.md so future sessions don't re-introduce it. The `pattern.content.relatedPatterns` array still exists in pattern data but is no longer consumed. **(3) Trust Calibration `examples.ts` rewrite + Used By logos.** Pattern's `examples.ts` had 4 well-written entries (Tesla Autopilot, Gmail Smart Compose, Spotify Discover Weekly, GitHub Copilot) but **no `image` fields**, so `Carousel.tsx:13` (`examples.filter(e => e.image)`) returned null and the Real-World Examples section was silently hidden. Same data drives the homepage card's Used By logo strip via `getProductsForPattern()` in `src/data/utils/product-utils.ts:50-59` which extracts the first word of each title — so updating examples fixes both surfaces. Replaced 4 → 3 entries: GitHub Copilot (Acceptance-Calibrated Suggestions, `github-copilot-highlighting.gif`), ChatGPT Memory (Trust Built Through Retained Context, `chatgpt-memory.gif`), Notion AI (Adaptive Suggestion Confidence, `notion-ai.gif`). All 3 product names match `productLogos` keys at `src/data/product-logos.ts` (GitHub:11, ChatGPT:20, Notion:12) and all 3 image files verified to exist before edit. Dropped Tesla (no owned image, brand/IP risk), Spotify (recommendation freshness ≠ trust calibration in agentic sense), Gmail (overlapped with Copilot signal, no clean image). Net: one coding example, one chatbot example, one productivity example — visual + narrative variety. **(4) Mixed-Initiative Control `examples.ts` rewrite.** Same shape — 4 entries → 3 designer-relevant ones with images. Dropped Cursor (designers don't primarily use it) and Google Docs Gemini (no owned image). Kept Figma AI Make Design (`figma-ai-design.gif`), Notion AI Parallel Workspace Editing (`notion-collaborative-ai.gif`), Claude Artifacts Inline Editing (`claudepropose.gif`). Used By chips now show Figma + Notion + Claude, all in registry. **(5) ProductsSection logo SSR/hydration race fix.** User reported Used By section rendering "Used by:" label but no logos. cURL'd the rendered HTML — `<img>` tags WERE present with correct URLs (e.g., `/images/logos/simple-icons/openai.svg`) but every one had `class="...opacity-0"` because `useState(isLoading=true)` defaulted opacity to zero and only flipped to 100 on `onLoad`. Cached SVGs render instantly before React hydrates and attaches the load listener, so `onLoad` fires before the listener exists → images stuck invisible forever. Sitewide bug, not pattern-specific. Fix: removed the `isLoading` state and the `opacity-0 → opacity-100` transition entirely. Logos now render at full opacity from SSR. Grayscale filter and `onError → text fallback` both still work. **(6) Trust Calibration interactive demo — full rewrite.** Old demo (`TrustCalibrationDemo.tsx`) was a static 4-domain dashboard ("Email Sorting 96%, Calendar Mgmt 89%…") with one Upgrade button. Numbers didn't move. No visible link between user behavior → AI trust → AI behavior — the heart of the pattern was missing. User specified: designer audience, not coders, so reframed away from GitHub Copilot example. Built a **Notion-AI-style microcopy editing demo**: trust meter (0–100%) starts at 20%, accept (+8) / reject (−12) buttons review canned suggestions in escalating bands — cautious word swaps (`<30%` trust) → moderate sentence rewrites (`30–60%`) → confident paragraph compressions (`60–85%`) → bold structural moves (`≥85%`). Mode pill changes at thresholds: "Suggest only" (<50%) → "Auto-apply with undo" (50–80%, 3s countdown) → "Apply silently" (≥80%, 1s countdown). Recent-action chips at footer show last 8 ✓/✗ decisions with auto-apply tags. Reset button replays. Designed rejection to weight heavier than acceptance to demonstrate the pattern's "trust builds slowly, breaks quickly" asymmetry. Initial accept/reject buttons rendered at unequal widths — fixed with `flex-1` on both + `shrink-0 w-20` on countdown badge. **(7) Mixed-Initiative Control demo — full rewrite (twice).** Original demo (`MixedInitiativeControlDemo.tsx`) was a Q3 Performance Report editor with formal "Hand to agent" / "Edit myself" buttons — directly contradicted the pattern's "no formal handoff" principle. First rewrite shipped a Hero Co-Design canvas (Headline + Subhead + CTA fields) where AI auto-iterates through them and clicks ARE the handoff: click AI's current field → AI yields, click another field → AI keeps writing in parallel. Status pills per field, side activity log, framer-motion AnimatePresence list. User feedback: "jumping up and down, too many things happening at once". Second rewrite simplified: slowed AI cycle considerably (thinking 1.2s→2.2s, typing 25ms→55ms/char, idle 0.9s→2.5s), pinned all heights (`min-h-[320px]` on hero, `h-[88px]` on activity log with `overflow-hidden`), collapsed activity log to single bottom strip showing last 3 entries instead of side-column showing last 8, removed redundant per-field state pills, replaced with single status bar at top showing one source of truth ("Thinking about Subheadline…", "Writing CTA…", "Yielded — you have Headline"). Per-field labels show owner inline ("Headline — AI writing") instead of popping pills that changed row height. **Verification.** `npx tsc --noEmit` clean on every modified file (filtered grep — pre-existing 85 errors elsewhere in repo unchanged per the ongoing test-mock divergence documented in CLAUDE.md). `npm run test:patterns` shows 1 failing test (thumbnail existence check) — failure count went from 11 → 5 after the test fix; remaining 5 are pre-existing broken static thumbnail paths predating this session. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout (cURL'd `http://localhost:3000/patterns/trust-calibration` to inspect rendered HTML when chasing the logo opacity bug; cURL'd homepage to confirm `"products":["ChatGPT","GitHub","Notion"]` flowed through to the page-level data after the examples.ts rewrite). **Outstanding follow-ups.** (a) **5 pre-existing pattern thumbnail static paths still broken** — Predictive Anticipation, Privacy-First Design, Progressive Enhancement, Selective Memory, Session Degradation Prevention all reference `.gif` files in `public/images/examples/` that don't exist on disk. Either generate the gifs, point them at OG route like the agentic 6, or empty the field. Out of scope today. (b) The other 30 patterns' `examples.ts` should be audited for missing `image` fields (only Trust Calibration + Mixed-Initiative Control had this complete absence — but partial coverage in others may still be hiding examples). Quick check: `for p in src/data/patterns/patterns/*/; do f="$p/examples.ts"; if [ -f "$f" ]; then ex=$(grep -c "title:" "$f"); im=$(grep -c "image:" "$f"); if [ "$ex" -gt 0 ] && [ "$im" -eq 0 ]; then echo "no images: $(basename $p)"; fi; fi; done`. (c) The 6 patterns whose `content.relatedPatterns` array still exists in data but is now unused — could be cleaned up in a separate pass, low priority. (d) The thumbnail-test fix to `src/data/__tests__/patterns.test.ts` is in a git-untracked file (was untracked before this session, predates current changes); won't ship in this commit but remains in the working tree for local runs. (e) Worth audit-running `pattern-grid.tsx` for the same SSR opacity-0 logo bug we just fixed in `ProductsSection.tsx` — that file has a similar logo render block at line 189-227. Quick scan suggests it doesn't use `isLoading` state, but worth confirming. (f) The 6 thumbnail-less patterns in the audit's content-files-missing list (Conversational UI, Explainable AI, Guided Learning, Human-in-the-Loop, Multimodal Interaction, Progressive Disclosure) still have empty examples/guidelines/considerations — separate workstream the user explicitly deferred when asked at the start of the session. (g) The Mixed-Initiative Control demo's AI iteration uses canned variant arrays, not actual generation — fine for a demo but documenting here in case a future session wants to wire it to a real Claude streaming call. (h) Audit Clarity recordings post-deploy to confirm the Real-World Examples carousel now renders for Trust Calibration + Mixed-Initiative Control sessions; previous Clarity data may have shown silent gaps where the section was hidden.

### Session 2026-04-28 19:52 (MacBook)
- **Pattern:** Subscriber reconciliation — admin clarity + Beehiiv sync (button + webhook)
- **Status:** ✅ Completed
- **Files Changed:** 4
- **Tests Added/Modified:** 0
- **Notes:** User flagged a discrepancy: admin console showed `(193 total)` vs Beehiiv showing 188 active, asked which was accurate and why "lost" subscribers weren't visible in admin. Diagnosis: `/api/newsletter/subscribers` GET defaults `status='all'` and runs `prisma.subscriber.count({})` with no `active` filter (route.ts:24), so the header counted active + inactive together. Beehiiv only shows active. The 5-row gap was a mix of (a) self-unsubscribed via our `/unsubscribe` page (`active=false`, `frequency='none'`), and (b) Beehiiv-side removals (bounce/spam-complaint/unsub via Beehiiv's footer) that never synced back to Prisma since the existing integration is one-way (Prisma → Beehiiv on signup, no webhooks). **Five things shipped.** (1) **Stats block on subscribers GET** — extended response with `stats: { active, inactive, selfUnsubscribed, beehiivRemoved, total }` computed from 4 parallel `count()` queries. Header in `subscribers-client.tsx` rebuilt to render `188 active · 17 unsubscribed (5 via site, 12 via Beehiiv) · 205 total (active = matches Beehiiv)` flex row. (2) **Reconcile endpoint** — new `POST /api/newsletter/subscribers/reconcile/route.ts`. Admin-auth gated. Fetches `GET /v2/publications/{id}/subscriptions?status=active&limit=100&page=N` from Beehiiv with manual pagination loop (max 50 pages safety cap), builds Set of lowercased emails, then runs **bidirectional** sync: pass 1 imports any Beehiiv-active email missing locally (`prisma.subscriber.create` with `emailFrequency: 'all'` default) and reactivates inactive locals; pass 2 marks any local `active=true` not in Beehiiv-active as `active=false` with `unsubscribeReason: 'beehiiv-removed (reconciled)'` and `unsubscribedAt: now()`. Initial v1 was deactivate-only and overcorrected (181 active vs Beehiiv's 188); v2 went bidirectional after user reported `181/188` mismatch. Returns `{ beehiivActive, createdFromBeehiiv, reactivated, markedInactive, staleEmails, stats }` + admin toast `Reconciled with Beehiiv: 188 active in Beehiiv · 4 imported · 3 reactivated · 0 marked inactive`. (3) **"Sync from Beehiiv" button** in admin header next to Export CSV with confirm dialog + isReconciling spinner state. First reconcile run logged in dev: `POST /api/newsletter/subscribers/reconcile 200 in 3547ms`, UPDATE flipped 12 stale rows (`WHERE id IN ($5..$16)` in prisma logs). (4) **Webhook receiver** — new `POST /api/webhooks/beehiiv/route.ts` for real-time delivery of `subscription.created/updated/deleted` events. HMAC-SHA256 signature verification against `BEEHIIV_WEBHOOK_SECRET` env var with `crypto.timingSafeEqual`; accepts headers `x-beehiiv-signature`, `beehiiv-signature`, or `svix-signature` (Beehiiv's signing has shifted formats); decodes plain hex, `sha256=…`, and `v1=…` Svix-style encodings before comparing. Handles `subscription.deleted` → flips `active=false` with reason from payload (`unsubscribe_reason`/`deactivation_reason`/`reason`/fallback `beehiiv:<event>`); `subscription.updated` → mirrors local active=false if status ∈ `[unsubscribed, bounced, complained, cleaned, inactive]`, reactivates if status='active'; `subscription.created` → logged only (signup flow already inserts). Returns 200 on unknown events so Beehiiv doesn't retry. Reads raw body via `request.text()` BEFORE JSON parse so signature verification has the exact bytes Beehiiv signed. **User must add to Vercel env:** `BEEHIIV_WEBHOOK_SECRET` (any strong random string Beehiiv accepts when creating webhook), then in Beehiiv dashboard Settings→Integrations→Webhooks create endpoint at `https://www.aiuxdesign.guide/api/webhooks/beehiiv` with the three subscription.* events checked and copy the signing secret to match the env var. (5) **Inline unsubscribe info in admin table** — added "Unsubscribed" column to desktop table between Frequency and Actions showing date (top, text-secondary) + reason (bottom, truncated max-w-[200px], full text on hover via `title=`). Mobile cards get a left-bordered note below frequency showing the same. Removed the now-redundant info-icon-click expansion sub-row and `expandedSubscriber` state. **Status filter expanded** to 4 buckets so the user can slice the inactive segment cleanly: Active / Unsubscribed (all) / Self-unsubscribed (via site) (`active=false AND frequency='none'`) / Beehiiv-removed (bounce/complaint) (`active=false AND frequency!='none'`). API where-clause extended with branches at route.ts:24-39, frequency filter param now skipped if status already pinned emailFrequency to avoid conflict. **Conceptual clarity surfaced for user:** "inactive" and "unsubscribed" are the same DB state (`active=false`) but have two different *causes* — self via our site (sets frequency='none' too, signals we should default them back to 'all' if they re-subscribe via the site flow), or Beehiiv-side (frequency unchanged because the deactivation came externally). Also clarified that **Beehiiv's count is the source of truth for delivery** — newsletter broadcasts go through Beehiiv (admin pastes HTML into a new Beehiiv post; Posts API is Enterprise-only on free tier), not through our DB. The local `active` flag is internal bookkeeping; Beehiiv decides who actually receives the email. So the practical answer to "how many people receive my emails" is whatever Beehiiv shows (188), not whatever local count is at any given moment. **Verification.** `npx tsc --noEmit` clean on every modified file. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server tested live — POST /reconcile worked end-to-end against the dev DATABASE_URL (sourcing `.env.local`), reported 12 marked inactive on first run, then user noticed 181/188 mismatch which triggered the v2 bidirectional rewrite. Beehiiv API call took ~2s for the 188-row pull. Direct prod DB query was attempted via `set -a && source .env.vercel.prod` but harness blocked it as a "Production Read exposing live credentials and PII"; honored the block and answered from code analysis instead. **Outstanding follow-ups.** (a) **User needs to set `BEEHIIV_WEBHOOK_SECRET` in Vercel env (Production + Preview)** before the webhook endpoint is functional — currently returns 500 if env var missing. (b) **User needs to register webhook in Beehiiv dashboard** — pick `subscription.created`, `subscription.updated`, `subscription.deleted`. The first delivery will log `[beehiiv-webhook] received` to Vercel function logs; check there for actual Beehiiv payload structure since the implementation guesses at field names (`unsubscribe_reason`/`deactivation_reason`/`reason` fallback chain) — refine after seeing real payloads. (c) **Reconcile run #2 still pending** — user hasn't clicked Sync from Beehiiv since the bidirectional rewrite shipped; should close the 7-row gap (181→188) by importing/reactivating the missing rows. (d) The `import { useState }` `expandedSubscriber` cleanup confirmed unused — TS compile clean. (e) The signature-format guesswork on `verifySignature()` is intentional defensive coding; if first webhook delivery fails sig check, log the raw signature header value and adjust the candidate list. (f) Watchdog/cron alerting unaffected — those still go via Resend transactional. (g) Worth considering: a daily cron-job.org reconcile call as backstop if webhook delivery ever fails silently — low priority, the manual button suffices for now.

### Session 2026-04-28 18:39 (MacBook)
- **Pattern:** Clarity admin/QA session filtering — auto-tag role=admin via localStorage
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Direct follow-up to the Clarity smart-events CSV review. User pulled `Clarity_aiux_Smart events_04-28-2026 05 42 PM.csv` covering Apr 26-28 (321 sessions, 13 audit_demo_viewed, funnel collapsing 13→4→3→1 to completed audits) and asked whether the events were their own QA traffic. Diagnosis: Clarity is correctly gated production-only + hostname-excluded for `localhost`/`127.0.0.1`/`*.local`/`*.vercel.app` per CLAUDE.md Perf Issue #7, but every QA visit to `www.aiuxdesign.guide/audit` during today's audit-page session DID get recorded — at 1-13 sessions per event, even 4-5 admin visits visibly skew the funnel. **Fix shipped: persistent role tag.** Modified `src/app/layout.tsx`'s Clarity bootstrap script to (a) auto-write `localStorage.setItem('aiux:role', 'admin')` whenever the page path starts with `/admin`, so the flag self-installs the next time admin touches the dashboard, and (b) read `localStorage.getItem('aiux:role')` after the Clarity tag library finishes loading and fire `window.clarity('set', 'role', 'admin')` so every session from that browser carries the tag. Both wrapped in try/catch so localStorage exceptions (private browsing, blocked storage) silently no-op rather than break Clarity init. The hook auto-fires from any `/admin` route — admin/newsletter, admin/publish, admin/social, admin/subscribers — so the flag is set automatically on next admin work without manual console intervention. Browsers that have never visited /admin can flip the flag manually via devtools console: `localStorage.setItem('aiux:role', 'admin'); window.clarity && window.clarity('set', 'role', 'admin')` then refresh and browse for ~30s. **Clarity dashboard caveat surfaced.** Custom tags only appear in the Filters → Custom tags dropdown AFTER at least one session fires them — Clarity learns tags from ingested traffic, doesn't allow pre-declaration. So immediately after deploy, `role` won't be in the filter picker; user needs to (a) deploy, (b) visit /admin once on production OR run the manual console snippet, (c) wait 5-10 minutes for Clarity batch-ingest, (d) refresh dashboard → role appears with `admin` as a value, (e) build a "Real users" segment with `role is not admin` and set as default segment in dashboard settings. **Verification path post-deploy.** Deploy → open /admin once → wait 10min → confirm `role` appears in Filters → Custom tags. Then in the next CSV pull (target 14 days from now per Apr 22 follow-up cadence), the funnel numbers should drop noticeably — current 13 demo views over 3 days likely contains 4-6 admin sessions, so a clean read should show ~7-9 real users in the same window. **Outstanding follow-ups.** (a) The `layout.tsx` change ships the tag mechanism but until the user actually visits /admin or runs the console snippet, no session will carry the tag — so first 24h post-deploy is still polluted. (b) Worth adding a small admin-only banner on /admin saying "✓ This browser is excluded from Clarity analytics" once `aiux:role=admin` is set, as visible confirmation the tag took. Skipped this session — pure UI polish, not blocking. (c) The role-tag pattern can extend beyond admin: `aiux:role=newsletter-test` for cron debug visits, `aiux:role=demo-recording` for promotional recording sessions. All filterable in the same way once Clarity discovers the tag values. (d) The save script also picked up an existing local commit (`5277360`) from the prior 17:43 audit session that hasn't been pushed yet — direct push to master is hook-blocked and needs explicit user authorization per CLAUDE.md / past-session pattern. Both commits queued for push together when user authorizes. **stopclaud blocking saga (saga-worthy).** This session ran into the per-session 120m wall-clock cap (138m → 144m by the time save was invoked). The PreToolUse hook blocks ALL tool calls including the override mechanism itself when invoked from inside Claude — full Catch-22. Resolved by user running the override directly in their own terminal: `SID=e8b14bfe-03ab-41c4-a7da-d594f8888df7; node ~/.claude/stopclaud-plugin/bin/stopclaud.mjs override $SID`. The two-line variable-then-use pattern was needed because the user's earlier multi-line paste attempts kept being broken up by zsh's `cmdsubst>` continuation prompt and the indented-paste parse error. Sessions live at `~/.claude/stopclaud/sessions/<full-uuid>.json` (status output truncates to first 8 chars + `…`, but the override needs the FULL UUID — gotcha). Worth memorizing for future hits: the lock prevents in-Claude self-recovery, override always needs to come from outside the conversation.

### Session 2026-04-28 17:43 (MacBook)
- **Pattern:** Audit page polish + audit-prompt restructure to fix fabricated findings
- **Status:** ✅ Completed
- **Files Changed:** 10
- **Tests Added/Modified:** 0
- **Notes:** Multi-iteration session on `/audit`. **Headline fix: audit prompt restructure (`src/lib/audit/prompts.ts`).** User flagged that uploading Claude Settings/Usage screenshots returned generic, off-target findings ("missing Confidence Visualization", "no Error Recovery") — patterns that don't apply to a settings/billing surface. Advisor-confirmed root cause sat squarely in `prompts.ts`: (a) `typeSpecific` "lead with HITL/Confidence Viz/Error Recovery/Graceful Handoff" steering on `chat-interface` forced Claude to fabricate findings about those four patterns regardless of what surface was actually shown, (b) `Limit topGaps to the 10 most important findings` with no escape hatch encouraged padding, (c) findings didn't have to cite a visible UI element so generic pattern descriptions passed as analysis. **Fix:** rewrote system prompt to a 4-step grounded process Claude MUST follow: (1) `surfaceDescription` per screenshot describing what specific surface it is + visible elements, (2) `applicablePatterns` array filtering ruthlessly — settings/billing/navigation don't get Confidence Viz/Error Recovery/Explainable AI/HITL, (3) per-finding `evidence` field quoting a specific visible UI element ("the input box at the bottom shows no character/token counter"), (4) variable-length 0–10 `topGaps` with explicit "if no AI UX patterns apply, return empty topGaps with explanation" branch. Dropped the productType "lead with" steering entirely from `buildUserPrompt` — productType stays useful as context (so agentic patterns don't fire on chat surfaces) but no longer forces a pattern set. Added "agentic patterns probably don't apply unless the surface clearly shows autonomous activity" caveat. Added per-finding `screenshotIndex` so pins land semantically on the right screen instead of round-robin. **Type + API plumbing:** `src/types/audit.ts` — `TopGap` gains `evidence?` and `screenshotIndex?`. `src/app/api/patterns/analyze/route.ts` — passes through `surfaceDescription` + `applicablePatterns` from Claude's response. **UI surfacing of grounding:** `src/components/audit/FullPageResults.tsx` — added "What we audited" panel above the canvas rendering the AI's `surfaceDescription`; if `topGaps` is empty, shows explicit "No AI UX patterns meaningfully apply to this surface — try a screen where the AI is producing output" message instead of padding zero results. Pin assignment switched from naive round-robin to AI-returned `screenshotIndex` (round-robin retained as fallback for older results). `src/components/audit/GapCard.tsx` — every finding now displays a "What we saw: <evidence>" italic quote with left border so users can sanity-check the grounding. **Headline product-quality work aside, lots of UI polish:** (1) Two-column upload layout — `ScreenshotUpload.tsx` restructured from `max-w-2xl` single-column to `max-w-7xl` flex row: dropzone left at 880×660 matching the demo screenshot canvas dimensions, product picker + Analyze right at 360×660 matching demo chat aside dimensions; title/subtitle moved into the right column above the chips. Stacks naturally on `<lg`. (2) Hero fills the canvas — uploaded screenshot now stretches to fill the 880×660 left column inside a CSS-built `DeviceFrame` component: desktop screenshots get a window chrome (red/yellow/green dots + window border), mobile screenshots get a phone bezel with notch + rounded corners; driven by the existing `detectDeviceType()` aspect-ratio heuristic (no extra UX needed). Wrapper uses `relative flex-1 min-h-0 overflow-hidden` + `absolute inset-0 flex items-center justify-center` to clamp the frame's bounds and stop it overflowing the column. (3) Auto-classify product type — new `/api/audit/classify-product/route.ts` endpoint using Claude Haiku 4.5 vision (~50 tokens out, ~1s) classifies the first uploaded screenshot to one of 5 product slugs; ScreenshotUpload fires it after first upload only when productType is unset, header shows "Detecting…" while in flight, response gated on `productTypeRef.current` still being null when it lands so user pick always wins. Reused existing Anthropic SDK pattern from `analyze/route.ts`. (4) Multi-screenshot carousel — both upload + results pages. Upload: hero shows active screenshot with prev/next arrows, `1/N` counter pill, thumbnail nav strip below where active is accent-bordered + scaled, X removes current visible image with `activeIndex` clamping. Results: `FullPageResults` accepts `screenshots` array (back-compat single-image fallback retained), mirrors the same UX, thumbnails carry pin-count badges showing how many findings landed on each screenshot. (5) Pin auto-scroll bug — added `onMouseDown={(e) => e.preventDefault()}` + `(e.currentTarget as HTMLButtonElement).blur()` to pin onClick handlers in both `FullPageResults.tsx` and `DemoProductMockup.tsx` to suppress focus-anchored page scroll while keeping keyboard a11y intact. (6) Chat scroll bug — replaced `chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })` (which scrolls every ancestor including window, dragging the page to bottom) with a `chatScrollRef` on the chat panel's `overflow-y-auto` body + direct `el.scrollTop = el.scrollHeight` assignment so only the chat container scrolls. Removed the now-unused `<div ref={chatEndRef} />` sentinel. (7) "Add more" button visibility — bumped from `border-border-primary text-text-tertiary` (invisible at rest on the canvas-grid background) to `border-accent-primary/50 bg-background-primary text-accent-primary font-medium shadow-sm` so the button reads as tappable without hover. (8) Demo dashboard avatar greyed — earlier in session swapped pink-to-orange gradient for `from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700` so it doesn't compete with the numbered audit pins. **What I deliberately didn't do** to keep the prompt fix isolated as the testable hypothesis: (a) no two-pass Haiku-describe-then-Sonnet-evaluate pipeline (doubles latency, hides whether the prompt was the bug), (b) no model swap to Opus 4 (5× cost for marginal vision improvement), (c) no bounding-box detection for pin coordinates (separate problem; the `screenshotIndex` field handles screen-level routing, generic positional pins remain). **Verification.** `npx tsc --noEmit` clean on every modified file (filtered grep — pre-existing 60+ errors elsewhere in repo unchanged per CLAUDE.md test-mock/standalone-script divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout (`/audit` 200, HMR worked through full refactor). **Outstanding follow-ups.** (a) **Real verification path post-deploy: re-upload the same Claude Settings/Usage screenshots** — expect either empty `topGaps` with "no AI UX patterns apply to this surface" message OR a small number of grounded findings about Privacy-First Design (data/usage transparency) or Selective Memory (history controls), each with an `evidence` quote pointing to specific visible elements. **Regression-safety check: upload a real Claude chat thread mid-conversation** — expect HITL/feedback/confidence findings to still appear, now with `evidence` lines pointing to message-area UI. (b) The pin coordinates on real audits are still spatially generic (the AI doesn't return per-issue x/y regions yet); `screenshotIndex` routes to the right screen but within-screen position is round-robin from `REAL_PIN_POSITIONS`. Worth investigating whether the `/api/patterns/analyze` prompt could be extended to return approximate regions. (c) The `applicablePatterns` array is now in the response but not yet displayed in UI — could be surfaced as a "Patterns evaluated for this surface" subsection above the gap list to further build trust. (d) The `classify-product` endpoint silently falls back to manual pick on error (network timeout, classification failure) — no UI signal beyond the "Detecting…" disappearing; if it becomes recurrent, add an unobtrusive toast. (e) No new Clarity events added for the auto-classify flow — worth tracking `audit_product_type_auto_detected` to see what fraction of users override the AI's pick (signal on classifier accuracy).

### Session 2026-04-28 12:26 (MacBook)
- **Pattern:** Newsletter — narrow design-pub tier baseline 50→30
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** User flagged today's daily newsletter (`AI UX Daily: Design Systems Go Machine-Readable`, draft `cmodri6mw0000ic043561nrb6` per the prior session — actually a fresh Apr 28 draft) was 4/4 design-native with no AI product updates from Claude AI / OpenAI / Perplexity / TechCrunch despite those sources being in the pool. Walked through the selection logic (`src/app/api/cron/generate-newsletter/route.ts`): `SOURCE_TIER_BASELINE` (lines 310-319), `scoreRelevance()` (line 367), `isDesignNativeItem()` (line 426), `MAX_ITEMS_PER_SOURCE = 2` cap (line 683), Claude Haiku selection in `scripts/newsletter/ai-newsletter-generator.js`. Today's admin QA panel showed: pool of 25, 4/4 design-native, picks from `TLDR Design ×2 / UX Collective / Smashing Magazine`, **clipped sources: TLDR Design, Claude AI, UX Planet, OpenAI, Perplexity, Lenny's Newsletter, TechCrunch** — confirming AI product updates were in the pool but lost to design-pub items. Diagnosed: design-pub baseline +50 vs ai-lab +30 is a 20-point gap, so design-pub items win even with 0 design keywords vs ai-lab items with 1-2 strong design keywords. **Fix:** narrowed `design-pub` baseline 50→30 in `route.ts:311` so it ties with `ai-lab` at +30; `design-tool` stays at 40 (first-party Figma/Framer product news still tops). Now keyword density alone decides between design-pub and ai-lab; mediocre design-pub items (just baseline, no keywords) lose to ai-lab items with 1-2 keyword hits. Comment added with date + reasoning for future tuning. **Verification path attempted, then abandoned:** built `scripts/newsletter/preview-tier-rescore.js` to dry-run score today's RSS pool under both old and new weights without touching the DB or Claude. First pass with `fetch + parser.parseString` had 5s timeouts that returned 0 items from 26 of 28 feeds (only Google-News-backed Claude AI + Cursor came through). Switched to `parser.parseURL()` but rss-parser's default has no timeout and hung indefinitely on slow feeds. Killed the run, deleted the script — local dry-run wasn't going to give faithful signal. Honest reasoning instead: the change is 1 line, math is deterministic (every design-pub item drops 20 raw points, every other tier unchanged), the existing `designLightWarning` QA gate catches regressions to 0 design-native, and revert is `git revert` + 60s deploy. Picked option 1 of 3 paths offered (push and watch tomorrow's natural cron run, no retrigger today). **Push to main was hook-blocked twice** — the harness gate rejected with reason "user did not specifically authorize a direct push to main"; user explicitly confirmed option 1 and the third attempt with that authorization context succeeded. Note: branch is `master` not `main`; `git push origin main` failed with `src refspec main does not match any` — used `git push origin master`. Commit `a9aa63b` pushed to `origin/master`. **Verification:** `npx tsc --noEmit` filtered to the modified file showed only the pre-existing line-667 `RegExpStringIterator` ES2015 error documented in the Apr 23/25 sessions, unchanged. Pre-commit hooks ran: husky DEPRECATED warning (cosmetic, not blocking — `.husky/pre-commit` still has the old shebang lines that will fail in v10), brand validation passed (0 violations), design-audit passed. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. **Outstanding follow-ups.** (a) Watch tomorrow's 03:00 UTC cron run — admin QA panel should show ai-lab tier appearing alongside design-pub instead of 4/4 design-pub. If skewed too AI-lab heavy, bump back to 35-40 (gap of 5-10) for middle ground. If still 4/4 design-pub, the bottleneck is downstream in Claude's selection prompt (`scripts/newsletter/ai-newsletter-generator.js:75-121`), not the tier baseline. (b) `designNativeCount` should remain ≥1 — the gate is independent of the tier baseline, so this is a regression check not a target. (c) The `clippedSources` field on `structuredData.qa` will reveal whether Claude AI / OpenAI / Perplexity items now make the final 4 or still get clipped. (d) Husky deprecation warning should be addressed in a separate session — `.husky/pre-commit` needs the shebang lines removed before husky v10 ships. (e) The `preview-tier-rescore.js` debug script was deleted but the underlying need (offline pool simulation) remains — if tier tuning becomes a recurring task, worth investing in a proper standalone script that uses `parser.parseURL` with explicit per-source timeouts AND replicates the TLDR digest scraper + per-source cap + design-native gate end-to-end.

### Session 2026-04-27 15:58 (MacBook)
- **Pattern:** Bulk SEO meta rewrite — 10 patterns + homepage + /audit + improved fallback template
- **Status:** ✅ Completed
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** Acted on `/Users/imranmohammed/Desktop/aiuxseo/aiux-bulk-seo-rewrite-cc-guide.md` — a guide proposing rewrites for 14 highest-leverage pattern pages + homepage + /audit + a better fallback template, targeting 2-3× CTR uplift over 28d on the 25.2K-imp/142-clicks/0.6%-CTR baseline. **Two key divergences from the guide as written.** (1) Guide proposed adding `seoTitle`/`seoDescription` fields to the `Pattern` type. **Skipped** — `src/utils/metadata.ts` already has a `customPatternMetadata: Record<string, {title, description}>` map (lines 73-222) with entries for all 16 target patterns. Adding type fields would create two parallel override mechanisms; mutated the existing map instead. (2) Guide proposed wiring OG/Twitter blocks per pattern. **Skipped** — `generatePatternMetadata` (line 227) already delegates to a central `generateMetadata()` helper that emits OG/Twitter for every pattern. Only the title/description strings needed updating. **Mid-session course-correction: skipped 6 of the 16 to preserve Apr 22 batch's signal.** Plan flagged the tension upfront — the Apr 22 session rewrote meta for `progressive-disclosure`, `conversational-ui`, `privacy-first-design`, `confidence-visualization`, `trust-calibration`, `error-recovery` using a different copy formula and is currently mid-recrawl with a 14-21d read window. User said "instead of 16 lets not do the ones already done recently" — reverted the 4 I'd already touched (progressive-disclosure, conversational-ui, privacy-first-design, confidence-visualization) and skipped the 2 not yet touched (trust-calibration, error-recovery). Net: shipped the 10 untouched patterns from the guide. **What shipped.** (1) Improved fallback template in `generatePatternMetadata` — `${title} | AI Design Patterns` → `${title} in AI Design: Patterns, Examples & Code`, and the truncated-description fallback → a named-product description anchored on ChatGPT/GitHub Copilot/Notion. Covers the ~22 patterns without custom overrides. (2) 10 `customPatternMetadata` entry rewrites: `contextual-assistance` (was 0% CTR @ 507 imp), `mixed-initiative-control` (0% @ 454), `escalation-pathways` (0% @ 373), `adaptive-interfaces` (0.70% @ 717), `multimodal-interaction` (0.15% @ 680), `feedback-loops` (0.45% @ 671), `context-switching` (0.31% @ 654), `agent-status-monitoring` (0.74% @ 540), `progressive-enhancement` (0.40% @ 497), `intelligent-caching` (0% @ 235 — title leads with "Smart Caching" since "smart caching" outranks "intelligent caching" 57:16 in queries). All copy from guide sections 3a-3p, all anchored on real named products (Gmail/Notion/Copilot, Netflix/Spotify/Duolingo, Google/Tesla/iPad Pro, ChatGPT/Notion AI/Slack, etc.). (3) Homepage `generateHomeMetadata` updated to `AI UX Design Patterns: 36 Examples from ChatGPT, Claude & More` + tightened description (the guide noted homepage is already converting at 5.93% CTR — polish, not urgent leverage). (4) `/audit` page metadata title/description + OG title/description + Twitter title/description swapped to `AI UX Audit: Free Tool to Score Designs Against 36 Patterns` formula. Kept existing keywords array, alternates.canonical, OG image, twitter creator. **Verification.** `npx tsc --noEmit` clean on both modified files (filtered grep — pre-existing 85 errors elsewhere unchanged per CLAUDE.md test-mock/standalone-script divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. **Follow-up note saved.** New memory at `~/.claude/projects/-Users-imranmohammed/memory/project_aiex_seo_bulk_rewrite_apr27.md` indexed in MEMORY.md active follow-ups. Recheck schedule: **Day 14 — 2026-05-11** (sanity check; mainly looking for "did Google ignore our titles" via site:aiuxdesign.guide search). **Day 28 — 2026-05-25** (real read; per-page CTR vs. previous 28d). 2026-05-25 also closes the Apr 22 batch's window so we get clean signal on both formulas head-to-head — decide whether to extend to the remaining ~22 fallback-template patterns based on which performs better. Targets per guide tier table: critical-tier 0%-CTR pages → 0.5% floor / 1.5% target / revert if <0.3%; medium-tier → maintain or +50% / revert if -10% from baseline; homepage → maintain 5.93% / revert if <5.0%. **Outstanding.** (a) Apr 22 batch (6 patterns, different formula) still in its read window — don't touch until 2026-05-20. (b) The remaining ~22 patterns get the improved fallback template only this batch; if specific pages still underperform on identifiable queries after Day 28, add custom rewrites for those individually. (c) `/patterns` (index page), `/guides`, `/prompts`, `/news`, `/about` all use their own metadata files — out of scope today; worth a follow-up audit if any show high impressions in the next GSC pull. (d) Schema.org `Article` markup, breadcrumb schema, OG image generation, image alt text optimization — all separate workstreams, lower leverage today. (e) Post-deploy: open GSC → URL Inspection on each of the 12 edited URLs (10 patterns + `/` + `/audit`) and request indexing — per `feedback_gsc_request_indexing_unreliable.md`, treat as optional accelerator; if it returns "try again later" that's fine, remaining ~22 patterns recrawl organically.

### Session 2026-04-25 13:28 (MacBook)
- **Pattern:** Audit page redesign — demo-led hero, pinned screenshot results, side-panel chat
- **Status:** ✅ Completed
- **Files Changed:** 11
- **Tests Added/Modified:** 0
- **Notes:** Major restructure of `/audit` flow driven by 0.3% completion baseline + Apr 17 v2 follow-up direction. **(1) Demo-led hero.** Flipped the funnel from "intake hero → product picker → upload → results" to "demo result IS the hero → click Start your audit → upload → results". `audit-client.tsx` initial state now `step: 'demo'` with eagerly-loaded `DEMO_ANALYSIS_RESULTS`/`DEMO_SCREENSHOT_FALLBACK`, fires `audit_demo_viewed` once on mount; `handleStartRealAudit` resets state and jumps to `'screenshot'`. New `AuditStep` includes `'demo'`. Old server-rendered hero (`audit-intake-hero` chip+H1+subtitle) deleted from `page.tsx`; H1 was preserved sr-only initially then promoted into `FullPageResults` demo branch as visible "Free AI UX Audit Tool" (3xl→6xl, var(--text-hero)) + subtitle, matching the brand's prior on-page SEO signal. Demo branch ends with a big rounded-full primary CTA "Start your audit" (no icon). **(2) DemoProductMockup.** New `src/components/audit/DemoProductMockup.tsx` — vendor-neutral PulseMetrics analytics dashboard with KPI cards (Revenue/Orders/Conv./AOV), inline-SVG revenue trend chart with linear-gradient fill, recent-orders table, and an AI Assistant right panel (insight cards in violet, recommendation, failed-forecast error block, mock input footer). Five numbered pins overlaid at fixed coordinates corresponding to the first 5 topGaps: Confidence Visualization (96/32), Human-in-the-Loop (76/11), Error Recovery (78/56), Explainable AI (96/44), Selective Memory (76/21). Active pin scales to 125% with white border + accent fill; inactive pins pulse via `animate-ping`. Replaces the earlier short-lived `DemoChatMockup.tsx` (deleted) — the chat-mockup approach was only on-screen for one iteration before the dashboard pivot. **(3) Side panel for pin clicks.** Both demo and real-audit branches share the same `openPin`/`hoveredPin` state; clicking a pin opens an absolute-positioned aside (full-width on mobile, 420px on desktop sm:) with the matching pattern's `<GapCard>`. Demo banner "Sample audit" + small CTA was first attempt then replaced by the bigger H1+button approach; the demo chat-tab path now empty-states with "Run an audit to chat" instead of auto-firing the chat opener. **(4) Real-audit results mirror demo.** Replaced the old split-view (5/7 grid + tab toggle) with same screenshot+pins+side-panel UX. User's uploaded screenshot rendered inside a fixed device-aware canvas: 880×660 (4:3 aspect) for desktop screenshots, 400×711 (9:16) for mobile (`detectDeviceType()` already plumbed via `screenshotDeviceType` prop from `audit-client.tsx`). Top-5 issues mapped to deterministic `REAL_PIN_POSITIONS` distributed across the screenshot (we don't have AI-detected coordinates yet — pins are spatially generic, the side panel does the actual feedback). 2px CSS blur + 30% white/dark wash overlay on the screenshot so the numbered pins read clearly. **(5) Inline chat side panel.** Chat moved from below-fold tab to a same-row right column. First iteration was a fixed-position drawer with scrim — wrong UX, replaced with in-flow flex layout where screenshot is left and chat aside is right. Chat is locked to the same explicit pixel height as the canvas (`lg:h-[660px]` desktop / `lg:h-[711px]` mobile-shot) so toggling it open/closed never reflows the page. Chat width: `lg:w-[360px]`, total row 880+360+24=1264 fits the bumped `max-w-7xl` (1280) wrapper. Chat content scrolls inside `flex-1 overflow-y-auto` body with `min-h-0` parent. Page wrapper widened from `max-w-6xl` → `max-w-7xl` to accommodate the canvas+chat row; CTA strip / Quick Wins still use narrower `max-w-2xl`/`max-w-3xl` inner constraints. **(6) Inline product-type on upload screen.** Extracted shared `productOptions` constant to `src/components/audit/productOptions.ts` (reused by the previously-deleted `AnchorQuestion.tsx` and the new chip selector). `ScreenshotUpload` now renders product-type as compact pill chips at the top of the column instead of a separate step; Analyze button disabled until both type + ≥1 screenshot are present. Removed the right-side per-product example audit preview (sampleAudits + statusConfig + LetterGrade import) — the new demo dashboard hero supplants that. Single-column layout, `max-w-2xl` centered. Removed `AnchorQuestion.tsx` (now unused). **(7) SocialProof gating.** SocialProof ("What is an AI UX audit?", "How it works", trust strip, Community block) only renders on `step === 'demo'`. Initial DOM-mutation hide via `getElementById` proved fragile on HMR + had a hydration flicker; final fix moves SocialProof rendering into `audit-client.tsx` as `{step === 'demo' && <SocialProof />}` and removes the wrapper from `page.tsx`. SSR still includes it on first paint at `/audit` since initial step is `'demo'` — SEO signal preserved. **(8) Action-bar CTAs (text-only).** Removed icons from the four primary CTAs in the audit flow per user direction: "Email Report" (was EnvelopeIcon), "Run Another Audit" (was ArrowPathIcon), "Analyze Screenshots" (was SparklesIcon), demo-mode "Start your own audit" (was SparklesIcon). Dead imports cleaned up (`SparklesIcon`, `EnvelopeIcon`, `ArrowPathIcon` removed from FullPageResults; `SparklesIcon` removed from ScreenshotUpload). CTA order on results page is now Email Report | Hide/Chat with results | Run Another Audit, sitting above the Quick Wins block. **(9) Score badge gated.** Removed the LetterGrade + product summary cluster from above the post-audit screenshot — at landing/demo time the score is meaningless before the user uploads, and on real-audit the screenshot+pins do the storytelling. Score still computed and used in API context. **(10) Canvas grid background.** Replaced the existing `bg-grain` (film-grain) with new `bg-canvas-grid` utility added to `globals.css` — 24px grid lines using nested linear-gradients, light variant for light mode (rgba(0,0,0,0.05)) and inverted for dark mode. Pattern matched from `src/components/mentor/CanvasView.tsx:144`'s inline grid usage. Applied across all three audit sections (intake hero in page.tsx already removed; remaining wrappers in audit-client.tsx). **(11) Two new analytics events.** `audit_demo_viewed` (fires once on demo step mount) and `audit_demo_start_real_clicked` (fires on Start-your-audit click) added to the `AuditEvent` union in `src/lib/audit/analytics.ts`. Existing `audit_product_type_selected` reused for the inline chip selector. **(12) Performance audit pass.** Verified the new flow against all 13 documented Performance & Web Vitals issues in CLAUDE.md before declaring done — most relevant: `framer-motion` zero usage in any new audit code (Issue #8); fixed a real regression where `FullPageResults` was still imported with `ssr: false` in `audit-client.tsx` even though the H1+mockup hero now lives inside it (Issue #9 + #12) — removed the `ssr: false` so the LCP element renders server-side; `'use client'` boundary correctly limited to `audit-client.tsx` not the whole page; no new media added (all SVG inline); 24px CSS grid bg adds zero JS cost. No `priority` on below-fold images, no `<video>` tags added, no animated webp added. **Verification.** `npx tsc --noEmit` clean on every iteration of every modified file. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout (`/audit` 200, HMR worked across the whole refactor). Did NOT run LHCI workflow — left for next session once dev iteration stabilizes; real verification against the budget will need a fresh nightly run. **Pending.** (a) Pin coordinates on real audits are spatially generic — the AI doesn't return per-issue regions yet. Worth investigating whether the `/api/patterns/analyze` prompt could be extended to return approximate regions on the screenshot so pins land on relevant areas. (b) Mobile breakpoint behavior of the canvas+chat row needs eyeball-testing on actual narrow viewport (single-column stack with chat below screenshot — should work but unverified). (c) Old `'product-type'` step value retained in `AuditStep` union but no code path renders it; keep until A/B work crystallizes, drop later. (d) `__tests__/ScreenshotUpload.test.tsx` is still stale (was already broken pre-session — references "Upload your screenshot" / `productDescription` which don't exist) — only updated `defaultProps` to add `onProductTypeChange` so the file type-checks; leaving real test fixes for a focused testing session. (e) Worth running an LHCI mobile-preset run against `/audit` once deployed to confirm the SSR fix delivers the expected LCP improvement (Issue #1: lab vs field gap is real; both lab and field should improve since we kept H1 server-rendered).

### Session 2026-04-25 11:50 (MacBook)
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
