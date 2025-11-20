import { Metadata } from 'next';
import PromptsClient from './prompts-client';

export const metadata: Metadata = {
  title: '18 Figma Make Prompts for AI Patterns | Copy-Paste Ready',
  description: 'Copy-paste ready Figma Make prompts for 18 AI design patterns. Generate ChatGPT interfaces, feedback loops, error states, and more with one click.',
  openGraph: {
    title: '18 Figma Make Prompts for AI Patterns | Copy-Paste Ready',
    description: 'Copy-paste ready Figma Make prompts for 18 AI design patterns. Generate ChatGPT interfaces, feedback loops, error states, and more.',
    type: 'website',
  },
};

export default function PromptsPage() {
  return <PromptsClient />;
}
