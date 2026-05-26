import { notFound } from 'next/navigation';
import patterns from '@/data/patterns';
import { Metadata } from 'next';
import ClientPage from './client-page';
import { generatePatternMetadata } from '@/utils/metadata';
import { generatePatternStructuredData } from '@/utils/structuredData';
import { getProductsForPattern } from '@/data/utils/product-utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { PatternSummary } from '@/types';
import { guides } from '@/data/guides';
import { getGuidesForPattern } from '@/lib/cross-links';

// ISR: revalidate daily — content is stable + on-demand revalidation handles admin edits
export const revalidate = 86400;
// Only allow slugs from generateStaticParams — unknown slugs return 404
export const dynamicParams = false;

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

  // Same-category patterns (excluding current)
  const categoryPatterns: PatternSummary[] = patterns
    .filter(p => p.category === pattern.category && p.slug !== pattern.slug)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      category: p.category,
      tags: p.tags,
      thumbnail: p.thumbnail,
      products: getProductsForPattern(p),
      industries: [],
    }));

  // Guides that teach this pattern in practice (cross-link for SEO)
  const relatedGuideData = getGuidesForPattern(pattern.slug)
    .map(slug => guides.find(g => g.slug === slug))
    .filter((g): g is typeof guides[number] => g != null)
    .map(g => ({
      slug: g.slug,
      title: g.title,
      tool: g.tool,
      lessonCount: g.lessons?.length ?? g.lessonCount ?? 0,
    }));

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
          categoryPatterns={categoryPatterns}
          relatedGuides={relatedGuideData}
        />
        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
} 