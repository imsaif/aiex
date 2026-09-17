import Link from 'next/link';
import {
  AcademicCapIcon,
  NewspaperIcon,
  PuzzlePieceIcon,
  TagIcon,
  CodeBracketIcon,
  MapIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { guides } from '@/data/guides';
import categories from '@/data/categories';
import { prisma } from '@/lib/prisma';
import { getNewsletters } from '@/data/newsletters';
import { getLessonsForCourse } from '@/lib/guides/lesson-urls';
import { getModuleTitle } from '@/lib/guides/modules';
import RailRevealCurrent from './RailRevealCurrent';
import { CourseToolMark } from '@/components/skills/AgentMarks';

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

/**
 * Explore is the one group whose ROWS carry marks.
 *
 * These four are destinations of different kinds — a map, a library, a thing
 * you install, a repo — and a mark tells them apart faster than reading four
 * similar-length words. Every other group is a list of one kind of thing, so
 * its mark belongs on the heading instead; see `GroupLabel`.
 */
const EXPLORE = [
  { label: 'Map', href: '/guides', Icon: MapIcon },
  { label: 'Patterns', href: '/patterns', Icon: Squares2X2Icon },
  { label: 'Skills', href: '/skills', Icon: PuzzlePieceIcon },
  {
    label: 'Open source',
    // The skills repo, not the site's. "Open source" next to Patterns and
    // Skills reads as an offer — the thing you can take and use — and that is
    // `aiux-skills`: 38 MIT skill files, and the marketplace the Claude Code
    // plugin installs from. The site's own repo is open too, but it is a
    // different promise, and the one nobody in this rail came for.
    href: 'https://github.com/imsaif/aiux-skills',
    external: true,
    Icon: CodeBracketIcon,
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
    .replace(/\s+Course$/i, '')
    // "…with Claude Code" is the one suffix that names a tool, and the row
    // already carries that tool's logo two characters to its left. Kept it and
    // the label wrapped to two lines to repeat what the mark had just said.
    .replace(/\s+with Claude Code$/i, '');
}

/**
 * A mark on the heading says what kind of thing the list below is.
 *
 * Rows get their own mark only where it carries information the title does not:
 * Explore, where the four destinations are different kinds of thing, and
 * Courses, where the logo names the product each course is about. What's new
 * and Topics get nothing on their rows, because every row there is the same
 * kind of thing and a repeated mark would be decoration.
 */
function GroupLabel({
  children,
  Icon,
}: {
  children: React.ReactNode;
  Icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}) {
  return (
    <p className="type-eyebrow mb-3 flex items-center gap-2 px-3 font-semibold text-text-secondary">
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />}
      {children}
    </p>
  );
}

function RailLink({
  href,
  children,
  current,
  external,
  Icon,
}: {
  href: string;
  children: React.ReactNode;
  current?: boolean;
  external?: boolean;
  Icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}) {
  // "You are here" is a location, not a button. It used to be a solid ink fill,
  // the same treatment as the Subscribe CTA and the selected category pill, so
  // three unrelated meanings read at the same volume. The current row now says
  // its piece with weight and a raised chip, and solid ink is left to mean
  // "the one action on this page".
  //
  // No accent edge: a left border on a rounded chip renders as a crescent
  // hanging off the corner rather than as a rail marker, which reads as a
  // mistake. The chip is a step lighter than the rail it sits on, which is
  // enough on its own.
  // Flex rather than block so the icon and label share a baseline row and a
  // wrapping label indents under itself instead of under the mark.
  const base =
    'flex items-center gap-2.5 rounded-card px-3 py-2 type-caption leading-relaxed transition-colors';
  const state = current
    ? 'bg-background-primary font-semibold text-text-primary shadow-card'
    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary';

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${state}`}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
        <span className="min-w-0 flex-1">{children}</span>
        <span aria-hidden="true" className="shrink-0">
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} ${state}`}
      aria-current={current ? 'page' : undefined}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
      <span className="min-w-0 flex-1">{children}</span>
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
          <ul className="space-y-1">
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

      <div className="mb-9">
        <GroupLabel>Explore</GroupLabel>
        <ul className="space-y-1">
          {EXPLORE.map((item) => (
            <li key={item.href}>
              <RailLink
                href={item.href}
                current={item.href === activeHref}
                external={item.external}
                Icon={item.Icon}
              >
                {item.label}
              </RailLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-9">
        <GroupLabel Icon={AcademicCapIcon}>Courses</GroupLabel>
        <ul className="space-y-1">
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
                    className={`flex items-center gap-2 rounded-card px-3 py-2 type-caption leading-relaxed transition-colors ${
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
                    {/* The tool's logo, which earns its place where a generic
                        icon would not: six of the seven courses are about a
                        product, and the logo says which one before the title is
                        read. The seventh has no product and takes a drawn mark,
                        so the column stays even. */}
                    <CourseToolMark tool={guide.tool} />
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

      <div className="mb-9">
        <GroupLabel Icon={NewspaperIcon}>What&rsquo;s new</GroupLabel>
        <ul className="space-y-1">
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
        <GroupLabel Icon={TagIcon}>Topics</GroupLabel>
        <ul className="space-y-1">
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
