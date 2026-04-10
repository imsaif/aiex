import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guides, getGuideBySlug, getPreviousGuide, getNextGuide } from '@/data/guides';
import { generateGuideStructuredData } from '@/utils/structuredData';
import { siteConfig } from '@/config/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import GuideClient from './guide-client';

// ISR + static params so course overviews are pre-built and cached — previously
// every request cold-started a serverless function (flagged in the SEO audit).
export const revalidate = 3600;

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  const pageUrl = `${siteConfig.url}/guides/${slug}`;
  const ogImage = guide.thumbnail?.startsWith('http')
    ? guide.thumbnail
    : `${siteConfig.url}${guide.thumbnail || siteConfig.ogImage}`;

  // Keep titles inside Google's ~60-65 char display window. Previously this
  // template produced 95+ char double-suffixed titles (audit #4).
  // `title.absolute` skips the layout's "%s | AI Design Patterns" template.
  const lessonCount = guide.lessons?.length ?? 0;
  const titleSuffix = lessonCount > 0 ? ` (${lessonCount} Lessons)` : '';
  const absoluteTitle = `${guide.tool} for Designers — Free Course${titleSuffix}`;
  const ogTitle = `${guide.tool} for Designers — Free Course`;

  return {
    title: { absolute: absoluteTitle },
    description: guide.excerpt || guide.description,
    keywords: [
      guide.tool.toLowerCase(),
      `${guide.tool.toLowerCase()} for designers`,
      `${guide.tool.toLowerCase()} guide`,
      `${guide.tool.toLowerCase()} tutorial`,
      `${guide.tool.toLowerCase()} course`,
      `${guide.tool.toLowerCase()} learning path`,
      ...(guide.tags || []),
      'AI tools for designers',
      'design with AI',
    ],
    openGraph: {
      title: ogTitle,
      description: guide.excerpt || guide.description,
      url: pageUrl,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: guide.publishedDate,
      modifiedTime: guide.lastUpdatedDate,
      images: [{ url: ogImage, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: guide.excerpt || guide.description,
      images: [ogImage],
      creator: siteConfig.creator.twitter,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Get navigation
  const previousGuide = getPreviousGuide(slug);
  const nextGuide = getNextGuide(slug);

  // Structured data for SEO
  const structuredData = generateGuideStructuredData(guide);

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      {structuredData.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Navbar />
      <GuideClient
        guide={guide}
        previousGuide={previousGuide}
        nextGuide={nextGuide}
      />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
