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
  {
    id: 'ai-ux-daily-dec-21-chatgpt-personality-claude-code-navigation-gemini-delay',
    title: 'AI UX Daily: ChatGPT Personality Sliders, Claude Code Navigation & Gemini Delay',
    slug: 'ai-ux-daily-dec-21-chatgpt-personality-claude-code-navigation-gemini-delay',
    summary: 'Personalization takes center stage: ChatGPT adds granular personality controls, Claude Code brings IDE-like navigation to the terminal, and Google buys Android users more time before the Gemini switch.',
    content: `
<p style="margin: 0 0 40px; font-size: 17px; line-height: 1.7; color: #334155;">Personalization takes center stage: ChatGPT adds granular personality controls, Claude Code brings IDE-like navigation to the terminal, and Google buys Android users more time before the Gemini switch.</p>

<div style="border-top: 1px solid #e2e8f0; margin-bottom: 40px;"></div>

<h2 style="margin: 0 0 32px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">📱 Today in AI Products</h2>

<!-- ChatGPT Update -->
<div style="margin: 0 0 32px; border-left: 3px solid #10a37f; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #10a37f; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">ChatGPT</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 20</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">ChatGPT lets you dial in warmth, enthusiasm, and emoji use</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">OpenAI shipped personality sliders that let users fine-tune ChatGPT's conversational style beyond preset tones. Adjustable traits include Warmth, Enthusiasm, Emoji use, Headers, and Lists—each set to More, Less, or Default. This addresses the "robotic vs. sycophantic" criticism by putting tone control directly in users' hands. <a href="https://techcrunch.com/2025/12/20/openai-allows-users-to-directly-adjust-chatgpts-warmth-and-enthusiasm/" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/adaptive-interfaces" style="background: #ecfdf5; color: #10a37f; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Adaptive Interfaces</a></p>
</div>

<!-- Claude Code Update -->
<div style="margin: 0 0 32px; border-left: 3px solid #d97706; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #d97706; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Claude Code</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 21</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">Claude Code adds go-to-definition and IDE-like code navigation</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">Version 2.0.74 brings LSP integration: go-to-definition, find references, and hover documentation—all inside the terminal. Also new: terminal setup for Kitty, Alacritty, Zed, and Warp. Reduces context-switching for developers who live in the command line. <a href="https://releasebot.io/updates/anthropic/claude-code" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/contextual-assistance" style="background: #fef3c7; color: #d97706; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Contextual Assistance</a></p>
</div>

<!-- Gemini Update -->
<div style="margin: 0 0 40px; border-left: 3px solid #4285f4; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #4285f4; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Gemini</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 19</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">Google delays Assistant-to-Gemini switch until 2026</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">Android users get a reprieve: the planned retirement of Google Assistant on phones and tablets is pushed to next year. The "Switch to Google Assistant" option stays in the Gemini app through the holidays. Forced transitions during busy periods create friction—Google's giving users more runway to adapt. <a href="https://9to5google.com/2025/12/19/google-assistant-gemini-2026/" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/graceful-handoff" style="background: #eff6ff; color: #4285f4; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Graceful Handoff</a></p>
</div>

<!-- Today's Takeaway -->
<div style="background-color: #1e293b; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">🎯 Today's Takeaway</h2>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #94a3b8;"><strong style="color: #ffffff;">User control over AI personality is the next frontier.</strong> ChatGPT's sliders signal a shift from "one-size-fits-all" AI personas to granular, user-defined interaction styles.</p>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #94a3b8;">Expect more products to ship similar customization—your design system should plan for it.</p>
</div>

<!-- CTA -->
<div style="text-align: center; padding: 24px 0;">
  <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">Want to learn more about the patterns mentioned today?</p>
  <a href="/" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore All 28 Patterns →</a>
</div>
    `.trim(),
    publishedAt: '2025-12-21',
    published: true,
    tags: getTagsBySlug(['ai-design', 'ux-patterns']),
  },
  {
    id: 'this-week-in-aiux-gpt52-cursor-visual-editor-gemini-deep-research',
    title: 'This Week in AIUX: GPT-5.2, Cursor Visual Editor & Gemini Deep Research',
    slug: 'this-week-in-aiux-gpt52-cursor-visual-editor-gemini-deep-research',
    summary: 'GPT-5.2 creates spreadsheets natively, Cursor ships a visual editor for designers, and Google reimagines Deep Research as an autonomous agent.',
    content: `
<p style="margin: 0 0 20px; font-size: 17px; line-height: 1.7; color: #334155;">Big week in AIUX. OpenAI dropped GPT-5.2 and overhauled image generation, Cursor shipped a visual editor that lets designers drag-and-drop directly in the IDE, and Google reimagined Deep Research as an autonomous agent.</p>

<p style="margin: 0 0 40px; font-size: 17px; line-height: 1.7; color: #334155;">The common thread? Every update is about reducing friction between intent and execution. Let's break down the UX patterns making it happen.</p>

<div style="border-top: 1px solid #e2e8f0; margin-bottom: 40px;"></div>

<h2 style="margin: 0 0 32px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">📱 This Week in AI Products</h2>

<!-- ChatGPT Update 1 -->
<div style="margin: 0 0 32px; border-left: 3px solid #10a37f; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #10a37f; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">ChatGPT</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 11</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">GPT-5.2 creates spreadsheets and presentations natively</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">OpenAI's new flagship model doesn't just describe how to build a spreadsheet. It builds it. Ask for a financial model and get a working .xlsx with formulas. Request a pitch deck and receive actual slides. The model also hallucinates 30% less than GPT-5.1 in testing. <a href="https://openai.com/index/introducing-gpt-5-2/" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/augmented-creation" style="background: #ecfdf5; color: #10a37f; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Augmented Creation</a></p>
</div>

<!-- ChatGPT Update 2 -->
<div style="margin: 0 0 32px; border-left: 3px solid #10a37f; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #10a37f; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">ChatGPT</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 16</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">New Images feature is 4x faster with precise editing</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">GPT Image 1.5 changes only what you ask while preserving lighting, composition, and faces. Users stay in control of exactly what gets modified. A dedicated Images section in the app lets you explore styles visually, no written prompt required. <a href="https://openai.com/index/new-chatgpt-images-is-here/" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/human-in-the-loop" style="background: #ecfdf5; color: #10a37f; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Human-in-the-Loop</a></p>
</div>

<!-- Cursor Update 1 -->
<div style="margin: 0 0 32px; border-left: 3px solid #7c3aed; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #7c3aed; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Cursor</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 11</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">Visual Editor lets you drag-and-drop UI in your IDE</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">Cursor 2.2 bridges design and code: click any element, drag it around, adjust colors with sliders, then tell the AI agent to apply changes. It updates your actual React components. Designers can now "reach in and fix it" instead of describing changes to devs. <a href="https://cursor.com/blog/browser-visual-editor" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/multimodal-interaction" style="background: #f3e8ff; color: #7c3aed; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Multimodal Interaction</a></p>
</div>

<!-- Cursor Update 2 -->
<div style="margin: 0 0 32px; border-left: 3px solid #7c3aed; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #7c3aed; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Cursor</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 10</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">Debug Mode instruments your code to find root causes</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">Describe a bug, and the AI agent automatically adds logging statements to trace the issue. It verifies the likely cause, proposes a fix, and invites you to re-test. No more "hundreds of lines of speculative code," just targeted diagnostics you can follow. <a href="https://cursor.com/blog/debug-mode" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/explainable-ai" style="background: #f3e8ff; color: #7c3aed; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Explainable AI</a></p>
</div>

<!-- Claude Update -->
<div style="margin: 0 0 32px; border-left: 3px solid #d97706; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #d97706; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Claude</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 8</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">Claude Code launches in Slack for in-thread coding</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">Tag @Claude in any Slack thread to spin up a full coding session. It reads the conversation context (bug reports, feature requests) to determine the right repo, posts progress updates, and opens pull requests. Developers stay in their collaboration tool instead of context-switching to an IDE. <a href="https://www.anthropic.com/news/claude-and-slack" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/contextual-assistance" style="background: #fef3c7; color: #d97706; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Contextual Assistance</a></p>
</div>

<!-- Gemini Update -->
<div style="margin: 0 0 40px; border-left: 3px solid #4285f4; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: #4285f4; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Gemini</span>
    <span style="font-size: 12px; color: #94a3b8;">Dec 16</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">Deep Research reimagined as autonomous research agent</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">Powered by Gemini 3 Pro, the new Deep Research autonomously plans multi-step investigations, navigates complex information, and synthesizes findings. Critically, it shows its research plan before executing so users can adjust the approach before the agent dives in. <a href="https://blog.google/technology/developers/deep-research-agent-gemini-api/" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/human-in-the-loop" style="background: #eff6ff; color: #4285f4; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">Human-in-the-Loop</a></p>
</div>

<!-- Steal This Week -->
<div style="background-color: #1e293b; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">🎯 Steal This Week</h2>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #94a3b8;"><strong style="color: #ffffff;">Cursor's Visual Editor</strong> solves a problem every design-to-dev team faces: "Can you move that button 8 pixels left?" Now designers point, drag, and click. Then AI writes the code.</p>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #94a3b8;">The UX insight: <strong style="color: #ffffff;">Multimodal beats single-mode for spatial tasks.</strong> If your AI product involves layout, positioning, or visual arrangement, consider combining direct manipulation with natural language. Let users show <em>and</em> tell.</p>
</div>

<!-- Pattern to Know -->
<div style="background-color: #0f172a; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">📚 Pattern to Know</h2>
  <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #ffffff;">Human-in-the-Loop</h3>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #cbd5e1;">This week's updates show two flavors of Human-in-the-Loop: GPT Image 1.5 lets users control <em>what</em> gets changed (precision editing), while Gemini Deep Research shows its plan <em>before</em> acting (approval gates). Both keep humans in control of AI actions.</p>
  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #cbd5e1;"><strong style="color: #ffffff;">When to use it:</strong> Any time AI actions are costly, irreversible, or consequential. Let users review before execution.</p>
  <p style="margin: 0;"><a href="/patterns/human-in-the-loop" style="color: #60a5fa; text-decoration: none; font-size: 15px; font-weight: 500;">Deep dive on Human-in-the-Loop →</a></p>
</div>

<!-- CTA -->
<div style="text-align: center; padding: 24px 0;">
  <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">Want the full breakdown on any pattern mentioned above?</p>
  <a href="/" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore All 28 Patterns →</a>
</div>
    `.trim(),
    publishedAt: '2025-12-17',
    published: true,
    tags: getTagsBySlug(['ai-design', 'ux-patterns', 'human-in-the-loop']),
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
