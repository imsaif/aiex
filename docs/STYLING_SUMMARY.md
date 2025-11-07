# Styling Standards Summary: Quick Reference

## At a Glance

### Guides Page (Modern, Modular)
- **Border Radius**: `rounded-xl` (16px)
- **Padding**: `p-5` (20px)
- **Spacing**: `space-y-4` / `gap-6`
- **Shadow**: `shadow-sm` → `shadow-md` on hover
- **Typography**: `text-lg semibold` titles, `text-sm` body
- **Colors**: `text-primary` (#0d0d0d), `accent-primary` (#0d0d0d), green for progress
- **Borders**: `border-gray-200` → `border-gray-300` on hover
- **Status Badges**: `StatusBadge` component with semantic colors

### Patterns Page (Minimalist, Grid-based)
- **Border Radius**: `rounded-lg` (8px)
- **Padding**: `p-6` / `p-8` (24-32px)
- **Spacing**: `space-y-12` (48px between sections)
- **Shadow**: `shadow-sm` (minimal hover effects)
- **Typography**: `text-5xl` page titles, `text-2xl` section titles
- **Colors**: Grayscale (text-gray-900, bg-white)
- **Borders**: `border-gray-200` with `border-gray-300` separators
- **Numbered Badges**: Circular badges with numbers (h-6 w-6 rounded-full)

---

## Simulator Recommendation: ADOPT GUIDES STYLING

| Feature | Implementation |
|---------|-----------------|
| **Card Structure** | `bg-surface-primary rounded-xl border border-gray-200 shadow-sm` |
| **Hover Effects** | `hover:border-gray-300 hover:shadow-md` |
| **Title** | `text-lg font-semibold text-text-primary` |
| **Description** | `text-sm text-text-secondary` |
| **Spacing** | `p-5` cards, `space-y-4` sections, `gap-6` grids |
| **Badges** | Use `StatusBadge` for status, `px-3 py-1` for metadata |
| **Progress** | Use `ProgressBar` component with green fill |
| **Separators** | `pt-4 border-t border-gray-300` |
| **Animations** | `transition-all duration-300` |

---

## Color System (Design Tokens)

### Text
```
Primary:   #0d0d0d (light) / #fafafa (dark)
Secondary: #525252 (light) / #a3a3a3 (dark)
Tertiary:  #737373 (light) / #737373 (dark)
```

### Semantic
```
Success:  #10b981 (green)
Error:    #ef4444 (red)
Warning:  #f59e0b (amber)
Info:     #3b82f6 (blue)
```

### UI Elements
```
Surface-primary:  #ffffff (light) / #0f0f0f (dark)
Border:           #f9f9f9 (light) / #262626 (dark)
Accent:           #0d0d0d (light) / #fafafa (dark)
```

---

## Component Snippets

### Guides-Style Card
```jsx
<div className="bg-surface-primary rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md p-5 space-y-4 transition-all duration-300">
  <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
  <p className="text-sm text-text-secondary">{description}</p>
  <div className="pt-4 border-t border-gray-300">
    <StatusBadge status="in-progress" />
  </div>
</div>
```

### Responsive Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
  {/* cards */}
</div>
```

### Button Variants
```jsx
// Primary
<button className="rounded-full px-8 py-3 bg-accent-primary text-background-primary hover:bg-accent-hover transition-colors">

// Secondary
<button className="rounded-full px-4 py-2 border border-gray-200 bg-surface-primary text-text-primary hover:bg-accent-subtle transition-colors">

// Outline
<button className="rounded-full px-4 py-2 border border-gray-200 bg-surface-primary text-text-primary hover:bg-accent-subtle transition-colors">
```

---

## Key Differences

### Guides vs Patterns

| Aspect | Guides | Patterns | For Simulator |
|--------|--------|----------|---------------|
| **Card Radius** | 16px (xl) | 8px (lg) | 16px (xl) ✓ |
| **Card Padding** | 20px (p-5) | 24-32px (p-6/8) | 20px (p-5) ✓ |
| **Gap Size** | 24px | 24-48px | 24px (gap-6) ✓ |
| **Typography** | Compact/Semibold | Large/Bold | Compact/Semibold ✓ |
| **Shadow Style** | Subtle + Hover | Minimal | Subtle + Hover ✓ |
| **Color Theme** | Dark text + accents | Grayscale | Dark text + accents ✓ |
| **Badges** | StatusBadge (semantic) | Numbered circles | StatusBadge ✓ |

---

## Tailwind Classes Quick Reference

### Spacing
```
p-5 = 20px    px-3 = 12px    pt-4 = 16px
p-6 = 24px    px-4 = 16px    border-t
space-y-4 = 16px gap
gap-6 = 24px
```

### Typography
```
text-xs = 12px, font-medium
text-sm = 14px, text-text-secondary
text-base = 16px
text-lg = 18px, font-semibold (guide titles)
text-xl = 20px
text-2xl = 24px, font-bold
text-5xl = 48px
```

### Colors
```
bg-surface-primary = #ffffff (light)
border-gray-200 = standard border
text-text-primary = #0d0d0d (light)
text-text-secondary = #525252 (light)
accent-primary = #0d0d0d (light)
```

### Interactivity
```
rounded-xl = 16px (cards)
rounded-lg = 8px (inputs, smaller elements)
rounded-full = pills & badges
border-2 = for focus states
shadow-sm = subtle
shadow-md = on hover
transition-all duration-300
hover:border-gray-300 hover:shadow-md
```

---

## Implementation Checklist

- [ ] Use `bg-surface-primary` for main card backgrounds
- [ ] Apply `border border-gray-200` to all cards
- [ ] Use `rounded-xl` for card border radius
- [ ] Add `p-5` padding to cards
- [ ] Use `space-y-4` for vertical spacing between elements
- [ ] Use `gap-6` for grid gaps
- [ ] Add `transition-all duration-300` to interactive elements
- [ ] Implement `hover:border-gray-300 hover:shadow-md` for card hover states
- [ ] Use `text-lg font-semibold` for card titles
- [ ] Use `text-sm text-text-secondary` for descriptions
- [ ] Use `StatusBadge` component for status indicators
- [ ] Use `ProgressBar` component for progress displays
- [ ] Add `pt-4 border-t border-gray-300` for metadata sections
- [ ] Use `text-text-primary` and `text-text-secondary` for all text
- [ ] Apply `motion` animations with `duration-300` or `0.3s`
- [ ] Ensure dark mode support with CSS variables

---

## Files to Reference

- **Main Tailwind Config**: `/tailwind.config.mjs` - Design tokens & color system
- **Global Styles**: `/src/app/globals.css` - CSS variables & theme
- **Guides Components**: `/src/components/ui/CourseCard.tsx`, `ModularLessonCard.tsx`, `ModuleSection.tsx`
- **Pattern Components**: `/src/app/patterns/[slug]/client-page.tsx`
- **Reusable UI**: `/src/components/ui/Button.tsx`, `StatusBadge.tsx`, `ProgressBar.tsx`, `Card.tsx`
- **Full Documentation**: `/docs/STYLING_COMPARISON.md`

---

## Pro Tips

1. **Always use design tokens** - Never hardcode colors, use Tailwind classes
2. **Responsive first** - Use `sm:`, `md:`, `lg:` prefixes for responsive design
3. **Dark mode included** - All colors automatically support dark mode via CSS variables
4. **Shadows upgrade on hover** - `shadow-sm` → `shadow-md` for interactive feedback
5. **Use component library** - StatusBadge, Button, ProgressBar, Card are pre-built
6. **Spacing consistency** - Guides use compact (20px), Patterns use spacious (24-32px)
7. **Typography hierarchy** - Always follow the font size and weight patterns
8. **Border language** - Use `border-gray-200` for standard, `border-gray-300` for active/hover
9. **Animations** - Keep them brief (0.2-0.3s) for snappy feel
10. **Test both themes** - Always verify light and dark mode appearance

