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
    problem: "AI systems often act as 'black boxes,' hindering understanding of decisions. This reduces trust, complicates debugging, and allows biased or incorrect decisions to go unnoticed.",
    solution: "Explain AI conclusions using visualizations, natural language, and interactive elements. Help users understand reasoning, data sources, and confidence levels.",
    examples: [
      {
        title: "Claude Reasoning",
        description: "Shows step-by-step thinking, breaking down complex problems into logical steps with reasoning for each conclusion.",
        image: "/images/examples/claudethinking.gif",
        altText: "Claude AI step-by-step reasoning process"
      },
      {
        title: "Perplexity AI Citations",
        description: "Shows exact sources for each answer, allowing users to verify information.",
        image: "/images/examples/perplexity-attribution.gif",
        altText: "Perplexity AI source attribution"
      },
      {
        title: "Hugging Face Model Cards",
        description: "Provides detailed documentation on model capabilities, limitations, training data, and biases to help users understand AI decision-making.",
        image: "/images/examples/huggingfacemodels.gif",
        altText: "Hugging Face Model Card example"
      }
    ],
    guidelines: [
      "Provide explanations at appropriate detail levels for different user types.",
      "Use visual aids (heatmaps, charts, diagrams) to illustrate decision factors.",
      "Show confidence levels and uncertainty ranges for AI predictions.",
      "Explain both what and why the AI decided.",
      "Provide source attribution when applicable.",
      "Use natural language explanations for non-experts.",
      "Allow users to drill down for more detailed explanations.",
      "Show alternative options considered but not chosen.",
      "Highlight the most important factors influencing the decision."
    ],
    considerations: [
      "Balance explanation detail with cognitive load and usability.",
      "Consider different explanation needs for varying expertise levels.",
      "Ensure explanations are accurate without oversimplifying.",
      "Account for cases where AI reasoning is too complex for simple explanations.",
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
    codeExamples: codeExamples,
    figmaPrompt: {
      prompt: `Design an explainable AI interface that makes decision-making transparent:

Create a decision explanation card showing:
1. **Decision Output**: The AI's conclusion or recommendation prominently displayed
2. **Confidence Score**: Visual indicator (progress bar/percentage) showing certainty level
3. **Key Factors**: Top 3-5 factors that influenced the decision with visual weights
4. **Data Sources**: Citations or references to where information came from
5. **Alternative Options**: Other options considered with brief explanations

Use visual hierarchy to show the most important factors first. Include an option to "See detailed explanation" for users who want deeper insights.`,
      tips: [
        "Use heatmaps or bar charts to show factor importance",
        "Make confidence levels visually clear (colors, percentages)",
        "Provide expandable sections for detailed explanations",
        "Show decision alternatives to build trust",
        "Include source attribution with clickable references"
      ]
    }
  }
};
