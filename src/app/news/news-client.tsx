'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import dynamic from 'next/dynamic';
import { Newsletter, NewsletterTag } from '@/types';

// Chip icons. Keys must match PRODUCT_KEYWORDS in src/lib/newsletter/products.ts;
// a product with no entry here still renders as a text-only chip (the JSX guards
// on presence), so a missing logo degrades rather than breaking.
// Every logo is self-hosted under /public/images/logos/simple-icons/ — do NOT
// hotlink a CDN when adding one; fetch the SVG and commit it alongside the others.
const PRODUCT_ICONS: Record<string, string> = {
  'ChatGPT': '/images/logos/simple-icons/openai.svg',
  'Claude': '/images/logos/simple-icons/anthropic.svg',
  'Gemini': '/images/logos/simple-icons/googlegemini.svg',
  'Copilot': '/images/logos/simple-icons/githubcopilot.svg',
  'Perplexity': '/images/logos/simple-icons/perplexity.svg',
  'Figma': '/images/logos/simple-icons/figma.svg',
  'OpenAI': '/images/logos/simple-icons/openai.svg',
  'Google': '/images/logos/simple-icons/google.svg',
  'Apple': '/images/logos/simple-icons/apple.svg',
  'Microsoft': '/images/logos/simple-icons/microsoft.svg',
  'GitHub': '/images/logos/simple-icons/github.svg',
  'Adobe': '/images/logos/simple-icons/adobe.svg',
  'Slack': '/images/logos/simple-icons/slack.svg',
  'Canva': '/images/logos/simple-icons/canva.svg',
  'Vercel': '/images/logos/simple-icons/vercel.svg',
  'Atlassian': '/images/logos/simple-icons/atlassian.svg',
  'Reddit': '/images/logos/simple-icons/reddit.svg',
  'Replit': '/images/logos/simple-icons/replit.svg',
};

const InlineNewsletterSignup = dynamic(
  () => import('@/components/newsletter/InlineNewsletterSignup').then(mod => ({ default: mod.InlineNewsletterSignup })),
  {
    loading: () => <div className="h-[152px] bg-background-secondary rounded-lg animate-pulse" />,
  }
);

interface NewsClientProps {
  initialNewsletters: Newsletter[];
  availableTags: NewsletterTag[];
}

// Reading time is precomputed at write time (`readMinutes`) so this list does not
// have to download every issue's full HTML just to count words. See
// src/lib/newsletter/products.ts.

function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const now = new Date();
  return d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate();
}

function isNew(date: string | Date): boolean {
  const d = new Date(date);
  const twoDaysAgo = new Date();
  twoDaysAgo.setUTCDate(twoDaysAgo.getUTCDate() - 2);
  twoDaysAgo.setUTCHours(0, 0, 0, 0);
  return d >= twoDaysAgo;
}

