# Save Work Session
Automatically capture session accomplishments to `docs/SESSION-LOG.md`, commit and push to GitHub.

## Workflow:
1. **Show Changes**: Run `git status` and `git diff --stat`
2. **Stage Changes**: Run `git add .` (stage all changes for analysis)
3. **Auto-Update Memory**: Run `.claude/scripts/update-memory.sh` (from git root)
   - Script appends a **terse** session summary to `docs/SESSION-LOG.md` (NOT CLAUDE.md):
     - Session date and time
     - Machine name (MacBook/Windows PC)
     - Pattern worked on (detected from file paths)
     - Files changed count
     - Tests added/modified count
   - Adds new session to "Recent Sessions" in that file (keeps last 10)
   - **Do NOT hand-write long session prose into CLAUDE.md.** CLAUDE.md is the lean,
     auto-loaded reference and must stay small. Durable *learnings* (a new gotcha, a
     stable convention) go under CLAUDE.md → "Known Issues & Learnings". Everything
     episodic stays in `docs/SESSION-LOG.md`.
4. **Stage memory files**: Run `git add docs/SESSION-LOG.md CLAUDE.md` (CLAUDE.md only if a durable learning was added)
5. **Commit**: Suggest descriptive commit message and commit all changes
6. **Push**: Run `git push`
7. **Confirm**: Show success summary

## Session Summary Format:
Present the save summary like this:
```
📊 ANALYZING CHANGES:
   Files changed: [X]
   Tests added/modified: [Y]
   Pattern detected: [Pattern Name]

📝 UPDATING MEMORY:
   ✓ docs/SESSION-LOG.md appended (terse summary)
   ✓ Session added to Recent Sessions
   ✓ CLAUDE.md left lean (untouched unless a durable learning was added)

💾 COMMITTING & PUSHING:
   Commit: [descriptive commit message]
   ✓ Committed to [branch name]
   ✓ Pushed to GitHub

🎉 Session saved successfully! All changes synced.
```

## What Happens Automatically:
- ✅ Git changes analyzed
- ✅ `docs/SESSION-LOG.md` appended with a terse session summary
- ✅ Pattern detected from file paths
- ✅ Session added to history (last 10 kept)
- ✅ CLAUDE.md stays lean (auto-loaded reference; not a diary)
- ✅ Everything committed and pushed

**Note:** The update-memory.sh script writes to `docs/SESSION-LOG.md`, not CLAUDE.md, so the auto-loaded context never bloats. No manual intervention needed!
