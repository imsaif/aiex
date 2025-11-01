# Border Standardization Guide

This guide standardizes all border usage across the application, ensuring consistency, accessibility, and maintainability.

## Design Tokens Overview

All borders should use design tokens instead of hardcoded colors. This ensures:
- ✅ Automatic dark mode support
- ✅ Single source of truth for colors
- ✅ Easy theme updates
- ✅ Consistent user experience

## Border Tokens

### Structural Borders (Default Usage)

These tokens define the basic border structure of components:

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-border-primary` | `#e5e5e5` | `#262626` | Default border for all containers, cards, inputs |
| `border-border-secondary` | `#d4d4d4` | `#404040` | Hover state for interactive elements |
| `border-border-focus` | `#525252` | `#737373` | Focus state when using border color change |
| `border-border-disabled` | `#d1d5db` | `#525252` | Disabled state elements |

### Semantic State Borders

Use these tokens when indicating specific states:

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-border-success` | `#10b981` | `#059669` | Success messages, valid states |
| `border-border-error` | `#ef4444` | `#dc2626` | Error messages, invalid states |
| `border-border-warning` | `#f59e0b` | `#d97706` | Warning messages, caution states |
| `border-border-info` | `#3b82f6` | `#1d4ed8` | Information messages, hints |

### Interactive State Borders

For components with interactive states:

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-border-interactive` | `#3b82f6` | `#1d4ed8` | Default interactive state |
| `border-border-interactive-hover` | `#2563eb` | `#2563eb` | Hover state for interactive elements |
| `border-border-selected` | `#3b82f6` | `#1d4ed8` | Selected/active state |

### Divider Tokens

For separators and dividers:

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-border-divider` | `#e5e5e5` | `#262626` | Standard horizontal/vertical dividers |
| `border-border-divider-subtle` | `#f3f4f6` | `#1f1f1f` | Subtle dividers for less emphasis |

### Focus Ring Tokens

For keyboard focus indicators:

| Token | Color | Usage |
|-------|-------|-------|
| `ring-focus` | `#3b82f6` / `#1d4ed8` | Standard focus ring (blue) |
| `ring-focus-error` | `#ef4444` / `#dc2626` | Error state focus ring |
| `ring-focus-success` | `#10b981` / `#059669` | Success state focus ring |
| `ring-focus-warning` | `#f59e0b` / `#d97706` | Warning state focus ring |

---

## Component Border Patterns

### Cards & Containers

**Standard card style:**
```tsx
// Default state
className="border border-border-primary"

// With hover effect (for clickable cards)
className="border border-border-primary hover:border-border-secondary transition-colors duration-200"

// Selected/active state
className="border-2 border-border-selected"
```

**Example Usage:**
```tsx
<div className="border border-border-primary rounded-lg p-4 hover:border-border-secondary transition-colors">
  Card content
</div>
```

---

### Input Fields

**Standard input pattern:**
```tsx
// Default state
className="border border-border-primary"

// Focus state (option 1: ring-based - PREFERRED)
className="border border-border-primary focus:ring-2 focus:ring-ring-focus"

// Focus state (option 2: border-based)
className="border border-border-primary focus:border-border-focus"

// Error state
className="border border-border-error focus:ring-2 focus:ring-ring-focus-error"

// Disabled state
className="border border-border-disabled text-text-disabled"
```

**Full example:**
```tsx
<input
  type="text"
  placeholder="Search..."
  className="border border-border-primary rounded-lg px-3 py-2
             hover:border-border-secondary
             focus:ring-2 focus:ring-ring-focus focus:border-transparent
             disabled:border-border-disabled disabled:bg-gray-100"
/>
```

**Rules:**
- Use `focus:ring-2` for keyboard accessibility (preferred)
- Set `focus:border-transparent` to avoid double borders
- Always include hover state for interactive inputs
- Use semantic tokens for error/disabled states

---

### Buttons (Outline Variant)

