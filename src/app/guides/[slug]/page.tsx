import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGuideBySlug, getPreviousGuide, getNextGuide } from '@/data/guides';
import patterns from '@/data/patterns';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import GuideClient from './guide-client';

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  return {
    title: `${guide.title} | aiux`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Get related patterns
  const relatedPatterns = guide.relatedPatterns
    ? patterns.filter((p) => guide.relatedPatterns?.includes(p.title))
    : [];

  // Get navigation
  const previousGuide = getPreviousGuide(slug);
  const nextGuide = getNextGuide(slug);

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />
      <GuideClient
        guide={guide}
        previousGuide={previousGuide}
        nextGuide={nextGuide}
        relatedPatterns={relatedPatterns}
      />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
