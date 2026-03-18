import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Notion AI - Scope Confirmation Before Bulk Action",
    description: "When asked to auto-fill a column with AI, Notion presents scope options — apply to this view only or fill all pages in the database. Gives users control over the blast radius before the AI acts across multiple items.",
    image: "/images/examples/notionaiscope.gif",
    altText: "Notion AI showing scope options for AI autofill with 'Try on this view' vs 'Fill all pages' choices"
  },
  {
    title: "Claude - Clarifying Questions Before Acting",
    description: "When a request is ambiguous, Claude pauses to ask clarifying questions rather than guessing. This ensures the response matches user intent and avoids wasted effort from incorrect assumptions.",
    image: "/images/examples/claudeclarifying.gif",
    altText: "Claude asking clarifying questions to understand user intent before providing a response"
  },
];
