'use client';

import { useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { Newsletter } from '@/types';

interface NewsletterDetailClientProps {
  newsletter: Newsletter;
  previousNewsletter: Newsletter | null;
  nextNewsletter: Newsletter | null;
}

// Dark mode color mappings for inline styles
const darkModeColors: Record<string, string> = {
  '#0f172a': '#f1f5f9', // Dark navy -> light gray
  '#334155': '#cbd5e1', // Slate -> light slate
  '#555555': '#cbd5e1', // Gray -> light slate
  '#64748b': '#94a3b8', // Muted -> lighter muted
};

const darkModeBorderColors: Record<string, string> = {
  '#e2e8f0': '#475569', // Light border -> dark border
};

export default function NewsletterDetailClient({
  newsletter,
  previousNewsletter,
  nextNewsletter,
}: NewsletterDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Estimate reading time (avg 200 words per minute)
  const wordCount = newsletter.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = useMemo(() => {
    if (typeof window === 'undefined') return newsletter.content;
    return DOMPurify.sanitize(newsletter.content, {
      ADD_TAGS: ['style'],
      ADD_ATTR: ['target', 'rel'],
    });
  }, [newsletter.content]);

  // Fix inline styles for dark mode
  useEffect(() => {
    const applyDarkModeStyles = () => {
      if (!contentRef.current) return;

      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark' ||
        (html.getAttribute('data-theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches);

      const elements = contentRef.current.querySelectorAll('[style]');

      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const currentColor = htmlEl.style.color;
        const currentBorderColor = htmlEl.style.borderTopColor || htmlEl.style.borderColor;

        if (isDark) {
          // Store original colors if not already stored
          if (currentColor && !htmlEl.dataset.originalColor) {
            htmlEl.dataset.originalColor = currentColor;
          }
          if (currentBorderColor && !htmlEl.dataset.originalBorder) {
            htmlEl.dataset.originalBorder = currentBorderColor;
          }

          // Apply dark mode colors
          const originalColor = htmlEl.dataset.originalColor || currentColor;
          if (originalColor) {
            const normalizedColor = originalColor.toLowerCase().replace(/\s/g, '');
            for (const [light, dark] of Object.entries(darkModeColors)) {
              if (normalizedColor.includes(light.toLowerCase())) {
                htmlEl.style.color = dark;
                break;
              }
            }
          }

          // Apply dark mode border colors
          const originalBorder = htmlEl.dataset.originalBorder || currentBorderColor;
          if (originalBorder) {
            for (const [light, dark] of Object.entries(darkModeBorderColors)) {
              if (originalBorder.toLowerCase().includes(light.toLowerCase())) {
                htmlEl.style.borderTopColor = dark;
                htmlEl.style.borderColor = dark;
                break;
              }
            }
          }
        } else {
          // Restore original colors in light mode
          if (htmlEl.dataset.originalColor) {
            htmlEl.style.color = htmlEl.dataset.originalColor;
          }
          if (htmlEl.dataset.originalBorder) {
            htmlEl.style.borderTopColor = htmlEl.dataset.originalBorder;
            htmlEl.style.borderColor = htmlEl.dataset.originalBorder;
          }
        }
      });
    };

    // Apply on mount
    applyDarkModeStyles();

    // Watch for theme changes
    const observer = new MutationObserver(applyDarkModeStyles);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyDarkModeStyles);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', applyDarkModeStyles);
    };
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-text-primary"
          >
            {newsletter.title}
          </motion.h1>

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
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-none [&>*]:max-w-none newsletter-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>

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
