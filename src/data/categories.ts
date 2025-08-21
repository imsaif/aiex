// Define the Category type directly in this file to avoid import issues
interface Category {
  id: string;
  title: string;
  description: string;
  slug: string;
  color: string;
  image: string;
}

const categories: Category[] = [
  {
    id: "contextual-assistance",
    title: "Contextual Assistance",
    description: "Smart help when needed",
    slug: "contextual-assistance",
    color: "blue",
    image: "/images/examples/Smart-compose_Taco_Tuesday.gif"
  },
  {
    id: "progressive-disclosure",
    title: "Progressive Disclosure",
    description: "Reveal complexity gradually",
    slug: "progressive-disclosure",
    color: "green",
    image: "/images/examples/loom-ai.gif"
  },
  {
    id: "human-in-the-loop",
    title: "Human-in-the-Loop",
    description: "Keep humans in control",
    slug: "human-in-the-loop",
    color: "amber",
    image: "/images/examples/grammarly-suggestions.gif"
  },
  {
    id: "conversational-ui",
    title: "Conversational UI",
    description: "Natural chat and voice",
    slug: "conversational-ui",
    color: "purple",
    image: "/images/examples/slack-ai.gif"
  },
  {
    id: "explainable-ai",
    title: "Explainable AI (XAI)",
    description: "Transparent AI decisions",
    slug: "explainable-ai",
    color: "sky",
    image: "/images/examples/claudethinking.gif"
  },
  {
    id: "adaptive-interfaces",
    title: "Adaptive Interfaces",
    description: "Interfaces that learn and adapt",
    slug: "adaptive-interfaces",
    color: "gray",
    image: "/images/examples/netflix-adaptive.gif"
  },
  {
    id: "multimodal-interaction",
    title: "Multimodal Interaction",
    description: "Voice, touch, and vision combined",
    slug: "multimodal-interaction",
    color: "indigo",
    image: "/images/examples/geminivoicemode.gif"
  },
  {
    id: "guided-learning",
    title: "Guided Learning",
    description: "Learn AI step-by-step",
    slug: "guided-learning",
    color: "emerald",
    image: "/images/examples/duolingo-adaptive.gif"
  },
  {
    id: "augmented-creation",
    title: "Augmented Creation",
    description: "Create with AI assistance",
    slug: "augmented-creation",
    color: "orange",
    image: "/images/examples/github-copilot-highlighting.gif"
  },
  {
    id: "responsible-ai-design",
    title: "Responsible AI Design",
    description: "Ethical and inclusive AI",
    slug: "responsible-ai-design",
    color: "rose",
    image: "/images/examples/chatgpt-limitations.png"
  },
  {
    id: "error-recovery",
    title: "Error Recovery & Graceful Degradation",
    description: "Graceful failure handling",
    slug: "error-recovery",
    color: "amber",
    image: "/images/examples/google-face-detection.gif"
  },
  {
    id: "collaborative-ai",
    title: "Collaborative AI",
    description: "Team up with AI",
    slug: "collaborative-ai",
    color: "violet",
    image: "/images/examples/notion-ai.gif"
  },
  {
    id: "ambient-intelligence",
    title: "Ambient Intelligence",
    description: "Invisible, contextual assistance",
    slug: "ambient-intelligence",
    color: "lime",
    image: "/images/examples/superhuman-ai.gif"
  },
  {
    id: "safe-exploration",
    title: "Safe Exploration",
    description: "Risk-free AI exploration",
    slug: "safe-exploration",
    color: "cyan",
    image: "/images/examples/ada-health.webp"
  }
];

export default categories;
