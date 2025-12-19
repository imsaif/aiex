import { Newsletter, NewsletterTag } from '@/types';

/**
 * Newsletter tags
 */
export const tags: NewsletterTag[] = [
  { id: 'introduction', name: 'Introduction', slug: 'introduction' },
  { id: 'ai-design', name: 'AI Design', slug: 'ai-design' },
  { id: 'ux-patterns', name: 'UX Patterns', slug: 'ux-patterns' },
  { id: 'human-in-the-loop', name: 'Human-in-the-Loop', slug: 'human-in-the-loop' },
  { id: 'ai-ethics', name: 'AI Ethics', slug: 'ai-ethics' },
  { id: 'trust', name: 'Trust', slug: 'trust' },
  { id: 'confidence-visualization', name: 'Confidence Visualization', slug: 'confidence-visualization' },
  { id: 'ui-design', name: 'UI Design', slug: 'ui-design' },
  { id: 'progressive-disclosure', name: 'Progressive Disclosure', slug: 'progressive-disclosure' },
  { id: 'onboarding', name: 'Onboarding', slug: 'onboarding' },
  { id: 'error-recovery', name: 'Error Recovery', slug: 'error-recovery' },
];

/**
 * Helper to get tags by slugs
 */
const getTagsBySlug = (slugs: string[]): NewsletterTag[] =>
  slugs.map((slug) => tags.find((t) => t.slug === slug)!).filter(Boolean);

/**
 * All newsletters - add new newsletters at the top (newest first)
 */
