# Styling & Typography Standards Comparison: Guides vs Patterns Pages

## Executive Summary
The guides and patterns pages have **different visual styles and typography standards**. Guides use a **modern, modular design system** with color-coded elements and structured layouts, while patterns use a **minimalist, grid-based approach** with grayscale typography. For the simulator to integrate seamlessly, it should **adopt the guides styling approach** as the default with pattern styling as an alternative.

---

## 1. COLOR SCHEME

### Design System Colors (Tailwind Config)

#### Primary Colors
```
Text Colors:
- text-primary:     #0d0d0d (light) / #fafafa (dark) - Main headings, body text
- text-secondary:   #525252 (light) / #a3a3a3 (dark) - Secondary content, descriptions
- text-tertiary:    #737373 (light) / #737373 (dark) - Subtle text
- text-disabled:    #a3a3a3(light) / #525252 (dark) - Disabled states

Background Colors:
- background-primary:   #ffffff (light) / #0f0f0f (dark)
- background-secondary: #fafafa (light) / #171717 (dark)
- background-tertiary:  #f5f5f5 (light) / #1f1f1f (dark)

Surface Colors:
- surface-primary:  #ffffff (light) / #0f0f0f (dark) - Main surfaces
- surface-secondary:#f9f9f9 (light) / #171717 (dark) - Secondary surfaces
- surface-elevated: #ffffff (light) / #1f1f1f (dark) - Elevated components

Accent Colors:
- accent-primary:   #0d0d0d (light) / #fafafa (dark) - Primary interactive
- accent-hover:     #262626 (light) / #e5e5e5 (dark) - Hover states
- accent-subtle:    #f5f5f5 (light) / #171717 (dark) - Subtle backgrounds
```

#### Border Colors
```
Structural Borders:
- border-primary:   #f9f9f9    - Main borders
- border-secondary: #f3f3f3    - Secondary borders
- border-focus:     #525252    - Focus states

Semantic Borders:
- border-success:   #10b981    - Success states
- border-error:     #ef4444    - Error states
- border-warning:   #f59e0b    - Warning states
- border-info:      #3b82f6    - Info states

Interactive Borders:
- border-interactive:       #3b82f6 - Interactive elements
- border-interactive-hover: #2563eb - Interactive hover
- border-selected:          #3b82f6 - Selected states
- border-disabled:          #d1d5db - Disabled states
```

#### Category Colors (for badges, icons)
```
- category-blue:    #3B82F6
- category-purple:  #8B5CF6
- category-amber:   #F59E0B
- category-teal:    #14B8A6
- category-indigo:  #6366F1
- category-green:   #10B981
- category-rose:    #F43F5E
- category-orange:  #F97316
- category-cyan:    #06B6D4
- category-emerald: #059669
- category-violet:  #7C3AED
- category-pink:    #EC4899
- category-slate:   #64748B
- category-neutral: #6B7280
```

---

## 2. GUIDES PAGE STYLING

### 2.1 Layout & Spacing
```
Hero Section:
- Top padding:     py-12 md:py-16 (48px on mobile, 64px on desktop)
- Max width:       max-w-7xl (80rem = 1280px)
- Horizontal padding: px-6 (24px)
- Bottom padding:  pb-24 (96px)

Search Bar:
- Max width:       max-w-2xl
- Padding:         px-6 py-4 (24px horizontal, 16px vertical)
- Border:          border border-gray-200
- Border radius:   rounded-lg (8px)
- Shadow:          shadow-sm

Filter Dropdowns:
- Width:           lg:w-48 (192px on desktop)
- Padding:         px-4 py-2
- Border:          border border-gray-200
- Border radius:   rounded-lg

Guides Grid:
- Columns:         grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
- Gap:             gap-6 (24px)
- Grid width:      max-w-7xl
```

### 2.2 CourseCard Component Styling

