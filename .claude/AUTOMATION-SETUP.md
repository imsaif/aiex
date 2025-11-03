# AIUX Automation Setup - Claude Memory
**Last Updated**: 2025-11-03

## Overview
This document describes the automated workflow system for AIUX pattern and guide development. It enables Claude to automatically suggest and coordinate generator tools.

## Problem Solved
Previously, the powerful pattern and guide generators weren't being used effectively because:
- Claude didn't proactively suggest when to use them
- No coordination between pattern, guide, test, and design agents
- Manual workflow execution required memorizing commands

## Solution Implemented (Nov 3, 2025)
A three-tier automation system:
1. **Enhanced Skills** - Claude detects intent and suggests generators
2. **Generator Tools** - Automated creation of patterns and guides
3. **Agent Orchestration** - Coordinates multiple agents into workflows

---

## Tier 1: Enhanced Skills System

### Pattern-Dev Skill (Enhanced)
**Location**: `.claude/skills/pattern-dev/SKILL.md`

**What it does**:
- Detects pattern-related keywords in user messages
- Auto-suggests `npm run generate-pattern` when appropriate
- Coordinates with test-gen and design agents
- Shows progress (15/24 complete, 9 need updates)

**Intent Triggers** (Claude watches for these):
- "work on [pattern-name]"
- "update pattern"
- "next pattern" or "which pattern should I work on?"
- "finish remaining patterns"
- "pattern" + "incomplete" or "need work"

**Claude's Auto-Response**:
```
"I notice you want to work on patterns. Ready to generate?
Run: npm run generate-pattern [slug]"
```

### Guide-Gen Skill (NEW)
**Location**: `.claude/skills/guide-gen/SKILL.md`

**What it does**:
- Detects guide/learning path keywords
- Auto-suggests `npm run generate-guide`
- Explains guide structure and module patterns
- Shows progress (2/6 complete: Claude Code ✅, Cursor ✅)

**Intent Triggers** (Claude watches for these):
- "create a guide" or "generate guide"
- "guide for [tool-name]"
- "designer guide" or "learning path"
- "update guide" or "add lesson"

**Claude's Auto-Response**:
```
"I see you want to create a guide. Let me generate the structure.
Run: npm run generate-guide"
```

---

## Tier 2: Generator Tools

### Pattern Generator
**File**: `scripts/ai-pattern-generator.js`
**Status**: Existing ✅ (Enhanced with better skill coordination)

**Usage**:
```bash
npm run generate-pattern           # Interactive mode
npm run generate-pattern [slug]    # Direct generation
npm run generate-all-patterns      # Generate all 9 remaining
npm run list-patterns              # Show status
```

**What it generates**:
- Pattern directory structure
- code-examples.ts
- guidelines.ts
- considerations.ts
- index.ts with metadata
- Optional demo component

**Remaining Patterns** (9 to complete):
1. Ambient Intelligence
2. Safe Exploration
3. Feedback Loops
4. Graceful Handoff
5. Context Switching
6. Intelligent Caching
7. Progressive Enhancement
8. Privacy-First Design
9. Universal Access Patterns

### Guide Generator (NEW)
**File**: `scripts/ai-guide-generator.js`
**Status**: New Implementation ✅

**Usage**:
```bash
npm run generate-guide             # Interactive mode
npm run list-guides                # Show status
npm run validate-guides            # Check structure
```

**What it does**:
1. Analyzes existing guides (Claude Code: 18 lessons, Cursor: 12 lessons)
2. Learns the module structure pattern (Setup → Features → Workflows → Advanced)
3. Generates new guide with:
   - Complete metadata (title, slug, tags, author)
   - 4 modules with sequential lessons
   - Rich lesson sections (intro, text, steps, images, callouts, code)
   - Proper TypeScript syntax for guides.ts

**Generated Content Template**:
```
Module 1: Setup (3 lessons)
  - Install/Create Account
  - First Project
  - Configure Workspace

Module 2: Features (3 lessons)
  - Core Features
  - AI Capabilities
  - Customization

Module 3: Workflows (3 lessons)
  - Development Workflow
  - Collaboration
  - Integration

Module 4: Advanced (3 lessons)
  - Advanced Techniques
  - Best Practices
  - Troubleshooting
```

**Placeholder Guides** (4 ready to generate):
1. GitHub Copilot
2. Replit
3. V0
4. GitHub

**After generation, you will need to**:
- Add images/GIFs to `public/images/guides/[slug]/`
- Update lesson titles with tool-specific details
- Replace placeholder content with actual tool information
- Add code examples
- Test at `http://localhost:3000/guides/[slug]`

---

## Tier 3: Agent Orchestration

### Updated Agent Orchestrator
**File**: `scripts/agent-orchestrator.js`

**Registered Agents**:
- `pattern-generator` (high priority)
- `guide-generator` (high priority) ← NEW
- `testing-agent` (medium priority)
- `design-agent` (medium priority)
- `typescript-guardian` (high priority)
- `progress-agent` (critical priority)

