# 🎨 AIUX Brand Color Enforcement

Your personal brand color guardian! This skill ensures every component, button, and color stays true to the black & white AIUX brand palette.

## Quick Start

### Invoke the Skill
```
/brand-colors check src/components/MyComponent.tsx
```

The skill will scan your file and report any brand color violations with suggestions.

---

## What You Get

✅ **Approved Color Palette** - Black, white, grays, blue (interactive only)
✅ **Violation Detection** - Finds gradients, purple, colorful buttons, etc.
✅ **Auto-Fix Suggestions** - Know exactly what to replace
✅ **Real Examples** - See violations side-by-side with corrections
✅ **Component Patterns** - Learn how to build brand-compliant components

---

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | Full skill documentation & usage guide |
| `COLOR-MAPPING.md` | Detailed violation → fix mappings |
| `README.md` | You're reading it! |

---

## How to Use During Development

### ✨ As You Build Components

```
You: "I just created a new button component"
→ /brand-colors check src/components/Button.tsx
← Skill: "Found 2 violations: bg-gradient-to-r and text-white"
You: "Fix them"
← Shows correct code examples
You: Update component and move on
```

### 🔍 Before Committing

```
/brand-colors check src/components/
```

Ensures all new/modified components are brand-compliant.

### 📊 Full Codebase Audit

```
/brand-colors report
```

Gets a complete compliance score and sees where violations are most common.

---

## Brand Color Philosophy

Your brand is intentionally **minimalist**:

- **Black & white** = high contrast, professional, accessible
- **No gradients** = clean, modern aesthetic
- **No colors** = focus on content, not decoration
- **Blue only for interactive** = reserved for focus rings, links
- **Semantic colors** = only for status (green/success, red/error, amber/warning)

This is **WCAG AAA compliant** and works across all contexts. ✨

---

## Common Questions

### Q: Can I use other colors?
**A:** Only these:
- Black `#0d0d0d`, white `#ffffff`, grays
- Blue `#3b82f6` (interactive/focus only)
- Green `#10b981` (success only)
- Red `#ef4444` (error only)
- Amber `#f59e0b` (warning only)

### Q: What if I need a different color?
**A:** Ask the skill! It'll help you decide if you really need it or if a brand color works better.

### Q: Can I auto-fix violations?
**A:** Yes! Use `/brand-colors fix src/components/` to auto-replace common violations.

### Q: How do I know if I'm compliant?
**A:** Use `/brand-colors check` - green = good, red = violation.

---

## Next Steps

1. **Review** `SKILL.md` for full command reference
2. **Check** `COLOR-MAPPING.md` for common fixes
3. **Use** `/brand-colors check` on your work
4. **Learn** from the examples and build habit

---

## Integration with Your Workflow

### When building the 6-pattern handbook:
- Use `/brand-colors check` on each new component
- Ensure all marketing text uses brand colors
- Check PDF generation colors
- Verify email templates are compliant

### When creating new features:
- Always run check before committing
- Use brand colors as default choice
- Ask skill if uncertain about any color

### When refactoring:
- `/brand-colors report` shows compliance score
- Prioritize critical violations first
- Auto-fix for bulk changes

---

## Your Brand DNA

**Remember:** Black & white isn't limitation—it's **clarity**. Every pixel should serve content, not distract. Your brand says: *"We believe in clear, honest, accessible AI design."*

That's powerful. Keep it pure. 🖤

---

## Next Command

Ready? Try:
```
/brand-colors help
```

Or jump straight in:
```
/brand-colors check src/components/lead-magnet/HandbookModal.tsx
```

Let's make sure everything looks on-brand! 🎨
