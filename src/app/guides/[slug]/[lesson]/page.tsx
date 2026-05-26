import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import LessonRenderer from '@/components/ui/LessonRenderer';
import GuideSidebar from '@/components/guides/GuideSidebar';
import OnThisPage from '@/components/guides/OnThisPage';
import { InlineNewsletterSignup } from '@/components/newsletter/InlineNewsletterSignup';
import GuidePDFCTA from '@/components/guides/GuidePDFCTA';
import { siteConfig } from '@/config/seo';
import { LessonSection } from '@/types/lesson';
import {
  getAllLessonParams,
  getLessonBySlug,
  getLessonNeighbors,
  getLessonsForCourse,
} from '@/lib/guides/lesson-urls';
import { extractHeadings } from '@/lib/guides/headings';
import { MODULE_TITLES } from '@/lib/guides/modules';

// ISR so the first request is cached and Googlebot hits warm HTML
export const revalidate = 86400;
export const dynamicParams = false;

// Pre-render every lesson at build time. Next.js requires the param keys here
// to match the file-system segment names (`[slug]/[lesson]`), so we remap the
// internal {course, lesson} pairs from the helper.
export async function generateStaticParams() {
  return getAllLessonParams().map(({ course, lesson }) => ({
    slug: course,
    lesson,
  }));
}

