# Design Audit Skill

Identifies design system inconsistencies, hardcoded colors, and design token violations across your codebase.

## Overview

This skill scans your components and validates that colors follow your design system (tailwind.config.mjs). It surfaces hardcoded colors, identifies where design tokens should be used, and flags known rendering issues.

## Capabilities

### 1. Color Scanning
- Identifies all hardcoded Tailwind color utilities (bg-, text-, border-, etc.)
- Detects custom color tokens that may not be rendering properly
- Maps hardcoded colors to their nearest design token equivalents

### 2. Design Token Validation
- Compares hardcoded colors against your tailwind.config.mjs design tokens
- Identifies when standard Tailwind colors are used instead of design system tokens
- Flags rendering inconsistencies in custom tokens

### 3. Violation Reporting
- Generates detailed violation reports with file locations and line numbers
- Suggests which design token should be used instead of hardcoded values
- Marks known issues (like category colors with rendering problems)

### 4. Issue Classification
- **Direct Match**: Hardcoded color has a design token equivalent that should be used
- **No Token**: Hardcoded color has no design token alternative
- **Known Issue**: Design token exists but has documented rendering problems
- **Warning**: Color choice inconsistent with design system patterns

## Usage

### Run Design Audit
```bash
npm run design-audit
```

Outputs a comprehensive report of all color inconsistencies and design system violations.

### Run with Specific Path
```bash
npm run design-audit -- src/components/ui
```

Audit only components in the specified directory.

### Show Only Violations
```bash
npm run design-audit -- --strict
```

Only show actual violations (exclude informational items).

### Auto-Fix Simple Cases (Interactive)
```bash
npm run design-audit -- --fix
```

Suggests automatic fixes for identified violations and applies them interactively.

## Design System Reference

### Design Tokens Defined
- **Background Colors**: primary, secondary, tertiary
- **Surface Colors**: primary, secondary, elevated
- **Text Colors**: primary, secondary, tertiary, disabled
- **Accent Colors**: primary, hover, subtle
- **Category Colors**: blue, purple, amber, teal, indigo, green, rose, orange, cyan, emerald, violet, pink, slate, neutral
- **Border Colors**: primary, secondary, focus, success, error, warning, info, interactive, selected, disabled
- **Ring Colors**: focus, focus-error, focus-success, focus-warning

### Known Rendering Issues
- ⚠️ **Custom namespaced colors** (e.g., `text-background-primary`) don't cross-communicate in Tailwind's namespace system
- ⚠️ **Category colors** render inconsistently with opacity/styling
- ✅ **Standard Tailwind colors** (black, white, red-600, yellow-300, etc.) render reliably

## Examples

### Example Violation
```
✗ src/components/examples/SessionDegradationDemo.tsx:170
  Line: <div className="bg-category-rose p-4 rounded-lg text-white...">

  Hardcoded: bg-category-rose
  Should Use: bg-red-600 (design token has rendering issues)
  Status: ⚠️  Known issue - custom color doesn't render reliably

  Fix: Change to bg-red-600 text-white
```

### Example Valid Use
```
✓ src/components/ui/Button.tsx:33
  Line: primary: 'bg-black text-white hover:bg-gray-800 active:opacity-90'

  Hardcoded: bg-black, text-white, bg-gray-800
  Status: ✓ Correct - uses reliable standard Tailwind colors
  Note: accent-primary token has rendering issues, explicit colors appropriate here
```

## Integration

The design audit can be integrated into:
- **Pre-commit hooks**: Prevent commits with design violations
- **CI/CD pipelines**: Fail builds if design violations found
- **Progress agent**: Track design system compliance as quality metric
- **Regular audits**: Run periodically to maintain consistency

## When to Use

- **During development**: Run after making styling changes
- **Before commits**: Validate design system compliance
- **Code reviews**: Check that new components follow design patterns
- **Refactoring**: Identify all places that need updating when design system changes
