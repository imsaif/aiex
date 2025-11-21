import { PromptFormData, GeneratedPrompt, FileType, DesignSystem } from '@/types/promptBuilder';
import { getTemplateById } from '@/data/promptTemplates';

/**
 * Format design system information for inclusion in prompts
 */
function formatDesignSystem(designSystem: DesignSystem): string {
  const parts: string[] = [];

  if (designSystem.primaryColor) {
    parts.push(`- Primary Color: ${designSystem.primaryColor}`);
  }
  if (designSystem.secondaryColor) {
    parts.push(`- Secondary Color: ${designSystem.secondaryColor}`);
  }
  if (designSystem.fontFamily) {
    parts.push(`- Font Family: ${designSystem.fontFamily}`);
  }
  if (designSystem.componentLibrary) {
    parts.push(`- Component Library: ${designSystem.componentLibrary}`);
  }

  return parts.length > 0 ? parts.join('\n') : 'No design system specified';
}

/**
 * Generate AI tool-specific formatting and instructions
 */
function getToolSpecificInstructions(aiTool: string): string {
  switch (aiTool) {
    case 'cursor':
      return '\n\n**Note**: This is for Cursor AI. You can save this as a .cursorrules file in your project root.';
    case 'claude':
      return '\n\n**Note**: This is for Claude. You can save this as a CLAUDE.md file in your project root or use directly in conversation.';
    case 'copilot':
      return '\n\n**Note**: This is for GitHub Copilot. Use this context in your code comments or as inline instructions.';
    case 'chatgpt':
      return '\n\n**Note**: This is for ChatGPT. Paste this at the start of your conversation for best results.';
    default:
      return '';
  }
}

/**
 * Generate prompt content based on form data
 */
export function generatePrompt(formData: PromptFormData): string {
  // If using a template, start with template and replace placeholders
  if (formData.template) {
    const template = getTemplateById(formData.template);
    if (template) {
      let prompt = template.promptTemplate;

      // Replace placeholders
      prompt = prompt.replace('{designSystem}', formatDesignSystem(formData.designSystem));
      prompt = prompt.replace('{projectContext}', formData.projectContext || 'Not specified');
      prompt = prompt.replace('{specificTask}', formData.specificTask || 'Not specified');

      return prompt + getToolSpecificInstructions(formData.aiTool);
    }
  }

  // Generate custom prompt based on use case
  switch (formData.useCase) {
    case 'project-setup':
      return generateProjectSetupPrompt(formData);
    case 'component':
      return generateComponentPrompt(formData);
    case 'code-help':
      return generateCodeHelpPrompt(formData);
    default:
      return generateCustomPrompt(formData);
  }
}

/**
 * Generate project setup / config file prompt
 */
function generateProjectSetupPrompt(formData: PromptFormData): string {
  return `# Project Context and Guidelines

## Design System
${formatDesignSystem(formData.designSystem)}

## Project Overview
${formData.projectContext || 'Not specified'}

## Development Guidelines

### Code Quality
- Use TypeScript for type safety
- Write clear, self-documenting code
- Follow functional programming patterns where appropriate
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names

### Component Development
- Build reusable, composable components
- Ensure accessibility (WCAG 2.1 AA minimum)
- Support keyboard navigation
- Include proper ARIA labels
- Make responsive (mobile-first approach)
- Support dark mode where applicable

### Best Practices
- Handle loading and error states
- Validate user inputs
- Sanitize data from external sources
- Optimize for performance
- Write tests for critical functionality
- Document complex logic

### Code Style
- Components: PascalCase
- Functions/variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Files: kebab-case

Remember these guidelines when helping me build features.${getToolSpecificInstructions(formData.aiTool)}`;
}

/**
 * Generate component-specific prompt
 */
function generateComponentPrompt(formData: PromptFormData): string {
  return `I need help building a UI component.

**Design System:**
${formatDesignSystem(formData.designSystem)}

**Project Context:**
${formData.projectContext || 'Not specified'}

**Component Requirements:**
${formData.specificTask || 'Not specified'}

**Technical Requirements:**
- Use TypeScript with proper type definitions
- Follow React best practices (hooks, composition)
- Include accessibility attributes (ARIA, keyboard navigation)
- Make component responsive
- Support dark mode if applicable
- Include comprehensive prop types
- Add JSDoc comments

**Please provide:**
1. Complete component code with TypeScript
2. Props interface definition
3. Usage examples
4. Any necessary helper functions or hooks
5. Accessibility considerations${getToolSpecificInstructions(formData.aiTool)}`;
}

/**
 * Generate code help prompt
 */
function generateCodeHelpPrompt(formData: PromptFormData): string {
  return `I need help with my code.

**Project Context:**
${formData.projectContext || 'Not specified'}

**What I need help with:**
${formData.specificTask || 'Not specified'}

**Design System (if relevant):**
${formatDesignSystem(formData.designSystem)}

**Please:**
1. Analyze the issue or requirements
2. Provide clear, working solutions
3. Explain your approach and reasoning
4. Point out potential edge cases
5. Suggest best practices
6. Include code examples where helpful${getToolSpecificInstructions(formData.aiTool)}`;
}

/**
 * Generate custom/generic prompt
 */
function generateCustomPrompt(formData: PromptFormData): string {
  const parts: string[] = [];

  if (formData.projectContext) {
    parts.push(`**Project Context:**\n${formData.projectContext}`);
  }

  if (formData.specificTask) {
    parts.push(`**Task:**\n${formData.specificTask}`);
  }

  const hasDesignSystem = Object.values(formData.designSystem).some(v => v);
  if (hasDesignSystem) {
    parts.push(`**Design System:**\n${formatDesignSystem(formData.designSystem)}`);
  }

  if (parts.length === 0) {
    return 'Please fill in at least one field to generate a prompt.';
  }

  return parts.join('\n\n') + getToolSpecificInstructions(formData.aiTool);
}

/**
 * Get filename based on AI tool and file type
 */
export function getFileName(aiTool: string, fileType: FileType): string {
  switch (fileType) {
    case 'cursorrules':
      return '.cursorrules';
    case 'clinerules':
      return '.clinerules';
    case 'claude-md':
      return 'CLAUDE.md';
    default:
      return `prompt-${aiTool}.txt`;
  }
}

/**
 * Generate complete prompt with metadata
 */
export function generateCompletePrompt(formData: PromptFormData, fileType: FileType = 'txt'): GeneratedPrompt {
  const content = generatePrompt(formData);
  const filename = getFileName(formData.aiTool, fileType);
  const characterCount = content.length;
  const lineCount = content.split('\n').length;

  return {
    content,
    fileType,
    filename,
    characterCount,
    lineCount,
  };
}

/**
 * Download generated prompt as a file
 */
export function downloadPrompt(prompt: GeneratedPrompt): void {
  const blob = new Blob([prompt.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = prompt.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
