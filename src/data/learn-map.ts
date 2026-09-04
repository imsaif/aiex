/**
 * The Learn Map — the curated structure behind /guides.
 *
 * Sections are labelled by the visitor's question rather than by level or topic.
 * Under each one sits a hand-ordered mix of existing content. Order is the
 * editorial product and is never sorted at runtime.
 *
 * This file stores REFERENCES, not content. An item names a kind and a slug;
 * title, description and read time are resolved at build time from the existing
 * registries by `resolveLearnItem` in `src/lib/learn-map.ts`. That is deliberate:
 * the map cannot drift from the content, and renaming a pattern fails the build
 * rather than leaving a stale card behind.
 *
 * Every href here points at a page that already exists and is already indexed.
 * The map creates internal links; it never creates destinations.
 */

/** The kinds actually in use. Adding one is a two-line change here plus a
 *  resolver branch — don't declare kinds ahead of need. */
export type LearnItemKind = 'course' | 'pattern' | 'resource';

/** Registry-backed. Title, description and read time come from the source. */
export interface RegistryRef {
  kind: 'course' | 'pattern';
  /** Guide.slug or Pattern.slug */
  slug: string;
  /** Editorial override; falls back to the source description. */
  blurb?: string;
}

/**
 * The escape hatch, made visible in the type rather than hidden behind optional
 * fields. The checklists and kits are hand-built pages with no data registry,
 * and inventing one for three items would cost more than it saves.
 */
export interface ResourceRef {
  kind: 'resource';
  /** Absolute path to an existing route. */
  href: string;
  title: string;
  badge: 'Kit' | 'Checklist';
  blurb: string;
}

export type LearnItemRef = RegistryRef | ResourceRef;

export interface LearnSection {
  /** Stable anchor id. Used for #links and scroll-mt. */
  id: string;
  /** Two-digit ordinal shown before the question, as on the reference. */
  ordinal: string;
  /** The visitor's question. Rendered as an <h2>. Never marked up as FAQ Q&A. */
  question: string;
  /** One short paragraph, plain text. */
  intro: string;
  items: LearnItemRef[];
  more: { label: string; href: string };
}

/**
 * Section intros are approved copy, not placeholders — reviewed 2026-09-04.
 * They were drafted here and signed off rather than rewritten, so treat the
 * wording as intentional.
 */
export const learnMap: LearnSection[] = [
  {
    id: 'first-ai-feature',
    ordinal: '01',
    question: "I'm designing my first AI feature. Where do I start?",
    intro:
      'The usual UX playbook assumes the system does what you told it to. Start ' +
      'with what changes when it does not, and the handful of patterns you will ' +
      'reach for in the first week.',
    items: [
      { kind: 'course', slug: 'ai-ux-skills-guide' },
      { kind: 'pattern', slug: 'conversational-ui' },
      { kind: 'pattern', slug: 'progressive-disclosure' },
      { kind: 'pattern', slug: 'human-in-the-loop' },
      { kind: 'pattern', slug: 'error-recovery' },
      {
        kind: 'resource',
        href: '/handbook',
        title: 'The AI UX Handbook',
        badge: 'Kit',
        blurb: 'The patterns written up as chapters, if you would rather read straight through.',
      },
    ],
    more: { label: 'All 38 patterns', href: '/patterns' },
  },
  {
    id: 'trust',
    ordinal: '02',
    question: 'How do I make people trust what the AI tells them?',
    intro:
      'Most AI features fail on confidence, not capability. These cover showing ' +
      'uncertainty, explaining a decision, and leaving people a way back when it ' +
      'gets something wrong.',
    items: [
      { kind: 'pattern', slug: 'confidence-visualization' },
      { kind: 'pattern', slug: 'explainable-ai' },
      { kind: 'pattern', slug: 'trust-calibration' },
      { kind: 'pattern', slug: 'intent-preview' },
      { kind: 'pattern', slug: 'action-audit-trail' },
    ],
    more: {
      label: 'More trustworthy AI patterns',
      href: '/patterns/category/trustworthy-reliable-ai',
    },
  },
  {
    id: 'conversation',
    ordinal: '03',
    question: 'How do I design the conversation itself?',
    intro:
      'Turn-taking, memory, and knowing when to hand back to a person. The course ' +
      'covers the shape of a conversation end to end; the patterns are the ' +
      'decisions inside it.',
    items: [
      { kind: 'course', slug: 'conversational-ui-guide' },
      { kind: 'pattern', slug: 'mixed-initiative-control' },
      { kind: 'pattern', slug: 'graceful-handoff' },
      { kind: 'pattern', slug: 'selective-memory' },
      { kind: 'pattern', slug: 'session-degradation-prevention' },
    ],
    more: {
      label: 'More natural interaction patterns',
      href: '/patterns/category/natural-interaction',
    },
  },
  {
    id: 'build-it',
    ordinal: '04',
    question: 'How do I get AI tools to build what I designed?',
    intro:
      'Five hands-on paths for the tools that turn a design into working code. ' +
      'Pick the one you already have open — they do not need to be taken in order.',
    items: [
      { kind: 'course', slug: 'claude-code-learning-path' },
      { kind: 'course', slug: 'claude-design-learning-path' },
      { kind: 'course', slug: 'cursor-learning-path' },
      { kind: 'course', slug: 'github-copilot-learning-path' },
      { kind: 'course', slug: 'github-learning-path' },
    ],
    more: { label: 'Prompts for every pattern', href: '/prompts' },
  },
  {
    id: 'check-your-work',
    ordinal: '05',
    question: 'How do I check my work before it ships?',
    intro:
      'Run the design past something other than your own judgement. Two ' +
      'checklists, an audit kit, and the patterns that catch what checklists miss.',
    items: [
      {
        kind: 'resource',
        href: '/agent-readability-audit-kit',
        title: 'Agent Readability Audit Kit',
        badge: 'Kit',
        blurb: 'Check whether an AI agent can actually read and act on your interface.',
      },
      {
        kind: 'resource',
        href: '/agentic-ux-checklist',
        title: 'Agentic UX Checklist',
        badge: 'Checklist',
        blurb: 'The pass to make before shipping anything that acts on a user’s behalf.',
      },
      {
        kind: 'resource',
        href: '/accessibility-checklist-for-ai-designs',
        title: 'Accessibility Checklist for AI Designs',
        badge: 'Checklist',
        blurb: 'Where AI interfaces commonly fail assistive technology, and what to do instead.',
      },
      {
        kind: 'resource',
        href: '/toolkit',
        title: 'AI Interaction Toolkit',
        badge: 'Kit',
        blurb: 'Interaction patterns, component specs and implementation checklists as a PDF.',
      },
      { kind: 'pattern', slug: 'vulnerable-user-protection' },
      { kind: 'pattern', slug: 'universal-access-patterns' },
    ],
    // Points at /resources now that it is off the nav — the page still exists
    // and still ranks, so the map is how you get to it.
    more: { label: 'Every tool and download', href: '/resources' },
  },
];
