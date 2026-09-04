import Link from 'next/link';
import { guides } from '@/data/guides';
import categories from '@/data/categories';
import { prisma } from '@/lib/prisma';
import { getNewsletters } from '@/data/newsletters';
import { getLessonsForCourse } from '@/lib/guides/lesson-urls';
import { getModuleTitle } from '@/lib/guides/modules';
import RailRevealCurrent from './RailRevealCurrent';

/**
 * The rail on the left of /guides. Turns the courses index into the front door
 * of a learn area rather than a standalone page, and matches the 240px docs
 * shell already used by /guides/[slug] and /guides/[slug]/[lesson].
 *
 * Server component by design — see the header of `src/lib/learn-map.ts`. It
 * reads `guides` and `categories`, so a 'use client' here would ship both
 * registries to the browser.
 *
 * Topics link straight to the category pages rather than expanding in place.
 * Those pages already exist and are already indexed, so a link is both simpler
 * than client-side expansion state and better for search.
 */

const EXPLORE = [
  { label: 'Map', href: '/guides' },
  { label: 'Patterns', href: '/patterns' },
  { label: 'Skills', href: '/skills' },
  {
    label: 'Open source',
    href: 'https://github.com/imsaif/aiex',
    external: true,
  },
];

/**
 * Latest issues for the "What's new" group. Published issues live in the
 * database; the static file covers the gap. The courses page is statically
 * generated and indexed, so a database blip must never be able to take it
 * down — same try/catch contract as `src/app/sitemap.ts`.
 */
async function getLatestIssues(): Promise<Array<{ slug: string; title: string }>> {
  try {
    const drafts = await prisma.newsletterDraft.findMany({
      where: { status: 'published' },
      select: { slug: true, title: true },
      orderBy: { publishDate: 'desc' },
      take: 3,
    });
    if (drafts.length > 0) {
      return drafts.map((d) => ({ slug: d.slug, title: d.title }));
    }
  } catch {
    // Fall through to the static issues below.
  }
  return getNewsletters()
    .slice(0, 3)
    .map((n) => ({ slug: n.slug, title: n.title }));
}

/**
 * Short label for the rail. Six of the seven course titles end in some form of
 * "Course for Designers", so at 240px they all wrap to two lines and the rail
 * loses its rhythm. The group heading already says "Courses", so the suffix is
 * carrying no information here.
 *
 * Presentation only — the full title is unchanged everywhere else, and a title
 * that does not match simply passes through.
 */
function railLabel(title: string): string {
  return title
    .replace(/\s+Course for Designers$/i, '')
    .replace(/\s+Learning Path$/i, '')
    .replace(/\s+Course$/i, '');
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-eyebrow mb-2 px-3 font-semibold text-text-secondary">
      {children}
    </p>
  );
}

function RailLink({
  href,
  children,
  current,
  external,
}: {
  href: string;
  children: React.ReactNode;
  current?: boolean;
  external?: boolean;
}) {
  const base =
    'block rounded-card px-3 py-1.5 type-caption transition-colors';
  const state = current
    ? 'bg-text-primary text-background-primary font-semibold'
    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary';

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${state}`}
      >
        {children} <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} ${state}`}
      aria-current={current ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}


/**
 * The current course's lessons, nested under it in the Courses group.
 *
 * This is what makes the rail a console rather than a page-local nav: the same
 * groups stay put on every page of the learning area, and the course you are
 * inside opens in place. Module grouping and the "Overview" row match what the
 * course pages showed before, so nothing is lost in the merge.
 */
