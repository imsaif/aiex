# Claude Docs, observed

Raw notes from a real session on 2026-09-17, captured as screenshots. Everything
here was seen on screen. Nothing is from documentation or press coverage. This
file is evidence; `claude-docs-guide-outline.md` is the plan that uses it.

## The empty doc

A new doc opens with a serif "Title" placeholder and one line of body prompt:
*"Start typing, or ask @Claude to write"*. That single line is the whole
onboarding. It tells you the two modes at once: you type, or you ask.

Toolbar above the page: a **Tabs** dropdown, then table, image, checklist, and a
`+` menu. Top bar carries the doc name as a dropdown, **Chat**, open-in-new-tab,
a comment count, **Share**, and close.

## Asking Claude, from inside the page

Typing `@claude` in the body opens a two-section menu:

- **Ask Claude** → Claude
- **Tabs** → the tabs in this doc, listed by name

So the same `@` does two different jobs: address the assistant, or reference
another tab. Worth calling out, because a designer will hit it by accident.

Choosing Claude turns the line into an inline composer: `@Claude` followed by
*"Tell Claude what to write or edit"*. Submit it and it becomes an anchored
comment on the right, with the source text highlighted amber in the page, and
the status *"Claude is working on it…"* inside the comment card.

**This is the interaction that makes Docs different.** You do not switch to a
chat box and describe where you mean. You point at the line and ask there. That
is a review comment, and designers already know what a review comment is.

## Two comments at once

Sending a second comment while the first is still running does not queue
silently. The card says *"Claude is finishing another turn. Your ask is next."*

The reply box carries a **Send to Claude** checkbox, ticked by default. So a
comment can be either a note for a human or an instruction for Claude, and the
difference is one checkbox. Untick it and you have left an ordinary comment.

## The doc names itself, twice

The doc kept the name typed into it, "Claude docs guide". The browser tab and
the session became "Claude docs usage guide" on their own. Two names for one
piece of work, and only one of them was chosen by a person.

## The split view

Opening the conversation gives a two-panel layout: the session on the left, the
doc live on the right. URL shapes differ, which matters for anyone sharing links:

- `claude.ai/artifact/<id>` is the doc on its own
- `claude.ai/cowork/cse_<session>?artifact=<uuid>` is the split view

The left panel shows the doc as a pinned card: **"Claude docs guide · Doc ·
Only you"** with a Hide button. Private by default, stated on the card.

Under it, the work is narrated in plain language:

- "Read 4 files, used Claude Docs integration, loaded tools"
- "Edit doc · 1 note" then "Now appending the remaining sections at the end of
  the doc."
- "Used Claude Docs integration · 2 notes"
- "Create doc, tab, or comment"
- Closing line: "Wrote the guide into the doc and replied in the thread there."

A one-off hint appears above the composer: *"Want to see the steps first? Ask
Claude for a plan up front."* with an **Add to message** button. Model picker at
the bottom read **Manual / Sonnet 5 High**.

## Watching it write

Claude types into the page with a named cursor, the same labelled caret you see
when someone else is in a shared document. The structure lands first, headings
visible while sections are still empty, then the detail fills in.

## It answers in the thread

When it finished, the comment thread showed a reply from Claude at 13:57:
*"Added the guide below — covers creating a doc, editing, tabs, comments, and
sharing."* The thread collapsed to "Show 1 reply".

So the loop closes where it started: comment on a line, get an answer on that
same line, with the change already made in the page.

## What this changes in the guide

1. **Lesson 1 gets a concrete hook.** Docs is not "a document Claude keeps
   current". It is a document you brief by commenting on it. That is the sentence
   a designer needs, and it is not in Anthropic's tooltip.
2. **The Send-to-Claude checkbox deserves its own beat.** It is the whole
   distinction between a human comment and an instruction, and it is one tick.
3. **The queue message and the plan hint are evidence of good AI UX.** This site
   has patterns for both. Worth linking rather than describing.
4. **Two names for one doc is a real wrinkle**, and the kind of thing every other
   guide will leave out.

---

# Claude Slides, observed

Same session, 1:59pm. One screenshot so far, of the empty state, and it already
argues for a separate guide.

## The empty state asks a different question

Docs opens with *"Start typing, or ask @Claude to write"*. Slides opens with
**"Paste your ideas and turn them into slides"** and, under it, a dropdown:
**Choose design system…**

That dropdown is the whole story. Before you have a single slide, Slides wants
to know what it should look like. Docs never asks. A deck is a styled object, a
doc is text, and the product admits that at second zero.

The right panel says *"This deck has no slides yet. Add one, or let Claude add
some."* with an **Add slide** button. So both hands are offered: yours or
Claude's.

## Different toolbar, different job

Docs gave document controls: tabs, table, image, checklist. Slides gives object
controls: text box, image, table, shapes. Plus, top right, download, present,
a layout toggle, and a zoom control reading 100%.

