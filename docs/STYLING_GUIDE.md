# Styling Guide

This guide documents the design system standards for the AIEX application.

## Design Philosophy

The application uses a **modern, modular design** with:
- Subtle shadows and rounded corners
- Semantic color system
- Consistent spacing
- Automatic dark mode support

---

## Color System

### Text Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `text-text-primary` | `#0d0d0d` | `#fafafa` | Headings, primary content |
| `text-text-secondary` | `#525252` | `#a3a3a3` | Descriptions, secondary content |
| `text-text-tertiary` | `#737373` | `#737373` | Subtle text |
| `text-text-disabled` | `#a3a3a3` | `#525252` | Disabled states |

### Background Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `bg-background-primary` | `#ffffff` | `#0f0f0f` | Main background |
| `bg-background-secondary` | `#fafafa` | `#171717` | Secondary sections |
| `bg-surface-primary` | `#ffffff` | `#0f0f0f` | Card backgrounds |
| `bg-surface-secondary` | `#f9f9f9` | `#171717` | Muted surfaces |

### Accent Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `accent-primary` | `#0d0d0d` | `#fafafa` | Primary interactive |
| `accent-hover` | `#262626` | `#e5e5e5` | Hover states |
| `accent-subtle` | `#f5f5f5` | `#171717` | Subtle backgrounds |

### Semantic Colors

| Color | Token | Usage |
|-------|-------|-------|
| Green | `#10b981` | Success, completed |
| Red | `#ef4444` | Error, danger |
| Amber | `#f59e0b` | Warning, caution |
| Blue | `#3b82f6` | Info, links |

---

## Typography

### Font Sizes

| Size | Class | Usage |
|------|-------|-------|
| 48px | `text-4xl` / `text-5xl` | Page titles |
| 24px | `text-2xl` | Section titles |
| 18px | `text-lg` | Card titles |
| 14px | `text-sm` | Body text |
| 12px | `text-xs` | Labels, badges |

### Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| 700 | `font-bold` | Page/section titles |
| 600 | `font-semibold` | Card titles |
| 500 | `font-medium` | Labels |
| 400 | `font-normal` | Body text |

---

## Spacing

### Padding

| Class | Size | Usage |
|-------|------|-------|
| `p-5` | 20px | Card content |
| `p-6` | 24px | Large sections |
| `px-3 py-1` | 12px/4px | Badges |
| `px-4 py-2` | 16px/8px | Buttons |

### Gaps

| Class | Size | Usage |
|-------|------|-------|
| `gap-6` | 24px | Grid gaps |
| `space-y-4` | 16px | Vertical spacing |
| `space-y-6` | 24px | Section spacing |

---

## Components

### Cards

```tsx
<div className="bg-surface-primary rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md p-5 transition-all duration-300">
  <h3 className="text-lg font-semibold text-text-primary mb-2">Title</h3>
  <p className="text-sm text-text-secondary">Description</p>
</div>
```

### Buttons

```tsx
// Primary
<button className="rounded-full px-8 py-3 bg-accent-primary text-background-primary hover:bg-accent-hover transition-colors">

// Secondary
<button className="rounded-full px-4 py-2 border border-gray-200 bg-surface-primary text-text-primary hover:bg-accent-subtle transition-colors">
```

### Badges

```tsx
// Status badge
<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
  Completed
</span>

// Category badge
<span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-text-secondary">
  Category
</span>
```

### Responsive Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
  {/* items */}
</div>
```

---

## Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Default cards |
| `shadow-md` | Hover state, elevated |
| `shadow-lg` | Modals, overlays |

---

## Border Radius

| Class | Size | Usage |
|-------|------|-------|
| `rounded-xl` | 16px | Cards |
| `rounded-lg` | 8px | Inputs, buttons |
| `rounded-full` | 50% | Badges, pills |

---

## Animations

```tsx
// Standard transition
transition-all duration-300

// Color transition
transition-colors duration-200

// Hover states
hover:border-gray-300 hover:shadow-md
```

---

## Dark Mode

All colors automatically support dark mode via CSS variables.

```tsx
// GOOD - Use design tokens
<div className="bg-surface-primary text-text-primary">

// BAD - Manual dark mode
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

---

## Key Files

- **Tailwind Config**: `/tailwind.config.mjs`
- **Global Styles**: `/src/app/globals.css`
- **Button**: `/src/components/ui/Button.tsx`
- **StatusBadge**: `/src/components/ui/StatusBadge.tsx`
- **ProgressBar**: `/src/components/ui/ProgressBar.tsx`
- **Card**: `/src/components/ui/Card.tsx`
