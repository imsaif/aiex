import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const explainableai: Pattern = {
  id: "explainable-ai",
  title: "Explainable AI (XAI)",
  slug: "explainable-ai",
  category: "Explainable AI",
  description: "Make AI decision-making processes understandable through visualizations, explanations, and transparent reasoning paths.",
  thumbnail: "/images/examples/claudethinking.gif",
  content: {
    problem: "AI systems often operate as 'black boxes' where users cannot understand how decisions are made. This lack of transparency reduces trust, makes debugging difficult, and can lead to biased or incorrect decisions going unnoticed.",
    solution: "Provide clear explanations of how AI systems reach their conclusions. Use visualizations, natural language explanations, and interactive elements to help users understand the reasoning process, data sources, and confidence levels behind AI decisions.",
    examples: [
      {
        title: "Claude Reasoning",
        description: "Shows detailed step-by-step thinking process, breaking down complex problems into logical steps and explaining the reasoning behind each conclusion.",
        image: "/images/examples/claudethinking.gif",
        altText: "Claude AI step-by-step reasoning process"
      },
      {
        title: "Perplexity AI Citations",
        description: "Shows exactly which sources were used for each part of the answer, allowing users to verify and understand the information basis.",
        image: "/images/examples/perplexity-attribution.gif",
        altText: "Perplexity AI source attribution"
      },
      {
        title: "Hugging Face Model Cards",
        description: "Provides detailed documentation explaining model capabilities, limitations, training data, and potential biases, helping users understand how AI models make decisions.",
        image: "/images/examples/huggingfacemodels.gif",
        altText: "Hugging Face Model Card example"
      }
    ],
    guidelines: [
      "Provide explanations at appropriate levels of detail for different user types",
      "Use visual aids like heatmaps, charts, and diagrams to illustrate decision factors",
      "Show confidence levels and uncertainty ranges for AI predictions",
      "Explain both what the AI decided and why it made that decision",
      "Provide source attribution and data provenance when applicable",
      "Use natural language explanations that non-experts can understand",
      "Allow users to drill down into more detailed explanations when needed",
      "Show alternative options that were considered but not chosen",
      "Highlight the most important factors that influenced the decision"
    ],
    considerations: [
      "Balance explanation detail with cognitive load and usability",
      "Consider different explanation needs for different user expertise levels",
      "Ensure explanations are accurate and don't oversimplify complex processes",
      "Account for cases where the AI reasoning may be too complex to explain simply",
      "Consider privacy implications of showing detailed decision factors",
      "Plan for scenarios where explanations might reveal system vulnerabilities",
      "Test explanations with real users to ensure they're actually helpful",
      "Consider cultural and linguistic differences in explanation preferences",
      "Balance transparency with intellectual property protection"
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