```
Card Container:
- Background:      bg-surface-primary
- Border:          border border-gray-200
- Border radius:   rounded-xl (16px)
- Shadow:          shadow-sm
- Hover shadow:    hover:shadow-md
- Hover border:    hover:border-gray-300
- Height:          h-full (flexbox column)
- Transition:      transition-all duration-300

Thumbnail Section (top 40 pixels / h-40):
- Height:          h-40 (160px)
- Background:      bg-gradient-to-br from-accent-primary/10 to-accent-primary/5
- Display:         flex items-center justify-center
- Icon size:       56x56 pixels

Content Section (padding):
- Padding:         p-5 (20px)
- Flex:            flex-1 flex flex-col

Title:
- Text size:       text-lg
- Font weight:     font-semibold
- Color:           text-text-primary
- Hover:           group-hover:text-accent-primary
- Line clamp:      line-clamp-2
- Margin bottom:   mb-2

Description:
- Text size:       text-sm
- Color:           text-text-secondary
- Line clamp:      line-clamp-2
- Margin bottom:   mb-4
- Flex grow:       flex-grow

Metadata Badges:
- Border top:      pt-4 border-t border-gray-300 mb-4
- Badge padding:   px-3 py-1
- Badge background:bg-gray-100 dark:bg-gray-800
- Badge text:      text-xs text-text-secondary font-medium

Status Badge (top-right):
- Position:        absolute top-2 right-2
- Size:            sm (smaller version)
```

### 2.3 ModularLessonCard Component

```
Card Container:
- Motion animation: opacity fade, y-axis movement
- Border:          border border-gray-200/300
- Background:      bg-surface-primary
- Padding:         p-5 (20px)
- Border radius:   rounded-lg
- Hover shadow:    hover:shadow-md

Expanded State:
- Border upgrade:  border-gray-300
- Shadow upgrade:  shadow-md

Icon Container (left):
- Size:            w-12 h-12
- Border radius:   rounded-lg
- Background (normal): bg-accent-subtle
- Background (completed): bg-green-100 dark:bg-green-900/30
- Flex shrink:     flex-shrink-0
- Center content:  flex items-center justify-center

Lesson Title:
- Font weight:     font-semibold
- Text size:       text-base
- Color:           text-text-primary (normal) / text-text-secondary (completed)
- Line through:    line-through (if completed)
- Hover color:     group-hover:text-accent-primary
- Margin bottom:   mb-2

Content Section:
- Gap between items: gap-4

Expanded Content:
- Background:      bg-surface-primary
- Border:          border border-t-0 border-gray-200
- Border radius:   rounded-b-lg
- Margin top:      mt-2
- Animation:       height & opacity fade
```

### 2.4 ModuleSection Component

```
Module Header Button:
- Padding:         p-5 (20px)
- Background:      bg-surface-secondary/50
- Border:          border border-gray-200
- Hover:           hover:border-gray-300 hover:bg-surface-secondary
- Border radius:   rounded-lg
- Transition:      transition-all

Title:
- Text size:       text-lg
- Font weight:     font-semibold
- Color:           text-text-primary
- Margin bottom:   mb-2

Description:
- Text size:       text-sm
- Color:           text-text-secondary
- Margin bottom:   mb-4

Module Stats:
- Display:         flex items-center gap-2
- Icon size:       w-4 h-4
- Icon color:      text-green-600 dark:text-green-400
- Text size:       text-xs font-medium

Progress Bar:
- Margin top:      mt-3
- Height:          h-1 (4px)
- Background:      bg-surface-primary
- Border radius:   rounded-full
- Fill color:      bg-green-500 dark:bg-green-600

Expanded Content:
- Space between:   space-y-3
- Margin top:      mt-2
```

### 2.5 Typography Hierarchy (Guides)

```
Page Title (H1):
- Font size:       text-4xl md:text-5xl
- Font weight:     font-bold
- Color:           text-text-primary
- Margin bottom:   mb-6 or mb-8

Subtitle (Descriptions):
- Font size:       text-lg md:text-xl
- Color:           text-text-secondary
- Margin bottom:   mb-8

Module Title (H3):
- Font size:       text-lg
- Font weight:     font-semibold
- Color:           text-text-primary
- Margin bottom:   mb-2

Lesson Title:
- Font size:       text-base
- Font weight:     font-semibold
- Color:           text-text-primary
- Margin bottom:   mb-2

Body Text:
- Font size:       text-sm
- Color:           text-text-secondary
- Line height:     natural (prose)
```

---

## 3. PATTERNS PAGE STYLING

