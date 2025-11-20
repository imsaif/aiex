import { Metadata } from 'next';
import PromptsClient from './prompts-client';

export const metadata: Metadata = {
  title: 'Figma Make Prompts | AI Design Patterns',
  description: 'Copy-paste ready Figma Make prompts for implementing AI design patterns. 18 prompts with customization tips for building AI interfaces.',
  openGraph: {
    title: 'Figma Make Prompts for AI Patterns',
    description: '18 ready-to-use prompts with customization tips',
    type: 'website',
  },
};

export default function PromptsPage() {
  return <PromptsClient />;
}
