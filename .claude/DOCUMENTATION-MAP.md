# AIUX Automation Documentation Map

**Quick Navigation Guide for Claude Code Configuration**

Last Updated: Nov 3, 2025

---

## 📍 Find What You Need

### I want to understand the automation system
→ Start here: [.claude/AUTOMATION-SETUP.md](.././claude/AUTOMATION-SETUP.md)
**Contains**: 3-tier system overview, all components, workflows, use cases

### I need to work on patterns
→ Read: [.claude/skills/pattern-dev/SKILL.md](.././claude/skills/pattern-dev/SKILL.md)
**Contains**: Intent detection, auto-suggestion, pattern generation workflow

### I need to create guides
→ Read: [.claude/skills/guide-gen/SKILL.md](.././claude/skills/guide-gen/SKILL.md)
**Contains**: Guide generation, template patterns, guide development workflow

### I want quick overview
→ See: [.claude/README.md](.././claude/README.md)
**Contains**: Directory structure, key features, quick reference

### I want main project guidance
→ See: [../CLAUDE.md](.././CLAUDE.md)
**Contains**: Project overview, development commands, workflow explanation

---

## 📂 File Locations & Purpose

### Configuration Files (`.claude/`)
| File | Purpose | Size |
|------|---------|------|
| [.claude/README.md](.././claude/README.md) | Index of Claude config | 7 KB |
| [.claude/AUTOMATION-SETUP.md](.././claude/AUTOMATION-SETUP.md) | Full automation documentation | 12 KB |
| [.claude/DOCUMENTATION-MAP.md](.././claude/DOCUMENTATION-MAP.md) | This file - navigation guide | 3 KB |

### Skill Files (`.claude/skills/`)
| Skill | File | Purpose | Status |
|-------|------|---------|--------|
| Pattern Dev | [pattern-dev/SKILL.md](.././claude/skills/pattern-dev/SKILL.md) | Pattern generation automation | ✅ Enhanced |
| Guide Gen | [guide-gen/SKILL.md](.././claude/skills/guide-gen/SKILL.md) | Guide generation automation | ✅ NEW |
| Test Gen | [test-gen/SKILL.md](.././claude/skills/test-gen/SKILL.md) | Test generation | ✅ Existing |
| Demo Gen | [demo-gen/SKILL.md](.././claude/skills/demo-gen/SKILL.md) | Demo component generation | ✅ Existing |
| Design | [design/SKILL.md](.././claude/skills/design/SKILL.md) | Design consistency | ✅ Existing |
| Progress | [progress/SKILL.md](.././claude/skills/progress/SKILL.md) | Progress tracking | ✅ Existing |

### Generator Scripts (`scripts/`)
| Script | Purpose | Status | Command |
|--------|---------|--------|---------|
| [ai-pattern-generator.js](.././scripts/ai-pattern-generator.js) | Generate AI design patterns | ✅ Existing | `npm run generate-pattern` |
| [ai-guide-generator.js](.././scripts/ai-guide-generator.js) | Generate guide learning paths | ✅ NEW | `npm run generate-guide` |
| [agent-orchestrator.js](.././scripts/agent-orchestrator.js) | Coordinate agents | ✅ Updated | `npm run orchestrate` |

### Main Documentation
| File | Purpose | Key Section |
|------|---------|------------|
| [../CLAUDE.md](.././CLAUDE.md) | Main project guide | Line 144: Automated Workflow |
| [../package.json](.././package.json) | NPM scripts | Lines 28-31: Guide commands |

---

## 🎯 Use Cases & Where to Look

### "How do patterns and guides work together?"
1. Read: [AUTOMATION-SETUP.md](.././claude/AUTOMATION-SETUP.md) (3-tier system)
2. Look at: [pattern-dev/SKILL.md](.././claude/skills/pattern-dev/SKILL.md) (intent triggers)
3. Look at: [guide-gen/SKILL.md](.././claude/skills/guide-gen/SKILL.md) (guide generation)

### "I want to generate a pattern"
1. See: [CLAUDE.md](.././CLAUDE.md) (line 144 for overview)
2. Run: `npm run generate-pattern`
3. Reference: [pattern-dev/SKILL.md](.././claude/skills/pattern-dev/SKILL.md) for workflow

### "I want to create a guide"
1. See: [CLAUDE.md](.././CLAUDE.md) (line 144 for overview)
2. Run: `npm run generate-guide`
3. Reference: [guide-gen/SKILL.md](.././claude/skills/guide-gen/SKILL.md) for details

### "I want to coordinate multiple agents"
1. Read: [AUTOMATION-SETUP.md](.././claude/AUTOMATION-SETUP.md) (Tier 3)
2. Run: `npm run orchestrate:workflow aiux-sprint`
3. See available workflows in [agent-orchestrator.js](.././scripts/agent-orchestrator.js)

### "I want to enhance a skill"
1. Read: [README.md](.././claude/README.md) (How to Update Skills section)
2. Edit the relevant file in `.claude/skills/[skill-name]/SKILL.md`
3. Changes take effect immediately

---

## 🔍 Content Organization

### By Topic

**Pattern Development**
- Main docs: [CLAUDE.md](.././CLAUDE.md) lines 144-171
- Skill file: [.claude/skills/pattern-dev/SKILL.md](.././claude/skills/pattern-dev/SKILL.md)
- Generator: [scripts/ai-pattern-generator.js](.././scripts/ai-pattern-generator.js)

**Guide Development (NEW)**
- Main docs: [CLAUDE.md](.././CLAUDE.md) lines 144-171
- Skill file: [.claude/skills/guide-gen/SKILL.md](.././claude/skills/guide-gen/SKILL.md)
- Generator: [scripts/ai-guide-generator.js](.././scripts/ai-guide-generator.js)