function CourseLessons({
  guideSlug,
  currentLessonSlug,
  currentIsOverview,
}: {
  guideSlug: string;
  currentLessonSlug?: string;
  currentIsOverview?: boolean;
}) {
  const lessons = getLessonsForCourse(guideSlug);

  const moduleOrder: string[] = [];
  const byModule = new Map<string, typeof lessons>();
  for (const lesson of lessons) {
    const key = lesson.module || 'lessons';
    if (!byModule.has(key)) {
      moduleOrder.push(key);
      byModule.set(key, []);
    }
    byModule.get(key)!.push(lesson);
  }

  return (
    <div className="mt-1 ml-3 border-l border-border-primary pl-2">
      <RailLink href={`/guides/${guideSlug}`} current={currentIsOverview}>
        Overview
      </RailLink>

      {moduleOrder.map((moduleKey) => (
        <div key={moduleKey} className="mt-3">
          <p className="type-eyebrow mb-1 px-3 font-semibold text-text-secondary">
            {getModuleTitle(moduleKey)}
          </p>
          <ul className="space-y-0.5">
            {byModule.get(moduleKey)!.map((lesson) => {
              const slug = lesson.url.split('/').pop() || '';
              return (
                <li key={lesson.url}>
                  <RailLink
                    href={lesson.url}
                    current={slug === currentLessonSlug}
                  >
                    {lesson.title}
                  </RailLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default async function LearnSidebar({
  active,
  currentGuideSlug,
  currentLessonSlug,
  currentIsOverview,
}: {
  /** Which Explore row to mark as the current page. */
  active?: 'map' | 'patterns' | 'skills';
  /** Set on a course or lesson page so that course opens in the rail. */
  currentGuideSlug?: string;
  currentLessonSlug?: string;
  currentIsOverview?: boolean;
} = {}) {
  const issues = await getLatestIssues();
  // A course page is inside the map's area but is not the map itself.
  const activeHref =
    active === 'patterns'
      ? '/patterns'
      : active === 'skills'
        ? '/skills'
        : currentGuideSlug
          ? null
          : '/guides';

  return (
    // Hidden below lg: the map itself is the mobile navigation, and a collapsed
    // accordion above five sections of content would only push them down.
    //
    // Pinned, with its own scroll and no visible scrollbar. A rail that scrolls
    // with the page snaps back to the top on every navigation, because Next
    // scrolls to top when the route changes — which is what made clicking
    // through the rail feel jumpy. Sticky keeps it anchored; scrollbar-none
    // keeps the page clean while every group stays reachable.
    <nav
      aria-label="Learn"
      // Border and column background come from LearnShell; the rail only owns
      // its own padding and scroll behaviour.
      className="hidden lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:px-4 lg:pt-6 lg:pb-10 scrollbar-none"
    >
      <RailRevealCurrent />

      <div className="mb-7">
        <GroupLabel>Explore</GroupLabel>
        <ul className="space-y-0.5">
          {EXPLORE.map((item) => (
            <li key={item.href}>
              <RailLink
                href={item.href}
                current={item.href === activeHref}
                external={item.external}
              >
                {item.label}
              </RailLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-7">
        <GroupLabel>Courses</GroupLabel>
        <ul className="space-y-0.5">
          {guides.map((guide) => {
            const isCurrent = guide.slug === currentGuideSlug;
            return (
              <li key={guide.slug}>
                {/* A native <details>, so opening a course is a disclosure and
                    not a navigation. Clicking the row used to load that
                    course's page, which reset the scroll and made the rail
                    jump; now it expands in place with no JavaScript and no
                    route change. "Overview" inside is the link to the course
                    page itself. */}
                <details
                  className="rail-disclosure"
                  open={isCurrent}
                  name="learn-rail-course"
                >
                  <summary
                    className={`flex items-center gap-2 rounded-card px-3 py-1.5 type-caption transition-colors ${
                      isCurrent
                        ? 'font-semibold text-text-primary'
                        : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="rail-chevron shrink-0 text-text-secondary"
                    >
                      ›
                    </span>
                    <span className="min-w-0 flex-1">
                      {railLabel(guide.title)}
                    </span>
                  </summary>

                  <CourseLessons
                    guideSlug={guide.slug}
                    currentLessonSlug={
                      isCurrent ? currentLessonSlug : undefined
                    }
                    currentIsOverview={isCurrent && currentIsOverview}
                  />
                </details>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mb-7">
        <GroupLabel>What&rsquo;s new</GroupLabel>
        <ul className="space-y-0.5">
          {issues.map((issue) => (
            <li key={issue.slug}>
              <RailLink href={`/news/${issue.slug}`}>{issue.title}</RailLink>
            </li>
          ))}
          <li>
            <RailLink href="/news">
              All <span aria-hidden="true">→</span>
            </RailLink>
          </li>
        </ul>
      </div>

      <div>
        <GroupLabel>Topics</GroupLabel>
        <ul className="space-y-0.5">
          {categories.map((category) => (
            <li key={category.slug}>
              <RailLink href={`/patterns/category/${category.slug}`}>
                {category.title}
              </RailLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