### New Workflows

#### 1. Guide Generation Workflow
```bash
npm run orchestrate:workflow guide-generation
```
**Steps**:
1. Guide generator creates structure
2. Design agent analyzes consistency
3. Progress agent updates status

#### 2. AIUX Sprint Workflow (NEW)
```bash
npm run orchestrate:workflow aiux-sprint
```
**Complete development sprint**:
1. Generate pattern
2. Generate guide for that pattern
3. Generate tests
4. Analyze design consistency
5. Validate types
6. Update progress report

**Time**: ~30-45 minutes per complete AIUX feature

---

## NPM Scripts Added

```json
{
  "generate-guide": "node scripts/ai-guide-generator.js",
  "generate-lesson": "node scripts/ai-guide-generator.js lesson",
  "list-guides": "node scripts/ai-guide-generator.js list",
  "validate-guides": "node scripts/ai-guide-generator.js validate"
}
```

---

## How To Use This System

### Scenario 1: Work on a Pattern
**User**: "Let's work on the Ambient Intelligence pattern"

**Claude detects this** (pattern-dev skill):
- Recognizes "Ambient Intelligence" + "work on"
- Checks `npm run list-patterns` status
- **Auto-suggests**:
```
I see you want to work on the Ambient Intelligence pattern.
Ready to generate the structure?

npm run generate-pattern ambient-intelligence
```

### Scenario 2: Create a New Guide
**User**: "Create a guide for GitHub Copilot"

**Claude detects this** (guide-gen skill):
- Recognizes "guide for" + "GitHub Copilot"
- **Auto-suggests**:
```
I can generate a GitHub Copilot guide using your existing
Claude Code and Cursor guides as templates.

npm run generate-guide

Then follow the prompts:
- Tool: GitHub Copilot
- Skill Level: Beginner
- Number of lessons: 12
```

### Scenario 3: Full Sprint
**User**: "Let's do a full AIUX sprint"

**Claude can orchestrate**:
```bash
npm run orchestrate:workflow aiux-sprint
```

---

## Key Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Pattern Mention** | Manual command | Claude auto-suggests generator |
| **Guide Creation** | Manually write files | Generator creates structure in seconds |
| **Guide Consistency** | Manual checking | Learned from 2 working examples |
| **Multiple Tasks** | Run one at a time | Orchestrate parallel agents |
| **Workflow Coordination** | Manual management | Automated workflow chains |

---

## Skill Files Reference

### Pattern Development Skill
- **Location**: `.claude/skills/pattern-dev/SKILL.md`
- **Size**: ~300 lines
- **Contains**: Intent triggers, auto-suggestion logic, commands, checklist
- **Last Updated**: Nov 3, 2025

### Guide Development Skill
- **Location**: `.claude/skills/guide-gen/SKILL.md`
- **Size**: ~350 lines
- **Contains**: Intent triggers, module patterns, section types, workflow
- **Created**: Nov 3, 2025

---

## Current Project Status

### Patterns
- ✅ 15/24 fully updated
- 🔄 9/24 ready for generation
- **Next**: Use pattern-dev skill to generate remaining patterns

### Guides
- ✅ 2/6 complete (Claude Code, Cursor)
- 📋 4/6 placeholders (GitHub Copilot, Replit, V0, GitHub)
- **Next**: Use guide-gen skill to generate placeholder guides

### Agent Coordination
- ✅ Pattern generator integrated
- ✅ Guide generator integrated
- ✅ Test generator available
- ✅ Design agent available
- ✅ Progress agent tracking everything

---

## Important: Claude's Proactive Behavior

**The key change**: Claude should now be **proactive**, not reactive.

**Before**: You had to remember and type: `npm run generate-pattern`

**Now**:
1. You mention "pattern" or "guide"
2. Claude automatically detects this
3. Claude suggests the right command
4. Claude explains what happens next

This is implemented through the enhanced skills in `.claude/skills/`.

---

## Troubleshooting

**Q: Pattern generator isn't auto-suggesting**
A: Make sure `.claude/skills/pattern-dev/SKILL.md` is loaded. Claude reads all skills on startup.

**Q: Guide generator created wrong structure**
A: Check the interactive prompts - make sure you entered:
- Correct tool name
- Correct slug format (kebab-case)
- Correct number of lessons

**Q: How do I update a skill?**
A: Edit the skill file directly in `.claude/skills/[name]/SKILL.md`
Changes take effect immediately on next message.

**Q: Can I modify the guide generator behavior?**
A: Yes! Edit `scripts/ai-guide-generator.js`
- Change lesson templates
- Add new section types
- Modify module structure

---

## For Claude Code Reference

When working on this project:
1. Check this file for automation status
2. Use enhanced skills for pattern/guide work
3. Leverage orchestrator for multi-agent workflows
4. Suggest generators proactively when relevant

**Key phrase to look for**: "Let's work on", "create a", "generate", "next task"

**Respond with**: "Ready to automate this? Run: npm run generate-[pattern|guide]"
