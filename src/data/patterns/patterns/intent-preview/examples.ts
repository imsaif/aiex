import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Claude — Change Preview",
    description: "When Claude proposes to create or edit files, it shows the intended changes before applying them. Users can review, modify, or reject each change individually, maintaining full control over multi-step operations.",
    image: "/images/examples/claudepropose.gif",
    altText: "Claude showing proposed file changes with review and modify controls before applying edits"
  },
  {
    title: "GitHub Copilot Workspace — File Change Plan",
    description: "Shows a complete plan of the files it intends to create or modify, what changes it'll make in each, before writing any code. Users can edit the plan before execution begins.",
    image: "/images/examples/githubpropose.gif",
    altText: "GitHub Copilot Workspace displaying a plan of files to create and modify with edit controls"
  },
  {
    title: "Gemini Deep Research — Research Plan Preview",
    description: "When given a research query, Gemini Deep Research first generates and displays a research plan showing which sources to check and what questions to answer before executing. Users can refine the plan before it runs.",
    image: "/images/examples/geminiresearchplan.gif",
    altText: "Gemini Deep Research showing an editable research plan with sources and questions before execution"
  }
];
