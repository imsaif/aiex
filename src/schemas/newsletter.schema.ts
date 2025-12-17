import { z } from 'zod';

/**
 * Schema for newsletter tags
 */
export const TagSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
});

/**
 * Schema for newsletter entries
 */
export const NewsletterSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  summary: z.string().min(10).max(500),
  content: z.string().min(50),
  publishedAt: z.coerce.date(),
  published: z.boolean().default(false),
  tags: z.array(TagSchema).default([]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Schema for creating a new newsletter
 */
export const CreateNewsletterSchema = NewsletterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  tags: true,
}).extend({
  tagIds: z.array(z.string().cuid()).optional(),
  tagNames: z.array(z.string().min(1).max(50)).optional(),
});

/**
 * Schema for newsletter filter options
 */
export const NewsletterFilterSchema = z.object({
  tags: z.array(z.string()).optional(),
  searchQuery: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10),
});

// Export inferred types
export type TagInput = z.infer<typeof TagSchema>;
export type NewsletterInput = z.infer<typeof NewsletterSchema>;
export type CreateNewsletterInput = z.infer<typeof CreateNewsletterSchema>;
export type NewsletterFilterInput = z.infer<typeof NewsletterFilterSchema>;
