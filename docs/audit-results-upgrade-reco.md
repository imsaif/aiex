# Audit Results — Upgrade Recommendation

_Research date: 2026-07-06. Method: 4 parallel research agents (value teardown of our actual 5-gap output, founder-recipient reaction, market/competitor packaging, CTA+chat decision) + an adversarial stress-test. Grounded in the live `FullPageResults.tsx` and real funnel data._

## The question we asked

Is the audit actually giving anyone value, and is the results experience (10 CTAs + an open chat) the right packaging? Or should we collapse to a single CTA?

## The honest verdict

**The audit is competent but not yet _authoritative_ — and that, not the button layout, is why post-results CTAs are near-dead.** Scoring our actual 5-gap output:

| Gap | Verdict |
|---|---|
| 1 Responsible AI (Critical) | **Mislabeled.** A missing disclosure sub-label is called "Critical" while the genuinely critical image-gen risks (provenance, likeness/consent) go unmentioned. The weakest, most generic finding wears the scariest badge — a trust-killer. |
| 2 Guided Learning | **Best of the set.** Actually reads the screen: "can't tell if clicking a tile applies to my photo or generates new." Real, specific. |
| 3 Safe Exploration | **Padding.** Near-duplicate of #2's click-affordance mechanism, re-skinned onto "prompt tiles." |
| 4 Augmented Creation | **Feature request** dressed as a gap ("input is bare, add prompt chips"). |
| 5 Selective Memory | **Thin but legit.** Real data-control question about "My images" history. |

Roughly **two real insights, one mislabeled, two filler** — and every fix bottoms out in "add a tooltip / label / link." A founder reading it goes "impressed for 5 seconds, then _so what_" because **nothing tells them what any gap costs them.**