### 3.1 Layout & Spacing
```
Main Container:
- Max width:       max-w-7xl
- Padding:         py-8 px-6 (32px top/bottom, 24px horizontal)
- Margin:          mx-auto

Breadcrumb:
- Margin bottom:   mb-6
- Text size:       text-sm
- Justify:         justify-between

Header Section:
- Margin bottom:   mb-10

Category/Status Badges:
- Display:         flex items-center gap-2 flex-wrap
- Margin bottom:   mb-3

Main Content Sections:
- Spacing:         space-y-12 (gap between sections)
- Margin:          mb-10

Content Grid:
- Columns:         grid-cols-1 md:grid-cols-2
- Gap:             gap-6
```

### 3.2 Pattern Detail Card Sections

```
Problem & Solution Cards (side by side on desktop):
- Background:      bg-white
- Padding:         p-6 (24px)
- Border:          border border-gray-200
- Border radius:   rounded-lg
- Shadow:          shadow-sm

Section Headers (H2):
- Font size:       text-2xl
- Font weight:     font-bold
- Color:           text-gray-900
- Padding bottom:  pb-3
- Margin bottom:   mb-4
- Border bottom:   border-b border-gray-300

Section Content:
- Font size:       text-lg (prose-lg)
- Color:           text-gray-700
- Line height:     leading-relaxed
```

### 3.3 Implementation Guidelines Section

```
Container:
- Background:      bg-white
- Border:          border border-gray-200
- Border radius:   rounded-lg
- Shadow:          shadow-sm
- Display:         md:flex-row (side by side)

Left Column (Guidelines):
- Padding:         p-6 md:p-8
- Border right:    md:border-r border-gray-200

Right Column (Considerations):
- Padding:         p-6 md:p-8
- Background:      bg-gray-50
- Border top:      md:border-b-0 md:border-r border-gray-200

Guideline/Consideration Item:
- Display:         flex items-start
- Number badge:    h-6 w-6 bg-gray-100 border border-gray-300 rounded-full
- Number text:     font-medium text-gray-700
- Right margin:    mr-3
- Content text:    text-gray-700
```

### 3.4 Related Patterns/Guides Grid

```
Related Patterns Card:
- Background:      bg-white
- Padding:         p-6
- Border:          border border-gray-200
- Border radius:   rounded-lg
- Shadow:          shadow-sm
- Hover:           hover:bg-gray-50
- Transition:      transition-colors
- Columns:         grid-cols-1 sm:grid-cols-2 md:grid-cols-3
- Gap:             gap-6

Card Content:
- Icon size:       w-5 h-5
- Text:            text-lg font-medium text-gray-700
- Icon color:      text-gray-500
```

### 3.5 Navigation

```
Breadcrumb Links:
- Color:           text-gray-600
- Hover:           hover:text-gray-900
- Transition:      transition-colors
- Icon size:       h-4 w-4
- Spacing:         gap-2

Previous/Next Navigation:
- Display:         flex flex-col sm:flex-row
- Justify:         justify-between
- Padding top:     pt-8
- Border top:      border-t border-gray-200
- Margin top:      mt-12

Navigation Card:
- Display:         flex items-center gap-3 / gap-2
- Text size:       text-xs text-gray-500 / font-medium
- Hover transition:group-hover:-translate-x-1 / group-hover:translate-x-1
```

### 3.6 Typography Hierarchy (Patterns)

```
Page Title (H1):
- Font size:       text-5xl
- Font weight:     font-bold
- Color:           text-gray-900
- Margin bottom:   mb-4 or mt-6

Subtitle (Description):
- Font size:       text-lg
- Color:           text-gray-600
- Line height:     leading-relaxed

Section Title (H2):
- Font size:       text-2xl
- Font weight:     font-bold
- Color:           text-gray-900
- Padding bottom:  pb-3
- Margin bottom:   mb-6
- Border bottom:   border-b border-gray-300

Subsection Title (H3):
- Font size:       text-xl
- Font weight:     font-semibold
- Color:           text-gray-800
- Margin bottom:   mb-5
- Padding bottom:  pb-2
- Border bottom:   border-b border-gray-100

Body Text:
- Font size:       text-base / text-lg (prose)
- Color:           text-gray-700
```

---

## 4. COMPONENT STYLING STANDARDS

### 4.1 Card/Box Styling

#### Guides Cards (CourseCard, GuideCard)
```
Standard Card:
- bg-surface-primary rounded-xl border border-gray-200 shadow-sm
- hover:border-gray-300 hover:shadow-md
- Padding in sections: p-5 (20px)
- Full height flex column

Metadata Areas:
- pt-4 border-t border-gray-300 (separator line)
```

