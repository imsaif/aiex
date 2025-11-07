# Styling & Typography Standards - Documentation Index

## Overview
Complete styling and typography comparison between Guides and Patterns pages, with recommendations for aligning the simulator styling.

---

## Documentation Files

### 1. STYLING_COMPARISON.md (Main Document)
**Size**: 876 lines | **Content**: Comprehensive detailed analysis
**Best For**: In-depth understanding of all styling systems

**Sections**:
1. Executive Summary
2. Color Scheme (design tokens)
3. Guides Page Styling (layout, cards, typography)
4. Patterns Page Styling (layout, cards, typography)
5. Component Styling Standards (cards, buttons, badges, progress)
6. Spacing & Padding Standards
7. Animations & Transitions
8. Font & Typography
9. **Simulator Styling Recommendations** ⭐
10. Design Tokens Summary
11. Quick Reference Table
12. Implementation Examples

**Key Insight**: Guides use modern modular design (rounded-xl, p-5, semantic colors), Patterns use minimalist grid-based design (rounded-lg, p-6/8, grayscale). **Recommendation: Adopt Guides styling for simulator.**

---

### 2. STYLING_SUMMARY.md (Quick Reference)
**Size**: 207 lines | **Content**: Quick reference with snippets
**Best For**: Fast lookup while coding

**Sections**:
- At a Glance (Guides vs Patterns)
- Simulator Recommendation Table
- Color System
- Component Snippets (ready-to-copy code)
- Key Differences Table
- Tailwind Classes Quick Reference
- Implementation Checklist
- File References
- Pro Tips

**Perfect For**: Copy-paste examples and quick styling lookups during development.

---

### 3. STYLING_FILE_REFERENCE.md (File-by-File Guide)
**Size**: 445 lines | **Content**: Where styling lives in the codebase
**Best For**: Understanding where to find and modify styles

**Sections**:
- Core Design System Files (Tailwind config, globals.css)
- Guides Page Components (CourseCard, ModularLessonCard, ModuleSection)
- Pattern Page Components (detail page sections)
- Reusable UI Components (Button, StatusBadge, ProgressBar, Card)
- Typography Components
- Color Usage Throughout
- Animation & Transition Patterns
- Dark Mode Implementation
- Layout Patterns
- Common Styling Issues & Solutions

**Perfect For**: When you need to know which file defines a specific style or component.

---

## Quick Start Guide

### For the Simulator Styling:

**Step 1: Understand the Systems**
- Read Executive Summary in STYLING_COMPARISON.md
- Compare "Guides" vs "Patterns" sections
- Review Simulator Recommendation (Section 8.1)

**Step 2: Get Implementation Details**
- Open STYLING_SUMMARY.md
- Copy the "Guides-Style Component" snippet
- Customize for your needs

**Step 3: Reference while Coding**
- Use STYLING_SUMMARY.md for quick lookups
- Check STYLING_FILE_REFERENCE.md if you need to find where something is defined
- Reference STYLING_COMPARISON.md for detailed specifications

---

## Key Takeaways

### Guides Page (Use This as Base)
```
rounded-xl (16px radius)
p-5 (20px padding)
space-y-4 / gap-6 (24px spacing)
shadow-sm → shadow-md hover
text-lg semibold titles
text-sm body
border-gray-200 → border-gray-300 hover
StatusBadge components
Green progress indicators
```

### Patterns Page (Reference for Alternative)
```
rounded-lg (8px radius)
p-6/p-8 (24-32px padding)
space-y-12 (48px spacing)
shadow-sm only
text-5xl/text-2xl titles
text-base/text-lg body
border-gray-200/300 separators
Numbered badges
Grayscale color scheme
```

### Simulator Recommendation
**Adopt Guides styling** as the primary approach with Pattern styling as an alternative. This maintains visual consistency with the learning path components.

---

## Design Token Quick Reference

