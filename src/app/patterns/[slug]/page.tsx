import { notFound } from 'next/navigation';
import { getPattern, patternMetadata } from '@/data/patterns';
import { Metadata } from 'next';
import ClientPage from './client-page';

// Generate static params for all patterns at build time
export async function generateStaticParams() {
  return patternMetadata.map((pattern) => ({
    slug: pattern.slug,
  }));
}

// Generate metadata for each pattern page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const patternMeta = patternMetadata.find(p => p.slug === slug);

  if (!patternMeta) {
    return {
      title: 'Pattern Not Found',
    };
  }

  return {
    title: `${patternMeta.title} | AI Design Patterns`,
    description: patternMeta.description,
    openGraph: {
      title: patternMeta.title,
      description: patternMeta.description,
      type: 'article',
    },
  };
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params before accessing properties (Next.js 15 requirement)
  const { slug } = await params;
  
  // Load pattern data dynamically (only when needed)
  const pattern = await getPattern(slug);

  if (!pattern) {
    notFound();
  }

  // Previous/next navigation is omitted for now
  return (
    <ClientPage 
      pattern={pattern}
      previousPattern={null}
      nextPattern={null}
    />
  );
} 