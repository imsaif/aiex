# Guidebot: brief (draft, 10-11 Nov 2026)

A chat on aiuxdesign.guide that knows the site's content and points each visitor to the right page, and answers simple support questions. Inspired by AIHero's "Ask AIHero Bot" (it knows every article, video and skill on that site). We take the idea, not their look or character.

Separate from the pattern mentor (`src/app/api/mentor`), which is switched off in production and stays untouched.

This is also the running experiment for Imran's Claude Architect study: each course topic gets built into this one real feature. Progress and lessons: Platform 101 Lab Notebook.

## Who it's for

Designers visiting aiuxdesign.guide who are learning AI UX: looking for a pattern, a course or lesson, a checklist, or a newsletter issue, and people asking about an audit or an event booking.

## Its job

1. **Point to the right page.** Answer from the site's own content and always link the page the answer came from.
2. **Answer simple support questions** about audits, events and the newsletter, from published information only.

## What it knows (v1)

Everything already in the repo as data or pages:
- 38 design patterns (`src/data/patterns`)
- Courses and tool guides (`src/data/guides.ts`, `src/app/guides`)
- The learning map (`src/data/learn-map.ts`)
- Newsletter issues (`src/data/newsletters.ts`, `src/app/news`)
- Events (`src/data/events.ts`)
- Checklists, handbook, prompts, skills and toolkit pages
- The audit: what it does, price, what you get (from the audit pages)

## What it never does

- **Answers outside the site's content.** If the site doesn't cover it, it says so and links the closest page.
- **Invents** prices, dates, availability or policy.
- **Refunds, cancels or changes a booking.** It drafts the request and passes it to Imran for approval. Nothing is changed automatically.
- **Asks for personal data** beyond an email address when a case is passed to Imran.

## How we'll know it works

- **Before launch:** a test set of about 30 real questions, taken from emails and newsletter replies people have actually sent. Each answer is checked: right page linked, nothing invented, support cases passed on.
- **After launch:** every conversation logged (the way audits are logged today), with a thumbs up or down on each answer. Reviewed weekly.
- **Model:** start with Haiku and move up only if the test set says so.

## Course topics it covers

| Topic | Where it shows up in the guide |
|---|---|
| Agent loop, tool use | Looking up patterns, courses and issues |
| Context management | Finding the right page among hundreds |
| Skills | Separate playbooks for learning and support questions |
| Approval hooks | Refunds and cancellations wait for Imran |
| Evaluations | The 30-question test set, run on every change |
| MCP | Later: the site's content offered as an MCP server |
| Claude Code | Built in this repo with its rules and skills |

## Decisions (Imran, 10-11 Nov 2026)

1. **Name: Guidebot** (Imran, 11 Nov). A character, distinct from the Guides section (the tool guides). Personality: patient and educational for someone new to AI UX; explains a term before using it and ends by pointing to the page that teaches more.
2. **Where it appears:** on the learning map, as a "not sure where to start?" card that opens the chat.
3. **Voice:** an educational guide. It explains, then points to the page that teaches more.
4. **Hand-off inbox:** imranrizom@gmail.com.
5. **Test questions:** real visitor questions from the same Gmail inbox. Personal details are removed before any question goes into the test set.
