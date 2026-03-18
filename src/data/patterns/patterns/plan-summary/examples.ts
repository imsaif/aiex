import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "ChatGPT Deep Research - Research Plan Generation",
    description: "Generates a structured research plan showing the topics it will investigate, the approach for each, and how findings will be organized. Users can review the plan before the agent starts executing, ensuring the strategy aligns with their intent.",
    image: "/images/examples/openairesearchprogress.gif",
    altText: "ChatGPT Deep Research displaying a research plan with bullet points covering topics like e-commerce, consumer behavior, supply chain, AI, inflation, and sustainability"
  },
  {
    title: "GitHub Copilot Workspace - Structured Implementation Plan",
    description: "Breaks down a task into a file-by-file plan with specific subtasks per file, general notes, and an 'Add file to plan' action. The left panel shows the editable plan while the right panel shows the resulting code changes — letting users review the strategy before committing.",
    image: "/images/examples/autonomy-spectrum/github-copilot-workspace.webp",
    altText: "GitHub Copilot Workspace showing a structured plan with file-level subtasks and corresponding code diffs"
  },
  {
    title: "Google Gemini - Deep Research Plan",
    description: "Generates a detailed research plan showing the questions it will investigate, the approach for each, and estimated depth. Users review and edit the plan before execution begins, ensuring the agent's strategy aligns with their intent.",
    image: "/images/examples/geminiresearchplan.gif",
    altText: "Google Gemini Deep Research displaying an editable research plan with questions, approach, and depth estimates"
  }
];
