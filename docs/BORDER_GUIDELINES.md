# Border Guidelines

This guide standardizes border usage across the application for consistency, accessibility, and maintainability.

## Design Tokens

All borders use design tokens for automatic dark mode support.

### Structural Borders

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-border-primary` | `#e5e5e5` | `#262626` | Default for containers, cards, inputs |
| `border-border-secondary` | `#d4d4d4` | `#404040` | Hover state for interactive elements |
| `border-border-focus` | `#525252` | `#737373` | Focus state |
| `border-border-disabled` | `#d1d5db` | `#525252` | Disabled elements |

### Semantic Borders

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-border-success` | `#10b981` | `#059669` | Success states |
| `border-border-error` | `#ef4444` | `#dc2626` | Error states |
| `border-border-warning` | `#f59e0b` | `#d97706` | Warning states |
| `border-border-info` | `#3b82f6` | `#1d4ed8` | Info states |

### Interactive Borders

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-border-interactive` | `#3b82f6` | `#1d4ed8` | Interactive default |
| `border-border-interactive-hover` | `#2563eb` | `#2563eb` | Interactive hover |
| `border-border-selected` | `#3b82f6` | `#1d4ed8` | Selected/active state |

### Dividers

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-border-divider` | `#e5e5e5` | `#262626` | Standard dividers |
| `border-border-divider-subtle` | `#f3f4f6` | `#1f1f1f` | Subtle dividers |

### Focus Rings

| Token | Usage |
|-------|-------|
| `ring-focus` | Standard focus ring (blue) |
| `ring-focus-error` | Error state focus ring |
| `ring-focus-success` | Success state focus ring |
| `ring-focus-warning` | Warning state focus ring |

---

## Component Patterns

### Cards & Containers

```tsx
// Default
className="border border-border-primary"

// With hover
className="border border-border-primary hover:border-border-secondary transition-colors"

// Selected
className="border-2 border-border-selected"
```

### Input Fields

```tsx
// Default with ring-based focus (preferred)
className="border border-border-primary focus:ring-2 focus:ring-ring-focus"

// Error state
className="border border-border-error focus:ring-2 focus:ring-ring-focus-error"

// Disabled
className="border border-border-disabled text-text-disabled"
```

### Alerts

```tsx
// Left accent (recommended)
className="border-l-4 border-border-success bg-green-50 p-4"
className="border-l-4 border-border-error bg-red-50 p-4"
className="border-l-4 border-border-warning bg-yellow-50 p-4"
className="border-l-4 border-border-info bg-blue-50 p-4"
```

### Dividers

```tsx
// Horizontal
className="border-t border-border-divider"

// Vertical
className="border-l border-border-divider"
```

---

## Border Width Standards

| Width | Token | Usage |
|-------|-------|-------|
| 1px | `border` | Default: cards, inputs, dividers |
| 2px | `border-2` | Emphasis: checkboxes, selection |
| 4px | `border-l-4` | Alert accents |

---

## Focus States

### Ring-Based (Preferred)

```tsx
focus:ring-2 focus:ring-ring-focus
focus:ring-2 focus:ring-ring-focus focus:border-transparent
```

### Border-Based (Alternative)

```tsx
focus:border-border-focus focus:border-2
```

---

## Dark Mode

All tokens automatically support dark mode via CSS variables.

```tsx
// GOOD - Use design tokens
<div className="border border-border-primary hover:border-border-secondary">

// BAD - Don't hardcode colors
<div className="border border-gray-200 dark:border-gray-600">
```

---

## Best Practices

1. **Always use design tokens** - Never hardcode colors
2. **Prefer ring-based focus** - More accessible
3. **Include hover states** - On all interactive elements
4. **Use semantic tokens** - For state indication
5. **Default to 1px borders** - Use 2px for emphasis only
6. **Test both modes** - Light and dark mode rendering

---

## Industry Alignment

Current border colors (`#e5e5e5` light / `#262626` dark) align with:
- Notion: `#ECECF1` / `#313138`
- Figma: `#E8E8E8` / `#373737`
- GitHub: `#D0D7DE` / `#30363D`

This subtle approach prioritizes content visibility over UI prominence.
