# Brand Color Mapping & Auto-Fix Rules

## Tailwind Class Mappings

### ❌ → ✅ Automatic Fixes

#### Background Colors
| Violation | Fix | Reason |
|-----------|-----|--------|
| `bg-blue-600`, `bg-blue-700` | `bg-accent-primary` | Primary action buttons |
| `bg-purple-600`, `bg-purple-700` | `bg-accent-primary` | Remove purple from brand |
| `bg-gradient-to-r from-blue-600 to-purple-600` | `bg-accent-primary` | Replace gradients with solid black |
| `bg-indigo-600` | `bg-accent-primary` | Keep accent consistent |
| `bg-teal-600`, `bg-cyan-600` | `bg-background-secondary` | Use neutrals |
| `bg-red-50`, `bg-green-50` | Keep as-is | Semantic colors OK for status |

#### Text Colors
| Violation | Fix | Reason |
|-----------|-----|--------|
| `text-blue-600`, `text-blue-700` | `text-accent-primary` | Interactive text |
| `text-purple-600` | `text-accent-primary` | Remove purple |
| `text-white` | `text-background-primary` | Use CSS variable |
| `text-gray-500`, `text-gray-600` | `text-text-secondary` | Use design system |

#### Border Colors
| Violation | Fix | Reason |
|-----------|-----|--------|
| `border-blue-600` | `border-border-interactive` | Interactive borders |
| `border-purple-600` | `border-border-focus` | Use black border |
| `border-gray-300` | `border-border-secondary` | Use design system |

#### Hover States
| Violation | Fix | Reason |
|-----------|-----|--------|
| `hover:bg-blue-700` | `hover:bg-accent-hover` | Consistent hover states |
| `hover:text-purple-600` | `hover:text-accent-primary` | Remove purple |
| `hover:border-blue-700` | `hover:border-border-interactive-hover` | Consistent interactivity |

---

## Inline Styles

### ❌ Violations → ✅ Fixes

#### SVG Fill/Stroke
```tsx
// ❌ Wrong
<svg fill="#667eea">...</svg>
<svg stroke="#8B5CF6">...</svg>

// ✅ Correct
<svg fill="currentColor" className="text-accent-primary">...</svg>
<svg stroke="currentColor" className="text-accent-primary">...</svg>
```

#### Inline Colors
```tsx
// ❌ Wrong
style={{ backgroundColor: '#667eea', color: '#8B5CF6' }}

// ✅ Correct
className="bg-accent-primary text-accent-primary"
```

#### CSS Variables
```tsx
// ❌ Wrong
style={{ color: '#0d0d0d' }}

// ✅ Correct
style={{ color: 'var(--text-primary)' }}
```

---

## CSS/SCSS Violations

### ❌ → ✅ Replacements

#### Color Declarations
```css
/* ❌ Wrong */
.button {
  background: #667eea;
  color: #ffffff;
  border: 1px solid #8B5CF6;
}

/* ✅ Correct */
.button {
  background: var(--accent-primary);
  color: var(--background-primary);
  border: 1px solid var(--border-focus);
}
```

#### Gradient Backgrounds
```css
/* ❌ Wrong */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* ✅ Correct */
.hero {
  background: var(--background-primary);
}
```

---

## Component Pattern Fixes

### ❌ Button with Gradient (Violation)
```tsx
<button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg">
  Click me
</button>
```

### ✅ Brand-Compliant Button
```tsx
<button className="bg-accent-primary text-background-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover cursor-pointer">
  Click me
</button>
```

---

### ❌ Colorful Icon (Violation)
```tsx
<svg className="text-blue-600" fill="currentColor">
  <circle cx="12" cy="12" r="10" />
</svg>
```

### ✅ Brand-Compliant Icon
```tsx
<svg className="text-accent-primary" fill="currentColor">
  <circle cx="12" cy="12" r="10" />
</svg>
```

---

### ❌ Alert with Blue (Violation)
```tsx
<div className="bg-blue-50 text-blue-600 border border-blue-200">
  Information message
</div>
```

### ✅ Semantic Alert (Correct)
```tsx
// Use appropriate semantic color based on message type
<div className="bg-green-50 text-green-600 border border-green-200">
  Success message
</div>

<div className="bg-red-50 text-red-600 border border-red-200">
  Error message
</div>

<div className="bg-yellow-50 text-yellow-600 border border-yellow-200">
  Warning message
</div>
```

---

## File-by-File Fixes

### React Components
**Location:** `src/components/**/*.tsx`

```tsx
// ❌ Common Violation
className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"

// ✅ Corrected
className="bg-accent-primary text-background-primary"
```

### Page Components
**Location:** `src/app/**/*.tsx`

```tsx
// ❌ Common Violation
style={{ backgroundColor: '#667eea' }}

// ✅ Corrected
className="bg-accent-primary"
```

### CSS Files
**Location:** `src/**/*.css`

```css
/* ❌ Common Violation */
color: #667eea;

/* ✅ Corrected */
color: var(--accent-primary);
```

### Tailwind Config
**Location:** `tailwind.config.mjs`

Verify no hardcoded non-brand colors in extend section.

---

## Priority Fixes (High Impact)

### 🔴 Critical (Fix Immediately)
1. **Gradient buttons** - Replace with solid black
2. **Purple anywhere** - Always replace with black
3. **Blue gradients** - Change to black
4. **Cyan/Teal interactive** - Replace with black

### 🟠 Important (Fix Soon)
1. **Inline color hex values** - Use CSS variables
2. **SVG hardcoded fills** - Use currentColor + class
3. **Hardcoded grays** - Use design system grays

### 🟡 Nice-to-Have (Fix When Refactoring)
1. **Redundant color classes** - Consolidate
2. **Legacy color naming** - Use new system names
3. **Unused color utilities** - Remove

---

## Testing & Validation

### Before Commit
```bash
# Check file for violations
/brand-colors check src/components/MyComponent.tsx

# Fix automatically
/brand-colors fix src/components/MyComponent.tsx

# Full report
/brand-colors report
```

### What to Look For
- [ ] No gradients (solid colors only)
- [ ] No purple, blue (except `#3b82f6` for interactive)
- [ ] No hardcoded hex colors (use CSS variables)
- [ ] All buttons use `bg-accent-primary`
- [ ] All text uses `text-` CSS variables
- [ ] Semantic colors only for status (green=success, red=error, amber=warning)

---

## Quick Reference Card

### Your Brand Colors (Remember These!)
```
Primary:      #0d0d0d (black)
Secondary:    #ffffff (white)
Neutral:      #525252, #737373, #a3a3a3 (grays)
Interactive:  #3b82f6 (blue focus rings only)
Success:      #10b981
Error:        #ef4444
Warning:      #f59e0b
```

### Default Classes
```
Primary button:    bg-accent-primary text-background-primary
Secondary text:    text-text-secondary
Disabled:         text-text-disabled
Interactive:      border-border-interactive
```

---

## Questions?

When unsure about a color:
1. **Is it black/white?** → Use it
2. **Is it gray?** → Check design system
3. **Is it blue?** → Only for focus rings
4. **Is it anything else?** → Ask the skill or check CSS variables

**Remember: Simple, minimal, high contrast = AIUX brand DNA** 🎨
