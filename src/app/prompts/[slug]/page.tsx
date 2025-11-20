import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPromptBySlug, getPatternsWithPrompts } from '@/data/utils/prompt-utils';
import ClientPage from './client-page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for each prompt page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPromptBySlug(slug);

  if (!pattern) {
    return {
      title: 'Prompt Not Found',
    };
  }

  return {
    title: `${pattern.title} - Figma Make Prompt | AI Design Patterns`,
    description: `Copy-paste Figma Make prompt for ${pattern.title} pattern with customization tips. ${pattern.description}`,
    openGraph: {
      title: `${pattern.title} - Figma Make Prompt`,
      description: pattern.description,
      type: 'article',
    },
  };
}

// Generate static paths for all prompts
export async function generateStaticParams() {
  const patterns = getPatternsWithPrompts();

  return patterns.map((pattern) => ({
    slug: pattern.slug,
  }));
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pattern = getPromptBySlug(slug);

  if (!pattern) {
    notFound();
  }

  // Get all patterns with prompts for previous/next navigation
  const allPatterns = getPatternsWithPrompts();
  const currentIndex = allPatterns.findIndex(p => p.slug === slug);

  const previousPattern = currentIndex > 0 ? allPatterns[currentIndex - 1] : null;
  const nextPattern = currentIndex < allPatterns.length - 1 ? allPatterns[currentIndex + 1] : null;

  return (
    <ClientPage
      pattern={pattern}
      previousPattern={previousPattern}
      nextPattern={nextPattern}
    />
  );
}
