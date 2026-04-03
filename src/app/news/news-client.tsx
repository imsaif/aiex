'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import dynamic from 'next/dynamic';
import { Newsletter, NewsletterTag } from '@/types';

const InlineNewsletterSignup = dynamic(
  () => import('@/components/newsletter/InlineNewsletterSignup').then(mod => ({ default: mod.InlineNewsletterSignup })),
  {
    ssr: false,
    loading: () => <div className="h-12 bg-background-secondary rounded-lg animate-pulse" />,
  }
);

interface NewsClientProps {
  initialNewsletters: Newsletter[];
  availableTags: NewsletterTag[];
}

function getReadingTime(content: string): number {
  const wordCount = content ? content.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isNew(date: string | Date): boolean {
  const d = new Date(date);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return d >= twoDaysAgo;
}

export default function NewsClient({ initialNewsletters }: NewsClientProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const hasRecentNewsletters = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return initialNewsletters.some((n) => new Date(n.publishedAt) >= thirtyDaysAgo);
  }, [initialNewsletters]);

  const [showAll, setShowAll] = useState(!hasRecentNewsletters && initialNewsletters.length > 0);
  const [showStickySignup, setShowStickySignup] = useState(false);
  const [stickyEmail, setStickyEmail] = useState('');
  const [stickyStatus, setStickyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleStickySubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stickyEmail || !stickyEmail.includes('@')) return;
    setStickyStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: stickyEmail, source: 'news', website_url: '' }),
      });
      if (res.ok) {
        setStickyStatus('success');
        localStorage.setItem('newsletter_subscribed', 'true');
        setTimeout(() => setShowStickySignup(false), 2000);
      } else {
        setStickyStatus('error');
      }
    } catch {
      setStickyStatus('error');
    }
  }, [stickyEmail]);

  const thirtyDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  }, []);

  const recentNewsletters = useMemo(() => {
    return initialNewsletters.filter(
      (n) => new Date(n.publishedAt) >= thirtyDaysAgo
    );
  }, [initialNewsletters, thirtyDaysAgo]);

  const olderNewsletters = useMemo(() => {
    return initialNewsletters.filter(
      (n) => new Date(n.publishedAt) < thirtyDaysAgo
    );
  }, [initialNewsletters, thirtyDaysAgo]);

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

  // Show sticky signup bar after scrolling past the hero
  useEffect(() => {
    const hasSubscribed = localStorage.getItem('newsletter_subscribed') === 'true';
    if (hasSubscribed) return;

    const handleScroll = () => {
      setShowStickySignup(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                Daily AI Design Updates
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
                customSubheading="Get daily AI product updates, pattern breakdowns & design insights"
                customButtonText="Solve my AI design overload →"
                customSuccessMessage="You're in! Watch for our next issue."
                stacked
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
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
        <div className="space-y-0 animate-fade-in">
          {filteredNewsletters.map((newsletter, index) => {
            // Quiet day entries have empty content - show inline without link
            const isQuietDay = !newsletter.content || newsletter.content.trim() === '';
            const isWeekly = newsletter.type === 'weekly' || newsletter.title.startsWith('This Week in');
            const itemIsNew = isNew(newsletter.publishedAt);
            const itemIsToday = isToday(newsletter.publishedAt);
            const readingTime = !isQuietDay ? getReadingTime(newsletter.content) : 0;

            return (
              <div
                key={newsletter.id}
                className="animate-slide-in"
                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
              >
                {isQuietDay ? (
                  // Quiet day - inline display
                  <div className="flex items-center gap-4 py-4 border-b border-border-secondary -mx-4 px-4">
                    {/* Moon icon for quiet days */}
                    <span className="w-5 h-5 flex items-center justify-center text-text-tertiary flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                      </svg>
                    </span>

                    {/* Date */}
                    <span className="text-text-tertiary text-sm w-16 flex-shrink-0">
                      {formatDate(newsletter.publishedAt)}
                    </span>

                    {/* Summary only */}
                    <span className="flex-1 text-text-secondary italic">
                      {newsletter.summary}
                    </span>
                  </div>
                ) : (
                  // Regular newsletter - with link
                  <Link
                    href={`/news/${newsletter.slug}`}
                    className={`group flex items-start gap-4 py-4 border-b border-border-secondary hover:bg-surface-secondary/50 -mx-4 px-4 transition-colors ${
                      itemIsToday ? 'bg-accent-subtle/30' : ''
                    }`}
                  >
                    {/* Dot — accent for new, muted for older */}
                    <span className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 transition-colors ${
                      itemIsNew
                        ? 'bg-accent-primary'
                        : 'bg-text-tertiary group-hover:bg-accent-primary'
                    }`} />

                    {/* Date */}
                    <span className="text-text-tertiary text-base w-20 flex-shrink-0 mt-0.5">
                      {formatDate(newsletter.publishedAt)}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base md:text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                          {newsletter.title}
                        </span>
                        {isWeekly && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-accent-primary/10 text-accent-primary">
                            Weekly
                          </span>
                        )}
                        {itemIsToday && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Today
                          </span>
                        )}
                      </div>
                      {newsletter.summary && (
                        <p className="text-sm md:text-base text-text-secondary mt-1 line-clamp-1">
                          {newsletter.summary}
                        </p>
                      )}
                      <span className="text-sm text-text-secondary mt-1 inline-block">
                        {readingTime} min read
                      </span>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="w-4 h-4 mt-1.5 text-text-tertiary group-hover:text-accent-primary group-hover:translate-x-1 transition-all flex-shrink-0"
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
              </div>
            );
          })}
        </div>

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

      {/* Sticky Newsletter Signup Bar */}
      {showStickySignup && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background-primary/95 backdrop-blur-sm border-t border-border-primary shadow-lg animate-slide-in">
          <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-6">
            {stickyStatus === 'success' ? (
              <p className="flex-1 text-base text-green-600 dark:text-green-400 font-medium">Subscribed!</p>
            ) : (
              <>
                <p className="text-base font-semibold text-text-primary hidden sm:block whitespace-nowrap">
                  Get these in your inbox
                </p>
                <form onSubmit={handleStickySubscribe} className="flex-1 flex items-center gap-3">
                  <input
                    type="email"
                    value={stickyEmail}
                    onChange={(e) => setStickyEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 max-w-sm px-5 py-3 text-base rounded-full border border-border-secondary bg-white dark:bg-gray-800 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
                  />
                  <button
                    type="submit"
                    disabled={stickyStatus === 'loading'}
                    className="px-6 py-3 text-base font-semibold rounded-full bg-accent-primary text-white hover:bg-accent-hover transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    {stickyStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                <p className="text-sm text-text-tertiary hidden md:block whitespace-nowrap">
                  Daily AIUX news. Unsubscribe anytime.
                </p>
              </>
            )}
            <button
              onClick={() => setShowStickySignup(false)}
              className="text-text-tertiary hover:text-text-primary p-1 flex-shrink-0"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Footer />
      <ScrollToTop />
    </main>
  );
}
