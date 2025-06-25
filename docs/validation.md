# Pattern Validation Guide

This guide explains the validation system for AI Design Patterns, helping contributors ensure their patterns meet quality standards.

## Overview

The validation system uses [Zod](https://zod.dev/) schemas to enforce runtime type safety and data quality for all patterns and categories. Validation happens at multiple levels:

1. **Schema Validation**: Ensures data structure compliance
2. **Content Validation**: Checks string lengths, formats, and required fields
3. **Relationship Validation**: Verifies pattern references exist
4. **Asset Validation**: Confirms image paths and extensions are valid

## Pattern Structure Requirements

### Core Fields

| Field | Type | Requirements |
|-------|------|--------------|
| `id` | string | • Lowercase with hyphens only<br>• Must match slug<br>• Example: `contextual-assistance` |
| `title` | string | • 1-100 characters<br>• Example: `Contextual Assistance` |
| `slug` | string | • Must match id exactly |
| `description` | string | • 20-200 characters<br>• Brief, clear summary |
| `category` | enum | • Must be one of the predefined categories |
| `thumbnail` | string | • Optional<br>• Valid image path |

### Content Fields

| Field | Type | Requirements |
|-------|------|--------------|
| `problem` | string | • 10-1000 characters<br>• Clear problem statement |
| `solution` | string | • 10-1000 characters<br>• Concrete solution description |
| `examples` | array | • At least 1 example required<br>• Each must have title, description, image, altText |
| `guidelines` | array | • At least 1 guideline required<br>• Non-empty strings |
| `considerations` | array | • At least 1 consideration required<br>• Non-empty strings |
| `codeExamples` | array | • Optional<br>• Each must have title, description, code, language |
| `relatedPatterns` | array | • Optional<br>• Pattern titles must exist |

### Valid Categories

The following categories are accepted:

- `Contextual Assistance`
- `Progressive Disclosure`
- `Human-in-the-Loop`
- `Conversational UI`
- `Explainable AI`
- `Guided Learning`
- `Adaptive Interfaces`
- `Multimodal Interaction`
- `Augmented Creation`
- `Responsible AI Design`
- `Error Recovery`
- `Collaborative AI`
- `Ambient Intelligence`
- `Safe Exploration`

## Image Requirements

### Path Format
- Must start with `/` (relative) or `http://` or `https://` (absolute)
- Example: `/images/examples/pattern.png`

### Supported Extensions
- `.jpg`, `.jpeg`
- `.png`
- `.webp`
- `.gif`
- `.svg`

Extensions are case-insensitive.

## Example Schema

### Valid Pattern Example

```typescript
const validPattern: Pattern = {
  id: 'contextual-assistance',
  title: 'Contextual Assistance',
  slug: 'contextual-assistance',
  description: 'Provide timely help and suggestions based on the user\'s current task and context',
  category: 'Contextual Assistance',
  thumbnail: '/images/patterns/contextual-assistance.png',
  content: {
    problem: 'Users often need help but don\'t know what to ask for or where to find it',
    solution: 'Proactively offer relevant assistance based on user behavior and context',
    examples: [
      {
        title: 'Google Smart Compose',
        description: 'Predicts and suggests text completions while typing emails',
        image: '/images/examples/smart-compose.gif',
        altText: 'Google Smart Compose suggesting email text completions'
      }
    ],
    guidelines: [
      'Provide suggestions at the right moment',
      'Make assistance non-intrusive',
      'Allow easy dismissal of suggestions'
    ],
    considerations: [
      'Avoid being too aggressive with suggestions',
      'Respect user privacy and preferences',
      'Consider performance impact of real-time analysis'
    ],
    codeExamples: [],
    relatedPatterns: ['Progressive Disclosure', 'Conversational UI']
  }
};
```

## Validation Tools

### 1. Development-Time Validation

Patterns are automatically validated when loaded in development mode. Check the console for validation errors.

### 2. Test Suite Validation

Run pattern validation tests:

```bash
npm test -- --testPathPattern=patterns.test.ts
```

Run category validation tests:

```bash
npm test -- --testPathPattern=categories.test.ts
```

### 3. Validation Utilities

Import validation utilities in your code:

```typescript
import { 
  validatePatternDetailed,
  isValidImagePath,
  isValidColor,
  generatePatternValidationReport 
} from '@/utils/validation';

// Validate a pattern
const result = validatePatternDetailed(myPattern);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

// Check image path
if (!isValidImagePath('/images/example.png')) {
  console.error('Invalid image path');
}

// Generate a validation report
const report = generatePatternValidationReport(myPattern);
console.log(report);
```

### 4. CLI Validation

Use the validation script:

```bash
node scripts/validate-patterns.js
```

## Common Validation Errors

### 1. ID/Slug Mismatch
```
Error: Pattern ID and slug must match
Fix: Ensure both use the same lowercase-hyphenated format
```

### 2. Description Too Short
```
Error: Description must be at least 20 characters
Fix: Provide a more detailed description
```

### 3. Invalid Category
```
Error: Invalid enum value
Fix: Use one of the predefined categories exactly as shown
```

### 4. Missing Required Fields
```
Error: Required at path "content.examples"
Fix: Ensure at least one example is provided
```

### 5. Invalid Image Path
```
Error: Image path must be a relative path starting with / or a valid URL
Fix: Start paths with / or use full URLs
```

## Best Practices

1. **Validate Early**: Test your patterns during development
2. **Use TypeScript**: Leverage type checking to catch errors early
3. **Follow Examples**: Reference existing patterns for structure
4. **Test Relationships**: Ensure related patterns exist
5. **Check Assets**: Verify all referenced images exist
6. **Meaningful Content**: Write clear, helpful descriptions
7. **Accessibility**: Always include alt text for images

## Extending Validation

To add new validation rules:

1. Update the Zod schema in `src/schemas/pattern.schema.ts`
2. Add corresponding TypeScript types in `src/types/index.ts`
3. Update validation utilities if needed
4. Add tests for new validation rules
5. Update this documentation

## Need Help?

If you encounter validation issues:

1. Check the error message carefully
2. Refer to this guide and examples
3. Look at existing patterns for reference
4. Run the test suite to see detailed errors
5. Ask for help in project discussions 