import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Google Deep Research - Research Plan Generation",
    description: "Generates a detailed research plan showing the questions it will investigate, the approach for each, and estimated depth. Users review and edit the plan before execution begins, ensuring the agent's strategy aligns with their intent.",
    image: "/images/examples/plan-summary.png",
    altText: "Google Deep Research displaying an editable research plan with questions, approach, and depth estimates"
  },
  {
    title: "Devin AI - Software Project Phases",
    description: "Shows a project plan with phases  -  understanding requirements, designing architecture, implementing code, running tests  -  before beginning work. Updates progress in real-time against the plan as each phase completes.",
    image: "/images/examples/plan-summary-devin.png",
    altText: "Devin AI showing a multi-phase project plan with real-time progress tracking for each phase"
  },
  {
    title: "ChatGPT Canvas - Section-by-Section Revision",
    description: "When asked to revise a document, Canvas shows its understanding of what changes are needed and applies them section by section, with the user able to see the rationale for each change.",
    image: "/images/examples/plan-summary-canvas.png",
    altText: "ChatGPT Canvas showing document revision plan with rationale for each section change"
  },
  {
    title: "Claude Extended Thinking - Reasoning Process",
    description: "Shows the reasoning process so users can see how the AI arrived at its approach. While currently read-only, it demonstrates the value of making the agent's strategy visible before and during execution.",
    image: "/images/examples/plan-summary-claude.png",
    altText: "Claude Extended Thinking showing step-by-step reasoning process for a complex task"
  }
];
