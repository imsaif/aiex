'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import { Newsletter, NewsletterTag } from '@/types';

interface NewsClientProps {
  initialNewsletters: Newsletter[];
  availableTags: NewsletterTag[];
}

export default function NewsClient({ initialNewsletters }: NewsClientProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filter newsletters from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentNewsletters = useMemo(() => {
    return initialNewsletters.filter(
      (n) => new Date(n.publishedAt) >= thirtyDaysAgo
    );
  }, [initialNewsletters]);

  const olderNewsletters = useMemo(() => {
    return initialNewsletters.filter(
      (n) => new Date(n.publishedAt) < thirtyDaysAgo
    );
  }, [initialNewsletters]);

  const displayedNewsletters = showAll ? initialNewsletters : recentNewsletters;

  const filteredNewsletters = useMemo(() => {
    if (!filterQuery) return displayedNewsletters;

    const query = filterQuery.toLowerCase();
    return displayedNewsletters.filter(
      (newsletter) =>
        newsletter.title.toLowerCase().includes(query) ||
        newsletter.summary.toLowerCase().includes(query) ||
        newsletter.tags.some((tag) => tag.name.toLowerCase().includes(query))
    );
  }, [displayedNewsletters, filterQuery]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section - with background + grain */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Info Chip */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info">
                Weekly AI Design Updates
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-text-primary">
              AIUX News
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              What&apos;s new in AI products and what it means for design.
            </p>

            {/* Subscribe Form */}
            <div className="max-w-md mx-auto">
              <InlineNewsletterSignup
                variant="hero"
                source="news"
                customSubheading="Get weekly AI product updates, pattern breakdowns & design insights"
                customButtonText="Solve my AI design overload →"
                customSuccessMessage="You're in! Watch for our next issue."
                stacked
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Section Header with Filter */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-lg font-semibold text-text-primary">
            {showAll ? 'All issues' : 'Last 30 days in AIUX'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary text-sm">Filter:</span>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Type to filter..."
                className="bg-transparent border-b border-border-secondary focus:border-accent-primary outline-none text-sm px-1 py-0.5 w-32 text-text-primary placeholder:text-text-tertiary"
              />
            </div>
            {!showAll && olderNewsletters.length > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="text-accent-primary hover:underline text-sm font-medium"
              >
                See all issues
              </button>
            )}
            {showAll && (
              <button
                onClick={() => setShowAll(false)}
                className="text-accent-primary hover:underline text-sm font-medium"
              >
                Last 30 days
              </button>
            )}
          </div>
        </div>

        {/* Newsletter List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-0"
        >
          {filteredNewsletters.map((newsletter, index) => {
            // Quiet day entries have empty content - show inline without link
            const isQuietDay = !newsletter.content || newsletter.content.trim() === '';

            return (
              <motion.div
                key={newsletter.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {isQuietDay ? (
                  // Quiet day - inline display, no link
                  <div className="flex items-start gap-4 py-4 border-b border-border-secondary -mx-4 px-4">
                    {/* Moon icon for quiet days */}
                    <span className="w-5 h-5 flex items-center justify-center text-text-tertiary flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                      </svg>
                    </span>

                    {/* Date */}
                    <span className="text-text-tertiary text-sm w-16 flex-shrink-0">
                      {formatDate(newsletter.publishedAt)}
                    </span>

                    {/* Title + Summary inline */}
                    <div className="flex-1">
                      <span className="text-text-secondary italic">
                        {newsletter.summary}
                      </span>
                    </div>
                  </div>
                ) : (
                  // Regular newsletter - with link
                  <Link
                    href={`/news/${newsletter.slug}`}
                    className="group flex items-center gap-4 py-4 border-b border-border-secondary hover:bg-surface-secondary/50 -mx-4 px-4 transition-colors"
                  >
                    {/* Dot */}
                    <span className="w-2 h-2 rounded-full bg-text-tertiary group-hover:bg-accent-primary transition-colors flex-shrink-0" />

                    {/* Date */}
                    <span className="text-text-tertiary text-sm w-16 flex-shrink-0">
                      {formatDate(newsletter.publishedAt)}
                    </span>

                    {/* Title */}
                    <span className="flex-1 text-text-primary group-hover:text-accent-primary transition-colors truncate">
                      {newsletter.title}
                    </span>

                    {/* Arrow */}
                    <svg
                      className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredNewsletters.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-2">No newsletters match your filter</p>
            <button
              onClick={() => setFilterQuery('')}
              className="text-accent-primary hover:underline text-sm"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
