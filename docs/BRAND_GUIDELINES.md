# Brand Design System Guidelines

**Last Updated:** November 11, 2025
**Status:** Active - Enforced on all commits via pre-commit hooks

---

## Overview

This document defines the brand design system for **AIUX Design Guide** – a Next.js application showcasing AI design patterns. Our design system ensures visual consistency, accessibility compliance, and brand integrity across the entire application.

**Key Principles:**
- **Accessible:** WCAG AA compliant color contrasts and semantic HTML
- **Minimalist:** Neutral color palette with intentional accent colors
- **Dark-Mode Ready:** First-class support for both light and dark themes
- **Component-First:** All UI built with reusable design system components
- **Token-Based:** No hardcoded colors – use design tokens exclusively

---

## Color System

### Primary Colors

#### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|--------|
| `text-primary` | #0d0d0d | #fafafa | Body text, primary content |
| `text-secondary` | #525252 | #a3a3a3 | Secondary content, descriptions |
| `text-tertiary` | #737373 | #737373 | Tertiary content, metadata |
| `text-disabled` | #a3a3a3 | #525252 | Disabled states, placeholder text |

#### Background Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|--------|
| `background-primary` | #ffffff | #0f0f0f | Page background |
| `background-secondary` | #fafafa | #171717 | Secondary sections |
| `background-tertiary` | #f5f5f5 | #1f1f1f | Tertiary backgrounds, hover states |

#### Surface Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|--------|
| `surface-primary` | #ffffff | #0f0f0f | Cards, containers |
| `surface-secondary` | #f9f9f9 | #171717 | Nested containers |
| `surface-elevated` | #ffffff | #1f1f1f | Modals, popovers, floating elements |

### Border Colors

#### Structural Borders

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|--------|
| `border-primary` | #f9f9f9 | #262626 | Main component borders |
| `border-secondary` | #f3f3f3 | #404040 | Subtle dividers |
| `border-focus` | #525252 | #737373 | Focus states, interactive elements |

#### Semantic State Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|--------|
| `border-success` | #10b981 | #059669 | Success states, validated inputs |
| `border-error` | #ef4444 | #dc2626 | Error states, validation failures |
| `border-warning` | #f59e0b | #d97706 | Warning states, alerts |
| `border-info` | #3b82f6 | #1d4ed8 | Info states, helpful hints |

#### Interactive States

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|--------|
| `border-interactive` | #3b82f6 | #1d4ed8 | Active interactive elements |
| `border-interactive-hover` | #2563eb | #2563eb | Hover state for interactive elements |
| `border-selected` | #3b82f6 | #1d4ed8 | Selected elements, active tabs |
| `border-disabled` | #d1d5db | #525252 | Disabled interactive elements |

### Category Colors (For Pattern Icons)

Used for visual differentiation of AI design pattern categories. Always use as accent colors, never for primary text.

```
blue       → #3B82F6
purple     → #8B5CF6
amber      → #F59E0B
teal       → #14B8A6
indigo     → #6366F1
green      → #10B981
rose       → #F43F5E
orange     → #F97316
cyan       → #06B6D4
emerald    → #059669
violet     → #7C3AED
pink       → #EC4899
slate      → #64748B
neutral    → #6B7280
```

### Semantic Colors

For states and feedback:
- **Success:** #10b981 (green) – Positive actions, confirmations
- **Error:** #ef4444 (red) – Errors, destructive actions, validation failures
- **Warning:** #f59e0b (amber) – Warnings, cautions, potential issues
- **Info:** #3b82f6 (blue) – Informational, helpful hints

---

## Typography

### Font Family

