# Ubiquitous Language

One term, one meaning, everywhere: code identifiers, UI copy, docs, and AI sessions. When a word below is the right concept, use exactly this word.

| Term | Means | Is NOT |
|------|-------|--------|
| Pattern | One of the AI UX design patterns in the registry (`src/data/patterns/`), presented at `/patterns/<slug>` | A skill, a guide |
| Skill | The generated Claude Code `SKILL.md` for one pattern, named `aiux-<slug>`, served at `/skills/aiux-<slug>.md` | The pattern itself, the pack |
| Trigger line | The skill's frontmatter `description`; symptom-first; authored per pattern as `content.skillDescription` | Marketing copy |
| Pack | A user-curated set of saved skills downloaded together (installer markdown or zip) from the dashboard | The full library; the /skills directory |
| Installer | The single markdown file (`aiux-skills.md`) that instructs Claude to create each skill file | A shell script |
| Audit fixes | The one-shot task file (`aiux-audit-fixes.md`) generated from a user's audits; worked through once, then deleted | A skill |
| Save | Adding a pattern's skill to the visitor's pack (browser state) | Installing |
| Install | Getting a skill onto the visitor's machine under `.claude/skills/` | Saving to the pack |
| Directory | The public `/skills` page listing every skill with a copy-install command | The dashboard, the pack |
| Course | A guide at `/guides` (nav label says Courses) | A pattern page |

Naming rule for code: helpers that produce install commands or Used-by data live in `src/lib/skills/` and use these terms (`skillInstallCommand`, not `copyCmd`; `exampleProducts`, not `logos`).