interface LessonPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug: courseSlug, lesson: lessonParam } = await params;
  const resolved = getLessonBySlug(courseSlug, lessonParam);
  if (!resolved) {
    return { title: 'Lesson Not Found' };
  }
  const { guide, lesson: currentLesson } = resolved;

  // Build a concrete, query-shaped title: "{Lesson Title} — {Tool} Guide for Designers"
  // Capped so the full string (plus the root-layout "| AI Design Patterns" suffix)
  // stays inside Google's ~60-65 char display window whenever possible.
  const title = `${currentLesson.title} — ${guide.tool} for Designers`;

  // Pull the first intro/text section as the description fallback so each
  // lesson has a unique meta description rather than the parent course's.
  const firstProse = (currentLesson.sections as LessonSection[] | undefined)?.find(
    (s) => s.type === 'intro' || s.type === 'text'
  );
  const fallbackDescription = guide.excerpt || guide.description;
  const description =
    firstProse && 'content' in firstProse && firstProse.content
      ? String(firstProse.content).replace(/<[^>]+>/g, '').slice(0, 160)
      : fallbackDescription.slice(0, 160);

  const pageUrl = `${siteConfig.url}/guides/${guide.slug}/${lessonParam}`;
  const ogImage = guide.thumbnail?.startsWith('http')
    ? guide.thumbnail
    : `${siteConfig.url}${guide.thumbnail || siteConfig.ogImage}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'article',
      url: pageUrl,
      title,
      description,
      siteName: siteConfig.name,
      publishedTime: guide.publishedDate,
      modifiedTime: guide.lastUpdatedDate,
      images: [{ url: ogImage, width: 1200, height: 630, alt: currentLesson.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.creator.twitter,
    },
  };
}

function buildLessonStructuredData(
  courseSlug: string,
  lessonSlug: string,
  lessonTitle: string,
  description: string,
  guideTitle: string,
  publishedDate: string,
  modifiedDate: string | undefined
) {
  const url = `${siteConfig.url}/guides/${courseSlug}/${lessonSlug}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lessonTitle,
    headline: lessonTitle,
    description,
    url,
    isPartOf: {
      '@type': 'Course',
      name: guideTitle,
      url: `${siteConfig.url}/guides/${courseSlug}`,
    },
    author: {
      '@type': 'Person',
      name: 'Imran Mohammed',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Design Patterns',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: `${siteConfig.url}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guideTitle,
        item: `${siteConfig.url}/guides/${courseSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: lessonTitle,
        item: url,
      },
    ],
  };

  return [article, breadcrumb];
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug: courseSlug, lesson: lessonParam } = await params;
  const resolved = getLessonBySlug(courseSlug, lessonParam);
  if (!resolved) {
    notFound();
  }
  const { guide, lesson, lessonSlug, lessonIndex } = resolved;
  const allLessons = getLessonsForCourse(courseSlug);
  const { previous, next } = getLessonNeighbors(courseSlug, lessonIndex);

  const sections = (lesson.sections as LessonSection[] | undefined) || [];
  const firstProse = sections.find((s) => s.type === 'intro' || s.type === 'text');
  const lessonDescription =
    firstProse && 'content' in firstProse && firstProse.content
      ? String(firstProse.content).replace(/<[^>]+>/g, '').slice(0, 160)
      : guide.excerpt || guide.description;

  const structuredData = buildLessonStructuredData(
    courseSlug,
    lessonSlug,
    lesson.title,
    lessonDescription,
    guide.title,
    guide.publishedDate,
    guide.lastUpdatedDate
  );

  const headings = extractHeadings(sections);

  return (
    <>
      {structuredData.map((schema, i) => (
        <script
          key={`guide-lesson-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />

        {/* Three-column docs layout.
            - Mobile: single column (sidebars hidden, breadcrumb gives context)
            - lg (≥1024px): left sidebar + content (no right sidebar yet)
            - xl (≥1280px): left sidebar + content + on-this-page TOC
            Grid math: left 240px, content 1fr (max ~720px), right 220px. */}
        <div className="max-w-[1400px] mx-auto px-6 pt-20 md:pt-24 pb-16">
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_220px] lg:gap-10">
            {/* LEFT SIDEBAR — course nav (sticky on desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
                <GuideSidebar guide={guide} currentLessonSlug={lessonSlug} />
              </div>
            </aside>

            {/* CENTER — lesson article */}
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
                  <li>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="hover:text-text-primary"
                    >
                      {guide.title}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-text-primary font-medium truncate">
                    {lesson.title}
                  </li>
                </ol>
              </nav>

              {/* Lesson header — accent divider, module + lesson counter chips,
                  H1, and iconified meta pill row */}
              <header className="mb-10">
                <div
                  className="border-t-2 border-accent-primary/30 w-12 mb-6"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {lesson.module && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-semibold uppercase tracking-wide">
                      {MODULE_TITLES[lesson.module] || lesson.module}
                    </span>
                  )}
                  <span className="text-xs text-text-secondary tabular-nums">
                    Lesson {lessonIndex + 1} of {allLessons.length}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-semibold mb-5 leading-tight">
                  {lesson.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-primary border border-gray-200 dark:border-gray-700 text-xs text-text-secondary">
                    {lesson.duration} min read
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-primary border border-gray-200 dark:border-gray-700 text-xs text-text-secondary">
                    {guide.tool} for Designers
                  </span>
                  {guide.lastUpdatedDate && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-primary border border-gray-200 dark:border-gray-700 text-xs text-text-secondary">
                      Updated{' '}
                      {new Date(guide.lastUpdatedDate).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  )}
                </div>
              </header>

              {/* Lesson body — fully expanded, server-rendered for crawlers */}
              <div className="mb-12">
                <LessonRenderer sections={sections} />
              </div>

              {/* Inline PDF email-capture CTA. Component self-gates: only renders
                  on configured guide+lesson pairs and hides post-submit via
                  localStorage. */}
              <GuidePDFCTA
                guideSlug={guide.slug}
                guideTitle={guide.title}
                lessonOrder={lesson.order}
              />

              {/* Newsletter signup — only on the last lesson of each course.
                  Peak-affinity moment: the reader just finished a 10-23 lesson
                  course. One ask per course (5 total across the site), auto-
                  hidden after first subscribe via localStorage. */}
              {!next && (
                <div className="mb-12 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-surface-primary">
                  <InlineNewsletterSignup
                    variant="pattern-detail"
                    source="guides"
                    customHeading={`You finished ${guide.tool}.`}
                    customSubheading="Get new guides and daily AI UX patterns in your inbox. No spam, unsubscribe anytime."
                    customButtonText="Subscribe"
                    customSuccessMessage="Subscribed! Watch for the next issue."
                  />
                </div>
              )}

              {/* Previous / next lesson */}
              <nav
                className="flex flex-col sm:flex-row justify-between items-stretch gap-4 border-t border-gray-200 dark:border-gray-700 pt-8"
                aria-label="Lesson navigation"
              >
                {previous ? (
                  <Link
                    href={previous.url}
                    className="flex-1 block p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-accent-primary/40 hover:bg-surface-primary transition-colors group"
                  >
                    <span className="block text-xs text-text-secondary mb-1">
                      ← Previous Lesson
                    </span>
                    <span className="block font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                      {previous.title}
                    </span>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                {next ? (
                  <Link
                    href={next.url}
                    className="flex-1 block p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-accent-primary/40 hover:bg-surface-primary transition-colors text-right group"
                  >
                    <span className="block text-xs text-text-secondary mb-1">
                      Next Lesson →
                    </span>
                    <span className="block font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </nav>

              {/* Back to course overview */}
              <div className="mt-8 text-center">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
                >
                  ← Back to {guide.title} overview
                </Link>
              </div>
            </article>

            {/* RIGHT SIDEBAR — on this page (xl+ only) */}
            <aside className="hidden xl:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pl-2">
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
