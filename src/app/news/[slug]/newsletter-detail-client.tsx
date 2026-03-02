'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import dynamic from 'next/dynamic';
import { Newsletter } from '@/types';

const InlineNewsletterSignup = dynamic(
  () => import('@/components/newsletter/InlineNewsletterSignup').then(mod => ({ default: mod.InlineNewsletterSignup })),
  {
    ssr: false,
    loading: () => <div className="h-24 bg-background-secondary rounded-lg animate-pulse" />,
  }
);

interface NewsletterDetailClientProps {
  newsletter: Newsletter;
  previousNewsletter: Newsletter | null;
  nextNewsletter: Newsletter | null;
}

export default function NewsletterDetailClient({
  newsletter,
  previousNewsletter,
  nextNewsletter,
}: NewsletterDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [sanitizedContent, setSanitizedContent] = useState(newsletter.content || '');

  const formattedDate = new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Estimate reading time (avg 200 words per minute)
  const wordCount = newsletter.content ? newsletter.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Lazy-load DOMPurify and sanitize content
  useEffect(() => {
    if (!newsletter.content) return;
    import('dompurify').then((mod) => {
      const DOMPurify = mod.default;
      const sanitized = DOMPurify.sanitize(newsletter.content, {
        ADD_TAGS: ['style'],
        ADD_ATTR: ['target', 'rel'],
      });
      setSanitizedContent(
        sanitized.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
      );
    });
  }, [newsletter.content]);

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Header */}
      <section className="pt-12 md:pt-16 pb-8 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Archive
          </Link>

          {/* Tags */}
          {newsletter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {newsletter.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-text-primary animate-fade-in">
            {newsletter.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-text-secondary text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <time dateTime={new Date(newsletter.publishedAt).toISOString()}>{formattedDate}</time>
            </div>
            <span className="text-text-tertiary">•</span>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div
          ref={contentRef}
          className="max-w-none [&>*]:max-w-none newsletter-content newsletter-dark-mode animate-fade-in"
          style={{ animationDelay: '100ms' }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>

      {/* Newsletter Subscription CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-surface-primary border border-primary rounded-2xl p-8 md:p-12 shadow-card">
          <InlineNewsletterSignup
            variant="news"
            customHeading="Enjoyed this issue?"
            customSubheading="Get AIUX News delivered to your inbox every week"
            customButtonText="Subscribe →"
            source="news"
          />
        </div>
      </section>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="border-t border-primary pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous */}
            {previousNewsletter ? (
              <Link
                href={`/news/${previousNewsletter.slug}`}
                className="group p-4 rounded-xl border border-primary hover:border-secondary transition-colors"
              >
                <div className="flex items-center gap-2 text-text-tertiary text-sm mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous Issue
                </div>
                <p className="font-medium text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
                  {previousNewsletter.title}
                </p>
              </Link>
            ) : (
              <div />
            )}

            {/* Next */}
            {nextNewsletter ? (
              <Link
                href={`/news/${nextNewsletter.slug}`}
                className="group p-4 rounded-xl border border-primary hover:border-secondary transition-colors md:text-right"
              >
                <div className="flex items-center gap-2 text-text-tertiary text-sm mb-2 md:justify-end">
                  Next Issue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="font-medium text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
                  {nextNewsletter.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