**Important caveat the stress-test surfaced (don't overstate the critique):** the input is a single screenshot, so the audit _structurally can't_ assess provenance, data flows, jurisdiction, etc. "The fixes are all add-microcopy" may be an accurate diagnosis of a bare generative surface, not laziness. The scope ceiling isn't a flaw to hide — **it's the honest reason to upgrade to the paid whole-product audit.**

## What's actually high-leverage (at ~1–2 audits/day)

At this volume the results page is a **trust/quality investment, not a growth lever** (the real leak is top-of-funnel demo→real-audit, out of scope here). So: **rewrite the output, not the buttons.** In priority order:

### P0 — Make the output show _judgment_, not a labeled list
This is the one change that fixes the "so what," and it's reusable on every future audit.
1. **Dedup to 3 sharp findings, honestly.** Merge #2+#3 into one "users can't tell what your tiles do before clicking" finding; treat #4 as an optional enhancement, not a headline gap. Stop padding to a round "5 GAPS FOUND."
2. **Fix severity so it's argued, not asserted.** The one "Critical" must be the highest-stakes item, with a one-line _why it ranks here_. Downgrade or honestly re-scope the Responsible-AI finding.
3. **One honestly-hedged impact line per gap.** "Users can't tell what a style tile does → they likely stall before their first generation." Inference is fine; a fabricated metric ("−X% activation") is not — we have no funnel data on the audited product.
4. **Lead with a single "Fix this first" block** — highest impact / lowest effort, with the before/after microcopy inline. This answers the user's own top question _inside the report_ instead of offloading it to a dead chat box.
5. **Inline the location pins per finding**, not a separate global "See where each gap is" toggle (matches Lighthouse / Attention Insight / WAVE — issue → exact spot → fix, co-located).

### P1 — Impose visual hierarchy on the CTAs (hygiene, not conversion-chasing)
Ten roughly co-equal actions read as "trust none of them." Collapse to **one obvious primary + demoted secondaries** — but note this is a _clutter_ fix, **not** a bet on the single-CTA conversion stats (13.5% vs 10.5% etc. are from at-volume A/B tests we can't reproduce or measure at 1–2/day).
- **Keep "Copy fix for Claude Code" — it's the trust engine** (proof the audit is real). Demote from hero to a strong secondary. Do **not** cut it, and do **not** go to a truly single CTA.
- **Primary button:** a value-framed step toward the paid service, sold on **scope**: _"This is 1 screen. Get the full audit of your whole product + this fix plan for every surface."_ Deliver value first (gaps + copy-fix visible), then the ask — the founder is still evaluating, so don't hard-sell above the value.
- **Email Report** = your best micro-conversion (a captured lead). Keep as a demoted secondary.
- **Remove "Save audit"** (localStorage, redundant with Email, no lead value). Minimize "New audit."

### P1 — Replace the chat with a structured fix plan
Your instinct is right: an open chat box on a one-shot report is the wrong format (zero recorded uses). But **demote, don't rip out the plumbing** — deleting working LLM code to save a cost that 0 uses/day makes negligible is busywork.
- Replace the blank "Ask about your audit…" box with **"Your fix plan"**: the deterministic severity-ranked list (Critical pinned as "Start here"), each row = gap + why-it-ranks + effort tag + the copy-fix/pattern link you already render. Its headline job ("what should I fix first?") is already deterministic — no LLM needed.
- Keep one honest escape hatch that doubles as lead-gen: **"Have a specific question about your product? → talk to us"** routing to contact/booking. This captures high-intent questions as _leads_ instead of spending an LLM call to deflect them, and tells you whether real Q&A demand exists before rebuilding a bot.

### Bank regardless — measurement fix
- **Fix the `sessionId`-always-null bug** (`src/lib/audit/analytics.ts:73`): results-page events don't pass `results.id`, so "distinct sessions reaching results" and "audits with ≥1 chat message" are _uncomputable by design_. Pass `sessionId` so this whole question becomes measurable in a few weeks. Cheap, real, unblocks everything above.

## What NOT to do yet
- Don't chase CTA _conversion_ lift or treat single-CTA percentages as a target — can't measure at this volume. Do the hierarchy cleanup as hygiene only.
- Don't rip out the chat LLM plumbing — demote/hide it.
- Don't wire CRM, add benchmark scores, or hard-sell the paid tier — all presuppose volume the funnel doesn't have.
- Don't treat "paid upsell = the primary CTA" as settled. It's in live tension with the founder's "I'm still evaluating" reaction; it's a qualitative bet to revisit once volume + fixed instrumentation give real signal.

## One-line ceiling reminder
None of this raises the absolute lead count much until the **demo→real-audit** top-of-funnel leak is fixed. The results-page work makes the 1–2/day we _do_ get worth acting on — which is also the most credible reason a founder clicks "audit my whole product."

## Concrete before/after (the 5→3 rewrite)

**Before:** 5 flat findings, 4 identical "Warning" badges, fixes = "add a tooltip/label/chip/link."

**After — Fix this first:**
> **1. Users can't tell what your tiles do before they click** _(highest impact, ~1hr)_
> Both the style tiles and the prompt tiles show only a label — no signal whether a click applies to the user's photo, generates something new, or costs them anything. This ambiguity is the most likely reason users stall before their first generation.
> **Fix:** one descriptor line + an action icon per tile ("Applies to your photo" vs "Generates new"). _[Guided Learning ↗]_

> **2. No way to manage AI-generated image history** _(medium)_
> "My images" stores generations with no visible control to view, delete, or opt out — a data-control gap users increasingly expect to see.
> **Fix:** a "Manage" link by the heading → delete / clear-all / history-off. _[Selective Memory ↗]_

> **3. No AI-transparency signal at the input** _(medium — scope-limited)_
> The prompt field discloses nothing about outputs being AI-generated or what's disallowed. _Note: from one screenshot we can't assess provenance/watermarking/consent — the full audit covers those._
> **Fix:** a disclosure sub-label + first-use tooltip linking usage guidelines. _[Responsible AI ↗]_

> _Optional enhancement:_ prompt-assist chips ("Add lighting / style / mood") for less-experienced users. _[Augmented Creation ↗]_
