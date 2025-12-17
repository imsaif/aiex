'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { Newsletter } from '@/types';

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
  const formattedDate = new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Estimate reading time (avg 200 words per minute)
  const wordCount = newsletter.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

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
                  className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-text-primary prose-headings:font-semibold
            prose-p:text-text-secondary prose-p:leading-relaxed
            prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-text-primary prose-strong:font-semibold
            prose-ul:text-text-secondary prose-ol:text-text-secondary
            prose-li:marker:text-text-tertiary
            prose-blockquote:border-l-accent-primary prose-blockquote:text-text-secondary
            prose-code:text-accent-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100"
          dangerouslySetInnerHTML={{ __html: newsletter.content }}
        />
      </article>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous */}
            {previousNewsletter ? (
              <Link
                href={`/news/${previousNewsletter.slug}`}
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
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
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors md:text-right"
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