- **Primary Font:** Inter (via CSS variable `--font-inter`)
- **Fallback:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`
- **Implementation:** Font loaded via Next.js `next/font`

### Typography Scale

Use Tailwind's default font size scale. No custom font sizes outside of this system.

| Scale | Size | Usage |
|-------|------|--------|
| `text-xs` | 0.75rem | Labels, captions, metadata |
| `text-sm` | 0.875rem | Secondary text, helper text |
| `text-base` | 1rem | Body text, default |
| `text-lg` | 1.125rem | Large body text, card titles |
| `text-xl` | 1.25rem | Section headings |
| `text-2xl` | 1.5rem | Page headings |
| `text-3xl` | 1.875rem | Major headings |
| `text-4xl` | 2.25rem | Hero/page titles |

### Font Weights

- **Regular (400):** Body text, default
- **Medium (500):** Slightly emphasized text
- **Semibold (600):** Button text, card titles
- **Bold (700):** Headings, strong emphasis

### Line Heights

Use Tailwind's default line height scale:
- `leading-tight` (1.25) – Headings
- `leading-normal` (1.5) – Body text
- `leading-relaxed` (1.625) – Descriptions

---

## Spacing System

All spacing must use Tailwind's default spacing scale. No arbitrary pixel values.

| Scale | Value | Usage |
|-------|-------|--------|
| `p-3` | 0.75rem | Small padding |
| `p-4` | 1rem | Default padding |
| `p-5` | 1.25rem | Card padding |
| `p-6` | 1.5rem | Larger padding |
| `gap-3` | 0.75rem | Small gaps |
| `gap-4` | 1rem | Default gaps |
| `gap-6` | 1.5rem | Larger gaps |
| `space-y-4` | 1rem | Vertical spacing |
| `space-y-6` | 1.5rem | Larger vertical spacing |

**Critical Rule:** Do NOT use arbitrary spacing like `p-[13px]` or `mt-[23px]`. Always use the standard scale.

---

## Component Patterns

### Buttons

All buttons must use the `Button` component from the design system. No inline button styling.

#### Primary Button (Filled - Brand Black)
```tsx
import Button from '@/components/ui/Button'

<Button variant="primary">
  Get Started
</Button>
```
- **Background:** Brand black (`accent-primary`)
- **Text:** White/Light (`background-primary`)
- **Hover:** Darker black (`accent-hover`)
- **Use case:** Main CTAs, primary actions

#### Secondary Button (Border - Brand Black)
```tsx
<Button variant="secondary">
  Learn More
</Button>
```
- **Border:** Brand black (`accent-primary`) 2px
- **Background:** Light (`surface-primary`)
- **Text:** Brand black (`accent-primary`)
- **Hover:** Light fill (`accent-subtle`)
- **Use case:** Secondary actions, alternatives to primary

#### Outline Button (Subtle Border)
```tsx
<Button variant="outline">
  Cancel
</Button>
```
- **Border:** Light border (`border-primary`)
- **Background:** Light (`surface-primary`)
- **Text:** Primary text (`text-primary`)
- **Hover:** Light gray background (`background-secondary`)
- **Use case:** Tertiary actions, cancel buttons

#### Sizes
```tsx
<Button size="sm">Small</Button>      {/* px-4 py-2 */}
<Button size="md">Medium</Button>    {/* px-6 py-3 (default) */}
<Button size="lg">Large</Button>     {/* px-8 py-4 */}
```

#### Other Features
```tsx
<Button fullWidth>Full Width Button</Button>
<Button disabled>Disabled Button</Button>
<Button className="custom-class">Custom Styling</Button>
```

### Cards

**Standard Pattern:**
```tsx
className="rounded-xl p-5 bg-surface-primary border border-border-primary shadow-sm hover:shadow-md transition-shadow"
```

- **Rounded:** Always `rounded-xl` (16px)
- **Padding:** `p-5` (1.25rem) standard
- **Border:** `border border-border-primary`
- **Shadow:** `shadow-sm` default, `shadow-md` on hover
- **Background:** `bg-surface-primary`

### Search Bars

All search inputs must use the `UnifiedSearchBar` component. No custom inline search inputs.

**Correct:**
```tsx
import UnifiedSearchBar from '@/components/ui/UnifiedSearchBar'