Same split-panel shell as Docs, same `claude.ai/cowork/cse_…?artifact=…` URL,
same chat on the left. The shell is shared. What sits inside it is not.

## The audit answer, so far

**Slides needs its own guide, not a section in the Docs one.** Evidence, not a
hunch: the two products ask for different things before you start. Docs wants a
sentence. Slides wants a design system. A guide that covers both will bury that,
and it is the single most useful thing to tell a designer.

Still to capture for Slides: what the design-system dropdown actually contains,
whether a migrated system appears there, what a paste of raw notes produces, and
the PowerPoint export fidelity.

## The design-system dropdown is empty

Opened at 2:00pm. It contains exactly one item: **Manage design systems**, with
an external-link icon. No systems, no defaults, no samples.

So the first thing Slides asks for is the one thing a new user does not have.
The dropdown is a door to a setup flow, dressed as a choice.

This connects directly to the banner seen on the artifacts page: *"Migrate your
design systems here to use them across all your artifacts and Claude sessions."*
Migration is not an optional tidy-up for existing Design users. It is how this
dropdown ever gets an entry.

For the guide: the honest first instruction for Slides is not "choose a design
system". It is "you do not have one yet, here is what happens if you skip it,
and here is what changes once you have one". The skip path needs capturing too,
since most readers will take it.

## Skipping the design system, and what the trace reveals

Asked plainly: "Lets create a slide for getting started on claude slides". No
design system chosen. It proceeded without complaint, so the picker is genuinely
optional, not a gate.

The left panel narrated the work, and this is the interesting part:

- "Ran 2 commands, used a tool"
- **"Print SKILL.md and craft.md reference files"**
- **"Print format.md reference file"**
- "Read an artifact"
- "Thinking… · 24s"

**Slides is driven by a skill.** Before placing anything it reads a `SKILL.md`
plus `craft.md` and `format.md` references. That is the same file shape this
site generates for all 38 patterns. The deck's quality is not magic in the
model, it is instructions in a file, and a designer who understands that
understands why a skill is worth installing.

That is the strongest link we have between this guide cluster and the skill
pack, and nobody writing a "how to use Claude Slides" post will notice it.

On the canvas, a labelled cursor reading **"Claude is working…"** sits where the
next object will land. Docs had the same presence cue in a line of text; Slides
has it in space.

The plan hint appears here too: *"Want to see the steps first? Ask Claude for a
plan up front."*

## The wait is long, and the canvas stays empty

At 1m 34s the deck was still blank. The status had moved from "Thinking… · 24s"
to **"Working through a complex response… · 1m 34s"**, and the only thing on the
canvas was the floating "Claude is working…" label and the Add slide button.

Set against Docs, this is a real difference in felt speed. Docs put headings on
the page within seconds and filled them in while you watched, so the wait was
spent reading. Slides holds everything back and shows a label instead, so the
same minute feels like nothing is happening.

Both are honest. Only one is reassuring. For a guide aimed at designers this is
the observation with the most teaching in it, and for this site it is a live
example of patterns we already document: progressive disclosure of work in
progress versus a bare activity indicator.

Do not soften this in the lesson. "Expect to wait, and here is why nothing
appears" is more useful than pretending it is instant.

## What a no-system deck actually looks like

Five slides, landed after roughly two minutes. I had expected generic. It is not.

- Dark title slide, then light content slides
- Serif display headings at a confident size
- A three-card row numbered 01 / 02 / 03, each card with a heading and two
  lines, orange numerals as the only accent colour
- Generous margins, one idea per slide
- Filmstrip along the bottom: title, what it is, how to build a first deck,
  design tips, and a closing dark slide

Claude's own summary in the panel: *"5 slides walking through Getting Started
with Claude Slides: a dark title slide, what the tool does (3-card breakdown),
the 4-step workflow, a quick grid of design tips, and a closing call-to-action."*
It then offered to change the tone, the palette, or rework any slide.

**Correcting an assumption made earlier in this file:** the argument for
migrating a design system is not that the default looks bad. The default has
taste. The argument is brand fidelity, which is a different and more honest
claim, and the guide should make that one.

## A deck is a pile of files

The panel read: **"Created 6 files, ran 3 commands, used a tool"**, then *"Now
publishing all files in one call."*

So a deck is not one opaque slide object. It is a set of files published
together. That explains why PowerPoint, HTML and PDF export are all plausible
from the same artifact, and it is the same file-shaped thinking as the skills.
Worth one sentence in the guide; a designer who knows this stops treating the
output as a black box.

## Revised audit verdict

Slides is a separate guide, confirmed. Docs is text you brief by commenting.
Slides is a styled artifact built from files, with a slow blank wait and a
strong default look. Sharing one guide would flatten both.
