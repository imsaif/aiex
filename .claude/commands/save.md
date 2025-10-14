# Save Work Session
Automatically capture session accomplishments, update CLAUDE.md, commit and push to GitHub.

## Workflow:
1. **Show Changes**: Run `git status` and `git diff --stat`
2. **Stage Changes**: Run `git add .` (stage all changes for analysis)
3. **Auto-Update Memory**: Run `.claude/scripts/update-memory.sh` (from git root)
   - Script automatically updates CLAUDE.md with:
     - Session date and time
     - Machine name (MacBook/Windows PC)
     - Pattern worked on (detected from file paths)
     - Files changed count
     - Tests added/modified count
   - Adds new session to "Recent Sessions" (keeps last 10)
4. **Stage CLAUDE.md**: Run `git add CLAUDE.md` (include memory updates)
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
   ✓ CLAUDE.md automatically updated
   ✓ Session added to Recent Sessions
   ✓ Memory synced

💾 COMMITTING & PUSHING:
   Commit: [descriptive commit message]
   ✓ Committed to [branch name]
   ✓ Pushed to GitHub

🎉 Session saved successfully! All changes synced.
```

## What Happens Automatically:
- ✅ Git changes analyzed
- ✅ CLAUDE.md updated with session info
- ✅ Pattern detected from file paths
- ✅ Session added to history (last 10 kept)
- ✅ Everything committed and pushed

**Note:** The update-memory.sh script handles all CLAUDE.md updates automatically. No manual intervention needed!