<UnifiedSearchBar
  placeholder="Search patterns..."
  value={searchQuery}
  onChange={setSearchQuery}
  size="md"
/>
```

**Features:**
- Uses all design tokens (colors, spacing, focus states)
- Supports loading state
- Automatic clear button
- Keyboard navigation (Enter to submit, Escape to clear)
- Consistent focus rings and transitions
- Dark mode support built-in
- Three sizes: `sm`, `md`, `lg`

**Incorrect:**
```tsx
// ❌ DON'T: Custom inline input
<input
  type="text"
  placeholder="Search..."
  className="..."
/>
```

### Typography Components

**Headings:**
- H1: `text-4xl font-bold text-text-primary`
- H2: `text-3xl font-bold text-text-primary`
- H3: `text-2xl font-semibold text-text-primary`
- H4: `text-xl font-semibold text-text-primary`

**Body Text:**
- Default: `text-base text-text-primary`
- Secondary: `text-sm text-text-secondary`
- Tertiary: `text-xs text-text-tertiary`

---

## Validation Rules

**Important:** The brand validator checks **new code being committed** against these rules. It prevents new violations from being introduced, not re-validating existing code. Once a component is built and committed, it's not repeatedly validated on future commits.

### Critical Rules (Commits Blocked)

These violations **BLOCK commits**. They represent brand-breaking violations.

#### 1. Hardcoded Colors
❌ **Forbidden:**
```tsx
className="text-[#ff0000]"        // Hardcoded hex
style={{ color: "#ff0000" }}      // Inline styles with colors
className="text-red-600"          // Direct Tailwind color, not token
```

✅ **Correct:**
```tsx
className="text-error"            // Using design token
className="text-text-primary"     // Using semantic token
```

**Fix Command:** `npm run brand:fix` auto-fixes these

#### 2. Arbitrary Spacing
❌ **Forbidden:**
```tsx
className="p-[13px]"              // Arbitrary padding
className="mt-[23px]"             // Arbitrary margin
className="gap-[17px]"            // Arbitrary gap
```

✅ **Correct:**
```tsx
className="p-4"                   // Standard scale
className="mt-6"                  // Standard scale
className="gap-4"                 // Standard scale
```

#### 3. Non-Design-System Components
❌ **Forbidden:**
```tsx
// Custom component not in design system
<MyCustomButton />

// Direct HTML instead of design system component
<button className="...">Click</button>
```

✅ **Correct:**
```tsx
// Import from design system
import { Button } from '@/components/ui/button'
<Button>Click</Button>
```

### Minor Rules (Warnings Only)

These violations **emit warnings** but do NOT block commits. Helpful guidance for developers.

#### 1. Dark Mode Variants
⚠️ **Warning:** Component doesn't have dark mode styling
```tsx
// Light mode only
className="bg-white text-black"
```

✅ **Better:** Includes dark mode
```tsx
className="bg-white dark:bg-slate-950 text-black dark:text-white"
```

#### 2. Inconsistent Typography
⚠️ **Warning:** Using non-standard font sizes
```tsx
className="text-[1.1rem]"         // Arbitrary size
```

✅ **Better:** Uses standard scale
```tsx
className="text-lg"               // Standard size
```

#### 3. Missing Accessibility
⚠️ **Warning:** Missing alt text, aria labels
```tsx
<img src="image.png" />            // No alt text
<button>Click</button>             // No accessible label
```

✅ **Better:** Complete accessibility
```tsx
<img src="image.png" alt="Description" />
<button aria-label="Close dialog">×</button>
```

---

## Implementation Guide

### Using Design Tokens in Your Code

#### CSS/Tailwind
```tsx
// Text colors
className="text-text-primary"
className="text-text-secondary"
className="text-error"

// Background colors
className="bg-background-primary"
className="bg-background-secondary"