#### Pattern Cards & Sections
```
Standard Card:
- bg-white rounded-lg border border-gray-200 shadow-sm
- hover:bg-gray-50 transition-colors
- Padding: p-6 (24px) or p-8 (32px)

Section Dividers:
- border-b border-gray-300 / border-gray-100
- pb-3 / mb-4 or mb-5
```

### 4.2 Button Styling

```
Button Component:
- Base:            rounded-full font-medium inline-flex items-center justify-center
- Focus:           focus:outline-none focus:ring-2 focus:ring-offset-2
- Transition:      transition-colors duration-200

Variants:
  primary:         bg-accent-primary text-background-primary 
                   hover:bg-accent-hover focus:ring-border-focus
  secondary:       bg-surface-secondary text-text-primary 
                   hover:bg-background-tertiary border border-gray-200
  outline:         border border-gray-200 bg-surface-primary text-text-primary 
                   hover:bg-accent-subtle
  gradient:        bg-gray-900 text-white hover:bg-gray-800

Sizes:
  sm:             px-3 py-1.5 text-sm
  md:             px-4 py-2 text-sm
  lg:             px-8 py-3 text-base
```

### 4.3 Badge Styling

#### Status Badge
```
not-started:       bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
in-progress:       bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400
completed:         bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400
ready:             bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400
work-in-progress:  bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400

Padding:
  sm:             px-2.5 py-1 text-xs
  md:             px-3 py-1.5 text-sm

Shape:             rounded-full
```

#### Category Badge
```
Background:        bg-{color}-100 (e.g., bg-blue-100)
Text:              text-{color}-800 (e.g., text-blue-800)
Padding:           px-3 py-1
Font:              rounded-full text-sm font-medium
```

### 4.4 Progress Bar
```
Container:         flex items-center gap-2
Background track:  flex-1 bg-border-primary rounded-full overflow-hidden
Fill (small):      h-1.5 (6px)
Fill (medium):     h-2 (8px)
Fill color:        bg-gradient-to-r from-accent-primary to-accent-primary/70

Percentage text:   text-xs font-medium text-text-secondary min-w-fit
Animation:         motion with duration 0.5 easeOut
```

### 4.5 Border & Shadow System

#### Guides
```
Borders:
- Standard:        border border-gray-200
- Hover upgrade:   border-gray-300
- Separator:       border-t / border-b border-gray-300

Shadows:
- Subtle:          shadow-sm
- Hover upgrade:   hover:shadow-md
- Interactive:     none (minimal)
```

#### Patterns
```
Borders:
- Standard:        border border-gray-200
- Subtle:          border-gray-100
- Separator:       border-b border-gray-300

Shadows:
- Subtle:          shadow-sm
- Interactive:     none (minimal)
```

### 4.6 Border Radius Patterns

```
Guides:
- Cards:           rounded-xl (16px)
- Input/Buttons:   rounded-lg (8px)
- Badges:          rounded-full / rounded-lg
- Icons:           rounded-lg

Patterns:
- Cards:           rounded-lg (8px)
- Buttons:         rounded-full / rounded-lg
- Badges:          rounded-full / text-centered
- Numbers:         rounded-full (circular badges)
```

---

## 5. SPACING & PADDING STANDARDS

### 5.1 Guides Page Spacing
```
Section Spacing:    space-y-6 (24px between sections)
Module spacing:     space-y-4 (16px between modules)
Lesson spacing:     space-y-3 (12px between lessons)
Card padding:       p-5 (20px)
Container padding:  px-6 (24px)
```

### 5.2 Pattern Page Spacing
```
Section Spacing:    space-y-12 (48px between major sections)
Grid spacing:       gap-6 (24px)
Card padding:       p-6 or p-8 (24px or 32px)
Container padding:  px-6 (24px)
Section padding:    py-8 (32px)
```

### 5.3 Padding Reference
```
px-2 = 8px      py-1 = 4px
px-3 = 12px     py-1.5 = 6px
px-4 = 16px     py-2 = 8px
px-5 = 20px     py-3 = 12px
px-6 = 24px     py-4 = 16px
px-8 = 32px     py-6 = 24px
```

---

## 6. ANIMATIONS & TRANSITIONS

