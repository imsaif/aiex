import { Metadata } from 'next';
import { siteConfig } from '@/config/seo';

interface GenerateMetadataProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  publishedTime?: string;
  authors?: string[];
}

/**
 * Generate complete metadata for a page
 */
export function generateMetadata({
  title,
  description,
  image = siteConfig.ogImage,
  url,
  type = 'website',
  keywords,
  publishedTime,
  authors,
}: GenerateMetadataProps): Metadata {
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const ogImage = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    title,
    description,
    keywords: keywords || undefined,
    authors: authors
      ? authors.map((name) => ({ name }))
      : [{ name: siteConfig.creator.name, url: siteConfig.links.portfolio }],
    openGraph: {
      type,
      locale: 'en_US',
      url: pageUrl,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime
        ? { publishedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.creator.twitter,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

/**
 * Custom SEO metadata for specific patterns
 */
const customPatternMetadata: Record<string, { title: string; description: string }> = {
  // --- High-impression patterns (top 10 by GSC data) ---
  'progressive-disclosure': {
    title: 'Progressive Disclosure in AI — ChatGPT, Claude & Notion Examples',
    description: 'See how ChatGPT, Claude, and Notion use progressive disclosure to hide complexity without losing power. Real examples, interactive demos, and copy-ready UI patterns for AI products.',
  },
  'conversational-ui': {
    title: 'Conversational UI Design — Patterns, Examples & Demos (2026)',
    description: 'Every major conversational UI pattern with working demos — from basic chat to voice assistants and agentic interfaces. See how ChatGPT, Slack, Siri, and Claude do it.',
  },
  'privacy-first-design': {
    title: 'Privacy-First AI Design — On-Device, Minimization & Consent Patterns',
    description: 'The privacy-first AI playbook: on-device ML, data minimization defaults, and transparent consent UX. See how Apple Intelligence, Signal, and DuckDuckGo build AI without mining user data.',
  },
  'confidence-visualization': {
    title: 'How to Show AI Confidence Scores — UI Patterns & Real Examples',
    description: 'How GitHub Copilot, medical AI tools, and LLM apps display confidence scores: gauges, probability bars, and trust signals that actually work. Interactive demos and design guidelines.',
  },
  'adaptive-interfaces': {
    title: 'Adaptive Interfaces in AI: Netflix, Spotify & Duolingo Patterns',
    description: 'How AI interfaces learn from user behavior. Real examples from Netflix, Spotify, and Duolingo. Design patterns, guidelines, and a working demo.',
  },
  'context-switching': {
    title: 'Context Switching in AI: ChatGPT, Notion AI & Slack Patterns',
    description: 'How AI manages multiple contexts and projects without losing track. Patterns from ChatGPT threads, Notion AI workspaces, and Slack for seamless task switching.',
  },
  'multimodal-interaction': {
    title: 'Multimodal AI Interaction: Google, Tesla & iPad Pro Examples',
    description: 'How AI products combine voice, touch, and gesture. Real examples from Google Assistant, Tesla, and iPad Pro — with patterns for seamless mode switching.',
  },
  'feedback-loops': {
    title: 'AI Feedback Loops: Design Patterns for Continuous Learning',
    description: 'How AI products capture user feedback to improve over time. Design patterns for explicit and implicit feedback, with real-world examples and a working demo.',
  },
  'error-recovery': {
    title: 'AI Error Recovery — Undo, Retry & Fallback Patterns + Examples',
    description: 'When AI gets it wrong — how ChatGPT, Copilot, and Notion let users undo, retry, and recover gracefully. Real error-recovery patterns with code examples and design guidelines.',
  },
  'contextual-assistance': {
    title: 'Contextual Assistance in AI: Gmail, Notion & Copilot Examples',
    description: 'Proactive AI help that respects user flow. Patterns from Gmail Smart Compose, Notion AI, and GitHub Copilot — with real examples and a working code demo.',
  },
  // --- Medium-impression patterns (500-1000+ impressions) ---
  'collaborative-ai': {
    title: 'Collaborative AI — What It Is & How to Design Human-AI Collaboration',
    description: 'What is collaborative AI? Design patterns for human-AI teamwork in creative and professional tools. Real examples from Figma AI, Google Docs, and GitHub Copilot with code demos.',
  },
  'ambient-intelligence': {
    title: 'Ambient Intelligence — Designing AI That Works Quietly in the Background',
    description: 'Ambient AI design patterns for invisible, context-aware assistance. Smart environments that anticipate needs without explicit commands. Examples from Apple, Nest, and Tesla.',
  },
  'intelligent-caching': {
    title: 'Smart Caching in AI: Pre-Fetch Strategies for Instant Responses',
    description: 'How AI products use intelligent caching to feel instant. Pre-fetch strategies, partial response patterns, and latency tricks from production systems.',
  },
  'escalation-pathways': {
    title: 'AI Escalation Pathways: When Agents Should Hand Off to Humans',
    description: 'When should AI agents hand off to humans? Design patterns for escalation triggers, ambiguity, and decisions beyond agent authority. Examples and code demo.',
  },
  'progressive-enhancement': {
    title: 'Progressive Enhancement in AI: Fast Results, Refined Over Time',
    description: 'Design AI interfaces that show basic results immediately, then progressively add detail. Patterns for streaming responses, partial outputs, and refinement.',
  },
  'crisis-detection-escalation': {
    title: 'Crisis Detection & Escalation — AI Safety Pattern for Sensitive Situations',
    description: 'Design AI that detects crisis signals and escalates appropriately. Patterns for mental health, safety, and high-risk scenarios with examples from crisis hotlines and healthcare AI.',
  },
  // --- Patterns ranking near page 1 (position 5-15) ---
  'trust-calibration': {
    title: 'Trust Calibration in AI — Meaning + UX Patterns for Appropriate Trust',
    description: 'Trust calibration is how UX helps users trust AI the right amount — neither over-relying nor dismissing it. See reliability signals, confidence cues, and over-reliance safeguards with real examples.',
  },
  'explainable-ai': {
    title: 'Explainable AI (XAI) UX — Make AI Decisions Transparent & Understandable',
    description: 'Design explainable AI interfaces that help users understand why AI made a decision. Feature attribution, decision trees, and transparency patterns with real-world examples.',
  },
  'safe-exploration': {
    title: 'Safe Exploration — Design AI Sandboxes for Risk-Free Experimentation',
    description: 'Safe exploration patterns for AI products. Sandbox environments, undo support, and guardrails that let users experiment without fear. Examples from AI coding tools and creative AI.',
  },
  'human-in-the-loop': {
    title: 'Human-in-the-Loop AI — When to Keep Humans in Control of AI Decisions',
    description: 'Design human-in-the-loop AI workflows. Approval gates, review interfaces, and override patterns for high-stakes AI decisions. Diagrams and examples from healthcare and finance AI.',
  },
  'graceful-handoff': {
    title: 'Graceful Handoff — Seamless Transitions Between AI and Human Agents',
    description: 'Design smooth handoffs from AI to human agents. Patterns for preserving context, warm transfers, and reducing user frustration. Examples from customer support and healthcare AI.',
  },
  'guided-learning': {
    title: 'Guided Learning — AI That Teaches Users How to Use the System',
    description: 'Design AI onboarding and guided learning experiences. Step-by-step tutorials, interactive walkthroughs, and adaptive help that teaches users progressively.',
  },
  'predictive-anticipation': {
    title: 'Predictive Anticipation — AI That Suggests Before You Ask',
    description: 'Design AI that anticipates user needs and offers proactive suggestions. Patterns for smart autocomplete, predictive actions, and anticipatory design from Gmail, Spotify, and Maps.',
  },
  'responsible-ai-design': {
    title: 'Responsible AI Design — Ethical AI Patterns for Fair & Accountable Products',
    description: 'Design AI products responsibly. Patterns for fairness, accountability, bias detection, and ethical AI decision-making with real-world examples and implementation guidelines.',
  },
  'anti-manipulation-safeguards': {
    title: 'Anti-Manipulation Safeguards — Prevent Dark Patterns & Protect Users in AI',
    description: 'How to prevent dark patterns in AI interfaces. Anti-manipulation design patterns that protect user autonomy, prevent persuasive AI abuse, and ensure ethical interaction design.',
  },
  'selective-memory': {
    title: 'Selective Memory in AI — Let Users Control What AI Remembers & Forgets',
    description: 'What does selective memory mean in AI? Design patterns for memory controls, data deletion, and persistent context management. Give users control over what AI remembers.',
  },
  // --- Remaining patterns for complete coverage ---
  'agent-status-monitoring': {
    title: 'Agent Status Monitoring: Track AI Agent Actions in Real-Time',
    description: 'Design real-time visibility for AI agents. Patterns for showing what is running, when to intervene, and how to monitor multi-step agent workflows.',
  },
  'augmented-creation': {
    title: 'Augmented Creation — AI as Creative Partner, Not Replacement',
    description: 'Design AI-augmented creative tools that enhance human creativity. Patterns for co-creation, AI suggestions, and creative AI workflows from Midjourney, Canva, and Figma.',
  },
  'intent-preview': {
    title: 'Intent Preview — Show Users What AI Plans to Do Before Acting',
    description: 'Design intent preview interfaces that show AI plans before execution. Patterns for action confirmation, plan visualization, and user approval gates in AI agents.',
  },
  'plan-summary': {
    title: 'Plan Summary — Help Users Understand Complex AI Action Plans',
    description: 'Design plan summary UX for AI agents. Patterns for breaking down multi-step plans, showing dependencies, and helping users review AI strategies before execution.',
  },
  'action-audit-trail': {
    title: 'Action Audit Trail — Track and Review Every AI Decision',
    description: 'Design audit trail interfaces for AI actions. Activity logs, decision history, and accountability patterns. Examples from GitHub Actions, Zapier, and enterprise AI tools.',
  },
  'autonomy-spectrum': {
    title: 'Autonomy Spectrum — Letting Users Control How Independent AI Acts',
    description: 'Design AI autonomy controls from fully manual to fully autonomous. Slider patterns, permission levels, and trust-building UX for AI agents and copilots.',
  },
  'mixed-initiative-control': {
    title: 'Mixed-Initiative Control in AI: Patterns for Human-AI Handoff',
    description: 'Design shared control between users and AI agents. When to lead, when to defer, and how to make handoffs feel natural. Real-world patterns and a working demo.',
  },
  'session-degradation-prevention': {
    title: 'Session Degradation Prevention — Keep AI Conversations Productive Over Time',
    description: 'Prevent AI conversations from degrading over long sessions. Patterns for context window management, conversation summarization, and maintaining quality in extended AI interactions.',
  },
  'universal-access-patterns': {
    title: 'Universal Access Patterns — Making AI Interfaces Accessible to Everyone',
    description: 'Design accessible AI interfaces for diverse users. Patterns for screen readers, motor impairments, cognitive accessibility, and inclusive AI interaction design.',
  },
  'vulnerable-user-protection': {
    title: 'Vulnerable User Protection — AI Safety for At-Risk Populations',
    description: 'Design AI products that protect vulnerable users including children, elderly, and at-risk populations. Patterns for content filtering, age-appropriate AI, and safety guardrails.',
  },
};

/**
 * Generate metadata for pattern pages
 */
export function generatePatternMetadata({
  title,
  description,
  slug,
  category,
  tags,
  thumbnail,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  datePublished?: string;
  dateModified?: string;
}): Metadata {
  // Check if this pattern has custom SEO metadata
  const customMetadata = customPatternMetadata[slug];

  // Use custom title or default format
  const pageTitle = customMetadata?.title || `${title} in AI Design: Patterns, Examples & Code`;

  // Use custom description or named-product fallback
  const pageDescription = customMetadata?.description ||
    `${title} in AI UX. Real-world examples from shipped products like ChatGPT, GitHub Copilot, and Notion. Design patterns, guidelines, and a working code demo.`;

  // Dynamic OG image — branded 1200x630 card generated per pattern
  const ogImage = `/api/og/patterns?slug=${slug}`;

  // Generate keywords from tags and category
  const keywords = [
    'AI design pattern',
    category.toLowerCase(),
    ...(tags || []),
    'AI UX',
    'machine learning interface',
  ];

  // Use dateModified if available, otherwise use datePublished
  const publishedTime = dateModified || datePublished;

  return generateMetadata({
    title: pageTitle,
    description: pageDescription,
    image: ogImage,
    url: `/patterns/${slug}`,
    type: 'article',
    keywords,
    publishedTime,
  });
}

/**
 * Generate metadata for the homepage
 */
export function generateHomeMetadata(): Metadata {
  return generateMetadata({
    title: 'AI UX Design Patterns: 36 Examples from ChatGPT, Claude & More',
    description:
      'The AI UX pattern library. 36 patterns documented from ChatGPT, Claude, Figma, Notion, GitHub Copilot, and 45+ shipped products. Code, demos, real examples.',
    url: '/',
    keywords: [
      'AI design patterns',
      'AI UX patterns',
      'machine learning UI',
      'artificial intelligence design',
      'AI user experience',
      'design system',
      'UX best practices',
      'AI interface design',
    ],
  });
}

/**
 * Generate metadata for the search page
 */
export function generateSearchMetadata(): Metadata {
  return generateMetadata({
    title: 'Search AI Design Patterns',
    description:
      'Search through AI design patterns to find the perfect solution for your AI-powered product. Filter by category, tags, and keywords.',
    url: '/search',
    keywords: [
      'search AI patterns',
      'find AI design patterns',
      'AI UX search',
      'design pattern search',
    ],
  });
}
