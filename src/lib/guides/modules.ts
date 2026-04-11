// Human-friendly titles and descriptions for the module keys used in the guides
// data. Shared between the course overview page, the lesson page, and the
// GuideSidebar — previously duplicated in two of those files.

export const MODULE_TITLES: Record<string, string> = {
  setup: 'Setup',
  features: 'Core Features',
  prototype: 'Prototype',
  prototyping: 'Prototyping Workflows',
  collaboration: 'Developer Collaboration',
  github: 'GitHub',
  practices: 'Best Practices',
  figma: 'Figma ↔ Code',
  foundations: 'Foundations',
  building: 'Building',
  advanced: 'Advanced Patterns',
  polish: 'Ship It',
};

// Short per-module "what you'll learn" descriptions used on the overview page.
export const MODULE_DESCRIPTIONS: Record<string, string> = {
  setup: 'Get your environment ready and install the tools.',
  features: 'Master the main features and capabilities.',
  prototype: 'Build and test your first real project.',
  prototyping: 'Create interactive prototypes from your designs.',
  collaboration: 'Work effectively with your development team.',
  github: 'Manage your work with version control.',
  practices: 'Learn the patterns that make work ship reliably.',
  figma: 'Move work between Figma and code in both directions.',
  foundations: 'Understand the primitives before you build.',
  building: 'Implement the core parts of your interface.',
  advanced: 'Handle edge cases, errors, and complex flows.',
  polish: 'Accessibility, agentic patterns, and a production checklist.',
};

/** Pretty title for a module key, with a fallback to capitalised raw key. */
export function getModuleTitle(moduleKey: string | undefined): string {
  if (!moduleKey) return '';
  return (
    MODULE_TITLES[moduleKey] ||
    moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)
  );
}
