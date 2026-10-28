# Audit tool as a workspace inside the console

Date: 2026-10-28 · Branch: `audit-workspace` (stacked on `audit-worth-checking`)

## Why

Imran's review of the redesigned results page: cards "feel like they are in the air". The audit sits on a dotted page background with no frame, a floating Back link, and actions scattered between the page and a side rail. Patterns, Skills and Courses already live in a console shell (`LearnShell` + `LearnSidebar`: pinned rail, solid content column, navbar joined to the slab). The audit is the one product surface outside it.

## Decisions

1. **`/audit` renders inside the console.** `src/app/audit/page.tsx` wraps `AuditClient` in `LearnShell` with `LearnSidebar`, and the navbar gets `inConsole`. The rail's Explore group gains an **Audit** row (`active="audit"`), so the tool is reachable from every console page and the reader always knows where they are.
2. **A tool bar at the top of the content column** (`AuditToolbar`): the tool name, a three-step indicator (Upload, Analyse, Results) showing the current step, and the step's main actions on the right. On results: **Run another audit** moves here from the rail. Back is removed on `/audit` (the rail and browser back cover it).
3. **No dotted background on `/audit`.** The console column is the surface. Cards keep borders; the header card and gap cards sit on white, so their borders carry the structure.
4. **Results layout unchanged in substance** (header card, gaps, Worth checking, Learn; pack card and screenshot pins in the right column), only moved into the column. The right column stays sticky.
5. **The homepage demo is untouched.** `AuditClient` gets a `layout: 'page' | 'console'` prop; `'page'` keeps today's marketing look on `/`.
6. **Hex colours in `AuditClient` become tokens** (the pre-commit brand check blocks the file otherwise).

## Not in scope

ScreenshotUpload internals, the analysing skeleton's content, the homepage demo, mobile drawer behaviour (LearnShell already handles it).

## How to check it worked

- `/audit` upload, analysing and results all render inside the console at 1440px and 390px, light and dark, with no dotted ground.
- The homepage `/` demo looks the same as before.
- Success measure after release: upload rate on `/audit` (191 opened, 9 uploaded before this change, per the admin Audit Samples page).
