# Claude Design course, audited against the artifacts move

Audited 2026-09-17, the day after Docs, Slides and Design appeared as three
tiles under `claude.ai/artifacts`. Source of truth is the product, seen today,
recorded in `claude-docs-observed.md`.

The course: `claude-design-learning-path`, twelve lessons, `status: 'ready'`,
published 2026-04-21, last updated 2026-07-20.

## Verdict: better than feared, but one lesson actively misdirects

The damage is concentrated, not spread. Lessons 2 through 10 teach **how you
work** with Claude on visual output: the four-part prompt, importing assets,
iterating in conversation, inline comments, tweaks, extracting and publishing a
design system. None of that depends on where Design lives, and today's session
confirmed the interaction model is not only intact but has spread. Anchored
comments now work on slides as well.

What is wrong is **where the course says things live**, and one lesson that now
sends the reader to the wrong tile.

## Fix, in priority order

### 1. Lesson 11, "Prompt to Pitch Deck" (the only urgent one)

It opens: *"Claude Design handles decks as well as product screens."* Decks are
now Slides' job, a separate tile with its own empty state, its own design-system
picker, and its own export menu including two PowerPoint options. A designer
following this lesson goes to the wrong place and gets a worse result.

This is the one that costs a reader a session. Fix it first, and point it at
Slides.

### 2. Lesson 1, "What Claude Design Is (and Isn't)"

- Says Design is *"currently in beta (Anthropic Labs)"*. The tile now reads
  **Beta** inside artifacts, and the banner states plainly: *"Claude Design lives
  here now. New Slides and Design projects are created as artifacts."*
- The "what it's good at" list includes *"Producing on-brand pitch decks from a
  bulleted outline"*. Same misdirection as lesson 11, one line.
- The course never uses the word **artifact** in any structural sense. Two
  incidental mentions, neither about the move. That is the gap a reader arriving
  from search will notice immediately.

### 3. Prerequisites line

Reads *"access to Claude Design in research preview"*. Out of date twice over:
it is Beta, and it is reached through artifacts.

### 4. Lesson 9, Team and Enterprise setup

Gives the admin path as *Organization settings → Capabilities → Anthropic Labs*.
**Unverified.** No enterprise org available to check it, and it may well still be
correct. Do not rewrite it on a guess. Either confirm it or mark it as
last-verified-on-a-date.

## What needs adding, not fixing

The migration. The banner offers *"Migrate team design systems"*, and today's
Slides session showed why it matters: the design-system dropdown is **empty**
until something is migrated. A designer who reads lesson 7 and 8, extracts and
publishes a system, then opens Slides and finds nothing in the picker, has hit a
gap the course created.

That is a new lesson or a substantial addition to lesson 8, not a copy edit.

## Scope

Four copy fixes, one of them urgent. One unverified item to confirm rather than
guess at. One genuine addition about migration. This is a morning's work, not a
rewrite, and it should land before the Docs and Slides guides publish beside it.
