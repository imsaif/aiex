import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuideBySlug } from '@/data/guides';
import patterns from '@/data/patterns';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);

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

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  // Get related patterns
  const relatedPatterns = guide.relatedPatterns
    ? patterns.filter((p) => guide.relatedPatterns?.includes(p.title))
    : [];

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Guide Content */}
      <div className="py-12 md:py-16">
        <div className="max-w-[900px] mx-auto px-8 md:px-12 lg:px-16">
          {/* Back Link */}
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover mb-6 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Guides
          </Link>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{guide.title}</h1>
            <p className="text-xl text-text-secondary mb-6">{guide.description}</p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border-primary">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Tool:</span>
                <span className="px-3 py-1 rounded-full text-sm bg-accent-subtle text-accent-primary font-medium">
                  {guide.tool}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Level:</span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-text-secondary">
                  {guide.skillLevel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-text-secondary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-sm text-text-secondary">{guide.readTime} min read</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">Domain:</span>
                <span className="text-sm text-text-secondary">{guide.designDomain}</span>
              </div>
            </div>
          </header>

          {/* Guide Content */}
          <article className="mb-12">
            <div
              className="text-text-primary leading-relaxed space-y-6
                       prose prose-invert max-w-none
                       [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
                       [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                       [&_p]:text-base [&_p]:text-text-secondary
                       [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2
                       [&_li]:text-text-secondary"
              dangerouslySetInnerHTML={{
                __html: guide.content || '<p>Guide content coming soon...</p>',
              }}
            />
          </article>

          {/* Related Patterns Section */}
          {relatedPatterns.length > 0 && (
            <section className="mt-16 pt-12 border-t border-border-primary">
              <h2 className="text-2xl font-bold mb-6">Related Patterns</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPatterns.map((pattern) => (
                  <Link
                    key={pattern.id}
                    href={`/patterns/${pattern.slug}`}
                    className="group p-4 rounded-lg bg-surface-primary border border-border-primary
                             hover:border-border-secondary hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                      {pattern.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                      {pattern.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
