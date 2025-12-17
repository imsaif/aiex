import { prisma } from '@/lib/prisma';
import { Newsletter, NewsletterTag, NewsletterFilter } from '@/types';

/**
 * Fetch all published newsletters with optional filtering
 */
export async function getNewsletters(filter?: NewsletterFilter): Promise<{
  newsletters: Newsletter[];
  totalCount: number;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    published: true,
  };

  // Tag filtering
  if (filter?.tags && filter.tags.length > 0) {
    where.tags = {
      some: {
        tag: {
          slug: { in: filter.tags },
        },
      },
    };
  }

  // Search filtering
  if (filter?.searchQuery) {
    where.OR = [
      { title: { contains: filter.searchQuery, mode: 'insensitive' } },
      { summary: { contains: filter.searchQuery, mode: 'insensitive' } },
      { content: { contains: filter.searchQuery, mode: 'insensitive' } },
    ];
  }

  const [newsletters, totalCount] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.newsletter.count({ where }),
  ]);

  return {
    newsletters: newsletters.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      summary: n.summary,
      content: n.content,
      publishedAt: n.publishedAt,
      published: n.published,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      tags: n.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
        slug: t.tag.slug,
      })),
    })),
    totalCount,
  };
}

/**
 * Fetch a single newsletter by slug
 */
export async function getNewsletterBySlug(slug: string): Promise<Newsletter | null> {
  const newsletter = await prisma.newsletter.findUnique({
    where: { slug, published: true },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!newsletter) return null;

  return {
    id: newsletter.id,
    title: newsletter.title,
    slug: newsletter.slug,
    summary: newsletter.summary,
    content: newsletter.content,
    publishedAt: newsletter.publishedAt,
    published: newsletter.published,
    createdAt: newsletter.createdAt,
    updatedAt: newsletter.updatedAt,
    tags: newsletter.tags.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
      slug: t.tag.slug,
    })),
  };
}

/**
 * Fetch all tags
 */
export async function getAllTags(): Promise<NewsletterTag[]> {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  return tags.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
  }));
}

/**
 * Fetch tags with newsletter count
 */
export async function getTagsWithCount(): Promise<(NewsletterTag & { count: number })[]> {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { newsletters: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return tags.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    count: t._count.newsletters,
  }));
}

/**
 * Get adjacent newsletters for navigation
 */
export async function getAdjacentNewsletters(currentSlug: string): Promise<{
  previous: Newsletter | null;
  next: Newsletter | null;
}> {
  const current = await prisma.newsletter.findUnique({
    where: { slug: currentSlug },
    select: { publishedAt: true },
  });

  if (!current) {
    return { previous: null, next: null };
  }

  const [previousResult, nextResult] = await Promise.all([
    prisma.newsletter.findFirst({
      where: {
        published: true,
        publishedAt: { lt: current.publishedAt },
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    }),
    prisma.newsletter.findFirst({
      where: {
        published: true,
        publishedAt: { gt: current.publishedAt },
      },
      orderBy: { publishedAt: 'asc' },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    }),
  ]);

  const mapNewsletter = (n: typeof previousResult): Newsletter | null => {
    if (!n) return null;
    return {
      id: n.id,
      title: n.title,
      slug: n.slug,
      summary: n.summary,
      content: n.content,
      publishedAt: n.publishedAt,
      published: n.published,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      tags: n.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
        slug: t.tag.slug,
      })),
    };
  };

  return {
    previous: mapNewsletter(previousResult),
    next: mapNewsletter(nextResult),
  };
}