### Colors
```javascript
// Text
text-primary:    #0d0d0d (light) / #fafafa (dark)
text-secondary:  #525252 (light) / #a3a3a3 (dark)

// Surfaces
surface-primary: #ffffff (light) / #0f0f0f (dark)
border:          #f9f9f9 (light) / #262626 (dark)

// Semantics
success: #10b981   error: #ef4444   warning: #f59e0b   info: #3b82f6

// Accents
accent-primary: #0d0d0d (light) / #fafafa (dark)
```

### Spacing
```
Card padding:    p-5 (20px)
Section gap:     gap-6 (24px)
Vertical space:  space-y-4 (16px)
Border padding:  pt-4 (16px)
```

### Typography
```
Page Title:      text-4xl/text-5xl font-bold
Section Title:   text-2xl font-bold
Card Title:      text-lg font-semibold
Body:            text-sm text-text-secondary
Label:           text-xs font-medium
```

### Shadows & Borders
```
Standard:        shadow-sm border border-gray-200
Hover:           shadow-md border border-gray-300
Separator:       border-t border-gray-300
```

---

## Component Usage Examples

### Guides-Style Card (Recommended for Simulator)
```jsx
<div className="bg-surface-primary rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md p-5 space-y-4 transition-all duration-300">
  <h3 className="text-lg font-semibold text-text-primary">Title</h3>
  <p className="text-sm text-text-secondary">Description</p>
  <div className="pt-4 border-t border-gray-300">
    <StatusBadge status="in-progress" />
  </div>
</div>
```

### Responsive Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-6">
  {/* Cards go here */}
</div>
```

### Button Patterns
```jsx
// Primary
<button className="rounded-full px-8 py-3 bg-accent-primary text-background-primary hover:bg-accent-hover transition-colors">

