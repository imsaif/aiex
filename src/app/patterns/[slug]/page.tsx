import { notFound } from 'next/navigation';
import patterns from '@/data/patterns';
import { Metadata } from 'next';
import ClientPage from './client-page';

// Generate static params for all patterns at build time
export async function generateStaticParams() {
  return patterns.map((pattern) => ({
    slug: pattern.slug,
  }));
}

// Generate metadata for each pattern page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pattern = patterns.find(p => p.slug === slug);

  if (!pattern) {
    return {
      title: 'Pattern Not Found',
    };
  }

  return {
    title: `${pattern.title} | AI Design Patterns`,
    description: pattern.description,
    openGraph: {
      title: pattern.title,
      description: pattern.description,
      type: 'article',
    },
  };
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params before accessing properties (Next.js 15 requirement)
  const { slug } = await params;

  // Find the requested pattern
  const currentIndex = patterns.findIndex(p => p.slug === slug);
  const pattern = patterns[currentIndex];

  if (!pattern) {
    notFound();
  }

  // Calculate previous and next patterns
  const previousPattern = currentIndex > 0 ? patterns[currentIndex - 1] : null;
  const nextPattern = currentIndex < patterns.length - 1 ? patterns[currentIndex + 1] : null;

  return (
    <ClientPage
      pattern={pattern}
      previousPattern={previousPattern}
      nextPattern={nextPattern}
    />
  );
} 