# Content Quality Audit Skill

Your handbook content guardian! This skill detects formatting issues, inappropriate punctuation, generic phrases, and inconsistent heading styles that make content sound like "AI slop."

## Quick Start

```
/content-audit check src/lib/handbook-content.ts
```

---

## What This Skill Checks

### ✗ Inappropriate Asterisks & Dashes
- `*text*` (italics within sentences) - Remove or use proper formatting
- `**text**` (bold within sentences) - Should be rare, only for emphasis
- `—` (em-dashes for separation) - Replace with periods or commas
- Multiple punctuation marks `!!!` `...` - Use single punctuation

### ✗ Generic AI Phrases ("AI Slop")
- "innovative", "transformative", "cutting-edge"
- "seamlessly", "elegantly", "beautifully"
- "harnesses the power of", "leverages AI"
- "game-changing", "revolutionary", "next-generation"
- "empowering", "enabling", "facilitating"
- Just be specific about what it does

### ✗ Inconsistent Heading Sizes & Styles
- All section headings should use `**Heading Name**` format
- Check that heading font sizes are consistent in CSS
- Headings: "The Idea", "Products Doing It Right", "When to Use"
- All should render at same size and weight

### ✗ Flowery Language Patterns
- Parenthetical asides (use sentences instead)
- Hedge words: "might", "perhaps", "arguably"
- Overly descriptive adjectives
- Marketing-speak that oversells

---

## Examples

### ❌ Before (AI Slop)
"This **innovative pattern** *seamlessly* harnesses the power of AI—offering users a beautifully crafted experience that elegantly transforms how they interact with technology!"

### ✓ After (Clear & Direct)
"This pattern shows users what the AI is thinking. Claude displays step-by-step reasoning. Perplexity shows sources. Users understand the logic."

---

## Heading Font Sizes to Verify

| Heading | CSS Class | Font Size | Weight |
|---------|-----------|-----------|--------|
| The Idea | h3 / strong | 14-15px | 600-700 |
| Products Doing It Right | h3 / strong | 14-15px | 600-700 |
| When to Use | h3 / strong | 14-15px | 600-700 |
| DO ✓ / DON'T ✗ | h3 / strong | 14-15px | 600-700 |
| Key Insight | h3 / strong | 14-15px | 600-700 |

All should be consistent size and weight.

---

## How to Use

### Check for Issues
```
/content-audit check handbook-content.ts
```

Returns: List of issues with line numbers and severity

### Get Suggestions
```
/content-audit suggest handbook-content.ts
```

Returns: Specific fix suggestions for each issue

### Fix All Issues
```
/content-audit fix handbook-content.ts
```

Automatically fixes common issues (use with caution)

---

## Content Quality Standards

✓ Direct over flowery
✓ Specific examples over generic praise
✓ Clear punctuation over dashes
✓ Honest voice over marketing voice
✓ Consistent formatting throughout
✓ No emphasis within normal text

---

## Common Issues & Fixes

| Issue | Count | Fix |
|-------|-------|-----|
| `*word*` italics | Check | Remove italics, use bold if needed |
| `**word**` within sentences | Check | Remove unless critical emphasis |
| Em-dash `—` for separation | Check | Replace with period or comma |
| Generic phrases | Check | Replace with specific examples |
| Inconsistent heading sizes | Check | Ensure all headings same CSS |
| `!!!` multiple marks | Check | Use single punctuation |
| Parenthetical asides | Check | Make them sentences or remove |

---

## Next Steps

Run the audit:
```
/content-audit check src/lib/handbook-content.ts
```

Review report and apply fixes to ensure handbook sounds authentic, not generated.
