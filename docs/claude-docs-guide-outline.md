# Docs, Slides or Design — guide outline

Scaffold for a designer-angle guide, opened 2026-09-17, the day after launch.

## What is confirmed, from the product

Verified in the product at `claude.ai/artifacts` on 2026-09-17, not from press
coverage. An earlier version of this file doubted that Slides existed, on the
basis that it had no marketing URL. That was wrong: these features live inside
Claude, not on their own pages, so the absence of a URL proved nothing.

**All three are Beta, and all three are created as artifacts.** Anthropic's own
one-line definitions, copied exactly from the tile tooltips:

| Tile | Anthropic's description |
|---|---|
| **Docs** | "A document your team reads, comments on and edits in place while Claude keeps it current." |
| **Slides** | "A deck you can present, restyle with a design system and export to PowerPoint." |
| **Design** | "Screens, flows and graphics laid out as artboards on one canvas you can edit by hand." |

Each tile offers "Start with a prompt".

**Claude Design has moved.** The banner on that page reads *"Claude Design lives
here now — New Slides and Design projects are created as artifacts. Migrate your
design systems here to use them across all your artifacts and Claude sessions."*
There is a "Migrate team design systems" action and a link to the standalone
homepage.

Export, seen on a Design artifact: PDF (instant, or re-formatted by Claude),
Project HTML (.zip or standalone), **PowerPoint (editable text and shapes)**,
PNG, Video (MP4), and Send to **Claude Code, Lovable, Miro**. Plus Present mode
and Comment.

## The consequence we should act on first

**The existing Claude Design course is now partly stale.** Twelve lessons
describing a product that has relocated into artifacts and gained a migration
path. Wrong live content ranks worse than missing content, and this site already
ranks for it.

Audit that course before publishing anything new. It protects something we have;
the guide below chases something we do not.

## The angle

Not "how to use Claude Slides". That is what everyone else will write, because
it is what you can produce without using the thing — and because the tile
tooltips hand it to you.

The real question, now that all three sit in one place, is **which one to ask
for**. Ask for a doc when you wanted a deck and the session is wasted. The three
definitions above are genuinely distinct, and nobody has written the designer's
version of that decision.

Working title: *Docs, Slides or Design — which to ask Claude for.*

Shape: one real piece of work taken through the choice, made, and exported. A
designer finishes with an artefact, not a list of capabilities.

## Lesson outline

Each lesson names the question it must answer and what has to be verified in the
product. Durations are placeholders until the steps are real.

| # | Lesson | Must answer | Verify first |
|---|---|---|---|
| 1 | The three tiles | What each is for, in a designer's words rather than Anthropic's | That the tooltip distinctions hold up in practice |
| 2 | Picking wrong on purpose | Ask for the wrong one and show what you get — the fastest way to teach the difference | What a deck request actually returns from Docs |
| 3 | Making the real thing | One artefact, start to finish | The first-run experience, including what it gets wrong |
| 4 | Getting it out | PowerPoint, PDF, Miro, Claude Code — what survives the export and what breaks | Each export path, and the formatting losses |
| 5 | Design systems across sessions | The migration the banner offers, and what it buys you | What "use them across all your artifacts" means in practice |
| 6 | When not to use any of them | The honest limit | Found by using them |

Lesson 6 is not padding. Every competing guide will skip it, and it is the one a
designer remembers.

## Registry entry

`src/data/guides.ts`, matching the existing shape:

- `slug`: `claude-docs-slides-design`
- `tool`: needs deciding — these are three tiles inside Claude, not one product,
  so the existing per-tool convention does not fit cleanly
- `useCase`: `Learning Path`
- `skillLevel`: `Beginner`
- `status`: `draft` until the lessons come from real use

Note for the rail: `railLabel()` strips "Course for Designers", "Learning Path"
and "Course" suffixes, so a title can carry one without crowding the sidebar.

## What NOT to do

- Do not generate lesson bodies from press coverage or from the tooltips. They
  say what the tiles claim; a guide has to say what they do.
- Do not merge this into the Claude Design course. Design is one of three tiles
  now, and conflating them is what the current search results already get wrong.
- Do not publish at `status: 'ready'` until someone has taken one artefact all
  the way through and out.
