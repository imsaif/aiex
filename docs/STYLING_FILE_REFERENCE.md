# Styling & Design System File Reference

## Core Design System Files

### 1. Tailwind Configuration
**Location**: `/tailwind.config.mjs`
**Purpose**: Defines all design tokens, colors, spacing, typography
**Key Sections**:
- Color system (text, background, surface, accent, category)
- Border colors (primary, secondary, semantic, interactive)
- Ring colors (focus states)
- Font families and letter spacing

**Critical Colors Defined**:
```javascript
text: {
  primary: '#0d0d0d' (light) / '#fafafa' (dark),
  secondary: '#525252' (light) / '#a3a3a3' (dark),
  tertiary: '#737373',
  disabled: '#a3a3a3' (light) / '#525252' (dark)
}

accent: {
  primary: '#0d0d0d' (light) / '#fafafa' (dark),
  hover: '#262626' (light) / '#e5e5e5' (dark),
  subtle: '#f5f5f5' (light) / '#171717' (dark)
}
```

### 2. Global Styles
**Location**: `/src/app/globals.css`
**Purpose**: CSS variables, dark mode theme, custom animations
**Key Sections**:
- CSS variables (mirror Tailwind config in `:root`)
- Dark mode overrides (`@media (prefers-color-scheme: dark)`)
- Custom patterns (pattern-grid-white, particle-float)
- Custom animations (chatBubbleEnter, pattern-card-hover)
- Smooth scrolling and font optimization

