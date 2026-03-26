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
    title: 'Progressive Disclosure in AI — Pattern, Examples & Best Practices',
    description: 'Learn progressive disclosure for AI interfaces: gradually reveal complexity to reduce cognitive load. Real examples from ChatGPT, Claude, and Notion with interactive demos and implementation guidelines.',
  },
  'conversational-ui': {
    title: 'Conversational UI Design — Build Chat & Voice Interfaces (Examples & Patterns)',
    description: 'Complete guide to conversational UI and conversational interfaces. Design patterns for chatbots, voice assistants, and natural language interfaces with examples from ChatGPT, Slack, and Siri.',
  },
  'privacy-first-design': {
    title: 'Privacy-First AI Design — Build Trust with Data Minimization & User Controls',
    description: 'Privacy-first design patterns for AI products. Local-first processing, transparent consent, data minimization, and privacy controls. Real examples from Apple, Signal, and DuckDuckGo.',
  },
  'confidence-visualization': {
    title: 'AI Confidence Scores UX — How to Show Confidence Levels to Users',
    description: 'How to display AI confidence scores and uncertainty to users. Patterns for confidence gauges, probability indicators, and trust signals with examples from GitHub Copilot and medical AI.',
  },
  'adaptive-interfaces': {
    title: 'Adaptive Interfaces — AI-Powered UX That Learns User Behavior',
    description: 'Design interfaces that adapt to individual users. AI-driven layout changes, smart defaults, and personalized workflows with examples from Spotify, Netflix, and Notion.',
  },
  'context-switching': {
    title: 'Context Switching in AI — Helping Users Switch Between Tasks Seamlessly',
    description: 'How to handle context switching in AI chatbots and tools. Patterns for preserving state, managing multiple conversations, and reducing cognitive load across projects.',
  },
  'multimodal-interaction': {
    title: 'Multimodal Interaction Design — Voice, Touch, Gesture & Text Patterns',
    description: 'Design multimodal AI interfaces combining voice, touch, gesture, and text. What multimodal interaction means, real examples from Siri, Google Lens, and GPT-4V, with implementation guidelines.',
  },
  'feedback-loops': {
    title: 'AI Feedback Loops — How to Design Continuous Learning from User Input',
    description: 'Design effective AI feedback loops that learn from user corrections. Thumbs up/down, implicit signals, corrective feedback diagrams, and real examples from ChatGPT, Midjourney, and Notion.',
  },
  'error-recovery': {
    title: 'Graceful Error Recovery in AI — Helping Users Recover from AI Mistakes',
    description: 'Design graceful error recovery for AI products. Patterns for handling wrong predictions, failed generations, and AI hallucinations with undo, retry, and fallback strategies.',
  },
  'contextual-assistance': {
    title: 'Contextual Assistance — Proactive AI Help Based on User Behavior',
    description: 'Design AI that offers help at the right moment without interrupting. Patterns for contextual suggestions, smart tooltips, and proactive assistance from Gmail, Notion, and GitHub Copilot.',
  },
  // --- Medium-impression patterns (500-1000+ impressions) ---
  'collaborative-ai': {
    title: 'Collaborative AI — Design Human-AI Teamwork That Amplifies Creativity',
    description: 'Patterns for human-AI collaboration in creative and professional tools. Real examples from Figma AI, Google Docs, and GitHub Copilot. Learn how to design AI that collaborates, not replaces.',
  },
  'ambient-intelligence': {
    title: 'Ambient Intelligence — Designing AI That Works Quietly in the Background',
    description: 'Ambient AI design patterns for invisible, context-aware assistance. Smart environments that anticipate needs without explicit commands. Examples from Apple, Nest, and Tesla.',
  },
  'intelligent-caching': {
    title: 'Intelligent Caching — Smart Caching Strategies for AI-Powered Products',
    description: 'Design intelligent caching for AI applications. Predictive prefetching, context-aware cache invalidation, and smart storage strategies. Reduce latency and improve UX in AI products.',
  },
  'escalation-pathways': {
    title: 'Escalation Pathways — When AI Should Hand Off to Humans (Design Pattern)',
    description: 'Design clear escalation pathways from AI to human support. Patterns for crisis detection, agent handoff, and human escalation with examples from Intercom, Zendesk, and healthcare AI.',
  },
  'progressive-enhancement': {
    title: 'Progressive Enhancement for AI — Graceful Degradation & Fallback Design',
    description: 'Progressive enhancement patterns for AI products. Design interfaces that degrade gracefully when AI fails or is unavailable. Fallback strategies, offline support, and resilient UX.',
  },
  'crisis-detection-escalation': {
    title: 'Crisis Detection & Escalation — AI Safety Pattern for Sensitive Situations',
    description: 'Design AI that detects crisis signals and escalates appropriately. Patterns for mental health, safety, and high-risk scenarios with examples from crisis hotlines and healthcare AI.',
  },
  // --- Patterns ranking near page 1 (position 5-15) ---
  'trust-calibration': {
    title: 'Trust Calibration — Help Users Build Appropriate Trust in AI Systems',
    description: 'Design AI interfaces that calibrate user trust accurately. Patterns for showing reliability, managing expectations, and preventing over-reliance or under-trust in AI predictions.',
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
    title: 'Anti-Manipulation Safeguards — Protecting Users from Dark Patterns in AI',
    description: 'Design AI interfaces that resist manipulation. Patterns for preventing dark patterns, protecting against persuasive AI, and ensuring user autonomy in AI-powered products.',
  },
  'selective-memory': {
    title: 'Selective Memory — Give Users Control Over What AI Remembers',
    description: 'Design AI memory controls that let users decide what the system remembers and forgets. Privacy-respecting patterns for persistent context and data management.',
  },
  // --- Remaining patterns for complete coverage ---
  'agent-status-monitoring': {
    title: 'Agent Status Monitoring — Track What AI Agents Are Doing in Real-Time',
    description: 'Design status dashboards and monitoring UX for AI agents. Real-time progress, activity logs, and transparency patterns. Examples from GitHub Actions, Zapier, and Claude.',
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
    title: 'Mixed-Initiative Control — Shared Control Between Human and AI',
    description: 'Design mixed-initiative interfaces where humans and AI share control. Patterns for turn-taking, initiative switching, and collaborative decision-making in AI products.',
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
  const pageTitle = customMetadata?.title || `${title} | AI Design Patterns`;

  // Use custom description or truncate default
  const pageDescription = customMetadata?.description ||
    (description.length > 160 ? `${description.substring(0, 157)}...` : description);

  // Use pattern thumbnail as OG image if available, otherwise use default
  const ogImage = thumbnail && thumbnail.startsWith('/images/')
    ? thumbnail
    : '/images/og/og-pattern-default.png';

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
    title: 'AIUX — AI UX Design Patterns | 36 Patterns from 50+ Shipped Products',
    description:
      'A framework of 36 AI UX design patterns documented from ChatGPT, Claude, GitHub Copilot, Midjourney, and 50+ shipped AI products. Real examples, code demos, and actionable guidance for designing AI-powered experiences.',
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
