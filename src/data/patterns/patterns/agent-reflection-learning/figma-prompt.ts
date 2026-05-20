import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a set of UI components for the Agent Reflection & Learning pattern. Include: (1) A ReflectionCard notification that appears at session start, showing a 3-sentence plain-language retrospective, a domain confidence badge, and a Yes/No confirmation prompt. (2) A confidence indicator component showing per-domain reliability as a labeled progress bar with trend arrow. (3) A Learning History list view with filter controls, showing task type, date, what changed, and a 'Recovered' badge for capabilities that have since succeeded. (4) A 'Recovered Capability' milestone toast that appears when an agent succeeds at a previously failed task type. Use a calm, informational visual tone — not alarming, not celebratory. Avoid red for errors; use amber and blue.",
  figmaFileUrl: undefined,
  tips: [
  "Use a distinct but non-alarming color for reflection cards — amber or slate blue works better than red, which triggers alarm rather than trust-building.",
  "Design the confidence indicator as a labeled component with a domain name and trend direction (up/down arrow), not a raw percentage — percentages invite false precision and anxiety.",
  "The ReflectionCard should be dismissible and non-blocking — never a modal. Position it as a banner at the top of the session view or as a sidebar card, not an overlay.",
  "Create a 'Recovered' badge variant in your component library — a green checkmark with 'Resolved after N attempts' — to make progress visible and positive.",
  "In the Learning History view, use a timeline layout rather than a flat list to make the evolution of agent behavior feel like a narrative arc, not a bug log.",
  "Design empty states carefully: 'No reflections yet' should feel like a positive signal ('the agent hasn't made significant errors') not an absence of data."
],
};
