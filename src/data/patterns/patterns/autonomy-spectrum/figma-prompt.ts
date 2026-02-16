import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a settings panel for controlling an AI agent's autonomy level. Show: (1) A labeled spectrum/slider with 4 levels: Suggest Only, Propose & Confirm, Act & Notify, Full Autonomy, (2) Per-task-type settings showing different autonomy levels for different domains (e.g., Email: Act & Notify, Calendar: Propose & Confirm, Finance: Suggest Only), (3) Current trust score based on agent performance history, (4) A 'Recent actions' preview showing what the agent would do at each level. Style: Professional, settings-panel aesthetic. Use color coding to indicate risk level at each autonomy tier.",
  figmaFileUrl: undefined,
  tips: [
    "Use a segmented slider rather than a continuous one  -  the 4 discrete levels are easier to understand than a smooth gradient",
    "Color-code autonomy levels from cool (blue/green for low autonomy) to warm (amber/red for full autonomy) to signal increasing risk",
    "Show a real-time preview of what changes at each level  -  'At this level, the agent will automatically sort your inbox without asking'",
    "Include a per-domain breakdown table so users can see all their autonomy settings at a glance",
    "Add a small trust indicator (accuracy percentage or track record) next to each domain to justify the current autonomy recommendation",
    "Use progressive disclosure  -  show the simple slider first, with an 'Advanced settings' expander for per-task granularity"
  ]
};
