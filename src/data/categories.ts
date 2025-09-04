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
    id: "adaptive-intelligent-systems",
    title: "Adaptive & Intelligent Systems",
    description: "Patterns for AI that learns and adapts",
    slug: "adaptive-intelligent-systems",
    color: "blue",
    image: "/images/examples/duolingo-adaptive.gif" // Example image, can be updated
  },
  {
    id: "human-ai-collaboration",
    title: "Human-AI Collaboration",
    description: "Patterns for effective human-AI partnership",
    slug: "human-ai-collaboration",
    color: "green",
    image: "/images/examples/grammarly-suggestions.gif" // Example image, can be updated
  },
  {
    id: "trustworthy-reliable-ai",
    title: "Trustworthy & Reliable AI",
    description: "Patterns for building trust and handling failures",
    slug: "trustworthy-reliable-ai",
    color: "purple",
    image: "/images/examples/chatgpt-limitations.png" // Example image, can be updated
  },
  {
    id: "natural-interaction",
    title: "Natural Interaction",
    description: "Patterns for intuitive AI communication",
    slug: "natural-interaction",
    color: "orange",
    image: "/images/examples/geminivoicemode.gif" // Example image, can be updated
  }
];

export default categories;