### 6.1 Guides Animations
```
Card Transitions:
- Duration:        duration-300
- Easing:          linear (default)
- Properties:      all (borders, shadows)

Modular Lesson Card:
- Initial:         opacity: 0, y: 10
- Animate:         opacity: 1, y: 0
- Duration:        0.2s
- Expand/collapse: height & opacity fade, 0.3s

Module Progress Bar:
- Initial:         width: 0
- Animate:         width: percentage%
- Duration:        0.5s
- Easing:          easeOut
```

### 6.2 Pattern Animations
```
Minimal Animations:
- Page transition:  opacity fade, 0.1s (minimal)
- Item transition:  opacity fade, 0.1s
- Breadcrumb:       text-gray-600 → text-gray-900 hover

Navigation Hover:
- Icon motion:      group-hover:-translate-x-1 / group-hover:translate-x-1
- Transition:       transition-transform
```

---

## 7. FONT & TYPOGRAPHY

### 7.1 Font Family
```
Sans-serif:        var(--font-inter) or system fonts
Body:              -webkit-font-smoothing: antialiased
                   -moz-osx-font-smoothing: grayscale
                   text-rendering: optimizeLegibility
```

### 7.2 Font Weights
```
Regular:           font-normal (400)
Medium:            font-medium (500)
Semibold:          font-semibold (600)
Bold:              font-bold (700)
```

### 7.3 Font Sizes
```
Text Size Hierarchy:

Guides:
- Page title:      text-4xl / text-5xl
- Subtitle:        text-lg / text-xl
- Module title:    text-lg
- Lesson title:    text-base
- Body:            text-sm
- Labels:          text-xs

Patterns:
- Page title:      text-5xl
- Description:     text-lg
- Section title:   text-2xl
- Subsection:      text-xl
- Body:            text-base / text-lg
- Labels:          text-sm / text-xs
```

### 7.4 Line Heights
```
Prose:             leading-relaxed (default prose styling)
Text:              Default (natural/1.5)
Headings:          Default (natural/1.2-1.3)
```

---

## 8. SIMULATOR STYLING RECOMMENDATIONS

### 8.1 Default Styling (Adopt Guides Approach)
```
Card Container:
- bg-surface-primary rounded-xl border border-gray-200 shadow-sm
- hover:border-gray-300 hover:shadow-md
- p-5 (inner padding)
- Spacing between: space-y-4

Title:
- text-lg font-semibold text-text-primary

Description:
- text-sm text-text-secondary

Badges/Labels:
- Status:          StatusBadge component (rounded-full, semantic colors)
- Category:        px-3 py-1 rounded-lg/full text-xs font-medium
- Metadata:        pt-4 border-t border-gray-300

Progress:
- ProgressBar component with green fill
```

### 8.2 Alternative Pattern-Inspired Styling
```
Card Container:
- bg-white rounded-lg border border-gray-200 shadow-sm
- hover:bg-gray-50
- p-6 or p-8

Title:
- text-2xl font-bold text-gray-900

Description:
- text-base text-gray-700

Sections:
- border-b border-gray-300 pb-3 mb-4
- Side-by-side layouts on desktop
```

### 8.3 Unified Design System
```
Use guides-style as base:
✓ Rounded-xl cards (16px border radius)
✓ Subtle shadows (shadow-sm/md)
✓ semantic color system (green for success, blue for info)
✓ text-primary/secondary color hierarchy
✓ Compact spacing (p-5, space-y-4)
✓ Modern badge styles (StatusBadge component)

Can adopt from patterns where beneficial:
✓ Larger typography for emphasis (text-2xl section headers)
✓ Side-by-side layouts for comparisons
✓ Border separators (border-b border-gray-300)
✓ Numbered guidelines styling
```

---

## 9. DESIGN TOKENS SUMMARY

### 9.1 Critical Design Tokens
```
COLORS
- Primary text:         #0d0d0d (light), #fafafa (dark)
- Secondary text:       #525252 (light), #a3a3a3 (dark)
- Borders:              #f9f9f9 (light), #262626 (dark)
- Accents:              #3b82f6 (blue), #10b981 (green), #f59e0b (amber)

SPACING
- Card padding:         20px (guides) / 24-32px (patterns)
- Section spacing:      24px (guides) / 48px (patterns)
- Border radius:        16px cards (guides) / 8px cards (patterns)

TYPOGRAPHY
- Headings:             font-bold / font-semibold
- Body:                 text-sm / text-base
- Labels:               text-xs

SHADOWS
- Subtle:               shadow-sm
- Elevated:             shadow-md
- Hover effect:         upgrade from sm → md

TRANSITIONS
- Standard:             duration-200 / duration-300
- Animations:           opacity fade, y-axis, width growth
```

