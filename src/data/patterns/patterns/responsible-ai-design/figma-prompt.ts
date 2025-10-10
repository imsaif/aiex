import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a responsible AI decision interface similar to LinkedIn's AI-powered recommendations or Microsoft's Responsible AI dashboard. Show an AI recommendation card with transparency layers. Include: main decision/recommendation display, expandable 'How this was decided' section showing key factors with visual weights, bias detection indicator (color-coded badge), data source attribution, user control panel with override and feedback buttons, and audit trail timeline. Style: Professional, trustworthy, high-contrast for accessibility. Use blues/greens for trust, clear typography, WCAG AAA compliant. Platform: Web application, responsive design.",
  figmaFileUrl: undefined,
  tips: [
    "Use progressive disclosure: collapse detailed explanations by default",
    "Add visual factor weights (bar charts, percentage indicators)",
    "Include a 'Report Bias' button prominently but not alarmingly",
    "Match your brand colors while maintaining accessibility standards",
    "Design for mobile: stack elements vertically, ensure touch targets are 44x44px minimum",
    "Add tooltips for technical terms using plain language"
  ]
};
