# Start Work Session
Pull latest changes and check the project board for today's priorities.

## Steps:
1. Run: `git fetch origin && git pull`
2. Show: `git status` (brief — just note if there are uncommitted changes or unpushed commits)

## Check GitHub Project Board:
3. Run: `gh project item-list 4 --owner $(gh repo view --json owner -q '.owner.login') --format json`
4. Parse and display items grouped by status, with priority levels
5. Suggest what to focus on today based on priority (P0/P1 first)

## Summary Format:
```
🔄 Git: [pulled/up-to-date, any uncommitted changes]

📋 PROJECT BOARD:
   🔴 Needs Attention (P0/P1):
      - [item] (status)
      - [item] (status)

   🟡 In Progress:
      - [item] (priority)

   📝 Todo:
      - [item] (priority)

   ✅ Done (recent):
      - [item]

✨ Suggested focus: [highest priority actionable item]
```
