import { Metadata } from 'next';
import { getPatternsWithPrompts } from '@/data/utils/prompt-utils';
import categories from '@/data/categories';
import PromptsClient from './prompts-client';

export const metadata: Metadata = {
  title: '36 Figma Make Prompts for AI Patterns | Copy-Paste Ready',
  description: 'Copy-paste ready Figma Make prompts for 36 AI design patterns. Generate ChatGPT interfaces, feedback loops, error states, and more with one click.',
  openGraph: {
    title: '36 Figma Make Prompts for AI Patterns | Copy-Paste Ready',
    description: 'Copy-paste ready Figma Make prompts for 36 AI design patterns. Generate ChatGPT interfaces, feedback loops, error states, and more.',
    type: 'website',
  },
};

// Serializable prompt data for the client
interface PromptItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
}

interface CategoryItem {
  id: string;
  title: string;
}

export default function PromptsPage() {
  // Pre-compute on server — avoids shipping full patterns array to client
  const allPatterns = getPatternsWithPrompts();

  const prompts: PromptItem[] = allPatterns.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    prompt: p.content.figmaPrompt?.prompt || '',
  }));

  const activeCategories: CategoryItem[] = categories
    .filter((cat) => allPatterns.some((p) => p.category === cat.title))
    .map((cat) => ({ id: cat.id, title: cat.title }));

  return <PromptsClient prompts={prompts} categories={activeCategories} />;
}