export const newsletters: Newsletter[] = [
  // Recent mock data for testing "Last 30 days" feature
  {
    id: 'dec-19-update',
    title: 'AI Agents Are Everywhere: What Designers Need to Know',
    slug: 'dec-19-ai-agents-everywhere',
    summary: 'Quick update on the rise of AI agents in product design.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-12-19',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  {
    id: 'dec-17-update',
    title: 'Claude 3.5 Sonnet Updates and New Features',
    slug: 'dec-17-claude-updates',
    summary: 'What the latest Claude updates mean for AI UX.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-12-17',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  {
    id: 'dec-15-update',
    title: 'Designing for Model Context Protocol (MCP)',
    slug: 'dec-15-mcp-design',
    summary: 'New patterns emerging from MCP integrations.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-12-15',
    published: true,
    tags: getTagsBySlug(['ux-patterns']),
  },
  {
    id: 'dec-12-update',
    title: 'not much happened today',
    slug: 'dec-12-quiet-day',
    summary: 'A quiet day in AI news.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-12-12',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  {
    id: 'dec-10-update',
    title: 'GPT-5 Rumors and What They Mean for UX',
    slug: 'dec-10-gpt5-rumors',
    summary: 'Speculation on next-gen models.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-12-10',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  {
    id: 'dec-08-update',
    title: 'not much happened today',
    slug: 'dec-08-quiet-day',
    summary: 'A quiet day in AI news.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-12-08',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  {
    id: 'dec-05-update',
    title: 'Gemini 2.0 Flash: Speed vs Quality Tradeoffs',
    slug: 'dec-05-gemini-flash',
    summary: 'Google releases Gemini 2.0 Flash.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-12-05',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  {
    id: 'dec-02-update',
    title: 'OpenAI Dev Day Recap: Realtime API and More',
    slug: 'dec-02-openai-devday',
    summary: 'Key announcements from OpenAI.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-12-02',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  {
    id: 'nov-28-update',
    title: 'Black Friday AI Tools Roundup',
    slug: 'nov-28-black-friday',
    summary: 'Best AI tool deals for designers.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-11-28',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  {
    id: 'nov-25-update',
    title: 'Anthropic Workspaces: Team Features Deep Dive',
    slug: 'nov-25-anthropic-workspaces',
    summary: 'New collaboration features from Anthropic.',
    content: '<p>Coming soon...</p>',
    publishedAt: '2025-11-25',
    published: true,
    tags: getTagsBySlug(['ai-design']),
  },
  // Older newsletters below
  {
    id: 'error-recovery-when-ai-gets-it-wrong',
    title: 'Error Recovery: When AI Gets It Wrong',
    slug: 'error-recovery-when-ai-gets-it-wrong',
    summary:
      'AI will make mistakes. Great design helps users recover gracefully. Patterns for handling errors, corrections, and edge cases.',
    content: `
<h2>Embrace Imperfection</h2>
<p>No AI system is perfect. The key isn't preventing all errors—it's making recovery easy and learning from mistakes.</p>

<h3>Error Recovery Patterns</h3>
<ul>
  <li><strong>Undo/Redo:</strong> Always provide a way to reverse AI actions</li>
  <li><strong>Edit in place:</strong> Let users modify AI output directly</li>
  <li><strong>Regenerate:</strong> Offer to try again with the same or modified prompt</li>
  <li><strong>Explain:</strong> Help users understand why the error might have occurred</li>
</ul>

<h3>Example: Image Generation</h3>
<p>Midjourney's interface shows 4 variations per prompt. If none are right, users can easily regenerate, vary specific images, or refine their prompt. Every "failure" is a learning opportunity.</p>

<h3>Communication Guidelines</h3>
<ol>
  <li>Use friendly, non-technical language</li>
  <li>Take responsibility ("I didn't understand" not "Invalid input")</li>
  <li>Suggest specific next steps</li>
  <li>Make feedback submission effortless</li>
</ol>

<p>A graceful error recovery can actually increase user trust more than a perfect first attempt.</p>
    `.trim(),
    publishedAt: '2024-03-15',
    published: true,
    tags: getTagsBySlug(['error-recovery', 'ui-design', 'trust']),
  },
  {
    id: 'progressive-disclosure-ai-interfaces',
    title: 'Progressive Disclosure in AI Interfaces',
    slug: 'progressive-disclosure-ai-interfaces',
    summary:
      'Start simple, reveal complexity gradually. How progressive disclosure makes AI features more approachable for all users.',
    content: `
<h2>Less is More (Initially)</h2>
<p>AI systems often have powerful capabilities, but showing everything at once can overwhelm users. Progressive disclosure reveals features gradually based on user needs and expertise.</p>

<h3>The Three Layers</h3>
<ol>
  <li><strong>Essential:</strong> The core action everyone needs (e.g., "Ask AI")</li>
  <li><strong>Intermediate:</strong> Common customizations (e.g., tone, length)</li>
  <li><strong>Advanced:</strong> Power user features (e.g., custom prompts, API access)</li>
</ol>

<h3>Example: ChatGPT's Evolution</h3>
<p>ChatGPT starts with a simple text input. As users become comfortable, they discover features like conversation history, custom instructions, and GPTs. The complexity grows with the user.</p>

<h3>Implementation Tips</h3>
<ul>
  <li>Use expandable sections for advanced options</li>
  <li>Implement "Learn more" links for curious users</li>
  <li>Remember user preferences for future sessions</li>
  <li>A/B test different disclosure levels</li>
</ul>

<p>The goal: Make simple things simple, and complex things possible.</p>
    `.trim(),
    publishedAt: '2024-03-01',
    published: true,
    tags: getTagsBySlug(['progressive-disclosure', 'ui-design', 'onboarding']),
  },
  {
    id: 'building-trust-with-confidence-visualization',
    title: 'Building Trust with Confidence Visualization',
    slug: 'building-trust-with-confidence-visualization',
    summary:
      'How showing AI confidence levels helps users make better decisions. Real examples from weather apps, search engines, and diagnostic tools.',
    content: `
<h2>Why Confidence Matters</h2>
<p>AI systems aren't always certain about their outputs. Communicating this uncertainty helps users calibrate their trust and make informed decisions.</p>

<h3>Visualization Techniques</h3>
<ul>
  <li><strong>Percentage indicators:</strong> "85% confident"</li>
  <li><strong>Visual meters:</strong> Progress bars or gauges</li>
  <li><strong>Color coding:</strong> Green/yellow/red for confidence levels</li>
  <li><strong>Language cues:</strong> "I'm fairly confident..." vs "I'm certain..."</li>
</ul>

<h3>Example: Weather Forecasting</h3>
<p>Modern weather apps don't just show "Rain on Tuesday." They show "70% chance of rain" with precipitation probability charts. This honest uncertainty actually increases user trust.</p>

<h3>Design Guidelines</h3>
<ol>
  <li>Match visualization complexity to user expertise</li>
  <li>Don't overwhelm with too many confidence indicators</li>
  <li>Be consistent in how you represent uncertainty</li>
  <li>Explain what confidence levels mean in context</li>
</ol>

<p>Transparency about limitations builds trust more effectively than false certainty.</p>
    `.trim(),
    publishedAt: '2024-02-15',
    published: true,
    tags: getTagsBySlug(['confidence-visualization', 'trust', 'ui-design']),
  },
  {
    id: 'deep-dive-human-in-the-loop-design',
    title: 'Deep Dive: Human-in-the-Loop Design',
    slug: 'deep-dive-human-in-the-loop-design',
    summary:
      'Exploring how to balance AI automation with human oversight. When should users have control, and how do we design for trust?',
    content: `
<h2>The Art of Human-AI Collaboration</h2>
<p>As AI becomes more capable, finding the right balance between automation and human control becomes crucial. Too much automation can feel unsettling; too little defeats the purpose of AI assistance.</p>

<h3>Key Principles</h3>
<ol>
  <li><strong>Transparency:</strong> Always show what the AI is doing and why</li>
  <li><strong>Control:</strong> Give users the ability to override, edit, or reject AI suggestions</li>
  <li><strong>Feedback:</strong> Make it easy to provide corrections that improve the system</li>
</ol>

<h3>Case Study: Gmail Smart Compose</h3>
<p>Gmail's Smart Compose is an excellent example of human-in-the-loop design. Suggestions appear inline, can be accepted with Tab, or simply ignored. The user always maintains control over their message.</p>

<h3>When to Use This Pattern</h3>
<ul>
  <li>High-stakes decisions (financial, medical, legal)</li>
  <li>Creative tasks where personal style matters</li>
  <li>Situations where errors could be costly</li>
</ul>

<p>Remember: AI should augment human capability, not replace human judgment.</p>
    `.trim(),
    publishedAt: '2024-02-01',
    published: true,
    tags: getTagsBySlug(['human-in-the-loop', 'ai-ethics', 'trust']),
  },
  {
    id: 'welcome-to-ai-ux-design-patterns',
    title: 'Welcome to AI UX Design Patterns',
    slug: 'welcome-to-ai-ux-design-patterns',
    summary:
      'Introducing our newsletter covering the latest in AI design patterns, UX insights, and practical implementation guides for designers and developers.',
    content: `
<h2>Welcome!</h2>
<p>We're excited to launch the AI UX Design Patterns newsletter. Each issue will bring you insights into designing better AI-powered interfaces.</p>

<h3>What to Expect</h3>
<ul>
  <li>Deep dives into specific AI design patterns</li>
  <li>Real-world examples from leading products</li>
  <li>Practical implementation tips</li>
  <li>Industry news and trends</li>
</ul>

<h3>Featured Pattern: Contextual Assistance</h3>
<p>This week we're highlighting the Contextual Assistance pattern - providing help exactly when and where users need it. Great examples include GitHub Copilot's inline suggestions and Notion AI's contextual prompts.</p>

<blockquote>
  <p>"The best interface is no interface. The best assistance appears before you need to ask for it."</p>
</blockquote>

<p>Stay tuned for more insights in upcoming issues!</p>
    `.trim(),
    publishedAt: '2024-01-15',
    published: true,
    tags: getTagsBySlug(['introduction', 'ai-design', 'ux-patterns']),
  },
];

/**
 * Get all published newsletters
 */
export function getNewsletters(): Newsletter[] {
  return newsletters.filter((n) => n.published);
}

/**
 * Get newsletter by slug
 */
export function getNewsletterBySlug(slug: string): Newsletter | undefined {
  return newsletters.find((n) => n.slug === slug && n.published);
}

/**
 * Get all unique tags from published newsletters
 */
export function getAllTags(): NewsletterTag[] {
  const publishedNewsletters = getNewsletters();
  const tagSlugs = new Set<string>();

  publishedNewsletters.forEach((n) => {
    n.tags.forEach((t) => tagSlugs.add(t.slug));
  });

  return tags.filter((t) => tagSlugs.has(t.slug));
}

/**
 * Get adjacent newsletters for navigation
 */
export function getAdjacentNewsletters(currentSlug: string): {
  previous: Newsletter | null;
  next: Newsletter | null;
} {
  const published = getNewsletters();
  const currentIndex = published.findIndex((n) => n.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex < published.length - 1 ? published[currentIndex + 1] : null,
    next: currentIndex > 0 ? published[currentIndex - 1] : null,
  };
}
