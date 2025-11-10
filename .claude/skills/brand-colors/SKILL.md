# 🎨 Brand Color Enforcement Skill

This skill helps maintain AIUX brand color consistency throughout development. It enforces the black & white color palette across all files.

## Brand Color Palette

### ✅ **APPROVED COLORS**
- **Black (Primary):** `#0d0d0d`, `#111827`, `#000000`
- **White (Primary):** `#ffffff`, `#fafafa`, `#f9f9f9`, `#f5f5f5`
- **Grey (Neutrals):** `#262626`, `#404040`, `#525252`, `#737373`, `#a3a3a3`, `#e5e5e5`
- **Blue (Interactive Only):** `#3b82f6` (focus rings, links only)
- **Semantic Colors (Status):** `#10b981` (success), `#ef4444` (error), `#f59e0b` (warning)

### ❌ **PROHIBITED COLORS** (Brand Violations)
- Blue gradients: `from-blue-600 to-purple-600`
- Purple: `#8B5CF6`, `#764ba2`, `#667eea`
- Pink/Magenta: `#db2777`, `#f472b6`, `#ec4899`
- Cyan/Teal: `#06b6d4`, `#14b8a6`
- Green (except semantic): `#10b981` is OK only for success states
- Orange: `#f97316`, `#f59e0b` is OK only for warning states

## Usage

### Check a file for brand color violations:
```
/brand-colors check src/components/MyComponent.tsx
```

### Check entire directory:
```
/brand-colors check src/components/
```

### Fix a file automatically:
```
/brand-colors fix src/components/MyComponent.tsx
```

### Generate brand color report:
```
/brand-colors report
```

### Help (see all commands):
```
/brand-colors help
```

## Common Violations & Fixes

### ❌ Gradient Buttons (Violation)
```tsx
className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
```

### ✅ Black Button (Correct)
```tsx
className="bg-accent-primary text-background-primary hover:bg-accent-hover"
```

---

### ❌ Colorful Icons (Violation)
```tsx
<svg fill="#667eea">...</svg>
```

### ✅ Black Icon (Correct)
```tsx
<svg fill="currentColor" className="text-accent-primary">...</svg>
```

---

### ❌ Blue Alert (Violation)
```tsx
className="bg-blue-100 text-blue-600"
```

### ✅ Semantic Alert (Correct)
```tsx
className="bg-red-50 text-red-600" // or green, amber for their status
```

## What This Skill Does

1. **Scans files** for non-approved colors in:
   - Tailwind classes (bg-*, text-*, border-*, etc.)
   - Inline styles (style={{color: ...}})
   - SVG fill/stroke attributes
   - CSS hex values

2. **Reports violations** with:
   - File location
   - Line number
   - Current color
   - Suggested replacement
   - Reason (e.g., "Use black for primary CTA")

3. **Auto-fixes** common violations:
   - `from-blue-600 to-purple-600` → `bg-accent-primary`
   - `text-blue-600` → `text-accent-primary`
   - `bg-blue-50` → `bg-accent-subtle`
   - And more...

4. **Generates reports** showing:
   - Brand compliance score
   - Violations by type
   - Most violated patterns
   - Recommendations

## When to Use This Skill

✅ **Before committing code** - "Check my changes for brand colors"
✅ **After adding new features** - "Make sure I didn't use wrong colors"
✅ **During component creation** - "Fix this component to use brand colors"
✅ **Refactoring** - "Ensure all old color schemes are replaced"

## Integration with Your Workflow

### Option 1: Quick Check
```
You: "I just created a new button component, check the colors"
Skill: Scans the file and reports violations
You: Fix any issues
```

### Option 2: Full Audit
```
You: "/brand-colors report"
Skill: Generates full codebase color compliance report
You: Address high-priority violations first
```

### Option 3: Auto-Fix (Recommended for Large Changes)
```
You: "/brand-colors fix src/components/"
Skill: Auto-fixes all common violations
You: Review the changes and commit
```

## Examples in Your Codebase

### ✅ Good Examples (Already Compliant)
- `src/components/layout/Navbar.tsx` - Uses `bg-accent-primary` correctly
- `src/components/ui/Button.tsx` - Uses `text-background-primary` for contrast
- `src/app/globals.css` - Uses CSS variables for consistency

### ⚠️ Items That Need Review
- Any new components with Tailwind color classes
- Any SVG files with explicit fill colors
- Any inline styles with hex colors

## Tips for Brand Color Compliance

1. **Use CSS Variables** - Prefer `bg-accent-primary` over `bg-black`
2. **Use Tailwind Accent Class** - Built into your design system
3. **Reserve Blue for Interactive** - Only use `#3b82f6` for focus rings, links
4. **Think "High Contrast"** - Black on white, white on black = brand DNA
5. **Test Accessibility** - Your black & white is WCAG AAA compliant

## Questions?

When building components, ask the skill:
- "Is this color brand-compliant?"
- "What should I use instead of [color]?"
- "How do I add a new accent without breaking brand?"

The skill will guide you! 🎨
