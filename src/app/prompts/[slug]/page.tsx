import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPromptBySlug, getPatternsWithPrompts } from '@/data/utils/prompt-utils';
import { siteConfig } from '@/config/seo';
import ClientPage from './client-page';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

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
    // No trailing "| AI Design Patterns" here — the root layout's title
    // template appends it, and hardcoding it produced a doubled suffix in the
    // live <title>.
    title: `${pattern.title} - Figma Make Prompt`,
    description: `Copy-paste Figma Make prompt for ${pattern.title} pattern with customization tips. ${pattern.description}`,
    openGraph: {
      title: `${pattern.title} - Figma Make Prompt`,
      description: pattern.description,
      type: 'article',
    },
    // Every /prompts/<slug> shares its slug with /patterns/<slug>. Without a
    // canonical, Google saw two similar pages and no signal of which is
    // primary, and dropped one: 7 prompt pages sat in "Crawled - currently not
    // indexed" in the 2026-09-11 Search Console export. Self-referencing
    // canonical, since these pages are their own primary URL.
    alternates: { canonical: `${siteConfig.url}/prompts/${slug}` },
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
  );
}
