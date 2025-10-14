# Start Work Session
Pull latest changes and load project context before starting work.

## Steps:
1. Check if we're in a git repository
2. Run: `git fetch origin`
3. Run: `git pull`
4. Show: `git status`
5. Summarize what changed since last session

## Load Project Context:
6. Read and display the "Current Work Session" section from CLAUDE.md:
   - Active pattern being worked on
   - Pattern checklist progress
   - Session notes
7. Read and display the "Recent Sessions" section from CLAUDE.md:
   - Show last 2-3 sessions from other machines
   - Highlight what was accomplished
8. Display current priorities:
   - Pattern completion status (10/24 fully updated)
   - Test coverage status
   - Next patterns in queue

## Summary Format:
Present the information clearly:
```
🔄 Git Status:
   [Git pull summary and changes]

📋 CURRENT WORK:
   Pattern: [Active Pattern Name] ([Status])
   Progress: [X/10 checklist items complete]

   Checklist:
   ✓ [Completed items]
   ⏳ [Remaining items]

📊 PROJECT STATUS:
   Patterns: 10/24 fully updated (14 need updates)
   Tests: 481 tests, 48% coverage

📝 RECENT ACTIVITY (Other Machines):
   [Summary of last 2-3 sessions]

✨ You're ready to continue working on [Pattern Name]!
```