**Important Custom Animations**:
```css
.pattern-card-hover {
  transition: all 0.2s ease-out;
}

.pattern-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

@keyframes chatBubbleEnter {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

## Guides Page Components

### 1. CourseCard Component
**Location**: `/src/components/ui/CourseCard.tsx`
**Used In**: Guides listing page
**Styling Pattern**:
```
Card: bg-surface-primary rounded-xl border border-gray-200 shadow-sm
Hover: hover:border-gray-300 hover:shadow-md transition-all duration-300
Height: h-40 (thumbnail)
Padding: p-5 (content section)
Title: text-lg font-semibold text-text-primary
Description: text-sm text-text-secondary
Badges: px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800
```

**Key Features**:
- Tool icons (Claude, Cursor, GitHub, etc.)
- Status badge (top-right corner, sm size)
- Metadata badges section with border-t

### 2. GuideCard Component
**Location**: `/src/components/ui/GuideCard.tsx`
**Used In**: Alternative guide listing (legacy)
**Styling Pattern**: Same as CourseCard but with BookOpenIcon placeholder

### 3. ModularLessonCard Component
**Location**: `/src/components/ui/ModularLessonCard.tsx`
**Used In**: Guide detail page, expandable lessons
**Styling Pattern**:
```
Container: border border-gray-200/300 bg-surface-primary p-5 rounded-lg
Expanded: border-gray-300 shadow-md transition-all duration-300
Icon: w-12 h-12 rounded-lg bg-accent-subtle (normal) / bg-green-100 (completed)
Title: text-base font-semibold text-text-primary group-hover:text-accent-primary
Animation: motion.div with opacity fade and y-axis movement
```

**Key Features**:
- Expandable/collapsible with motion animation
- Completion checkbox with green checkmark
- Status badge (not-started, completed)
- Icon changes based on lesson type

### 4. ModuleSection Component
**Location**: `/src/components/ui/ModuleSection.tsx`
**Used In**: Guide detail page, module groupings
**Styling Pattern**:
```
Header: p-5 bg-surface-secondary/50 border border-gray-200 rounded-lg
Title: text-lg font-semibold text-text-primary
Description: text-sm text-text-secondary
Progress Bar: mt-3 h-1 bg-surface-primary with green-500 fill
Expanded Content: space-y-3 border border-t-0 border-gray-200 rounded-b-lg
```

**Key Features**:
- Expandable module header
- Progress indicator with percentage
- Completion stats (completed/total lessons)
- Icon support (cog, code, monitor, etc.)

---

## Guides Page Structure

### Guides Client Page
**Location**: `/src/app/guides/guides-client.tsx`
**Styling**:
```
Hero: py-12 md:py-16 text-center max-w-4xl
Title: text-4xl md:text-5xl font-bold mb-6
Subtitle: text-lg md:text-xl text-text-secondary mb-8
Search Bar: max-w-2xl mx-auto, px-6 py-4, border-gray-200, rounded-lg
Filters: flex flex-col lg:flex-row gap-4 items-stretch lg:items-center
Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl
Bottom padding: pb-24
```

### Guide Detail Page
**Location**: `/src/app/guides/[slug]/guide-client.tsx`
**Styling**:
```
Container: py-12 md:py-16 max-w-5xl mx-auto px-6
Back Link: inline-flex gap-2 text-accent-primary hover:text-accent-hover mb-6
Title: text-4xl md:text-5xl font-bold mb-8
Description: text-lg text-text-secondary mb-6
Progress Section: p-4 bg-surface-secondary/50 rounded-lg border border-gray-200
Modules: space-y-6 pb-12 border-b border-gray-300
Navigation: flex justify-between items-center pt-8 mt-12 border-t
```

---

## Pattern Page Components

### Pattern Detail Page (Client)
**Location**: `/src/app/patterns/[slug]/client-page.tsx`
**Styling Pattern**: More spacious and minimalist
```
Container: max-w-7xl mx-auto py-8 px-6
Breadcrumb: flex items-center justify-between text-sm mb-6
Header: mb-10
Title: text-5xl font-bold text-gray-900
Description: text-lg text-gray-600 leading-relaxed
Badges: flex items-center gap-2 flex-wrap mb-3
Section Spacing: space-y-12 (large gaps between sections)
```

### Problem & Solution Cards
**Location**: `/src/app/patterns/[slug]/client-page.tsx`
**Styling**:
```
Grid: grid-cols-1 md:grid-cols-2 gap-6
Card: bg-white rounded-lg border border-gray-200 shadow-sm p-6
Header: text-2xl font-bold text-gray-900 pb-3 mb-4 border-b border-gray-300
Content: prose prose-lg max-w-none text-gray-700
```

### Implementation Guidelines Section
**Location**: `/src/app/patterns/[slug]/client-page.tsx`
**Styling**:
```
Container: bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden
Left Column: flex-1 p-6 md:p-8 md:border-r border-gray-200
Right Column: flex-1 p-6 md:p-8 bg-gray-50
Item: flex items-start gap-3
Number Badge: h-6 w-6 bg-gray-100 border border-gray-300 rounded-full font-medium text-gray-700
Text: text-gray-700
```

---

## Reusable UI Components

### 1. Button Component
**Location**: `/src/components/ui/Button.tsx`
**Base Classes**:
```
rounded-full font-medium inline-flex items-center justify-center
focus:outline-none focus:ring-2 focus:ring-offset-2
transition-colors duration-200 cursor-pointer
```

**Variants**:
- `primary`: bg-accent-primary text-background-primary hover:bg-accent-hover
- `secondary`: bg-surface-secondary text-text-primary hover:bg-background-tertiary border border-gray-200
- `outline`: border border-gray-200 bg-surface-primary text-text-primary hover:bg-accent-subtle
- `gradient`: bg-gray-900 text-white hover:bg-gray-800

**Sizes**:
- `sm`: px-3 py-1.5 text-sm
- `md`: px-4 py-2 text-sm
- `lg`: px-8 py-3 text-base

### 2. StatusBadge Component
**Location**: `/src/components/ui/StatusBadge.tsx`
**Status Types**:
```
not-started: bg-gray-100/800 text-gray-700/300 (light/dark)
in-progress: bg-blue-100/900 text-blue-700/400
completed: bg-green-100/900 text-green-700/400
ready: bg-green-50/900 text-green-600/400
work-in-progress: bg-yellow-50/900 text-yellow-600/400
```

**Sizes**:
- `sm`: px-2.5 py-1 text-xs
- `md`: px-3 py-1.5 text-sm
- `shape`: rounded-full font-medium

### 3. ProgressBar Component
**Location**: `/src/components/ui/ProgressBar.tsx`
**Styling**:
```
Container: flex items-center gap-2
Track: flex-1 bg-border-primary rounded-full overflow-hidden
Fill (sm): h-1.5 (6px)
Fill (md): h-2 (8px)
Fill Color: bg-gradient-to-r from-accent-primary to-accent-primary/70
Text: text-xs font-medium text-text-secondary min-w-fit
Animation: duration 0.5s easeOut
```

### 4. Card Component
**Location**: `/src/components/ui/Card.tsx`
**Base Classes**:
```
bg-surface-primary border border-gray-200
padding: p-3 (small) / p-6 (medium) / p-8 (large)
shadow: shadow-sm (small) / shadow-md (medium) / shadow-lg (large)
rounded: rounded-sm / rounded-lg / rounded-xl
hover: cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all
```

---

## Typography Components

### Page Titles
```
Guides: text-4xl md:text-5xl font-bold text-text-primary
Patterns: text-5xl font-bold text-gray-900
Guide Details: text-4xl md:text-5xl font-bold text-text-primary
```

### Section Titles
```
Guides Modules: text-lg font-semibold text-text-primary mb-2
Patterns Sections: text-2xl font-bold text-gray-900 pb-3 mb-6 border-b border-gray-300
Pattern Subsections: text-xl font-semibold text-gray-800 mb-5
```

### Body Text
```
Guides descriptions: text-sm text-text-secondary
Pattern content: text-base / text-lg text-gray-700 leading-relaxed
Labels: text-xs font-medium
```

---

## Color Usage Throughout

### Guides Pages
- **Text**: `text-text-primary` (#0d0d0d light) / `text-text-secondary` (#525252 light)
- **Backgrounds**: `bg-surface-primary` (white light) / `bg-surface-secondary` (#f9f9f9 light)
- **Borders**: `border-gray-200` (standard) / `border-gray-300` (hover/active)
- **Accents**: `text-accent-primary` (#0d0d0d light), green (#10b981) for success
- **Shadows**: `shadow-sm` (normal) / `shadow-md` (hover)

### Patterns Pages
- **Text**: `text-gray-900` / `text-gray-700` / `text-gray-600` (grayscale)
- **Backgrounds**: `bg-white` (primary) / `bg-gray-50` (secondary)
- **Borders**: `border-gray-200` / `border-gray-300` / `border-gray-100`
- **Accents**: Minimal, mostly grayscale
- **Shadows**: `shadow-sm` only

---

## Animation & Transition Patterns

### Guides Animations
```javascript
// Motion library imports
import { motion, AnimatePresence } from 'framer-motion';

