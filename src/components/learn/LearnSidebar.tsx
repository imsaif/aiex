import Link from 'next/link';
import { guides } from '@/data/guides';
import categories from '@/data/categories';
import { prisma } from '@/lib/prisma';
import { getNewsletters } from '@/data/newsletters';

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
  { label: 'Map', href: '/guides', current: true },
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

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-eyebrow mb-3 font-semibold text-text-secondary">
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
    'block rounded-card px-3 py-2 type-body transition-colors';
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

export default async function LearnSidebar() {
  const issues = await getLatestIssues();

  return (
    // Hidden below lg: the map itself is the mobile navigation, and a collapsed
    // accordion above five sections of content would only push them down.
    // The rail is also taller than the viewport, so it scrolls inside itself —
    // without that the Topics group sits below the fold with no way to reach it.
    <nav
      aria-label="Learn"
      className="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-2"
    >
      <div className="mb-8">
        <GroupLabel>Explore</GroupLabel>
        <ul className="space-y-0.5">
          {EXPLORE.map((item) => (
            <li key={item.href}>
              <RailLink
                href={item.href}
                current={item.current}
                external={item.external}
              >
                {item.label}
              </RailLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <GroupLabel>Courses</GroupLabel>
        <ul className="space-y-0.5">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <RailLink href={`/guides/${guide.slug}`}>{guide.title}</RailLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
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