**Standard outline button:**
```tsx
// Default outline button
className="border border-border-primary text-text-primary hover:border-border-secondary"

// With focus state
className="border border-border-primary hover:border-border-secondary
           focus:ring-2 focus:ring-ring-focus"

// Primary outline (darker borders)
className="border-2 border-border-primary hover:border-border-focus"

// Error outline
className="border border-border-error text-border-error hover:border-red-600
           focus:ring-2 focus:ring-ring-focus-error"
```

---

### Alert/Notification Boxes

**Left accent border pattern (recommended):**
```tsx
// Success alert
className="border-l-4 border-border-success bg-green-50 p-4"

// Error alert
className="border-l-4 border-border-error bg-red-50 p-4"

// Warning alert
className="border-l-4 border-border-warning bg-yellow-50 p-4"

// Info alert
className="border-l-4 border-border-info bg-blue-50 p-4"
```

**Full border pattern (alternative):**
```tsx
// Full border success
className="border border-border-success bg-green-50 rounded-lg p-4"

// Full border error
className="border border-border-error bg-red-50 rounded-lg p-4"
```

**Rules:**
- Use left borders (4px) for compact alerts
- Use full borders only for prominent alerts
- Match background color to semantic state
- Never use hardcoded border colors for states

---

### Dividers & Separators

**Horizontal divider:**
```tsx
// Standard divider
className="border-t border-border-divider"

// Subtle divider
className="border-t border-border-divider-subtle"

// Full-width divider
<div className="border-t border-border-divider w-full" />
```

**Vertical divider:**
```tsx
// Standard vertical
className="border-l border-border-divider"

// In flex layouts
className="border-l border-border-divider mx-4"
```

---

### Checkboxes & Radio Buttons

**Standard checkbox:**
```tsx
// Default state (2px border for emphasis)
className="border-2 border-border-primary rounded group-hover:border-border-secondary"

// Checked state
className="border-2 border-border-selected bg-border-selected"

// Disabled state
className="border-2 border-border-disabled opacity-50"
```

---

### Tables (When Used)

**Table headers:**
```tsx
// Header cell
className="border-b-2 border-border-primary"

// Body cell
className="border-b border-border-divider"
```

**Full table:**
```tsx
// Row hover effect
className="border-b border-border-divider hover:bg-background-secondary transition-colors"
```

---

### Dropdowns & Menus

**Dropdown container:**
```tsx
// Default
className="border border-border-primary rounded-lg shadow-sm"

// Open state
className="border border-border-primary rounded-lg shadow-md ring-2 ring-ring-focus"

// Menu items
className="border-b border-border-divider-subtle"
```

---

### Modal Dialogs

**Modal body:**
```tsx
// Standard modal
className="border border-border-primary rounded-xl shadow-lg"

// Focus within
className="border border-border-primary focus-within:ring-2 focus-within:ring-ring-focus"
```

---

## Border Width Standards

Use these rules for border widths:

| Width | Token | Usage |
|-------|-------|-------|
| 1px | `border` (default) | Most borders: cards, inputs, dividers, containers |
| 2px | `border-2` | Emphasis states: checkboxes, selected items, primary buttons |
| 4px | `border-l-4` / `border-t-4` | Alert left accents, important separators |

**Rules:**
- Default to 1px for all structural borders
- Use 2px for interactive emphasis (checkboxes, selection)
- Use 4px only for alert left borders
- Never use arbitrary border widths

---

## Focus States Strategy

### Preferred Approach: Ring-Based

Use focus rings for all interactive elements (recommended by WCAG):

```tsx
// Standard focus
focus:ring-2 focus:ring-ring-focus

// With transparent border to prevent shift
focus:ring-2 focus:ring-ring-focus focus:border-transparent

// Error focus
focus:ring-2 focus:ring-ring-focus-error

// Success focus
focus:ring-2 focus:ring-ring-focus-success
```

### Alternative: Border-Based

Only use for specific design needs:

```tsx
// Border color change on focus
focus:border-border-focus focus:border-2

// Combined with ring
focus:border-border-focus focus:ring-2 focus:ring-ring-focus
```

---

## Hover States

All interactive elements should indicate hover state:

```tsx
// Standard hover
hover:border-border-secondary

// With background change
hover:border-border-secondary hover:bg-background-secondary

// For cards
hover:border-border-secondary hover:shadow-md transition-all duration-200
```

