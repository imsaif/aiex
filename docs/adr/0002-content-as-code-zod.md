# 0002 — Content-as-code with Zod, not a CMS

**Status:** Accepted

## Context

The core content of the site is ~36 design patterns, each a rich, structured
object: description, code examples, interactive demo wiring, real-world
examples, guidelines, considerations, and Figma prompts. This content is
authored by a very small team and changes alongside the code that renders it.

We needed the content to be (1) strongly typed so the rendering components can
rely on its shape, (2) versioned and reviewable, and (3) cheap to operate.

## Decision

Store content **as TypeScript modules in the repo**, one directory per pattern
under `src/data/patterns/patterns/`, aggregated through a central registry
(`src/data/patterns.ts`) and validated at load time against **Zod** schemas
(`src/schemas/`). Components consume it through React Context
(`PatternProvider` + `usePatterns`/`usePattern` hooks).

## Alternatives considered

- **Headless CMS (Contentful, Sanity, Strapi).** Rejected for now. Adds cost, a
  network dependency, and a sync/caching layer, and weakens end-to-end type
  safety. Content and rendering code change together here, so a separate content
  service buys little. (`docs/architecture.md` still lists CMS integration as a
  *future* possibility — this was a deliberate "start simple" call, not an
  oversight.)
- **Markdown/MDX files.** Good for prose, awkward for the deeply structured,
  multi-field pattern objects with typed code-example and demo references.
- **A database for content.** Overkill for content that is naturally static,
  rarely changes outside of code edits, and benefits from build-time rendering.
  (We *do* use a database — but only for genuinely dynamic data; see ADR 0005.)

## Consequences

- **Buys us:** full TypeScript type safety from authoring to render; Zod
  validation catches malformed content at load/build; content is git-versioned
  and code-reviewed; zero CMS cost and no runtime content fetch; pages render
  statically.
- **Costs us:** authoring requires a code edit and deploy (no non-technical
  editor UI); large content sets live in the bundle/build rather than a queryable
  store; a future pivot to user-generated or editor-managed content would mean
  introducing a CMS or DB-backed content layer.
</content>
