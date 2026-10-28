import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LessonRenderer from '@/components/ui/LessonRenderer';
import LearnSidebar from '@/components/learn/LearnSidebar';
import LearnShell from '@/components/learn/LearnShell';
import OnThisPage from '@/components/guides/OnThisPage';
import { getGuideBySlug } from '@/data/guides';
import { courseStudies, getCourseStudy } from '@/data/course-studies';
import { getLessonsForCourse } from '@/lib/guides/lesson-urls';
import { extractHeadings } from '@/lib/guides/headings';
import { siteConfig } from '@/config/seo';

/**
 * A course's companion study (src/data/course-studies.ts). A static segment
 * beside [lesson], so only this one URL per course is taken; lesson URLs and the
 * course's lesson count are untouched. Courses without a study 404 here.
 */

const STUDY_SLUG = 'the-study';

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return courseStudies.filter((s) => s.slug === STUDY_SLUG).map((s) => ({ slug: s.courseSlug }));
}

interface StudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCourseStudy(slug, STUDY_SLUG);
  const guide = getGuideBySlug(slug);
  if (!study || !guide) return { title: 'Not Found' };

  const url = `${siteConfig.url}/guides/${slug}/${STUDY_SLUG}`;
  const ogImage = guide.thumbnail?.startsWith('http')
    ? guide.thumbnail
    : `${siteConfig.url}${guide.thumbnail || siteConfig.ogImage}`;
  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: study.title,
      description: study.description,
      siteName: siteConfig.name,
      publishedTime: study.publishedDate,
      images: [{ url: ogImage, width: 1200, height: 630, alt: study.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: study.title,
      description: study.description,
      images: [ogImage],
      creator: siteConfig.creator.twitter,
    },
  };
}

export default async function CourseStudyPage({ params }: StudyPageProps) {
  const { slug } = await params;
  const study = getCourseStudy(slug, STUDY_SLUG);
  const guide = getGuideBySlug(slug);
  if (!study || !guide) notFound();

  const url = `${siteConfig.url}/guides/${slug}/${STUDY_SLUG}`;
  const firstLesson = getLessonsForCourse(slug)[0];
  const headings = extractHeadings(study.sections);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: study.title,
      description: study.description,
      url,
      author: { '@type': 'Person', name: 'Imran Mohammed', url: siteConfig.url },
      publisher: {
        '@type': 'Organization',
        name: 'AI Design Patterns',
        logo: { '@type': 'ImageObject', url: `${siteConfig.url}/logo.png` },
      },
      datePublished: study.publishedDate,
      dateModified: study.publishedDate,
      isPartOf: { '@type': 'Course', name: guide.title, url: `${siteConfig.url}/guides/${slug}` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteConfig.url}/guides` },
        { '@type': 'ListItem', position: 3, name: guide.title, item: `${siteConfig.url}/guides/${slug}` },
        { '@type': 'ListItem', position: 4, name: 'The study', item: url },
      ],
    },
  ];

  return (
    <>
      {structuredData.map((schema, i) => (
        <script
          key={`course-study-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar inConsole />
        <LearnShell sidebar={<LearnSidebar currentGuideSlug={guide.slug} />}>
          <div className="pt-10 pb-16">
            <div className="pt-2">
              <nav className="mb-6 text-sm text-text-secondary" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link prefetch={false} href="/guides" className="hover:text-text-primary">
                      Guides
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link prefetch={false} href={`/guides/${guide.slug}`} className="hover:text-text-primary">
                      {guide.title}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-text-primary font-medium truncate">The study</li>
                </ol>
              </nav>

              <header className="mb-10">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-semibold uppercase tracking-wide">
                    Case study
                  </span>
                  <span className="text-xs text-text-secondary">By Imran Mohammed</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-semibold mb-5 leading-tight">{study.title}</h1>
                <p className="type-lead text-text-secondary">{study.description}</p>
              </header>

              <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-12">
                <article className="w-full">
                  <div className="mb-12">
                    <LessonRenderer sections={study.sections} />
                  </div>
                </article>
                <aside className="hidden xl:block">
                  <div
                    className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-none border-l border-border-primary pl-6"
                    data-course-chrome="scroll"
                  >
                    <OnThisPage headings={headings} />
                  </div>
                </aside>
              </div>

              {firstLesson && (
                <nav aria-label="Course navigation" className="mt-12 border-t border-border-primary pt-8">
                  <Link
                    prefetch={false}
                    href={firstLesson.url}
                    className="group block rounded-card bg-surface-secondary p-loose transition-colors hover:bg-background-secondary"
                  >
                    <span className="type-caption block text-text-secondary">Start the course</span>
                    <span className="type-lead block font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
                      {firstLesson.title}
                    </span>
                  </Link>
                </nav>
              )}
            </div>
          </div>
        </LearnShell>
        <Footer />
      </main>
    </>
  );
}
