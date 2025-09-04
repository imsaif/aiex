import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const explainableai: Pattern = {
  id: "explainable-ai",
  title: "Explainable AI (XAI)",
  slug: "explainable-ai",
  category: "Trustworthy & Reliable AI",
  description: "Make AI decisions understandable via visualizations, explanations, and transparent reasoning.",
  thumbnail: "/images/examples/claudethinking.gif",
  content: {
    problem: "AI systems often act as 'black boxes,' hindering user understanding of decisions. This lack of transparency reduces trust, complicates debugging, and allows biased or incorrect decisions to go unnoticed.",
    solution: "Clearly explain AI conclusions using visualizations, natural language, and interactive elements. Help users understand reasoning, data sources, and confidence levels behind AI decisions.",
    examples: [
      {
        title: "Claude Reasoning",
        description: "Shows detailed, step-by-step thinking, breaking down complex problems into logical steps and explaining each conclusion's reasoning.",
        image: "/images/examples/claudethinking.gif",
        altText: "Claude AI step-by-step reasoning process"
      },
      {
        title: "Perplexity AI Citations",
        description: "Shows exact sources for each answer part, allowing users to verify and understand the information basis.",
        image: "/images/examples/perplexity-attribution.gif",
        altText: "Perplexity AI source attribution"
      },
      {
        title: "Hugging Face Model Cards",
        description: "Provides detailed documentation on model capabilities, limitations, training data, and potential biases, helping users understand AI decision-making.",
        image: "/images/examples/huggingfacemodels.gif",
        altText: "Hugging Face Model Card example"
      }
    ],
    guidelines: [
      "Provide explanations at appropriate detail levels for different user types.",
      "Use visual aids (heatmaps, charts, diagrams) to illustrate decision factors.",
      "Show confidence levels and uncertainty ranges for AI predictions.",
      "Explain both what and why the AI decided.",
      "Provide source attribution and data provenance when applicable.",
      "Use natural language explanations understandable by non-experts.",
      "Allow users to drill down for more detailed explanations.",
      "Show alternative options considered but not chosen.",
      "Highlight the most important factors influencing the decision."
    ],
    considerations: [
      "Balance explanation detail with cognitive load and usability.",
      "Consider different explanation needs for varying user expertise.",
      "Ensure explanations are accurate and don't oversimplify complex processes.",
      "Account for cases where AI reasoning is too complex to explain simply.",
      "Consider privacy implications of showing detailed decision factors.",
      "Plan for scenarios where explanations might reveal system vulnerabilities.",
      "Test explanations with real users to ensure helpfulness.",
      "Consider cultural and linguistic differences in explanation preferences.",
      "Balance transparency with intellectual property protection."
    ],
    relatedPatterns: [
      "Transparent Feedback",
      "Human-in-the-Loop",
      "Responsible AI Design",
      "Error Recovery"
    ],
    codeExamples: codeExamples
  }
};
