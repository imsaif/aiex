import { Metadata } from 'next';
import PromptBuilderClient from './prompt-builder-client';

export const metadata: Metadata = {
  title: 'AI Dev Tool Prompt Builder | Generate Custom Prompts for Claude, Cursor & ChatGPT',
  description: 'Build custom prompts for AI coding assistants in minutes. Generate optimized prompts or config files (.cursorrules, CLAUDE.md) for Claude, Cursor, ChatGPT, and GitHub Copilot with your design system and project context.',
  openGraph: {
    title: 'AI Dev Tool Prompt Builder | Generate Custom Prompts for Claude, Cursor & ChatGPT',
    description: 'Build custom prompts for AI coding assistants. Generate optimized prompts or config files for Claude, Cursor, ChatGPT, and GitHub Copilot.',
    type: 'website',
  },
};

export default function PromptBuilderPage() {
  return <PromptBuilderClient />;
}