export default function NewsClient({ initialNewsletters }: NewsClientProps) {
  // Date-derived UI (isToday / isNew badges) runs `new Date()` which produces
  // different output server-side (UTC) vs client-side (user TZ), causing the
  // documented React #418 hydration mismatch on /news. Gate all such UI behind
  // this flag so SSR and first client render are identical, then opt in after
  // hydration.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [filterQuery, setFilterQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  const [productFilters, setProductFilters] = useState<string[]>([]);
  const hasRecentNewsletters = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return initialNewsletters.some((n) => new Date(n.publishedAt) >= thirtyDaysAgo);
  }, [initialNewsletters]);

  const [showAll, setShowAll] = useState(!hasRecentNewsletters && initialNewsletters.length > 0);

  // Issue pages deep-link here as /news?product=Figma. Read AFTER hydration from
  // window.location rather than via useSearchParams: this page is ISR
  // (`revalidate = 3600` in page.tsx) and touching searchParams — in the server
  // component or through the hook — opts it out of static rendering, which would
  // hand back the load-time win from dropping the `content` column. The filter
  // applies on mount instead, and the widened range keeps the deep link honest
  // when the product has no coverage in the last 30 days.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('product');
    if (!requested) return;
    const known = initialNewsletters.some((n) => n.products?.includes(requested));
    if (!known) return;
    setProductFilters([requested]);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const inRecent = initialNewsletters.some(
      (n) => n.products?.includes(requested) && new Date(n.publishedAt) >= cutoff
    );
    if (!inRecent) setShowAll(true);
  }, [initialNewsletters]);

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

  // Which chips can actually return something in the CURRENT view. The chip row
  // itself is built from every issue (so it stays stable and doesn't reshuffle
  // under the cursor when you toggle "See all issues"), but the default view is
  // the last 30 days — so a product covered only in older issues would otherwise
  // render an enabled chip that yields an empty list. Those get disabled instead.
  const productsInView = useMemo(() => {
    const s = new Set<string>();
    displayedNewsletters.forEach((n) => n.products?.forEach((p) => s.add(p)));
    return s;
  }, [displayedNewsletters]);

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
    if (productFilters.length > 0) {
      results = results.filter((n) => productFilters.some((p) => n.products?.includes(p)));
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
  }, [displayedNewsletters, typeFilter, productFilters, filterQuery]);

  const hasActiveFilters = typeFilter !== 'all' || productFilters.length > 0 || filterQuery !== '';

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
                Daily AI Product Design Updates
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
              <p className="text-base font-medium text-text-secondary mt-4">
                46,000+ reads · 50+ products analyzed daily
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* max-w-7xl to match the hero container above. Was 5xl, which left a lot of
          dead margin on wide screens and forced the product chips onto 2-3 rows. */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Filter Bar. Contained in a bordered panel so the controls read as one
            object distinct from the list beneath them — on an all-white page the
            rows previously floated with nothing grouping them. Rows are separated
            by a divider rather than spacing alone, so each facet is its own band. */}
        <div className="mb-12 rounded-card border border-border-secondary bg-surface-primary divide-y divide-border-secondary">
          {/* Range + type + search on one line. They are all "which issues do I
              see" controls, so they read as one group; product gets its own row
              because it is a long wrapping list. The row renders even when there
              are no older issues, so search never disappears with the pills. */}
          <div className="flex items-center gap-4 px-5 py-4">
              {/* The count lives with "Clear filters" in the panel footer, so this
                  is just the row label. Heading kept for document structure but
                  visually hidden — "Show" is a control label, not a section title. */}
              <h2 className="sr-only">Browse issues</h2>
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider w-20 flex-shrink-0">Show</span>
              <div className="flex flex-1 items-center gap-3 flex-wrap">
                {olderNewsletters.length > 0 && (
                  <>
                    {([
                      { key: false, label: 'Last 30 days' },
                      { key: true, label: 'All issues' },
                    ] as const).map(({ key, label }) => (
                      <button
                        key={label}
                        onClick={() => setShowAll(key)}
                        aria-pressed={showAll === key}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                          showAll === key
                            ? 'bg-accent-primary text-white dark:text-gray-900'
                            : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    {/* Separates the date-range pair from the type pair, so "All
                        issues" and "All" don't read as one run of options. */}
                    <span className="w-px h-6 bg-border-secondary mx-1" aria-hidden="true" />
                  </>
                )}
                {(['all', 'daily', 'weekly'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      typeFilter === type
                        ? 'bg-accent-primary text-white dark:text-gray-900'
                        : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'daily' ? 'Daily' : 'Weekly'}
                  </button>
                ))}
                <div className="relative w-full sm:w-72 sm:ml-auto">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="search"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search issues..."
                    aria-label="Search issues"
                    className="w-full rounded-pill border border-border-secondary bg-surface-primary pl-11 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-accent-primary"
                  />
                  {filterQuery && (
                    <button
                      type="button"
                      onClick={() => setFilterQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-text-tertiary hover:text-text-primary hover:bg-background-tertiary transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" className="w-3.5 h-3.5" aria-hidden="true">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          {/* Product row */}
          <div className="flex items-start gap-4 px-5 py-4">
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider w-20 flex-shrink-0 mt-3">Product</span>
              <div className="flex items-center gap-3 flex-wrap">
                {allProducts.map((product) => {
                  const isSelected = productFilters.includes(product);
                  // Nothing to show for this product in the current window. Keep
                  // the chip in place (so the row doesn't jump) but make it
                  // unclickable rather than letting it return an empty list.
                  const isUnavailable = !productsInView.has(product) && !isSelected;
                  return (
                    <button
                      key={product}
                      disabled={isUnavailable}
                      title={isUnavailable ? `No ${product} coverage in this range` : undefined}
                      onClick={() => setProductFilters((prev) =>
                        isSelected ? prev.filter((p) => p !== product) : [...prev, product]
                      )}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-accent-primary text-white dark:text-gray-900 cursor-pointer'
                          : isUnavailable
                            ? 'bg-background-tertiary text-text-tertiary opacity-40 cursor-not-allowed'
                            : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary cursor-pointer'
                      }`}
                    >
                      {PRODUCT_ICONS[product] && (
                        <Image
                          src={PRODUCT_ICONS[product]}
                          alt=""
                          width={16}
                          height={16}
                          className={`flex-shrink-0 ${isSelected ? 'brightness-0 invert dark:invert-0' : 'opacity-60 dark:invert'}`}
                        />
                      )}
                      {product}
                    </button>
                  );
                })}
              </div>
          </div>

          {/* Result count + reset, as the panel's footer band. The count is always
              shown (not only when filters are active) so the panel always reports
              what the list below contains. */}
          <div className="flex items-center gap-3 px-5 py-3">
            <span className="text-sm text-text-secondary">
              {filteredNewsletters.length} {filteredNewsletters.length === 1 ? 'issue' : 'issues'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setProductFilters([]);
                  setFilterQuery('');
                }}
                className="text-sm text-accent-primary hover:underline font-medium cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Newsletter List */}
        <div className="space-y-0 animate-fade-in">
          {filteredNewsletters.map((newsletter, index) => {
            // Quiet day entries have empty content, which the generator records as
            // 0 reading minutes — show them inline without a link, since their
            // detail page would just bounce back here.
            const readingTime = newsletter.readMinutes ?? 0;
            const isQuietDay = readingTime === 0;
            const isWeekly = newsletter.type === 'weekly' || newsletter.title.startsWith('This Week in');
            const itemIsNew = hydrated && isNew(newsletter.publishedAt);
            const itemIsToday = hydrated && isToday(newsletter.publishedAt);

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
                setProductFilters([]);
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
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
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
                claps: 206,
                comments: 7,
                url: 'https://medium.com/design-bootcamp/ai-learned-to-shut-up-it-forgot-to-say-what-it-was-doing-91df21ad2742',
              },
              {
                title: 'Who is designing the boundary for AI?',
                summary: 'I mapped the permission decisions in 12 AI products. The gap in the middle is the design problem.',
                readTime: '19 min',
                date: 'Feb 24, 2026',
                claps: 132,
                comments: 4,
                url: 'https://medium.com/design-bootcamp/who-is-designing-the-boundary-for-ai-3a51b18b5fc7',
              },
              {
                title: 'Your design is invisible now',
                summary: 'When AI agents can\'t read your product, they borrow your competitor\'s words instead.',
                readTime: '15 min',
                date: 'Feb 10, 2026',
                claps: 114,
                comments: 2,
                url: 'https://medium.com/design-bootcamp/ai-cant-see-your-design-so-it-guesses-c50e3695f01a',
              },
              {
                title: 'AI is finally learning to shut up',
                summary: 'One-click actions, ambient context, and a framework for deciding when AI should talk and when it shouldn\'t.',
                readTime: '14 min',
                date: 'Jan 29, 2026',
                claps: 290,
                comments: 10,
                url: 'https://medium.com/design-bootcamp/ai-is-finally-learning-to-shut-up-62af1d2c01c8',
              },
              {
                title: 'Stop designing AI interfaces. Start designing AI relationships.',
                summary: 'Interface design is necessary for AI products. It\'s just not sufficient.',
                readTime: '11 min',
                date: 'Dec 23, 2025',
                claps: 34,
                comments: 0,
                url: 'https://medium.com/design-bootcamp/stop-designing-ai-interfaces-start-designing-ai-relationships-ab99228a796c',
              },
              {
                title: 'Most AIUX is just search with extra steps?',
                summary: 'We were given the most transformative technology in decades and we turned it into a fancier text box.',
                readTime: '10 min',
                date: 'Dec 12, 2025',
                claps: 214,
                comments: 2,
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
                <p className="text-base text-text-secondary leading-relaxed mb-4">
                  {article.summary}
                </p>
                <div className="flex items-center gap-4 mb-5 text-sm text-text-tertiary">
                  <span className="inline-flex items-center gap-1">
                    <span className="text-base grayscale">👏</span>
                    {article.claps}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="text-base grayscale">💬</span>
                    {article.comments}
                  </span>
                </div>
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
        <div className="fixed bottom-0 left-0 right-0 z-sticky bg-background-primary/95 backdrop-blur-sm border-t border-border-primary shadow-lg animate-slide-in">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-6">
            {stickyStatus === 'success' ? (
              // status-success fails contrast as TEXT (see .claude/rules/design-system.md),
              // so it carries the dot only and the label stays text-primary. The word
              // "Subscribed!" already conveys the state without relying on colour.
              <p className="flex-1 flex items-center gap-tight text-base text-text-primary font-medium">
                <span className="w-2 h-2 rounded-full bg-status-success flex-shrink-0" aria-hidden="true" />
                Subscribed!
              </p>
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
                    className="flex-1 max-w-sm px-5 py-3 text-base rounded-full border border-border-secondary bg-surface-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
                  />
                  <button
                    type="submit"
                    disabled={stickyStatus === 'loading'}
                    className="px-6 py-3 text-base font-semibold rounded-full bg-accent-primary text-white dark:text-gray-900 hover:bg-accent-hover transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
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
