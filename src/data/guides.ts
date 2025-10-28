import { Guide, GuideFilter } from '@/types';

/**
 * Designer guides for using AI tools in design workflows
 * Each guide targets specific designer roles and skill levels
 */
export const guides: Guide[] = [
  {
    id: 'claude-code-ux-designers',
    slug: 'ux-designers-guide-to-claude-code',
    title: "UX Designers' Guide to Claude Code",
    description:
      'Learn how to leverage Claude Code to accelerate your UX design workflow with AI-powered code generation, prototyping, and design system automation.',
    excerpt:
      'Discover practical ways to use Claude Code for rapid prototyping, design validation, and collaborative design handoffs.',
    tool: 'Claude Code',
    useCase: 'Prototyping',
    skillLevel: 'Intermediate',
    designDomain: 'UX Design',
    readTime: 12,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/claude-code-ux.jpg',
    tags: ['claude-code', 'prototyping', 'ux-design', 'productivity'],
    content: `
      <h2>Why Claude Code for UX Designers?</h2>
      <p>Claude Code brings AI-powered assistance directly into your development environment, making it easier to bridge the gap between design and implementation. For UX designers, this means faster prototyping, better design validation, and more collaborative handoffs to developers.</p>

      <h2>Getting Started with Claude Code</h2>
      <p>Claude Code integrates seamlessly into your development workflow. Here's how to get the most out of it:</p>

      <h3>1. Rapid Prototyping</h3>
      <p>Use Claude Code to generate interactive prototypes based on your design specifications. Describe your design intent, and Claude Code will generate working code that you can test immediately.</p>

      <h3>2. Design System Documentation</h3>
      <p>Generate comprehensive documentation for your design system. Claude Code can create component libraries, style guides, and implementation guides automatically.</p>

      <h3>3. Collaborative Handoffs</h3>
      <p>Create detailed design specifications with working code examples. This reduces miscommunication with developers and ensures your designs are implemented correctly.</p>

      <h2>Best Practices</h2>
      <ul>
        <li>Be specific about your design requirements</li>
        <li>Include visual references and design tokens</li>
        <li>Test the generated code before sharing</li>
        <li>Use Claude Code to validate design feasibility early</li>
      </ul>

      <h2>Real-World Examples</h2>
      <p>Many designers are already using Claude Code to accelerate their workflows. From rapid prototyping to design system generation, Claude Code helps designers ship faster and collaborate better with their teams.</p>
    `,
    relatedPatterns: ['Contextual Assistance', 'Augmented Creation'],
  },
  {
    id: 'github-designers-beginner',
    slug: 'designers-beginner-guide-to-github',
    title: "Designers' Beginner Guide to GitHub",
    description:
      'A comprehensive introduction to GitHub for designers. Learn version control, collaboration, and how to work effectively with developers.',
    excerpt:
      'Master the basics of GitHub including repositories, branches, pull requests, and best practices for designer-developer collaboration.',
    tool: 'GitHub',
    useCase: 'Collaboration',
    skillLevel: 'Beginner',
    designDomain: 'Product Design',
    readTime: 15,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/github-designers.jpg',
    tags: ['github', 'collaboration', 'version-control', 'beginner'],
    content: `
      <h2>Why Designers Need GitHub</h2>
      <p>GitHub isn't just for developers. It's become the central hub for collaboration in modern product teams. Understanding GitHub helps designers communicate better with developers, track design changes, and participate in the development process.</p>

      <h2>Core GitHub Concepts for Designers</h2>

      <h3>Repositories</h3>
      <p>Think of a repository as a project folder that tracks all changes over time. Each design system, product, or project usually has its own repository.</p>

      <h3>Branches</h3>
      <p>Branches let multiple people work on different features simultaneously without interfering with each other. You might have a "main" branch for production and feature branches for new work.</p>

      <h3>Pull Requests</h3>
      <p>A pull request is a way to propose changes to the project. It's a request for others to review, discuss, and merge your changes into the main branch.</p>

      <h3>Issues</h3>
      <p>Issues track bugs, feature requests, and design discussions. They're a great way to communicate design feedback and track progress.</p>

      <h2>Practical Tips for Designers</h2>
      <ul>
        <li>Create clear issue descriptions with visual mockups</li>
        <li>Comment on pull requests with design feedback</li>
        <li>Use GitHub to track design debt and improvement ideas</li>
        <li>Participate in code reviews to ensure design fidelity</li>
      </ul>

      <h2>Getting Started Today</h2>
      <p>Start by exploring your team's GitHub repository. Read through existing issues, review pull requests, and ask questions. The more you engage, the better you'll understand your team's workflow.</p>
    `,
    relatedPatterns: ['Human-in-the-Loop'],
  },
  {
    id: 'cursor-prototyping-guide',
    slug: 'prototyping-with-cursor',
    title: 'Rapid Prototyping with Cursor: A Design Engineer Guide',
    description:
      'Build interactive prototypes faster using Cursor. This guide teaches design engineers how to use Cursor for rapid iteration, code generation, and design implementation.',
    excerpt:
      'Master Cursor shortcuts, AI completions, and VS Code integration to build prototype code 10x faster.',
    tool: 'Cursor',
    useCase: 'Prototyping',
    skillLevel: 'Intermediate',
    designDomain: 'UI Design',
    readTime: 14,
    author: 'Design Team',
    publishedDate: '2025-10-28',
    thumbnail: '/images/guides/cursor-prototyping.jpg',
    tags: ['cursor', 'prototyping', 'design-engineering', 'ai-tools'],
    content: `
      <h2>What is Cursor?</h2>
      <p>Cursor is an AI-powered code editor built on VS Code that helps you write code faster. It understands your codebase and provides intelligent suggestions, making prototyping significantly faster.</p>

      <h2>Key Features for Prototyping</h2>

      <h3>AI-Powered Completions</h3>
      <p>Cursor learns from your code patterns and suggests completions that match your style. This is perfect for repetitive prototyping tasks.</p>

      <h3>Chat Interface</h3>
      <p>Describe what you want to build in natural language, and Cursor generates the code. It's like having an expert programmer by your side.</p>

      <h3>Codebase Understanding</h3>
      <p>Cursor reads and understands your entire codebase, allowing it to make suggestions that fit seamlessly into your project.</p>

      <h2>Prototyping Workflow</h2>

      <h3>Step 1: Set Up Your Project</h3>
      <p>Create a new project or open an existing one in Cursor. The AI will analyze your project structure and setup.</p>

      <h3>Step 2: Describe Your Design</h3>
      <p>Use the chat interface to describe the UI/UX you want to build. Be specific about layout, interactions, and styling.</p>

      <h3>Step 3: Review and Refine</h3>
      <p>Review the generated code. Make tweaks using Cursor's suggestions. Iterate quickly until you're satisfied.</p>

      <h3>Step 4: Deploy Your Prototype</h3>
      <p>Share your prototype with stakeholders. Gather feedback and iterate using Cursor's rapid generation capabilities.</p>

      <h2>Pro Tips</h2>
      <ul>
        <li>Use consistent naming conventions to help Cursor understand your patterns</li>
        <li>Keep your prototype code clean and well-organized</li>
        <li>Use Cursor's chat to explain design tokens and system properties</li>
        <li>Leverage existing components from your design system</li>
      </ul>

      <h2>Common Use Cases</h2>
      <p>Design engineers use Cursor for everything from simple landing pages to complex interactive prototypes. The key is using the tool to focus on design decisions rather than routine coding tasks.</p>
    `,
    relatedPatterns: ['Augmented Creation', 'Progressive Disclosure'],
  },
];

