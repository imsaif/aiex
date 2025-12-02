# Styling Reference

Technical reference for styling implementation across components.

## Component File Locations

### Core Design System
- **Tailwind Config**: `/tailwind.config.mjs` - Design tokens, colors, spacing
- **Global Styles**: `/src/app/globals.css` - CSS variables, animations

### UI Components
- `/src/components/ui/Button.tsx` - Button variants
- `/src/components/ui/StatusBadge.tsx` - Status indicators
- `/src/components/ui/ProgressBar.tsx` - Progress displays
- `/src/components/ui/Card.tsx` - Card container
- `/src/components/ui/CourseCard.tsx` - Guide cards
- `/src/components/ui/ModularLessonCard.tsx` - Lesson cards
- `/src/components/ui/ModuleSection.tsx` - Module groupings

### Pages
- `/src/app/guides/guides-client.tsx` - Guides listing
- `/src/app/guides/[slug]/guide-client.tsx` - Guide detail
- `/src/app/patterns/[slug]/client-page.tsx` - Pattern detail

---

## Tailwind Class Reference

### Spacing

```
px-2 = 8px      py-1 = 4px
px-3 = 12px     py-1.5 = 6px
px-4 = 16px     py-2 = 8px
px-5 = 20px     py-3 = 12px
px-6 = 24px     py-4 = 16px
px-8 = 32px     py-6 = 24px
```

### Typography

```
text-xs = 12px
text-sm = 14px
text-base = 16px
text-lg = 18px
text-xl = 20px
text-2xl = 24px
text-3xl = 30px
text-4xl = 36px
text-5xl = 48px
```

### Border Radius

```
rounded-sm = 2px
rounded = 4px
rounded-md = 6px
rounded-lg = 8px
rounded-xl = 12px
rounded-2xl = 16px
rounded-full = 9999px
```

---

## CSS Variables

Defined in `/src/app/globals.css`:

```css
:root {
  --text-primary: #0d0d0d;
  --text-secondary: #525252;
  --background-primary: #ffffff;
  --surface-primary: #ffffff;
  --accent-primary: #0d0d0d;
  --border-primary: #e5e5e5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #fafafa;
    --text-secondary: #a3a3a3;
    --background-primary: #0f0f0f;
    --surface-primary: #0f0f0f;
    --accent-primary: #fafafa;
    --border-primary: #262626;
  }
}
```

---

## Animation Patterns

### Motion Library

```tsx
import { motion, AnimatePresence } from 'framer-motion';

// Card entrance
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.2 }}

// Expand/collapse
<AnimatePresence>
  {expanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  )}
</AnimatePresence>
```

### CSS Transitions

```tsx
// Standard
transition-all duration-300

// Colors only
transition-colors duration-200

// Transform
transition-transform
```

---

## Status Badge Colors

```tsx
const statusStyles = {
  'not-started': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'completed': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  'ready': 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  'work-in-progress': 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
};
```

---

## Button Variants

```tsx
const variants = {
  primary: 'bg-accent-primary text-background-primary hover:bg-accent-hover',
  secondary: 'bg-surface-secondary text-text-primary hover:bg-background-tertiary border border-gray-200',
  outline: 'border border-gray-200 bg-surface-primary text-text-primary hover:bg-accent-subtle',
  gradient: 'bg-gray-900 text-white hover:bg-gray-800',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
};
```

---

## Progress Bar

```tsx
<div className="flex items-center gap-2">
  <div className="flex-1 bg-border-primary rounded-full overflow-hidden">
    <motion.div
      className="h-1.5 bg-gradient-to-r from-accent-primary to-accent-primary/70"
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  </div>
  <span className="text-xs font-medium text-text-secondary min-w-fit">
    {percentage}%
  </span>
</div>
```

---

## Layout Patterns

### Responsive Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
```

### Flex Patterns

```tsx
// Horizontal center
flex items-center justify-between

// Vertical stack
flex flex-col gap-4

// Grow to fill
flex-1

// Prevent shrink
flex-shrink-0
```

### Container Max Widths

```
max-w-2xl = 672px
max-w-4xl = 896px
max-w-5xl = 1024px
max-w-7xl = 1280px
```

---

## Common Issues & Solutions

### Colors not changing in dark mode
Use Tailwind dark: variants or CSS variables:
```tsx
className="bg-gray-100 dark:bg-gray-800"
```

### Spacing inconsistent
Use consistent padding and spacing:
```tsx
className="p-5 space-y-4 gap-6"
```

### Hover effects too strong
Use subtle border and shadow upgrades:
```tsx
className="border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
```

### Typography mismatch
Follow the hierarchy:
```tsx
<h3 className="text-lg font-semibold text-text-primary">Title</h3>
<p className="text-sm text-text-secondary">Description</p>
```
