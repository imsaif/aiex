'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import dynamic from 'next/dynamic';
import { Newsletter, NewsletterTag } from '@/types';

const PRODUCT_ICONS: Record<string, string> = {
  'ChatGPT': '/images/logos/simple-icons/openai.svg',
  'Claude': '/images/logos/simple-icons/anthropic.svg',
  'Gemini': '/images/logos/simple-icons/googlegemini.svg',
  'Cursor': '/images/logos/simple-icons/cursor.svg',
  'Copilot': '/images/logos/simple-icons/githubcopilot.svg',
  'Perplexity': '/images/logos/simple-icons/perplexity.svg',
  'Midjourney': '/images/logos/simple-icons/midjourney.svg',
  'Figma': '/images/logos/simple-icons/figma.svg',
  'v0': '/images/logos/simple-icons/v0.svg',
  'OpenAI': '/images/logos/simple-icons/openai.svg',
  'Google': '/images/logos/simple-icons/google.svg',
  'Meta': '/images/logos/simple-icons/meta.svg',
  'Apple': '/images/logos/simple-icons/apple.svg',
};

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
  const [typeFilter, setTypeFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  const [productFilter, setProductFilter] = useState<string | null>(null);
  const hasRecentNewsletters = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return initialNewsletters.some((n) => new Date(n.publishedAt) >= thirtyDaysAgo);
  }, [initialNewsletters]);

  const [showAll, setShowAll] = useState(!hasRecentNewsletters && initialNewsletters.length > 0);
  const [showStickySignup, setShowStickySignup] = useState(false);
  const [stickyEmail, setStickyEmail] = useState('');
  const [stickyStatus, setStickyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Collect all unique products across newsletters
  const allProducts = useMemo(() => {
    const counts = new Map<string, number>();
    initialNewsletters.forEach((n) => {
      n.products?.forEach((p) => counts.set(p, (counts.get(p) || 0) + 1));
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [initialNewsletters]);

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
    let results = displayedNewsletters;

    // Type filter
    if (typeFilter !== 'all') {
      results = results.filter((n) => {
        const isWeekly = n.type === 'weekly' || n.title.startsWith('This Week in');
        return typeFilter === 'weekly' ? isWeekly : !isWeekly;
      });
    }

    // Product filter
    if (productFilter) {
      results = results.filter((n) => n.products?.includes(productFilter));
    }

    // Text search
    if (filterQuery) {
      const query = filterQuery.toLowerCase();
      results = results.filter(
        (newsletter) =>
          newsletter.title.toLowerCase().includes(query) ||
          newsletter.summary.toLowerCase().includes(query) ||
          newsletter.tags.some((tag) => tag.name.toLowerCase().includes(query))
      );
    }

    return results;
  }, [displayedNewsletters, typeFilter, productFilter, filterQuery]);

  const hasActiveFilters = typeFilter !== 'all' || productFilter !== null || filterQuery !== '';

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
        {/* Filter Bar */}
        <div className="mb-12 space-y-6">
          {/* Top row: heading + time toggle + search */}
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-text-primary">
              {showAll ? 'All issues' : 'Last 30 days'}
            </h2>
            <div className="flex items-center gap-4">
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
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-b border-border-secondary focus:border-accent-primary outline-none text-sm px-1 py-0.5 w-28 text-text-primary placeholder:text-text-tertiary"
              />
            </div>
          </div>

          {/* Filter rows */}
          <div className="space-y-5">
            {/* Type row */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider w-16 flex-shrink-0">Type</span>
              <div className="flex items-center gap-3">
                {(['all', 'daily', 'weekly'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                      typeFilter === type
                        ? 'bg-accent-primary text-white'
                        : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'daily' ? 'Daily' : 'Weekly'}
                  </button>
                ))}
              </div>
            </div>

            {/* Product row */}
            <div className="flex items-start gap-4">
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider w-16 flex-shrink-0 mt-3">Product</span>
              <div className="flex items-center gap-3 flex-wrap">
                {allProducts.map((product) => (
                  <button
                    key={product}
                    onClick={() => setProductFilter(productFilter === product ? null : product)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                      productFilter === product
                        ? 'bg-accent-primary text-white'
                        : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
                    }`}
                  >
                    {PRODUCT_ICONS[product] && (
                      <Image
                        src={PRODUCT_ICONS[product]}
                        alt=""
                        width={16}
                        height={16}
                        className={`flex-shrink-0 ${productFilter === product ? 'brightness-0 invert' : 'opacity-60 dark:invert'}`}
                      />
                    )}
                    {product}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">
                {filteredNewsletters.length} {filteredNewsletters.length === 1 ? 'issue' : 'issues'}
              </span>
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setProductFilter(null);
                  setFilterQuery('');
                }}
                className="text-sm text-accent-primary hover:underline font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
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
            <p className="text-text-secondary mb-2">No issues match your filters</p>
            <button
              onClick={() => {
                setTypeFilter('all');
                setProductFilter(null);
                setFilterQuery('');
              }}
              className="text-accent-primary hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Deep Dives Section */}
      <section className="border-t border-border-secondary">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="mb-10">
            <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">From the editor</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mt-2">Deep Dives</h2>
            <p className="text-text-secondary mt-2">Long-form analysis on where AI design is heading.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'AI learned to shut up. It forgot to say what it was doing.',
                summary: 'Two AI products read my data this week. One told me. The other assumed I\'d figure it out.',
                readTime: '18 min',
                date: 'Mar 30, 2026',
                url: 'https://medium.com/design-bootcamp/ai-learned-to-shut-up-it-forgot-to-say-what-it-was-doing-91df21ad2742',
              },
              {
                title: 'Who is designing the boundary for AI?',
                summary: 'I mapped the permission decisions in 12 AI products. The gap in the middle is the design problem.',
                readTime: '19 min',
                date: 'Feb 24, 2026',
                url: 'https://medium.com/design-bootcamp/who-is-designing-the-boundary-for-ai-3a51b18b5fc7',
              },
              {
                title: 'Your design is invisible now',
                summary: 'When AI agents can\'t read your product, they borrow your competitor\'s words instead.',
                readTime: '15 min',
                date: 'Feb 10, 2026',
                url: 'https://medium.com/design-bootcamp/ai-cant-see-your-design-so-it-guesses-c50e3695f01a',
              },
              {
                title: 'AI is finally learning to shut up',
                summary: 'One-click actions, ambient context, and a framework for deciding when AI should talk and when it shouldn\'t.',
                readTime: '14 min',
                date: 'Jan 29, 2026',
                url: 'https://medium.com/design-bootcamp/ai-is-finally-learning-to-shut-up-62af1d2c01c8',
              },
              {
                title: 'Stop designing AI interfaces. Start designing AI relationships.',
                summary: 'Interface design is necessary for AI products. It\'s just not sufficient.',
                readTime: '11 min',
                date: 'Dec 23, 2025',
                url: 'https://medium.com/design-bootcamp/stop-designing-ai-interfaces-start-designing-ai-relationships-ab99228a796c',
              },
              {
                title: 'Most AIUX is just search with extra steps?',
                summary: 'We were given the most transformative technology in decades and we turned it into a fancier text box.',
                readTime: '10 min',
                date: 'Dec 12, 2025',
                url: 'https://medium.com/design-bootcamp/most-aiux-is-just-search-with-extra-steps-3faaae035ab8',
              },
            ].map((article) => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 rounded-xl border border-border-secondary hover:border-accent-primary/40 hover:bg-surface-secondary/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-4 text-sm text-text-tertiary">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime} read</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-snug mb-3">
                  {article.title}
                </h3>
                <p className="text-base text-text-secondary leading-relaxed mb-5">
                  {article.summary}
                </p>
                <span className="inline-flex items-center gap-1.5 text-base font-medium text-accent-primary">
                  Read on Medium
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

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
