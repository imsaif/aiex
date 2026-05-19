import { z } from 'zod';

export const PatternMatchSchema = z.object({
  slug: z.string(),
  confidence: z.number().min(0).max(1),
  rationale: z.string().min(1).max(400),
});
export type PatternMatch = z.infer<typeof PatternMatchSchema>;

export const ClassifierResponseSchema = z.object({
  matches: z.array(PatternMatchSchema).max(3),
});

export const EnricherResponseSchema = z.object({
  shouldEnrich: z.boolean(),
  exampleTitle: z.string().max(120).optional(),
  exampleDescription: z.string().max(400).optional(),
  rationale: z.string().max(300).optional(),
});

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  slug: string;
  publishDate: Date;
}

export interface PatternRef {
  slug: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
}
