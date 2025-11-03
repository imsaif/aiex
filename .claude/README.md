# Claude Code Configuration for AIUX Project

This directory contains Claude-specific configuration, skills, and documentation for the AIUX pattern and guide development project.

## 📁 Directory Structure

```
.claude/
├── README.md                    # This file
├── AUTOMATION-SETUP.md         # Comprehensive automation documentation
├── skills/
│   ├── pattern-dev/           # Pattern development skill (enhanced)
│   ├── guide-gen/             # Guide generation skill (NEW!)
│   ├── test-gen/              # Test generation skill
│   ├── demo-gen/              # Demo component generation skill
│   ├── design/                # Design consistency skill
│   ├── build/                 # Build management skill
│   ├── code-review/           # Code review skill
│   └── progress/              # Project progress tracking skill
├── commands/                   # Custom slash commands
└── scripts/                    # Script configurations
```

## 🤖 Key Automation Features (Nov 3, 2025)

### Pattern Development Automation
- **Skill**: `.claude/skills/pattern-dev/SKILL.md`
- **What it does**: Claude automatically detects pattern work and suggests `npm run generate-pattern`
- **Intent triggers**: "work on pattern", "update pattern", "next pattern"
- **Status**: 15/24 complete, 9 remaining

### Guide Development Automation (NEW!)
- **Skill**: `.claude/skills/guide-gen/SKILL.md`
- **What it does**: Claude automatically detects guide work and suggests `npm run generate-guide`
- **Intent triggers**: "create guide", "guide for", "learning path"
- **Generator**: `scripts/ai-guide-generator.js`
- **Status**: 2/6 complete, 4 placeholders ready

## 📚 Documentation

### For Quick Reference
1. **Quick Start**: See main [CLAUDE.md](../CLAUDE.md) file
   - Line 144: "⚡ Automated Workflow System"
   - Line 109: "Automation & Agent Orchestration"

2. **Detailed Setup**: See [.claude/AUTOMATION-SETUP.md](./AUTOMATION-SETUP.md)
   - Complete 3-tier automation system explanation
   - How skills work together
   - Generator capabilities
   - Workflow examples

### For Skill Details
- **Pattern Development**: [.claude/skills/pattern-dev/SKILL.md](./skills/pattern-dev/SKILL.md)
- **Guide Development**: [.claude/skills/guide-gen/SKILL.md](./skills/guide-gen/SKILL.md)

## 🎯 How Claude Uses This Configuration

### 1. Skill Detection
When you write a message, Claude reads all skills and detects keywords:
- Pattern keywords → pattern-dev skill activates
- Guide keywords → guide-gen skill activates
- Test keywords → test-gen skill activates

### 2. Auto-Suggestion
Skills contain "Intent Detection" sections that guide Claude to suggest:
```
You: "Let's work on a pattern"
Claude: "Ready to generate? Run: npm run generate-pattern [slug]"
```

### 3. Workflow Coordination
Claude understands how different agents work together:
- Pattern generator
- Guide generator
- Test generator
- Design analyzer
- Progress reporter

## 🚀 Using the Automation System

### To work on a pattern:
```
You: "Let's work on Ambient Intelligence"
Claude: (auto-suggests) "npm run generate-pattern ambient-intelligence"
```

### To create a guide:
```
You: "Create a guide for GitHub Copilot"
Claude: (auto-suggests) "npm run generate-guide"
Then Claude guides you through the interactive setup
```

### For a complete sprint:
```
You: "Let's do a full AIUX sprint"
Claude: "I'll coordinate pattern + guide + test generation"
npm run orchestrate:workflow aiux-sprint
```

## 📖 Key Concepts

### Intent Detection
Skills contain lists of keywords Claude should watch for. When detected, Claude suggests the appropriate action.

**Pattern keywords**:
- "work on", "update", "next", "complete", "remaining", "pattern"

**Guide keywords**:
- "create", "guide", "learning path", "lesson", "course"

### Auto-Suggestion
Instead of you remembering npm commands, Claude proactively suggests them based on context.

### Agent Coordination
Multiple agents can work together:
- Pattern generator creates structure
- Test generator creates tests
- Design analyzer checks consistency
- Progress agent tracks everything

## 🔧 How to Update Skills

1. Edit the skill file: `.claude/skills/[skill-name]/SKILL.md`
2. Update intent triggers, descriptions, or instructions
3. Changes take effect immediately on next message

Example: If you want to change pattern-dev behavior:
```bash
# Edit the file
nano .claude/skills/pattern-dev/SKILL.md

# Changes are immediately active
```

## 🎓 Understanding the 3-Tier System

### Tier 1: Skills (`.claude/skills/`)
- **Purpose**: Tell Claude when to suggest generators
- **How**: Intent detection + auto-suggestion
- **Files**: `pattern-dev/SKILL.md`, `guide-gen/SKILL.md`

### Tier 2: Generators (`scripts/`)
- **Purpose**: Automate file creation
- **How**: Parse templates, generate TypeScript code
- **Files**: `ai-pattern-generator.js`, `ai-guide-generator.js`

### Tier 3: Orchestration (`scripts/agent-orchestrator.js`)
- **Purpose**: Coordinate multiple agents
- **How**: Chain workflows, run agents in parallel
- **Commands**: `npm run orchestrate:workflow [name]`

## 📊 Current Status

### Patterns
- ✅ 15/24 fully updated
- 🔄 9/24 ready for generation
- 🤖 Automated with pattern-dev skill

### Guides
- ✅ 2/6 complete (Claude Code, Cursor)
- 📋 4/6 placeholders ready
- 🤖 Automated with guide-gen skill (NEW!)

### Agents
- ✅ Pattern generator
- ✅ Guide generator (NEW!)
- ✅ Test generator
- ✅ Design analyzer
- ✅ TypeScript guardian
- ✅ Progress reporter

## 🔗 Important Links

- **Project Root**: [../](../)
- **Main Documentation**: [../CLAUDE.md](../CLAUDE.md)
- **Automation Setup**: [./AUTOMATION-SETUP.md](./AUTOMATION-SETUP.md)
- **Pattern Skill**: [./skills/pattern-dev/SKILL.md](./skills/pattern-dev/SKILL.md)
- **Guide Skill**: [./skills/guide-gen/SKILL.md](./skills/guide-gen/SKILL.md)

## 💡 Pro Tips

1. **First time?** Start with [AUTOMATION-SETUP.md](./AUTOMATION-SETUP.md)
2. **Quick answers?** Check relevant skill file (pattern-dev, guide-gen, etc.)
3. **Need workflows?** See agent-orchestrator section in AUTOMATION-SETUP.md
4. **Want to customize?** Edit skill files directly

## ❓ FAQ

**Q: Claude isn't auto-suggesting generators**
A: Make sure skills are loaded. Skills are read automatically by Claude Code.

**Q: How do I see what skills are available?**
A: Check the `skills/` directory. Each skill has its own subdirectory with a `SKILL.md` file.

**Q: Can I create a new skill?**
A: Yes! Create a new directory in `skills/[new-skill]/` with a `SKILL.md` file.

**Q: What's the difference between skills and scripts?**
A: Skills tell Claude **when** to suggest something. Scripts **do** the actual work.

**Q: How do I update the automation system?**
A: Edit `.claude/AUTOMATION-SETUP.md` for documentation and skill files for behavior.

---

**Last Updated**: Nov 3, 2025
**Automation System**: Fully Implemented ✅
