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
    description: "Provide timely help and suggestions based on the user's current task and needs",
    slug: "contextual-assistance",
    color: "blue",
    image: "/images/examples/Smart-compose_Taco_Tuesday.gif"
  },
  {
    id: "progressive-disclosure",
    title: "Progressive Disclosure",
    description: "Reveal information gradually to reduce cognitive load and complexity",
    slug: "progressive-disclosure",
    color: "green",
    image: "/images/examples/loom-ai.gif"
  },
  {
    id: "human-in-the-loop",
    title: "Human-in-the-Loop",
    description: "Balance automation with human oversight and intervention for critical decisions",
    slug: "human-in-the-loop",
    color: "amber",
    image: "/images/examples/grammarly-suggestions.gif"
  },
  {
    id: "conversational-ui",
    title: "Conversational UI",
    description: "Design natural, human-like interactions through chat and voice interfaces",
    slug: "conversational-ui",
    color: "purple",
    image: "/images/examples/slack-ai.gif"
  },
  {
    id: "explainable-ai",
    title: "Explainable AI (XAI)",
    description: "Make AI decision-making processes understandable through visualizations and explanations",
    slug: "explainable-ai",
    color: "sky",
    image: "/images/examples/claudethinking.gif"
  },
  {
    id: "adaptive-interfaces",
    title: "Adaptive Interfaces",
    description: "Create interfaces that learn from user behavior and adjust accordingly",
    slug: "adaptive-interfaces",
    color: "gray",
    image: "/images/examples/netflix-adaptive.gif"
  },
  {
    id: "multimodal-interaction",
    title: "Multimodal Interaction",
    description: "Combine multiple input/output modes for more natural and accessible experiences",
    slug: "multimodal-interaction",
    color: "indigo",
    image: "/images/examples/geminivoicemode.gif"
  },
  {
    id: "guided-learning",
    title: "Guided Learning",
    description: "Help users understand AI capabilities through tutorials and contextual examples",
    slug: "guided-learning",
    color: "emerald",
    image: "/images/examples/duolingo-adaptive.gif"
  },
  {
    id: "augmented-creation",
    title: "Augmented Creation",
    description: "Empower users to create content with AI as a collaborative partner",
    slug: "augmented-creation",
    color: "orange",
    image: "/images/examples/github-copilot-highlighting.gif"
  },
  {
    id: "responsible-ai-design",
    title: "Responsible AI Design",
    description: "Address ethical considerations, bias mitigation, and inclusivity in AI systems",
    slug: "responsible-ai-design",
    color: "rose",
    image: "/images/examples/chatgpt-limitations.png"
  },
  {
    id: "error-recovery",
    title: "Error Recovery & Graceful Degradation",
    description: "Design AI interfaces that fail gracefully and provide meaningful recovery paths",
    slug: "error-recovery",
    color: "amber",
    image: "/images/examples/google-face-detection.gif"
  },
  {
    id: "collaborative-ai",
    title: "Collaborative AI",
    description: "Enable effective collaboration between multiple users and AI within shared workflows",
    slug: "collaborative-ai",
    color: "violet",
    image: "/images/examples/notion-ai.gif"
  },
  {
    id: "ambient-intelligence",
    title: "Ambient Intelligence",
    description: "Create unobtrusive AI that senses context and provides assistance without explicit interaction",
    slug: "ambient-intelligence",
    color: "lime",
    image: "/images/examples/superhuman-ai.gif"
  },
  {
    id: "safe-exploration",
    title: "Safe Exploration",
    description: "Design controlled environments for experimenting with AI capabilities without risk",
    slug: "safe-exploration",
    color: "cyan",
    image: "/images/examples/ada-health.webp"
  }
];

export default categories;