/**
 * Get a guide by slug
 */
export function getGuideBySlug(slug: string): Guide | null {
  return guides.find((guide) => guide.slug === slug) || null;
}

/**
 * Filter guides based on criteria
 */
export function filterGuides(filter: GuideFilter): Guide[] {
  return guides.filter((guide) => {
    // Tool filter
    if (filter.tool && guide.tool !== filter.tool) {
      return false;
    }

    // Skill level filter
    if (filter.skillLevel && guide.skillLevel !== filter.skillLevel) {
      return false;
    }

    // Design domain filter
    if (filter.designDomain && guide.designDomain !== filter.designDomain) {
      return false;
    }

    // Tags filter (match any tag)
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some((tag) => guide.tags?.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Search guides by query (title, description, tags)
 */
export function searchGuides(query: string): Guide[] {
  const lowerQuery = query.toLowerCase();

  return guides.filter((guide) => {
    return (
      guide.title.toLowerCase().includes(lowerQuery) ||
      guide.description.toLowerCase().includes(lowerQuery) ||
      guide.excerpt?.toLowerCase().includes(lowerQuery) ||
      guide.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get all unique tools from guides
 */
export function getAllTools(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.tool)));
}

/**
 * Get all unique skill levels from guides
 */
export function getAllSkillLevels(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.skillLevel)));
}

/**
 * Get all unique design domains from guides
 */
export function getAllDesignDomains(): string[] {
  return Array.from(new Set(guides.map((guide) => guide.designDomain)));
}

/**
 * Get all guides for a specific pattern
 */
export function getGuidesForPattern(patternSlug: string): Guide[] {
  return guides.filter((guide) => guide.relatedPatterns?.includes(patternSlug));
}