// Secondary  
<button className="rounded-full px-4 py-2 border border-gray-200 bg-surface-primary text-text-primary hover:bg-accent-subtle transition-colors">
```

---

## Implementation Checklist

Use this when styling the simulator:

- [ ] **Colors**: Use `text-primary`, `text-secondary`, `accent-primary` (never hardcode)
- [ ] **Cards**: `bg-surface-primary rounded-xl border border-gray-200 shadow-sm`
- [ ] **Hover**: `hover:border-gray-300 hover:shadow-md`
- [ ] **Padding**: `p-5` for cards, consistent throughout
- [ ] **Spacing**: `space-y-4` for vertical, `gap-6` for grids
- [ ] **Typography**: `text-lg font-semibold` for titles, `text-sm` for body
- [ ] **Badges**: Use `StatusBadge` component, not custom
- [ ] **Progress**: Use `ProgressBar` component with green
- [ ] **Separators**: `pt-4 border-t border-gray-300`
- [ ] **Animations**: `transition-all duration-300` standard
- [ ] **Responsive**: `sm:`, `md:`, `lg:` prefixes for mobile
- [ ] **Dark Mode**: Automatically supported via CSS variables
- [ ] **Test**: Verify both light and dark mode

---

## File Locations for Reference

### Configuration
- **Tailwind Design Tokens**: `/tailwind.config.mjs`
- **CSS Variables & Theme**: `/src/app/globals.css`

### Guides Components
- **Course/Guide Cards**: `/src/components/ui/CourseCard.tsx`, `GuideCard.tsx`
- **Lesson Cards**: `/src/components/ui/ModularLessonCard.tsx`
- **Module Sections**: `/src/components/ui/ModuleSection.tsx`
- **Guides Listing**: `/src/app/guides/guides-client.tsx`
- **Guide Details**: `/src/app/guides/[slug]/guide-client.tsx`

### Pattern Components
- **Pattern Details**: `/src/app/patterns/[slug]/client-page.tsx`

### Reusable Components
- **Button**: `/src/components/ui/Button.tsx`
- **Status Badge**: `/src/components/ui/StatusBadge.tsx`
- **Progress Bar**: `/src/components/ui/ProgressBar.tsx`
- **Card**: `/src/components/ui/Card.tsx`

---

## When to Reference Which Document

| Situation | Document | Section |
|-----------|----------|---------|
| "I need the complete styling overview" | STYLING_COMPARISON.md | Executive Summary + Section 1 |
| "What colors should I use?" | STYLING_SUMMARY.md | Color System |
| "I need example code now" | STYLING_SUMMARY.md | Component Snippets |
| "Where is the border-radius defined?" | STYLING_FILE_REFERENCE.md | Core Design System |
| "How do I style a card?" | STYLING_COMPARISON.md | Section 4.1 + STYLING_SUMMARY.md |
| "What spacing should I use?" | STYLING_COMPARISON.md | Section 5 + STYLING_SUMMARY.md |
| "How do animations work?" | STYLING_COMPARISON.md | Section 6 |
| "Which component should I use?" | STYLING_FILE_REFERENCE.md | Reusable UI Components |
| "How do I support dark mode?" | STYLING_FILE_REFERENCE.md | Dark Mode Implementation |
| "I'm getting color issues" | STYLING_FILE_REFERENCE.md | Common Styling Issues & Solutions |

---

## Key Differences at a Glance

### Visual Comparison

**Guides (Modern)**
- Rounded corners: 16px (rounded-xl)
- Card padding: 20px (p-5)
- Spacing: 24px gaps (gap-6)
- Shadows: Subtle + hover upgrade
- Colors: Dark text, accent primary
- Badges: StatusBadge with semantic colors
- Animations: 0.3s transitions, smooth

**Patterns (Minimalist)**
- Rounded corners: 8px (rounded-lg)
- Card padding: 24-32px (p-6/p-8)
- Spacing: 48px gaps (space-y-12)
- Shadows: Minimal
- Colors: Grayscale
- Badges: Numbered circles
- Animations: Minimal, 0.1s

**Simulator (Guides-Based)**
- Rounded corners: 16px (rounded-xl) ✓
- Card padding: 20px (p-5) ✓
- Spacing: 24px gaps (gap-6) ✓
- Shadows: Subtle + hover upgrade ✓
- Colors: Dark text, accent primary ✓
- Badges: StatusBadge with semantic colors ✓
- Animations: 0.3s transitions ✓

---

## Pro Tips

1. **Design System First**: Always use Tailwind classes, never hardcode colors
2. **Consistency Matters**: Guides components are cohesive - maintain that pattern
3. **Dark Mode Ready**: All colors automatically support dark mode via CSS variables
4. **Test Both Themes**: Always check light and dark mode rendering
5. **Mobile First**: Use responsive breakpoints (sm:, md:, lg:) from the start
6. **Shadows for Depth**: Use shadow-sm → shadow-md for interactive feedback
7. **Typography Hierarchy**: Match font sizes and weights exactly
8. **Spacing Rhythm**: Use consistent spacing (p-5, space-y-4) throughout
9. **Component Reuse**: Use Button, StatusBadge, ProgressBar, Card components
10. **Animation Duration**: Keep transitions brief (0.2-0.3s) for snappy feel

---

## Summary

This documentation package provides everything needed to style the simulator with consistency and alignment to the existing design system. The **STYLING_SUMMARY.md** is best for quick reference during coding, while **STYLING_COMPARISON.md** provides the complete rationale and detailed specifications. **STYLING_FILE_REFERENCE.md** helps locate and understand specific files.

**Key Recommendation**: Adopt Guides styling (rounded-xl, p-5, semantic colors) as the primary approach for maximum visual consistency with the learning platform.

---

**Last Updated**: November 8, 2025
**Files Generated**: 3 documents (1,528 lines total)
**Scope**: Complete styling standards analysis for Guides vs Patterns pages
**Target**: Simulator integration and component styling alignment