---

## Active/Selected States

Clear visual feedback for selected elements:

```tsx
// Selected border style
border-2 border-border-selected

// Selected with background
border-2 border-border-selected bg-blue-50

// Active menu item
border-l-4 border-border-selected pl-3
```

---

## Dark Mode Best Practices

All design tokens automatically support dark mode via CSS variables.

**What you should do:**
✅ Use design tokens like `border-border-primary`
✅ Use semantic tokens like `border-border-error`
✅ Set background colors that work with borders

**What to avoid:**
❌ Hardcoded color values like `border-gray-200`
❌ Manual dark mode variants like `dark:border-gray-700`
❌ Color values without dark mode alternatives

**Example of proper dark mode support:**
```tsx
// GOOD ✅
<div className="border border-border-primary hover:border-border-secondary
                 bg-background-primary">
  Automatically adapts to dark mode
</div>

// BAD ❌
<div className="border border-gray-200 hover:dark:border-gray-600
                 bg-white dark:bg-black">
  Manual dark mode management
</div>
```

---

## Common Patterns Reference

### Navigation Links with Underline
```tsx
className="border-b-2 border-border-transparent hover:border-border-secondary transition-colors"
```

### List Items with Dividers
```tsx
className="border-b border-border-divider last:border-b-0"
```

### Card Grid with Subtle Borders
```tsx
className="border border-border-divider-subtle rounded-lg hover:border-border-primary transition-colors"
```

### Input Group with Borders
```tsx
// Wrapper
className="border border-border-primary rounded-lg overflow-hidden flex"

// Individual inputs
className="border-r border-border-divider-subtle last:border-r-0 px-3 py-2 focus:ring-2 focus:ring-ring-focus"
```

### Floating Label with Border Bottom
```tsx
className="border-b-2 border-border-primary focus-within:border-border-focus transition-colors"
```

---

## Migration Checklist

When updating a component to use design tokens:

- [ ] Replace all hardcoded `border-gray-*` with `border-border-primary`
- [ ] Replace hover borders with `border-border-secondary`
- [ ] Update focus states to use `focus:ring-2 focus:ring-ring-focus`
- [ ] Add semantic tokens for error/success/warning states
- [ ] Test in both light and dark modes
- [ ] Verify hover and focus states work correctly
- [ ] Remove any manual dark mode border variants
- [ ] Run linter to ensure compliance

---

## Implementation Status

As of November 2025:

| Component Type | Status | Priority |
|----------------|--------|----------|
| Cards | 60% migrated | Low |
| Buttons | 40% migrated | Low |
| Inputs | 5% migrated | High |
| Alerts | 0% migrated | High |
| Dropdowns | 20% migrated | High |
| Navigation | 80% migrated | Low |
| Dividers | 20% migrated | Medium |
| Demos | 0% migrated | Medium |

---

## Questions & Edge Cases

### Q: When should I use 1px vs 2px borders?
**A:** Use 1px for default state (cards, inputs, containers). Use 2px only for emphasis (checkboxes, selected items, primary buttons).

### Q: What if my component needs a special border color?
**A:** If it's a state (error, success, warning, info), use the semantic tokens. If it's a unique design need, first check if it could use an existing token. Only add new tokens if absolutely necessary.

### Q: How do I handle borders that change on interaction?
**A:** Use hover states with `hover:border-border-secondary` for hover, and `border-border-selected` for active/selected states.

### Q: Can I mix border-based and ring-based focus?
**A:** Yes, for specific needs. However, prefer ring-based focus (more accessible). If combining, remember to set `focus:border-transparent` to avoid double borders.

### Q: What about borders on images or media elements?
**A:** Use the same tokens as containers. Example: `border border-border-divider-subtle rounded-lg overflow-hidden`.

---

## Summary

- **Always use design tokens**, never hardcoded colors
- **Prefer ring-based focus** over border-based focus
- **Include hover states** on all interactive elements
- **Use semantic tokens** for state indication
- **Default borders are 1px**, use 2px for emphasis
- **All tokens support dark mode automatically**
- **Test in both light and dark modes** before shipping
