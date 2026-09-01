import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { guides, getGuideBySlug } from '@/data/guides';
import CallOfferBlock from '@/components/call/CallOfferBlock';
import { guideCarriesCallOffer } from '@/lib/call-offer';
import { generateGuideStructuredData } from '@/utils/structuredData';
import { siteConfig } from '@/config/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import GuideSidebar from '@/components/guides/GuideSidebar';
import OnThisPage from '@/components/guides/OnThisPage';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import { getLessonsForCourse } from '@/lib/guides/lesson-urls';
import type { LessonHeading } from '@/lib/guides/headings';
import { MODULE_TITLES, MODULE_DESCRIPTIONS } from '@/lib/guides/modules';
import patterns from '@/data/patterns';
import { getPatternsForGuide } from '@/lib/cross-links';

/** Matches MAX_RELATED_PATTERNS on the lesson page. */
const MAX_RELATED_PATTERNS = 3;

// ISR + static params so course overviews are pre-built and cached — previously
// every request cold-started a serverless function (flagged in the SEO audit).
export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// A second "Claude Code" guide (ai-ux-skills-guide) would otherwise collide
// with claude-code-learning-path's title, since generateMetadata derives the
// title stem from guide.tool. Existing guides' titles stay byte-identical.
const TITLE_STEM_OVERRIDES: Record<string, string> = {
  'ai-ux-skills-guide': 'AI UX Skills for Claude Code',
  // "build a conversational interface" draws 236 impressions at ~position 10
  // (Search Console, 3mo to 25 Aug 2026) — a how-to query this course answers
  // and /patterns/conversational-ui does not. The derived stem was
  // "Conversational UI for Designers", which never says "build". Matching the
  // query exactly keeps the full title at 59 chars, inside the display window.
  'conversational-ui-guide': 'Build a Conversational Interface',
};

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  const pageUrl = `${siteConfig.url}/guides/${slug}`;
  // Dynamic OG image — branded 1200x630 card generated per guide
  const ogImage = `${siteConfig.url}/api/og/guides?slug=${slug}`;

  // Keep titles inside Google's ~60-65 char display window. Previously this
  // template produced 95+ char double-suffixed titles (audit #4).
  // `title.absolute` skips the layout's "%s | AI Design Patterns" template.
  const lessonCount = guide.lessons?.length ?? 0;
  const titleSuffix = lessonCount > 0 ? ` (${lessonCount} Lessons)` : '';
  const stem = TITLE_STEM_OVERRIDES[slug] ?? `${guide.tool} for Designers`;
  const absoluteTitle = `${stem} | Free Course${titleSuffix}`;
  const ogTitle = `${stem} | Free Course`;

  return {
    title: { absolute: absoluteTitle },
    description: guide.excerpt || guide.description,
    keywords: [
      guide.tool.toLowerCase(),
      `${guide.tool.toLowerCase()} for designers`,
      `${guide.tool.toLowerCase()} guide`,
      `${guide.tool.toLowerCase()} tutorial`,
      `${guide.tool.toLowerCase()} course`,
      `${guide.tool.toLowerCase()} learning path`,
      ...(guide.tags || []),
      'AI tools for designers',
      'design with AI',
    ],
    openGraph: {
      title: ogTitle,
      description: guide.excerpt || guide.description,
      url: pageUrl,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: guide.publishedDate,
      modifiedTime: guide.lastUpdatedDate,
      images: [{ url: ogImage, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: guide.excerpt || guide.description,
      images: [ogImage],
      creator: siteConfig.creator.twitter,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Structured data for SEO
  const structuredData = generateGuideStructuredData(guide);

  // First lesson → used for the "Start Learning" CTA
  const lessonLinks = getLessonsForCourse(slug);
  const firstLesson = lessonLinks[0];

  // Upward cross-link: course hub → pattern. See the matching block on the
  // lesson page; GUIDE_TO_PATTERNS lists the primary pattern first.
  const relatedPatterns = getPatternsForGuide(slug)
    .map((patternSlug) => patterns.find((p) => p.slug === patternSlug))
    .filter((p): p is (typeof patterns)[number] => p != null)
    .slice(0, MAX_RELATED_PATTERNS);

  // Group lessons by module for the "All lessons" section in the middle column
  const moduleOrder: string[] = [];
  const lessonsByModule = new Map<string, typeof lessonLinks>();
  for (const link of lessonLinks) {
    const key = link.module || 'lessons';
    if (!lessonsByModule.has(key)) {
      moduleOrder.push(key);
      lessonsByModule.set(key, []);
    }
    lessonsByModule.get(key)!.push(link);
  }

  const totalLessons = lessonLinks.length;
  const totalMinutes = lessonLinks.reduce((sum, l) => sum + (l.duration || 0), 0);

  // Synthetic headings so OnThisPage can anchor into the middle-column sections.
  // Ids match the `id` attributes on the h2s below.
  const headings: LessonHeading[] = [
    { id: 'about', text: 'About this course', level: 'h2' },
    { id: 'what-youll-learn', text: "What you'll learn", level: 'h2' },
    { id: 'all-lessons', text: 'All lessons', level: 'h2' },
  ];

  return (
    <>
      {structuredData.map((schema, i) => (
        <script
          key={`guide-overview-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />

        {/* Full-width hero — mirrors the /news hero treatment so every guide
            opens with the same centered, branded moment instead of a bordered
            card squeezed inside the article column. */}
        <section className="pt-20 md:pt-24 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info uppercase tracking-wider">
                  {guide.tool} Course
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-text-primary leading-[1.1]"
                style={{ textWrap: 'balance' }}
              >
                {guide.title}
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                {guide.excerpt || guide.description}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-primary border border-border-primary text-xs text-text-secondary font-medium">
                  {guide.skillLevel}
                </span>
                {guide.lastUpdatedDate && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-primary border border-border-primary text-xs text-text-secondary font-medium">
                    Updated{' '}
                    {new Date(guide.lastUpdatedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
              {firstLesson && (
                <div className="flex justify-center">
                  <Link
                    href={firstLesson.url}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover transition-colors whitespace-nowrap"
                  >
                    Start Learning
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              )}
              <p className="text-base font-medium text-text-secondary mt-6">
                {totalLessons} lessons · {totalMinutes} minutes · {moduleOrder.length} {moduleOrder.length === 1 ? 'module' : 'modules'}
              </p>
            </div>
          </div>
        </section>

        {/* Three-column docs layout — same grid as /guides/[course]/[lesson]
            so users see a consistent shell the moment they enter the course. */}
        <div className="max-w-[1400px] mx-auto px-6 pt-12 md:pt-16 pb-16">
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_220px] lg:gap-10">
            {/* LEFT SIDEBAR — course nav */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-r border-border-primary pr-6">
                <GuideSidebar guide={guide} currentIsOverview />
              </div>
            </aside>

            {/* CENTER — course overview article */}
            <article className="max-w-3xl">
              {/* Breadcrumb */}
              <nav
                className="mb-6 text-sm text-text-secondary"
                aria-label="Breadcrumb"
              >
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/guides" className="hover:text-text-primary">
                      Guides
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-text-primary font-medium truncate">
                    {guide.title}
                  </li>
                </ol>
              </nav>

              {/* About this course */}
              <section className="mb-12">
                <h2
                  id="about"
                  className="scroll-mt-24 text-2xl md:text-3xl font-bold mb-4"
                >
                  About this course
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-text-secondary leading-relaxed">
                  <p>{guide.description}</p>
                  {guide.excerpt && guide.excerpt !== guide.description && (
                    <p>{guide.excerpt}</p>
                  )}
                </div>
              </section>

              {/* What you'll learn — bulleted list from module descriptions */}
              <section className="mb-12">
                <h2
                  id="what-youll-learn"
                  className="scroll-mt-24 text-2xl md:text-3xl font-bold mb-4"
                >
                  What you&apos;ll learn
                </h2>
                <ul className="space-y-3">
                  {moduleOrder.map((moduleKey) => {
                    const title = MODULE_TITLES[moduleKey] || moduleKey;
                    const desc =
                      MODULE_DESCRIPTIONS[moduleKey] ||
                      `${lessonsByModule.get(moduleKey)?.length || 0} lessons`;
                    return (
                      <li
                        key={moduleKey}
                        className="flex gap-3 text-text-secondary"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                        <span>
                          <strong className="text-text-primary">{title}</strong>
                          {': '}
                          {desc}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Paid 1:1 call offer. Placed here — after the reader has seen what
                  the course covers, before the lesson list — because the previous
                  paid surface (/services) sat only in the footer and the post-audit
                  screen and took zero enquiries in three months. Mid-page is the
                  change being tested. Learning paths only; see call-offer.ts. */}
              {guideCarriesCallOffer(guide.slug) && (
                <CallOfferBlock
                  variant="full"
                  source={`guide:${guide.slug}`}
                  className="mb-12"
                />
              )}

              {/* All lessons — bordered module cards with hoverable lesson rows */}
              <section className="mb-12">
                <h2
                  id="all-lessons"
                  className="scroll-mt-24 text-2xl md:text-3xl font-bold mb-6"
                >
                  All lessons
                </h2>
                <div className="space-y-6">
                  {moduleOrder.map((moduleKey) => {
                    const title = MODULE_TITLES[moduleKey] || moduleKey;
                    const desc = MODULE_DESCRIPTIONS[moduleKey];
                    const lessons = lessonsByModule.get(moduleKey) || [];
                    const moduleMinutes = lessons.reduce(
                      (sum, l) => sum + (l.duration || 0),
                      0
                    );
                    return (
                      <div
                        key={moduleKey}
                        className="rounded-xl border border-border-primary bg-surface-primary overflow-hidden"
                      >
                        {/* Module header */}
                        <div className="px-5 py-4 border-b border-border-primary bg-background-primary">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-base font-semibold text-text-primary">
                              {title}
                            </h3>
                            <span className="text-xs text-text-secondary tabular-nums">
                              {lessons.length}{' '}
                              {lessons.length === 1 ? 'lesson' : 'lessons'} ·{' '}
                              {moduleMinutes} min
                            </span>
                          </div>
                          {desc && (
                            <p className="text-sm text-text-secondary mt-1">
                              {desc}
                            </p>
                          )}
                        </div>

                        {/* Lesson rows */}
                        <ol className="divide-y divide-border-primary">
                          {lessons.map((lesson, i) => (
                            <li key={lesson.url}>
                              <Link
                                href={lesson.url}
                                className="flex items-center gap-4 px-5 py-3 hover:bg-background-primary transition-colors group"
                              >
                                <span className="text-xs text-text-secondary tabular-nums w-6 flex-shrink-0">
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="flex-1 text-sm text-text-primary group-hover:text-accent-primary font-medium transition-colors">
                                  {lesson.title}
                                </span>
                                <span className="text-xs text-text-secondary tabular-nums flex-shrink-0">
                                  {lesson.duration} min
                                </span>
                                <ArrowRightIcon className="w-4 h-4 text-text-secondary group-hover:text-accent-primary flex-shrink-0 transition-colors" />
                              </Link>
                            </li>
                          ))}
                        </ol>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Start CTA again at the bottom — momentum nudge */}
              {firstLesson && (
                <div className="mt-12 pt-8 border-t border-border-primary text-center">
                  <Link
                    href={firstLesson.url}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover transition-colors"
                  >
                    Start the course
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Related patterns — upward half of the guide/pattern cross-link.
                  Sits above the newsletter card so the course hub passes a
                  titled link to the pattern pages it teaches. */}
              {relatedPatterns.length > 0 && (
                <section className="mt-16" aria-labelledby="related-patterns-heading">
                  <h2
                    id="related-patterns-heading"
                    className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-4"
                  >
                    The patterns behind this course
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPatterns.map((pattern) => (
                      <Link
                        key={pattern.slug}
                        href={`/patterns/${pattern.slug}`}
                        className="block p-5 rounded-xl border border-border-primary hover:border-accent-primary/40 hover:bg-surface-primary transition-colors group"
                      >
                        <span className="block font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                          {pattern.title}
                        </span>
                        <span className="block mt-1 text-sm text-text-secondary line-clamp-2">
                          {pattern.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Newsletter signup — positioned after the Start CTA so it
                  catches readers who browsed the full course and didn't click
                  Start. Wrapped in its own bordered card so it reads as a
                  distinct alternative path, not as copy attached to the CTA. */}
              <div className="mt-24 p-6 md:p-8 rounded-2xl border border-border-primary bg-surface-primary">
                <InlineNewsletterSignup
                  variant="pattern-detail"
                  source="guides"
                  customHeading="Not ready to start?"
                  customSubheading="Get daily AI UX patterns and new guides as we ship them. No spam, unsubscribe anytime."
                  customButtonText="Subscribe"
                  customSuccessMessage="Subscribed! Watch for the next issue."
                />
              </div>
            </article>

            {/* RIGHT SIDEBAR — on this page (xl+ only) */}
            <aside className="hidden xl:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-l border-border-primary pl-6">
                <OnThisPage headings={headings} />
              </div>
            </aside>
          </div>
        </div>

        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
