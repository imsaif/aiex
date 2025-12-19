'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-primary">
              AIUX News
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              How designers stay ahead of AI. Weekly insights on design patterns, UX strategies, and what&apos;s shaping the future of human-AI interaction.
            </p>
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
          {filteredNewsletters.map((newsletter, index) => (
            <motion.div
              key={newsletter.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
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
            </motion.div>
          ))}
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