**Automation System**
- Overview: [CLAUDE.md](.././CLAUDE.md) lines 109-166
- Complete: [.claude/AUTOMATION-SETUP.md](.././claude/AUTOMATION-SETUP.md)
- Index: [.claude/README.md](.././claude/README.md)

**Agent Orchestration**
- Workflows: [AUTOMATION-SETUP.md](.././claude/AUTOMATION-SETUP.md) (Tier 3)
- Commands: [CLAUDE.md](.././CLAUDE.md) lines 109-114
- Script: [scripts/agent-orchestrator.js](.././scripts/agent-orchestrator.js)

---

## 📋 Quick Command Reference

### Pattern Commands
```bash
npm run generate-pattern           # Generate pattern (interactive)
npm run generate-pattern [slug]    # Generate specific pattern
npm run generate-all-patterns      # Generate all 9 remaining
npm run list-patterns              # Show pattern status
```

### Guide Commands (NEW)
```bash
npm run generate-guide             # Generate guide (interactive)
npm run list-guides                # Show guide status
npm run validate-guides            # Validate guide structure
```

### Orchestration Commands
```bash
npm run orchestrate:workflow guide-generation     # Guide workflow
npm run orchestrate:workflow aiux-sprint          # Full AIUX sprint
npm run orchestrate:health                        # Check agent health
```

---

## 🗂️ Directory Tree

```
.claude/
├── README.md                              # Main index
├── AUTOMATION-SETUP.md                    # Complete automation docs
├── DOCUMENTATION-MAP.md                   # This file
├── skills/
│   ├── pattern-dev/
│   │   └── SKILL.md                      # Pattern automation
│   ├── guide-gen/
│   │   └── SKILL.md                      # Guide automation (NEW)
│   ├── test-gen/
│   │   └── SKILL.md                      # Test automation
│   ├── demo-gen/
│   │   └── SKILL.md                      # Demo generation
│   ├── design/
│   │   └── SKILL.md                      # Design consistency
│   ├── progress/
│   │   └── SKILL.md                      # Progress tracking
│   ├── code-review/
│   │   └── SKILL.md
│   └── build/
│       └── SKILL.md
├── commands/                              # Custom slash commands
└── scripts/                               # Script configurations

scripts/
├── ai-pattern-generator.js               # Pattern generator (existing)
├── ai-guide-generator.js                 # Guide generator (NEW)
└── agent-orchestrator.js                 # Orchestrator (updated)
```

---

## 🔄 Information Flow

When you mention "pattern" or "guide":

1. **Claude reads skills** → `.claude/skills/[pattern-dev|guide-gen]/SKILL.md`
2. **Intent detected** → Keywords match (work on, create, generate, etc.)
3. **Auto-suggestion** → Claude suggests appropriate npm command
4. **Generator runs** → `scripts/ai-pattern-generator.js` or `ai-guide-generator.js`
5. **Output created** → Pattern or guide added to project
6. **Validation** → Optional validation and testing

---

## 📚 Cross-References

### AUTOMATION-SETUP.md contains links to:
- How pattern-dev skill works
- How guide-gen skill works
- Generator capabilities
- Workflow examples
- Agent coordination

### Pattern-Dev Skill contains:
- Intent detection keywords
- Auto-suggestion logic
- Pattern status (15/24 complete)
- Commands reference
- Workflow steps

### Guide-Gen Skill contains:
- Intent detection keywords
- Guide structure reference
- Module patterns
- Section types
- Development workflow

### README.md (.claude/) contains:
- Directory structure
- Key automation features
- How Claude uses configuration
- How to update skills
- FAQ

---

## 🚀 Getting Started

### First Time Setup
1. Read: [.claude/README.md](.././claude/README.md) (5 min)
2. Skim: [AUTOMATION-SETUP.md](.././claude/AUTOMATION-SETUP.md) (10 min)
3. Reference: Relevant skill file when needed

### For Pattern Work
1. Quick check: [CLAUDE.md](.././CLAUDE.md) (lines 144-171)
2. Full details: [pattern-dev/SKILL.md](.././claude/skills/pattern-dev/SKILL.md)

### For Guide Work
1. Quick check: [CLAUDE.md](.././CLAUDE.md) (lines 144-171)
2. Full details: [guide-gen/SKILL.md](.././claude/skills/guide-gen/SKILL.md)

---

## ✅ Implementation Status

| Component | Status | File | Notes |
|-----------|--------|------|-------|
| Pattern-dev skill | ✅ Enhanced | `.claude/skills/pattern-dev/SKILL.md` | Intent detection added |
| Guide-gen skill | ✅ New | `.claude/skills/guide-gen/SKILL.md` | Created Nov 3, 2025 |
| Pattern generator | ✅ Existing | `scripts/ai-pattern-generator.js` | Works with enhanced skill |
| Guide generator | ✅ New | `scripts/ai-guide-generator.js` | Created Nov 3, 2025 |
| Agent orchestrator | ✅ Updated | `scripts/agent-orchestrator.js` | Guide support added |
| NPM scripts | ✅ Added | `package.json` (lines 28-31) | 4 guide commands |
| CLAUDE.md | ✅ Updated | `CLAUDE.md` (lines 109-171) | Automation docs added |
| Documentation | ✅ Complete | `.claude/` | 4 doc files created |

---

## 📞 Need Help?

**Quick question?** → Check the relevant skill file
**How do I...?** → Check AUTOMATION-SETUP.md
**Where is...?** → Use this DOCUMENTATION-MAP.md
**Not working?** → Check README.md FAQ section

---

**Documentation Version**: 1.0
**Created**: Nov 3, 2025
**Automation System**: Fully Implemented ✅
