# Claude Docs guide — outline, not content

Scaffold for a designer-angle guide on Claude's document work, opened 2026-09-17,
the day after the launch.

## Read this before writing a word

**The content is deliberately not written.** A guide about a product that
shipped yesterday, written by someone who has not used it, is inference dressed
as instruction — the exact thing this site exists to argue against. Every lesson
below states the question it must answer and the evidence needed to answer it.
Fill them from the product, not from the press coverage.

## What is actually confirmed, and what is not

Checked on 2026-09-17 against primary sources rather than taken from the alert:

| Claim | Status |
|---|---|
| Cowork retired as a separate product, folded into Claude | **Confirmed** — Engadget, 2026-09-16 |
| Claude creates editable documents you can revise with it | **Confirmed** — Engadget headline and body |
| Export to Google Docs / Word | Reported in the alert; **not verified** at source |
| "Claude Slides" as a named product | **Not found** in the Engadget piece or on anthropic.com/news. May be an inference in the alert. Axios sits behind Cloudflare and could not be read. |

**Settle the Slides question before building any lesson on it.** If it does not
exist under that name, a guide promising it will be wrong on its first line, and
that is the line search engines show.

## Why this slot is worth taking

The alert's finding, worth restating because it is the whole reason for speed:
big outlets have the news, but what ranks for tutorial queries is older *Claude
Design* content from April 2026 — Claude Academy, Jeff Su, Pietro Montaldo.
Nobody has published a designer-angle how-to for the new document work yet.

That gap closes the moment those creators repoint their existing Claude Design
material. Days, not weeks.

## The angle

Not a feature tour. A feature tour is what everyone else will write, because it
is what you can produce without using the thing.

The guide takes **one real document from prompt to something you would actually
send**, and the lessons are the decisions along the way. A designer finishes it
with a document, not a list of capabilities.

Candidate artefact: a one-page design rationale — the thing a designer writes
after the work and usually writes badly because it is the last task of the week.
Pick something the reader already has to do.

## Lesson outline

Each lesson names the question it answers and what has to be verified in the
product first. Duration is a placeholder until the steps are real.

| # | Lesson | Must answer | Verify first |
|---|---|---|---|
| 1 | What changed on 16 September | Cowork is gone as a separate thing — where did its abilities go, and what does that mean for someone who never used it? | Whether Cowork's features are all present, or only some |
| 2 | Your first document | What does the first prompt look like, and what comes back? | The actual first-run experience, including what it gets wrong |
| 3 | Revising with it, not after it | How do you push back on a draft? Comments, chat, direct edit — which for what? | Which revision surfaces exist and how they differ |
| 4 | The handoff | Getting it out — export targets, what survives and what breaks | Export formats, and what formatting is lost |
| 5 | When not to use it | The honest limit: what it does badly enough that you should not start here | Found by using it, not by reading about it |

Lesson 5 is not optional padding. Every competing guide will skip it, and it is
the one a designer remembers.

## Registry entry

`src/data/guides.ts`, matching the existing shape:

- `slug`: `claude-docs-guide`
- `tool`: needs the product's real name once settled — **not** "Claude Design",
  which is a different product and already has a course
- `useCase`: `Learning Path`
- `skillLevel`: `Beginner`
- `status`: `draft` until the lessons are written from real use

Note for the rail: `railLabel()` strips "Course for Designers", "Learning Path"
and "Course" suffixes, so the title can carry one without crowding the sidebar.

## What NOT to do

- Do not generate lesson bodies from the press coverage. It describes what the
  product claims; a guide has to describe what it does.
- Do not fold this into the Claude Design course. Different product, and
  conflating them is what the current search results already get wrong.
- Do not publish with `status: 'ready'` until someone has done the whole flow
  end to end and produced the artefact the guide promises.
