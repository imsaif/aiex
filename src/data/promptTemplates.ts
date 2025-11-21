import { PromptTemplate } from '@/types/promptBuilder';

export const promptTemplates: PromptTemplate[] = [
  {
    id: 'react-tailwind-component',
    name: 'React + Tailwind Component',
    description: 'Build UI components with React and Tailwind CSS',
    icon: 'cube',
    category: 'component',
    defaultValues: {
      aiTool: 'claude',
      useCase: 'component',
      designSystem: {
        componentLibrary: 'Tailwind CSS',
      },
      projectContext: 'Building a React application with TypeScript and Tailwind CSS',
      specificTask: 'Create a reusable button component with multiple variants',
    },
    promptTemplate: `You are an expert React and Tailwind CSS developer. I need help building UI components that follow modern best practices.

**Design System:**
{designSystem}

**Project Context:**
{projectContext}

**Task:**
{specificTask}

**Requirements:**
- Use TypeScript with proper type definitions
- Follow React best practices (hooks, composition)
- Use Tailwind CSS utility classes
- Include accessibility attributes (ARIA labels, keyboard navigation)
- Make components responsive
- Support dark mode if applicable
- Include JSDoc comments explaining props

Please provide clean, production-ready code with explanations.`,
  },
  {
    id: 'design-system-context',
    name: 'Design System Context',
    description: 'Teach AI about your design system and brand',
    icon: 'paint-brush',
    category: 'project-setup',
    defaultValues: {
      aiTool: 'cursor',
      useCase: 'project-setup',
      projectContext: 'Explain your design system, color palette, typography, spacing, and component patterns',
    },
    promptTemplate: `# Design System and Project Context

## Design System
{designSystem}

## Project Information
{projectContext}

## Code Style Preferences
- Use TypeScript for type safety
- Follow functional programming patterns
- Prefer composition over inheritance
- Write self-documenting code with clear variable names
- Include inline comments for complex logic

## Component Guidelines
- Keep components small and focused (single responsibility)
- Use consistent prop naming conventions
- Extract reusable logic into custom hooks
- Ensure all interactive elements are keyboard accessible
- Test edge cases and loading/error states

## Naming Conventions
- Components: PascalCase (e.g., UserProfile)
- Functions: camelCase (e.g., handleSubmit)
- Constants: SCREAMING_SNAKE_CASE (e.g., API_BASE_URL)
- CSS classes: kebab-case or utility classes

Remember these guidelines when helping me build features or components.`,
  },
  {
    id: 'debug-helper',
    name: 'Debug Helper',
    description: 'Troubleshoot and fix code issues',
    icon: 'bug-ant',
    category: 'code-help',
    defaultValues: {
      aiTool: 'chatgpt',
      useCase: 'code-help',
      specificTask: 'Help me debug an error or unexpected behavior',
    },
    promptTemplate: `I need help debugging an issue in my code.

**Project Context:**
{projectContext}

**The Problem:**
{specificTask}

**What I've Tried:**
[Describe troubleshooting steps you've already taken]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Error Messages:**
[Paste any error messages or console output]

Please help me:
1. Identify the root cause of the issue
2. Suggest a fix with explanations
3. Recommend how to prevent similar issues in the future
4. Point out any potential side effects of the fix`,
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Connect to REST APIs or GraphQL endpoints',
    icon: 'arrows-right-left',
    category: 'component',
    defaultValues: {
      aiTool: 'claude',
      useCase: 'component',
      specificTask: 'Integrate with an external API',
    },
    promptTemplate: `I need help integrating with an API in my application.

**Project Context:**
{projectContext}

**API Integration Task:**
{specificTask}

**Requirements:**
- Implement proper error handling
- Add loading states
- Handle network failures gracefully
- Use TypeScript types for API responses
- Implement request/response caching if appropriate
- Add retry logic for failed requests
- Sanitize and validate API data before using it

**Please provide:**
1. Type definitions for API responses
2. API client/service code
3. React hooks or components for data fetching
4. Error boundary implementation
5. Loading and error state UI components`,
  },
  {
    id: 'accessibility-audit',
    name: 'Accessibility Audit',
    description: 'Improve accessibility and WCAG compliance',
    icon: 'eye',
    category: 'code-help',
    defaultValues: {
      aiTool: 'claude',
      useCase: 'code-help',
      specificTask: 'Audit my component for accessibility issues',
    },
    promptTemplate: `I need help improving the accessibility of my code.

**Project Context:**
{projectContext}

**Component/Feature:**
{specificTask}

**Accessibility Requirements:**
- WCAG 2.1 AA compliance minimum
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes
- Color contrast compliance (4.5:1 for text)
- Focus indicators visible
- Semantic HTML structure
- Support for reduced motion preferences

**Please review and provide:**
1. List of accessibility issues found
2. Fixes for each issue with code examples
3. Testing recommendations (tools, manual tests)
4. Best practices to maintain accessibility`,
  },
  {
    id: 'performance-optimization',
    name: 'Performance Optimization',
    description: 'Speed up rendering and reduce bundle size',
    icon: 'bolt',
    category: 'code-help',
    defaultValues: {
      aiTool: 'cursor',
      useCase: 'code-help',
      specificTask: 'Optimize component performance',
    },
    promptTemplate: `I need help optimizing the performance of my application.

**Project Context:**
{projectContext}

**Performance Issue:**
{specificTask}

**Optimization Goals:**
- Reduce initial bundle size
- Improve render performance
- Minimize unnecessary re-renders
- Optimize images and assets
- Implement code splitting
- Add proper memoization
- Lazy load components

**Please analyze and provide:**
1. Performance bottlenecks identified
2. Specific optimization recommendations
3. Code examples showing before/after
4. Trade-offs of each optimization
5. Metrics to measure improvement`,
  },
  {
    id: 'typescript-types',
    name: 'TypeScript Types',
    description: 'Create type-safe interfaces and types',
    icon: 'code-bracket-square',
    category: 'code-help',
    defaultValues: {
      aiTool: 'copilot',
      useCase: 'code-help',
      specificTask: 'Define TypeScript types for my data structures',
    },
    promptTemplate: `I need help creating TypeScript type definitions.

**Project Context:**
{projectContext}

**Type Definition Needed:**
{specificTask}

**Type Requirements:**
- Strict type safety (no 'any' types)
- Use interfaces for object shapes
- Use type aliases for unions/intersections
- Include JSDoc comments explaining complex types
- Use generics where appropriate
- Mark optional vs required properties clearly
- Include proper null/undefined handling

**Please provide:**
1. Complete type definitions
2. Example usage of the types
3. Utility types if needed (Pick, Omit, Partial, etc.)
4. Validation functions if appropriate`,
  },
  {
    id: 'testing-assistant',
    name: 'Testing Assistant',
    description: 'Write unit tests and integration tests',
    icon: 'beaker',
    category: 'code-help',
    defaultValues: {
      aiTool: 'claude',
      useCase: 'code-help',
      specificTask: 'Write tests for my component',
    },
    promptTemplate: `I need help writing tests for my code.

**Project Context:**
{projectContext}

**Testing Task:**
{specificTask}

**Testing Requirements:**
- Use Jest and React Testing Library
- Follow testing best practices
- Test user interactions, not implementation details
- Include happy path and edge cases
- Test accessibility
- Mock external dependencies
- Achieve good code coverage

**Please provide:**
1. Complete test file with multiple test cases
2. Setup/teardown code if needed
3. Mock implementations for dependencies
4. Explanations of what each test verifies
5. Suggestions for additional test scenarios`,
  },
];

export const getTemplatesByCategory = (category?: string): PromptTemplate[] => {
  if (!category) return promptTemplates;
  return promptTemplates.filter(t => t.category === category);
};

export const getTemplateById = (id: string): PromptTemplate | undefined => {
  return promptTemplates.find(t => t.id === id);
};
