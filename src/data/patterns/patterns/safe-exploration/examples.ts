import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "OpenAI Playground",
    description: "Interactive sandbox for experimenting with language models without affecting production. Users can test different prompts, adjust parameters, and explore model capabilities with full reversibility and isolation from real systems.",
    image: "/images/examples/openai-playground.gif",
    altText: "OpenAI Playground interface showing safe prompt experimentation with isolated sandbox environment"
  },
  {
    title: "GitHub Copilot Labs",
    description: "Experimental beta features in a protected environment where developers can test new AI coding capabilities, learn best practices, and safely explore novel functionality before integration into their workflow.",
    image: "/images/examples/github-copilot-labs.gif",
    altText: "GitHub Copilot Labs showing safe AI coding experimentation with preview and rollback capabilities"
  },
  {
    title: "Photoshop AI Beta",
    description: "Dedicated experimental workspace with non-destructive AI editing tools. Users can try generative features, test new effects, and explore creative possibilities with full undo/revert options and original assets always preserved.",
    image: "/images/examples/photoshop-ai-beta.gif",
    altText: "Photoshop AI Beta workspace showing safe generative editing with non-destructive workflows"
  }
];
