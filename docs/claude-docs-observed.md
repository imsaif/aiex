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
