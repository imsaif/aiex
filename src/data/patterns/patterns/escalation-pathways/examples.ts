import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Intercom Fin - AI-to-Human Customer Service Handoff",
    description: "When the AI agent can't confidently resolve a customer issue, it seamlessly transfers to a human agent with full conversation context and a summary of what it already tried, preserving continuity.",
    image: "/images/examples/escalation-pathways.png",
    altText: "Intercom Fin showing AI-to-human handoff with conversation context summary and attempted resolution log"
  },
  {
    title: "Microsoft Copilot in Teams - Authorization Escalation",
    description: "When asked to perform an action it can't complete, like approving a purchase order above its authorization level, it explains why and routes the request to the appropriate person with full context.",
    image: "/images/examples/escalation-pathways-teams.png",
    altText: "Microsoft Copilot in Teams showing an authorization escalation with explanation and routing to approver"
  },
  {
    title: "Cursor AI - Architectural Decision Escalation",
    description: "When encountering a coding decision that requires architectural judgment, it presents options and asks the developer to choose rather than making the decision autonomously, preserving developer control over critical choices.",
    image: "/images/examples/escalation-pathways-cursor.png",
    altText: "Cursor AI presenting architectural options for developer choice rather than making autonomous decision"
  },
  {
    title: "Amazon Warehouse Robots - Physical Task Escalation",
    description: "Robots escalate to human workers when they encounter items they can't identify or pick reliably, providing camera footage and location data for efficient human intervention without disrupting overall workflow.",
    image: "/images/examples/escalation-pathways-amazon.png",
    altText: "Amazon warehouse robot escalation system showing camera view and location data for human worker assistance"
  }
];
