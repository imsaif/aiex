import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { guides, getGuideBySlug } from '@/data/guides';
import { generateGuideStructuredData } from '@/utils/structuredData';
import { siteConfig } from '@/config/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import GuideSidebar from '@/components/guides/GuideSidebar';
import OnThisPage from '@/components/guides/OnThisPage';
import { getLessonsForCourse } from '@/lib/guides/lesson-urls';
import type { LessonHeading } from '@/lib/guides/headings';

// ISR + static params so course overviews are pre-built and cached — previously
// every request cold-started a serverless function (flagged in the SEO audit).
export const revalidate = 3600;

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  const pageUrl = `${siteConfig.url}/guides/${slug}`;
  const ogImage = guide.thumbnail?.startsWith('http')
    ? guide.thumbnail
    : `${siteConfig.url}${guide.thumbnail || siteConfig.ogImage}`;

  // Keep titles inside Google's ~60-65 char display window. Previously this
  // template produced 95+ char double-suffixed titles (audit #4).
  // `title.absolute` skips the layout's "%s | AI Design Patterns" template.
  const lessonCount = guide.lessons?.length ?? 0;
  const titleSuffix = lessonCount > 0 ? ` (${lessonCount} Lessons)` : '';
  const absoluteTitle = `${guide.tool} for Designers — Free Course${titleSuffix}`;
  const ogTitle = `${guide.tool} for Designers — Free Course`;

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

// Human-friendly titles for the module keys, shared with the sidebar.
const MODULE_TITLES: Record<string, string> = {
  setup: 'Setup',
  features: 'Core Features',
  prototype: 'Prototype',
  prototyping: 'Prototyping Workflows',
  collaboration: 'Developer Collaboration',
  github: 'GitHub',
  practices: 'Best Practices',
  figma: 'Figma ↔ Code',
  foundations: 'Foundations',
  building: 'Building',
  advanced: 'Advanced Patterns',
  polish: 'Ship It',
};

// Short per-module "what you'll learn" descriptions used in the middle column.
const MODULE_DESCRIPTIONS: Record<string, string> = {
  setup: 'Get your environment ready and install the tools.',
  features: 'Master the main features and capabilities.',
  prototype: 'Build and test your first real project.',
  prototyping: 'Create interactive prototypes from your designs.',
  collaboration: 'Work effectively with your development team.',
  github: 'Manage your work with version control.',
  practices: 'Learn the patterns that make work ship reliably.',
  figma: 'Move work between Figma and code in both directions.',
  foundations: 'Understand the primitives before you build.',
  building: 'Implement the core parts of your interface.',
  advanced: 'Handle edge cases, errors, and complex flows.',
  polish: 'Accessibility, agentic patterns, and a production checklist.',
};

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

        {/* Three-column docs layout — same grid as /guides/[course]/[lesson]
            so users see a consistent shell the moment they enter the course. */}
        <div className="max-w-[1400px] mx-auto px-6 pt-20 md:pt-24 pb-16">
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_220px] lg:gap-10">
            {/* LEFT SIDEBAR — course nav */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
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

              {/* Hero */}
              <header className="mb-10">
                <p className="text-sm font-medium text-accent-primary uppercase tracking-wide mb-2">
                  {guide.tool} Course
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight">
                  {guide.title}
                </h1>
                <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  {guide.excerpt || guide.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  <span>{totalLessons} lessons</span>
                  <span aria-hidden="true">·</span>
                  <span>{totalMinutes} min total</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.skillLevel}</span>
                  {guide.lastUpdatedDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        Updated{' '}
                        {new Date(guide.lastUpdatedDate).toLocaleDateString(
                          'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </span>
                    </>
                  )}
                </div>
              </header>

              {/* Primary CTA — start the course */}
              {firstLesson && (
                <div className="mb-12">
                  <Link
                    href={firstLesson.url}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover transition-colors"
                  >
                    Start Learning: {firstLesson.title}
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              )}

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
                          {' — '}
                          {desc}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* All lessons — compact list grouped by module */}
              <section className="mb-12">
                <h2
                  id="all-lessons"
                  className="scroll-mt-24 text-2xl md:text-3xl font-bold mb-6"
                >
                  All lessons
                </h2>
                <div className="space-y-8">
                  {moduleOrder.map((moduleKey) => {
                    const title = MODULE_TITLES[moduleKey] || moduleKey;
                    const lessons = lessonsByModule.get(moduleKey) || [];
                    return (
                      <div key={moduleKey}>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary mb-3">
                          {title}
                        </h3>
                        <ol className="space-y-2">
                          {lessons.map((lesson, i) => (
                            <li
                              key={lesson.url}
                              className="flex items-baseline gap-4"
                            >
                              <span className="text-xs text-text-secondary tabular-nums w-6 flex-shrink-0">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <Link
                                href={lesson.url}
                                className="text-text-primary hover:text-accent-primary transition-colors flex-1"
                              >
                                {lesson.title}
                              </Link>
                              <span className="text-xs text-text-secondary flex-shrink-0">
                                {lesson.duration} min
                              </span>
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
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                  <Link
                    href={firstLesson.url}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-primary text-white dark:text-gray-900 font-medium hover:bg-accent-hover transition-colors"
                  >
                    Start the course
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              )}
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
