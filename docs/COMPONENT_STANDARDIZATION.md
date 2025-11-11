# Component Standardization Guide

**Last Updated:** November 11, 2025  
**Status:** Active - Standardized components available and documented

---

## Overview

Your component library has been standardized to use brand design tokens exclusively. This guide covers the standardized components and how to use them.

---

## Standardized Components

### 1. UnifiedSearchBar ✅

**Status:** All 3 pages updated (Patterns, Guides, Simulator)

```tsx
import UnifiedSearchBar from '@/components/ui/UnifiedSearchBar'

<UnifiedSearchBar
  placeholder="Search patterns..."
  value={searchQuery}
  onChange={setSearchQuery}
  size="md"           // 'sm' | 'md' | 'lg'
  isLoading={false}
  disabled={false}
/>
```

**Features:**
- Uses design tokens exclusively (no hardcoded colors)
- Automatic clear button
- Loading state indicator
- Dark mode support
- Keyboard navigation

**Where it's used:**
- Homepage pattern search
- Guides page course search
- Simulator scenario search

---

### 2. Button Component ✅

**Status:** Redesigned with brand colors

```tsx
import Button from '@/components/ui/Button'

// Primary: Filled brand black
<Button variant="primary">Get Started</Button>

// Secondary: Black border
<Button variant="secondary">Learn More</Button>

// Outline: Subtle border
<Button variant="outline">Cancel</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Design:**
- **Primary Button**
  - Background: Brand black (`accent-primary` #0d0d0d)
  - Text: White/Light (`background-primary`)
  - Hover: Darker black (`accent-hover`)
  - Use case: Main CTAs, primary actions

- **Secondary Button**
  - Border: 2px brand black (`accent-primary`)
  - Background: Light (`surface-primary`)
  - Text: Brand black (`accent-primary`)
  - Hover: Light fill (`accent-subtle`)
  - Use case: Secondary actions, alternatives

- **Outline Button**
  - Border: Light (`border-primary`)
  - Background: Light (`surface-primary`)
  - Text: Primary text (`text-primary`)
  - Hover: Light gray (`background-secondary`)
  - Use case: Tertiary actions, cancel buttons

**Features:**
- Uses design tokens (no hardcoded colors)
- Proper focus and hover states
- Disabled state support
- Dark mode support
- Three sizes: sm, md, lg
- Full width option

---

## Design Token System

All components use these brand design tokens:

### Neutral/Black (Brand Primary)
```
accent-primary:    #0d0d0d (light) / #fafafa (dark)
accent-hover:      #262626 (light) / #e5e5e5 (dark)
accent-subtle:     #f5f5f5 (light) / #171717 (dark)
```

### Text Colors
```
text-primary:      #0d0d0d (light) / #fafafa (dark)
text-secondary:    #525252 (light) / #a3a3a3 (dark)
text-tertiary:     #737373
text-disabled:     #a3a3a3 (light) / #525252 (dark)
```

### Surfaces
```
surface-primary:   #ffffff (light) / #0f0f0f (dark)
surface-secondary: #f9f9f9 (light) / #171717 (dark)
surface-elevated:  #ffffff (light) / #1f1f1f (dark)
```

### Borders
```
border-primary:    #f9f9f9 (light) / #262626 (dark)
border-secondary:  #f3f3f3 (light) / #404040 (dark)
border-focus:      #525252 (light) / #737373 (dark)
```

### State Colors
```
Success:  #10b981
Error:    #ef4444
Warning:  #f59e0b
Info:     #3b82f6
```

---

## Brand Validator

The brand validator checks **new code on commit** for:

### Critical (Blocks Commits)
- ❌ Hardcoded colors (e.g., `#ff0000` instead of `text-error`)
- ❌ Arbitrary spacing (e.g., `p-[13px]` instead of `p-4`)

### Warnings (Shows but Allows Commit)
- ⚠️ Missing dark mode support
- ⚠️ Missing accessibility (alt text, aria labels)

### Not Validated (Best Practices Only)
- 🎨 Button component usage (recommended)
- 🎨 UnifiedSearchBar usage (recommended)
- 🎨 Card patterns (recommended)

**Why?** Once a component is built correctly, it doesn't need re-validation on every commit. The validator prevents NEW violations from being introduced.

---

## Quick Reference: Brand Colors

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `accent-primary` | #0d0d0d | #fafafa | Brand black, buttons, text |
| `text-primary` | #0d0d0d | #fafafa | Body text |
| `text-secondary` | #525252 | #a3a3a3 | Secondary text |
| `surface-primary` | #ffffff | #0f0f0f | Card backgrounds |
| `border-primary` | #f9f9f9 | #262626 | Component borders |
| `error` | #ef4444 | #dc2626 | Error states |
| `success` | #10b981 | #059669 | Success states |

---

## Usage Checklist

When building new components:

- [ ] Use only design tokens (no hardcoded colors like `#fff` or `blue-600`)
- [ ] Use standard spacing scale (p-4, gap-6, not p-[13px])
- [ ] Include dark mode support (CSS variables handle it automatically)
- [ ] Use Button component for buttons
- [ ] Use UnifiedSearchBar for search inputs
- [ ] Include proper accessibility (alt text, aria labels)
- [ ] Add focus states (automatic with design tokens)

---

## Files to Reference

| File | Purpose |
|------|---------|
| `src/components/ui/Button.tsx` | Button component |
| `src/components/ui/UnifiedSearchBar.tsx` | Search input component |
| `src/app/globals.css` | Design tokens (CSS variables) |
| `tailwind.config.mjs` | Extended Tailwind colors |
| `docs/BRAND_GUIDELINES.md` | Complete brand rules |
| `docs/BRAND_SYSTEM_DEVELOPER_GUIDE.md` | Developer examples |
| `scripts/brand-validator.js` | Validation rules |

---

## Common Patterns

### Primary CTA (Call-to-Action)
```tsx
<Button variant="primary" size="lg">
  Get Started
</Button>
```

### Secondary Action
```tsx
<Button variant="secondary">
  Learn More
</Button>
```

### Cancel/Close
```tsx
<Button variant="outline">
  Cancel
</Button>
```

### Search Form
```tsx
<UnifiedSearchBar
  placeholder="Search..."
  value={query}
  onChange={setQuery}
/>
```

### Card with Button
```tsx
<div className="rounded-xl p-5 bg-surface-primary border border-border-primary">
  <h3 className="text-lg font-semibold text-text-primary">Card Title</h3>
  <p className="text-sm text-text-secondary mt-2">Description</p>
  <Button variant="primary" className="mt-4">
    Action
  </Button>
</div>
```

---

## Summary

✅ **Search Bars:** Unified component across 3 pages  
✅ **Buttons:** Standardized with brand black design  
✅ **Colors:** All design tokens, no hardcoded colors  
✅ **Validation:** Prevents NEW violations on commit  
✅ **Documentation:** Complete guidelines and examples  

Your brand is now protected and standardized! 🎨
