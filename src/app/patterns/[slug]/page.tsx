import { notFound } from 'next/navigation';
import patterns from '@/data/patterns';
import { Metadata } from 'next';
import ClientPage from './client-page';
import { generatePatternMetadata } from '@/utils/metadata';
import { generatePatternStructuredData } from '@/utils/structuredData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

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
      description: 'The requested AI design pattern could not be found.',
    };
  }

  return generatePatternMetadata({
    title: pattern.title,
    description: pattern.description,
    slug: pattern.slug,
    category: pattern.category,
    tags: pattern.tags,
    thumbnail: pattern.thumbnail,
    datePublished: pattern.datePublished,
    dateModified: pattern.dateModified,
  });
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

  // Generate structured data for SEO
  const structuredData = generatePatternStructuredData(pattern);

  return (
    <>
      {/* Structured Data (JSON-LD) for SEO */}
      {structuredData.map((schema, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />
        <ClientPage
          pattern={pattern}
          previousPattern={previousPattern}
          nextPattern={nextPattern}
        />
        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
} 