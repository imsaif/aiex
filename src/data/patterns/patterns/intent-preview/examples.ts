import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Claude Artifacts & Computer Use - Change Preview",
    description: "When Claude proposes to create or edit files, it shows the intended changes before applying them. Users can review, modify, or reject each change individually, maintaining full control over multi-step operations.",
    image: "/images/examples/intent-preview.png",
    altText: "Claude showing proposed file changes with review and modify controls before applying edits"
  },
  {
    title: "GitHub Copilot Workspace - File Change Plan",
    description: "Shows a complete plan  -  the files it intends to create or modify, what changes it'll make in each  -  before writing any code. Users can edit the plan before execution begins.",
    image: "/images/examples/intent-preview-github.png",
    altText: "GitHub Copilot Workspace displaying a plan of files to create and modify with edit controls"
  },
  {
    title: "Cursor AI - Multi-File Diff Preview",
    description: "Displays proposed code changes as diffs  -  showing exactly what will be added, removed, or modified  -  before applying them. Multi-file changes are shown as a reviewable list with accept/reject per file.",
    image: "/images/examples/intent-preview-cursor.png",
    altText: "Cursor AI showing multi-file code diffs with accept and reject buttons per file change"
  },
  {
    title: "Google Deep Research - Research Plan Preview",
    description: "When given a research query, Deep Research first generates and displays a research plan showing which sources to check and what questions to answer before executing. Users can refine the plan before it runs.",
    image: "/images/examples/intent-preview-deep-research.png",
    altText: "Google Deep Research showing an editable research plan with sources and questions before execution"
  }
];