// Border colors
className="border border-border-primary"
className="border-border-error"

// Surface colors
className="bg-surface-primary"

// Category colors (for icons/accents)
className="text-category-blue"
className="bg-category-purple"
```

#### CSS Variables (Advanced)
```css
.custom-element {
  color: var(--text-primary);
  background: var(--background-primary);
  border: 1px solid var(--border-primary);
}
```

### Component Usage Examples

#### Card Example
```tsx
<div className="rounded-xl p-5 bg-surface-primary border border-border-primary shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-xl font-semibold text-text-primary">Card Title</h3>
  <p className="text-sm text-text-secondary mt-2">Card description</p>
</div>
```

#### Button Group Example
```tsx
<div className="flex gap-4">
  <button className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover">
    Primary
  </button>
  <button className="px-4 py-2 border border-border-primary rounded-lg hover:bg-background-tertiary">
    Secondary
  </button>
</div>
```

---

## Dark Mode

### Implementation

Dark mode is automatically enabled based on `prefers-color-scheme`. CSS variables automatically switch values.

**No custom logic needed** – Tailwind handles this with `dark:` prefix for additional overrides.

```tsx
// Tailwind dark mode prefix
className="bg-white dark:bg-slate-950"
className="text-black dark:text-white"

// CSS variables (already handle light/dark)
color: var(--text-primary)        // Auto-switches based on theme
```

---

## Validation & Enforcement

### Pre-Commit Validation

Every commit is automatically validated:

1. **Critical violations** → Commit blocked, must be fixed
2. **Minor violations** → Warnings shown, commit allowed with acknowledgment

### Manual Validation

```bash
# Check current changes
npm run brand:check

# Check and fix violations
npm run brand:fix

# Full codebase audit
npm run brand:check:all
```

### Fixing Violations

When brand violations are detected:

```bash
# Auto-fix automatically fixable violations
npm run brand:fix

# Manually view violations
npm run brand:check
```

---

## What Gets Validated vs. Best Practices

### Actively Validated (Git Hook)

These rules are enforced on **new code being committed**:

- ✅ **Hardcoded colors** - Must use design tokens
- ✅ **Arbitrary spacing** - Must use standard scale
- ⚠️ **Missing dark mode** - Warning only
- ⚠️ **Missing accessibility** - Warning only

### Best Practices (Not Enforced)

These are recommended but not validated in the pre-commit hook:

- 🎨 Use the **Button component** for all buttons (recommended)
- 🎨 Use the **UnifiedSearchBar** for search inputs (recommended)
- 🎨 Use predefined **Card patterns** (recommended)

Why? Once a component is built correctly the first time, it doesn't need to be re-validated on every future commit. The validator focuses on preventing NEW violations from being introduced.

## Exceptions

Exceptions to critical rules must be:
1. **Approved by design lead**
2. **Documented with comment:** `// BRAND EXCEPTION: reason why`
3. **Logged in design decisions document**

Example:
```tsx
// BRAND EXCEPTION: Custom animation requires #ff6b6b for visual effect
// Approved by: design team, Date: 2025-11-11
<div style={{ color: "#ff6b6b" }} />
```

---

## Resources

- **Design Tokens:** `src/app/globals.css` (CSS variables)
- **Tailwind Config:** `tailwind.config.mjs`
- **Component Library:** `src/components/ui/`
- **Examples:** Look at existing pattern pages for implementation examples

---

## Questions & Updates

For questions about the brand system:
1. Check this guidelines document
2. Review similar existing components
3. Ask in #design-systems Slack channel
4. Create an issue on GitHub with the `brand-system` label

To update brand guidelines:
1. Create a PR with changes to this file
2. Get approval from design lead
3. Run `npm run brand:validate` to update validators
4. All future commits will enforce new rules

---

**Last Updated by:** Claude Code (Brand System Implementation)
**Next Review:** Monthly (every 30 days)
