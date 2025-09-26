import { Category } from '../types';

const categories: Category[] = [
  {
    id: "adaptive-intelligent-systems",
    title: "Adaptive & Intelligent Systems",
    description: "Design AI systems that learn from user behavior and adapt in real-time",
    slug: "adaptive-intelligent-systems",
    color: "blue",
    image: "/images/examples/claudethinking.gif",
    icon: "Brain"
  },
  {
    id: "human-ai-collaboration",
    title: "Human-AI Collaboration",
    description: "Create seamless partnerships between humans and AI for enhanced productivity",
    slug: "human-ai-collaboration",
    color: "green",
    image: "/images/categories/human-ai-collaboration.gif",
    icon: "Users"
  },
  {
    id: "trustworthy-reliable-ai",
    title: "Trustworthy & Reliable AI",
    description: "Build AI systems that are transparent, fair, and robust against failures",
    slug: "trustworthy-reliable-ai",
    color: "purple",
    image: "/images/categories/trustworthy-reliable-ai.gif",
    icon: "Shield"
  },
  {
    id: "natural-interaction",
    title: "Natural Interaction",
    description: "Enable intuitive and natural communication between users and AI",
    slug: "natural-interaction",
    color: "orange",
    image: "/images/categories/natural-interaction.gif",
    icon: "MessageCircle"
  }
];

export default categories;