// Card entrance
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
duration: 0.2s

// Expand/collapse
height & opacity fade
duration: 0.3s

// Progress bar fill
width animation
duration: 0.5s
easing: easeOut
```

### Pattern Animations
```
Minimal animations (0.1s duration)
Hover transitions (text color, bg-gray-50)
Icon transforms (group-hover:-translate-x-1)
```

### Standard Transitions
```
transition-all duration-300
transition-colors duration-200
transition-transform
hover:* state changes
```

---

## Dark Mode Implementation

### CSS Variables (from globals.css)
```css
:root {
  --text-primary: #0d0d0d;
  --background-primary: #ffffff;
  /* ... etc */
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #fafafa;
    --background-primary: #0f0f0f;
    /* ... etc */
  }
}
```

### Tailwind Dark Variants
```
bg-gray-100 dark:bg-gray-800
text-gray-700 dark:text-gray-300
border-gray-200 (same in both modes)
```

---

## Layout Patterns

### Responsive Grid
```
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
gap-6 (24px)
max-w-7xl mx-auto px-6
```

### Flexbox Patterns
```
flex items-center justify-between
flex-1 (flex grow)
flex-shrink-0 (prevent shrinking)
gap-4, gap-6 (spacing)
```

### Section Spacing
```
Guides: space-y-4 (modules), space-y-6 (sections)
Patterns: space-y-12 (major sections)
Cards: p-5 (guides) / p-6-8 (patterns)
```

---

## Key Files Summary

| File | Purpose | Key Colors | Key Spacing |
|------|---------|-----------|-------------|
| `tailwind.config.mjs` | Design tokens | All color definitions | Theme values |
| `globals.css` | CSS variables & theme | Light/dark mode | Animations |
| `CourseCard.tsx` | Guide listing card | surface-primary, text-primary | p-5, gap-6 |
| `ModularLessonCard.tsx` | Lesson card | green-100 (completed) | p-5, space-y-4 |
| `ModuleSection.tsx` | Module grouping | surface-secondary/50, green | p-5, space-y-3 |
| `Button.tsx` | Interactive button | accent-primary variants | px/py sizes |
| `StatusBadge.tsx` | Status indicator | Semantic colors | rounded-full |
| `ProgressBar.tsx` | Progress display | green fills | h-1/h-2, gap-2 |
| `client-page.tsx` (patterns) | Pattern details | gray-900, white | space-y-12, p-6/8 |

---

## Next Steps for Styling the Simulator

1. **Start with Guides styling base** (rounded-xl, p-5, space-y-4)
2. **Use existing components**: Button, StatusBadge, ProgressBar, Card
3. **Follow color system**: Use Tailwind classes, not hardcoded colors
4. **Add dark mode support**: All colors automatically supported
5. **Test on mobile**: Use responsive breakpoints (sm:, md:, lg:)
6. **Reference files**: Check CourseCard and ModularLessonCard for patterns

---

## Common Styling Issues & Solutions

### Issue: Colors not changing in dark mode
**Solution**: Use Tailwind dark: variants or CSS variables
```jsx
className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
```

### Issue: Spacing inconsistent with guides
**Solution**: Use consistent padding (p-5) and spacing (space-y-4, gap-6)
```jsx
className="p-5 space-y-4"
```

### Issue: Hover effects not subtle enough
**Solution**: Use border and shadow upgrades, not color changes
```jsx
className="border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
```

### Issue: Typography too large/small
**Solution**: Match the guides hierarchy (text-lg semibold for titles, text-sm for body)
```jsx
<h3 className="text-lg font-semibold text-text-primary">Title</h3>
<p className="text-sm text-text-secondary">Description</p>
```

