# Design System Enforcement

## Overview

Your project now has **automatic design system compliance checks** that run on every commit via Git pre-commit hooks.

## How It Works

### Automatic Pre-Commit Hook

When you run `git commit`, the following validations run automatically:

1. **Brand Design System Validation** - Ensures brand guidelines are followed
2. **Design System Audit (New Code Only)** - Scans only staged/new files for design violations

**Key Difference**: The audit only checks **new code** being committed, not the existing codebase. This allows:
- ✅ Existing code with design issues to remain as-is
- ✅ New code to be held to a stricter standard
- ❌ New code with design violations to be blocked from committing

## What Gets Checked

### Design System Audit (.husky/pre-commit)

The design audit automatically scans **only new code** and checks for:

- **Hardcoded custom design tokens** - Colors that don't render properly
- **Design token violations** - Using custom tokens instead of reliable Tailwind colors
- **Color reliability** - Ensures new code uses the reliable color set (bg-black, text-white, etc.)

Example output during commit:
```
🎨 Auditing new code for design violations...

✅ Design audit passed!
```

Or if violations are found:
```
🎨 Auditing new code for design violations...

⚠️  Violations (2)

  src/components/NewFeature.tsx:15
    Color: bg-category-rose
    Issue: Design token has rendering issues - use text-white or text-black
    Code: <div className="bg-category-rose text-white">

  src/components/NewFeature.tsx:22
    Color: text-background-primary
    Issue: Cross-namespace color not supported by Tailwind
    Code: <span className="text-background-primary">

❌ Design violations detected in new code!

Fix the violations above and try committing again.
```

### Compliance Rules

**New Code (Staged Files):**
- ❌ Design violations **block commits** - Strict enforcement
- ✅ Violations must be fixed before commit succeeds

**Existing Code:**
- ✅ Not affected by pre-commit checks
- ✅ Violations remain as-is (use `npm run design-audit` to see them)

## Running Design Audit Manually

### Full Audit
```bash
npm run design-audit
```

Shows all colors found, organized by severity:
- **Warnings**: Design tokens with known rendering issues
- **Info**: Hardcoded colors that could use tokens

### Strict Mode (Only Violations)
```bash
npm run design-audit -- --strict
```

Only shows actual design system violations.

### Audit Specific Directory
```bash
npm run design-audit src/components/ui
```

## Understanding the Report

The audit report shows three metrics:

```
📊 Summary
  Design Compliance: 27%
    ↳ Percentage of colors using reliable standard Tailwind colors

  Valid Colors: 1615
    ↳ Colors using reliable standard Tailwind utilities (bg-black, text-white, etc.)

  Warnings: 1589
    ↳ Design tokens with known rendering issues or design system violations

  Info Items: 2787
    ↳ Hardcoded colors that could use design tokens (informational)
```

## Known Design System Issues

Your audit revealed that custom namespaced design tokens don't render reliably:

- ❌ `text-background-primary` - Cross-namespace colors don't work (Tailwind limitation)
- ❌ `bg-category-rose` - Custom category colors have rendering issues
- ✅ Standard Tailwind colors work reliably (bg-black, bg-red-600, text-white, etc.)

## Making Commits

### Normal Workflow

```bash
# Make your changes
# ... edit files ...

# Stage your changes
git add .

# Commit (pre-commit hook runs automatically)
git commit -m "Your message"

# If new code has design violations → commit blocked ❌
# If new code is clean → commit succeeds ✅
```

### If Commit is Blocked

The pre-commit hook shows exactly which violations exist:

```
❌ Commit blocked: New code has design system violations

src/components/MyComponent.tsx:10
  Color: bg-category-rose
  Issue: Design token has rendering issues - use text-white or text-black
  Code: <div className="bg-category-rose">

Fix the violations above and try committing again.
```

**To fix:**
1. Open the file mentioned (src/components/MyComponent.tsx)
2. Replace the problematic color with a reliable one
3. Commit again

Example fix:
```tsx
// Before (blocked)
<div className="bg-category-rose text-white">

// After (allowed)
<div className="bg-red-600 text-white">
```

### Checking Staged Files Only

To see what would be blocked in your next commit:

```bash
npm run design-audit -- --staged
```

This shows only NEW code being staged, not the entire codebase.

### Bypassing the Hook (Not Recommended)

If you need to bypass for emergency fixes:
```bash
git commit --no-verify
# ⚠️  Use sparingly - defeats quality checks
```

## Improving Design Compliance

To increase your design compliance percentage:

1. **Replace problematic tokens** with reliable standard Tailwind colors
   - Instead of: `bg-category-rose text-white`
   - Use: `bg-red-600 text-white`

2. **Document design token issues** to understand where fixes are needed
   - Run: `npm run design-audit`
   - Review warnings in files like SessionDegradationDemo.tsx

3. **Track compliance over time**
   - Design compliance should gradually increase as you fix violations
   - Current: 27% → Target: 50%+ → Goal: 80%+

## Integration with CI/CD

The design audit can be integrated into your CI/CD pipeline:

```bash
# In GitHub Actions / GitLab CI / etc.
npm run design-audit -- --strict
```

This ensures no design violations merge into main.

## Configuration

### Modify Pre-Commit Behavior

The current setup checks **staged files only** and is **strict** about new code.

To change the behavior, edit `.husky/pre-commit`:

**Current (Strict for New Code):**
```bash
npm run design-audit -- --staged
# Exits with code 1 if violations found → blocks commit
```

**More Lenient (Allow Staged Violations):**
```bash
npm run design-audit -- --staged || true
# Always allows commit, just shows warnings
```

**Full Codebase Check (Less Common):**
```bash
npm run design-audit -- --strict
# Checks entire codebase, blocks on violations
```

## Files Changed

- **`.scripts/design-audit.js`** - Design audit script
- **`.claude/skills/design-audit/SKILL.md`** - Skill documentation
- **`.husky/pre-commit`** - Updated pre-commit hook (added design audit)
- **This file** - Documentation

## Next Steps

1. ✅ Design audit is now running on every commit
2. ⚠️ Review warnings in `npm run design-audit` output
3. 🔧 Fix critical issues where design tokens fail
4. 📊 Track compliance improvements over time
5. 🎨 Eventually establish design token standards that actually work

## Questions?

See the full skill documentation:
```bash
cat .claude/skills/design-audit/SKILL.md
```
