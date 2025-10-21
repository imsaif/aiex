---
name: Pattern Development
description: Guide through updating AI design patterns with comprehensive checklist completion, code examples, images, documentation, and interactive demos
---

# Pattern Development Skill

This skill helps you update one of the 12 AI design patterns that require comprehensive review and updates. It ensures every pattern is fully completed with all components before moving to the next one.

## When to Use This Skill

Claude will automatically invoke this skill when:
- You ask to "work on a pattern"
- You request "update a design pattern"
- You mention "complete pattern work"
- You want to "finish a pattern"

## Available Patterns Requiring Updates (12)

1. **Predictive Anticipation** - Proactive suggestions and actions
2. **Ambient Intelligence** - Context-aware background processing
3. **Confidence Visualization** - Displaying AI certainty levels
4. **Safe Exploration** - Risk-free experimentation environments
5. **Feedback Loops** - Continuous learning from user interactions
6. **Graceful Handoff** - Seamless transitions between AI and humans
7. **Context Switching** - Managing multiple conversation contexts
8. **Intelligent Caching** - Smart data persistence strategies
9. **Progressive Enhancement** - Layered feature availability
10. **Privacy-First Design** - Data minimization and user control
11. **Selective Memory** - User-controlled AI memory management
12. **Universal Access Patterns** - Inclusive design for all users

## Pattern Completion Checklist

Each pattern must have ALL of the following completed before marking as done:

- [ ] **Code Examples** - Working implementations with titles, descriptions, and code samples
- [ ] **Images & Visuals** - Optimized images, examples, diagrams with alt text
- [ ] **Text Content** - Description, use cases, key benefits clearly written
- [ ] **Guidelines** - Best practices and recommendations for using the pattern (minimum 1)
- [ ] **Considerations** - Important trade-offs and considerations (minimum 1)
- [ ] **Figma Prompts** - Design prompts for creating visual assets
- [ ] **Interactive Demo** - Working React component demonstration at `/patterns/[slug]`
- [ ] **Component Tests** - Comprehensive tests for the demo component
- [ ] **Validation Passed** - Run `npm run test:patterns` successfully
- [ ] **Browser Review** - Review pattern at http://localhost:3000 and verify all looks good

## Workflow

### Step 1: Select Your Pattern
Ask which pattern you want to work on, or I'll suggest the next priority pattern.

### Step 2: Review Current State
```bash
# Check existing pattern structure
npm run list-patterns
```
Examine what exists and what's missing from the checklist.

### Step 3: Work Through Checklist Items
For EACH checklist item, follow these steps:

#### Code Examples
- Review existing code at `src/data/patterns/patterns/[pattern-slug]/code-examples.ts`
- Add/update 2-3 working code examples
- Include practical use cases
- Ensure code is properly formatted and runnable

#### Images & Visuals
- Add 1-2 high-quality images to `public/images/patterns/[pattern-slug]/`
- Use WebP/AVIF formats (run `npm run optimize-images`)
- Include descriptive alt text
- Ensure images are 800-1200px width

#### Text Content
- Update `src/data/patterns/patterns/[pattern-slug]/index.ts`
- Write clear description (2-3 paragraphs)
- List 3-5 use cases
- Include key benefits and real-world applications

#### Guidelines
- Add to `guidelines.ts` in pattern directory
- Provide 3-5 actionable guidelines
- Each should be specific and implementable
- Include when to use and when NOT to use

#### Considerations
- Add to `considerations.ts` in pattern directory
- Document trade-offs and limitations
- Include accessibility considerations
- Note performance implications if any

#### Figma Prompts
- Create design prompts that help generate visuals
- Store in pattern's data file
- Should describe UI states and interactions

#### Interactive Demo Component
- Create React component at `src/components/examples/[PatternName]Example.tsx`
- Make it interactive and demonstrate the pattern in action
- Use existing component patterns and Tailwind styling
- Include explanatory text and controls

#### Component Tests
- Create test file at `src/components/examples/__tests__/[PatternName]Example.test.tsx`
- Test interactions, rendering, state changes
- Aim for 80%+ coverage of the component

#### Validation
```bash
npm run test:patterns
```
All pattern data must validate successfully against the Zod schema.

#### Browser Review
1. Start dev server: `npm run dev`
2. Navigate to the pattern: `http://localhost:3000/patterns/[pattern-slug]`
3. Review visuals, demo, and all content
4. Test interactive demo component
5. Check responsive design on mobile

### Step 4: Mark Complete
Only when ALL 10 checklist items are 100% complete, mark the pattern as done.

### Step 5: Move to Next Pattern
Select the next pattern from the list and repeat.

## Commands Reference

```bash
# List all patterns and their status
npm run list-patterns

# Validate pattern data structure
npm run test:patterns

# Generate missing pattern components (if needed)
npm run generate-pattern

# Start development server
npm run dev

# Run tests for specific pattern
npm test -- --testPathPattern="pattern-slug"

# Optimize images
npm run optimize-images
```

## Important Rules

⚠️ **Stay Focused**: Work on ONE pattern at a time. Do not jump to another pattern until the current one is 100% complete with all checklist items done.

✅ **Complete Everything**: Don't skip items. Every checklist item matters for consistency and user experience.

🎯 **Quality First**: Focus on making each pattern excellent rather than rushing through them.

📱 **Test Thoroughly**: Always review in browser and test on mobile before marking complete.

## Pattern Structure Reference

Each pattern at `src/data/patterns/patterns/[pattern-slug]/` should have:

```
[pattern-slug]/
├── index.ts                    # Main pattern data with metadata
├── code-examples.ts           # Working code examples
├── guidelines.ts              # Best practices and guidelines
└── considerations.ts          # Trade-offs and considerations
```

Plus:
- Demo component: `src/components/examples/[PatternName]Example.tsx`
- Demo test: `src/components/examples/__tests__/[PatternName]Example.test.tsx`
- Images: `public/images/patterns/[pattern-slug]/`

## Success Criteria

A pattern is complete when:

✅ All 10 checklist items are checked
✅ `npm run test:patterns` passes with no validation errors
✅ Pattern displays correctly at http://localhost:3000/patterns/[slug]
✅ Interactive demo works smoothly
✅ Mobile responsive design verified
✅ All code examples work as expected
✅ Images are optimized and load quickly

## Next Steps After Pattern Completion

1. Commit changes with pattern name in message
2. Move to next pattern from the list
3. Repeat the workflow
4. Track progress toward 24/24 patterns complete

---

**Project Goal**: Complete all 24 AI design patterns with comprehensive implementations, interactive demos, and documentation. Currently: 12/24 complete, 12 require updates.
