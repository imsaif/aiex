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
  const pattern = patterns.find(p => p.slug === slug);

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