### 9.2 Implementation Checklist for Simulator
```
[✓] Color scheme: Use accent-primary, text-primary/secondary
[✓] Cards: rounded-xl border border-gray-200 shadow-sm
[✓] Typography: text-lg font-semibold for titles, text-sm for body
[✓] Spacing: p-5 for cards, space-y-4 between sections
[✓] Badges: Use StatusBadge component for status, px-3 py-1 for metadata
[✓] Buttons: Use Button component or button.tsx pattern
[✓] Progress: Use ProgressBar component with green fills
[✓] Borders: border border-gray-200, border-t border-gray-300 for separators
[✓] Hover states: border-gray-300 shadow-md elevation changes
[✓] Transitions: transition-all duration-300
```

---

## 10. QUICK REFERENCE TABLE

| Element | Guides | Patterns | Simulator Recommendation |
|---------|--------|----------|-------------------------|
| **Card Border Radius** | rounded-xl (16px) | rounded-lg (8px) | rounded-xl |
| **Card Padding** | p-5 (20px) | p-6/p-8 (24-32px) | p-5 |
| **Border Color** | border-gray-200/300 | border-gray-200/300 | border-gray-200 |
| **Title Font Size** | text-lg / text-base | text-5xl / text-2xl | text-lg |
| **Title Font Weight** | font-semibold | font-bold | font-semibold |
| **Body Font Size** | text-sm | text-base / text-lg | text-sm |
| **Section Spacing** | space-y-4/6 | space-y-12 | space-y-4 |
| **Shadow (Normal)** | shadow-sm | shadow-sm | shadow-sm |
| **Shadow (Hover)** | shadow-md | shadow-sm | shadow-md |
| **Progress Color** | green-500/600 | N/A | green-500/600 |
| **Badge Style** | StatusBadge (rounded-full) | Numbered circles | StatusBadge |
| **Accent Color** | #0d0d0d / blue | gray (#333-900) | #0d0d0d + blue accents |

---

## 11. IMPLEMENTATION EXAMPLES

### 11.1 Guides-Style Component
```jsx
<div className="bg-surface-primary rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md p-5 space-y-4 transition-all duration-300">
  <h3 className="text-lg font-semibold text-text-primary">Title</h3>
  <p className="text-sm text-text-secondary">Description</p>
  <div className="pt-4 border-t border-gray-300">
    <StatusBadge status="in-progress" />
  </div>
</div>
```

### 11.2 Pattern-Style Section
```jsx
<section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
  <h2 className="text-2xl font-bold text-gray-900 pb-3 mb-4 border-b border-gray-300">
    Implementation Guidelines
  </h2>
  <div className="space-y-4">
    {guidelines.map((g, i) => (
      <div key={i} className="flex items-start">
        <div className="h-6 w-6 flex-shrink-0 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center font-medium text-gray-700 mr-3">
          {i + 1}
        </div>
        <p className="text-gray-700">{g}</p>
      </div>
    ))}
  </div>
</section>
```

### 11.3 Simulator Card (Recommended)
```jsx
// Guides-style with simulator-specific enhancements
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-surface-primary rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-300 p-5 space-y-4"
>
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-subtle flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
    </div>
  </div>
  <div className="pt-4 border-t border-gray-300 space-y-2">
    <StatusBadge status={status} />
  </div>
</motion.div>
```

---

## Summary: Key Takeaways for Simulator

1. **Adopt guides styling** as the primary approach - it's more modern and cohesive
2. **Use the color system** from Tailwind config (accent-primary, text-primary/secondary)
3. **Consistent spacing**: p-5 for cards, space-y-4 between elements
4. **Border radius**: rounded-xl (16px) for a modern look
5. **Subtle shadows**: shadow-sm → shadow-md on hover
6. **Typography hierarchy**: text-lg bold titles, text-sm descriptions
7. **Status indicators**: Use the StatusBadge component (semantic colors)
8. **Transitions**: duration-300 for smooth interactions
9. **Responsive**: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pattern
10. **Dark mode ready**: All colors have dark mode variants in design system

