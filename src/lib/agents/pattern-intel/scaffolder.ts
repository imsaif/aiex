import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const SONNET_MODEL = 'claude-sonnet-4-6';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ScaffoldInput {
  slug: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  rationale: string;
}

export interface ScaffoldedFiles {
  /** key = relative path from repo root, value = file content */
  files: Record<string, string>;
  /** camelCase export name derived from slug */
  exportName: string;
}

function slugToCamel(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

const ScaffoldSchema = z.object({
  description: z.string().min(20).max(300),
  introduction: z.string().min(100).max(1200),
  tags: z.array(z.string()).min(2).max(8),
  guidelines: z.array(z.string()).min(3).max(8),
  considerations: z.array(z.string()).min(3).max(8),
  judgmentCall: z.object({
    explainWhen: z.array(z.string()).min(2).max(4),
    dontWhen: z.array(z.string()).min(2).max(4),
    trap: z.string().min(30).max(400),
  }),
  takeaways: z.array(z.object({
    heading: z.string().min(10).max(120),
    body: z.string().min(30).max(400),
  })).min(3).max(4),
  installPrompt: z.string().min(200).max(3000),
  figmaPromptText: z.string().min(100).max(1000),
  figmaTips: z.array(z.string()).min(3).max(6),
  demoComponentCode: z.string().min(200),
});

function extractJson(text: string): unknown {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenceMatch ? fenceMatch[1] : text;
  const start = candidate.indexOf('{');
  if (start === -1) throw new Error('no JSON object found');
  let depth = 0;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return JSON.parse(candidate.slice(start, i + 1));
    }
  }
  throw new Error('unbalanced JSON');
}

export async function scaffoldPattern(input: ScaffoldInput): Promise<ScaffoldedFiles> {
  const { slug, title, category, problem, solution, rationale } = input;
  const exportName = slugToCamel(slug);

  const systemPrompt = `You are an expert AI UX designer and TypeScript developer generating content for a design pattern library at aiuxdesign.guide.

The library has 36 patterns across 8 categories. Patterns explain recurring UI/UX design challenges in AI products and how to solve them.

The newest pattern page format (applied to explainable-ai) includes these fields:
- judgmentCall: { explainWhen[], dontWhen[], trap } — opinionated guidance on when to use vs avoid
- takeaways: [{ heading, body }] — 3-4 ranked, actionable design moves
- installPrompt: a Claude Code prompt the user can copy to apply this pattern to their own codebase
- hideFAQ: true (always set for new patterns)

Return strict JSON (no markdown fences, no prose outside JSON) matching this schema exactly:
{
  "description": "one-sentence pattern definition, max 300 chars",
  "introduction": "2-3 paragraph intro explaining what this pattern is, why it matters, and real-world examples (100-1200 chars)",
  "tags": ["2-8 lowercase kebab-case tags"],
  "guidelines": ["3-8 action-oriented guideline strings"],
  "considerations": ["3-8 implementation consideration strings"],
  "judgmentCall": {
    "explainWhen": ["2-4 specific conditions where this pattern is the right call"],
    "dontWhen": ["2-4 specific conditions where this pattern adds friction or fails"],
    "trap": "the single most common misapplication of this pattern, 30-400 chars"
  },
  "takeaways": [
    { "heading": "imperative sentence max 120 chars", "body": "explanation 30-400 chars" }
  ],
  "installPrompt": "a complete Claude Code prompt (200-3000 chars) for implementing this pattern in a real codebase. Should be opinionated and concrete with specific implementation steps.",
  "figmaPromptText": "a Figma design prompt for this pattern (100-1000 chars)",
  "figmaTips": ["3-6 Figma-specific design tips"],
  "demoComponentCode": "a complete working React/TSX component (no imports needed, no default export) that demonstrates this pattern interactively. Use only React hooks and inline Tailwind-like styles via className. Export as: export default function Demo() { ... }"
}`;

  const userPrompt = `Generate full pattern content for:

Title: ${title}
Slug: ${slug}
Category: ${category}
Problem: ${problem}
Solution: ${solution}
Context: ${rationale}

Make the content practical and opinionated. The takeaways should be the 3-4 most important design moves, ranked by impact. The installPrompt should be detailed enough that a developer can run it with Claude Code against their codebase and get real changes.`;

  const response = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 4000,
    temperature: 0.3,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let data: z.infer<typeof ScaffoldSchema>;
  try {
    data = ScaffoldSchema.parse(extractJson(text));
  } catch (err) {
    console.error('[scaffolder] parse failed:', err, 'raw:', text.slice(0, 300));
    throw new Error('Scaffolder parse failed');
  }

  const dir = `src/data/patterns/patterns/${slug}`;

  const indexTs = `import { Pattern } from '../../../../types';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { figmaPrompt } from './figma-prompt';
import { codeExamples } from './code-examples';

export const ${exportName}: Pattern = {
  id: "${slug}",
  title: "${title}",
  slug: "${slug}",
  status: 'implemented',
  description: ${JSON.stringify(data.description)},
  category: "${category}",
  tags: ${JSON.stringify(data.tags, null, 2).split('\n').join('\n  ')},
  thumbnail: "/images/patterns/placeholder.png",
  introduction: ${JSON.stringify(data.introduction)},
  datePublished: "${new Date().toISOString().split('T')[0]}",
  dateModified: "${new Date().toISOString().split('T')[0]}",
  hideFAQ: true,
  content: {
    problem: ${JSON.stringify(problem)},
    solution: ${JSON.stringify(solution)},
    examples: [],
    guidelines,
    considerations,
    relatedPatterns: [],
    codeExamples,
    figmaPrompt,
    judgmentCall: ${JSON.stringify(data.judgmentCall, null, 4).split('\n').join('\n    ')},
    installPrompt: ${JSON.stringify(data.installPrompt)},
    takeaways: ${JSON.stringify(data.takeaways, null, 4).split('\n').join('\n    ')},
  },
};
`;

  const guidelinesTs = `export const guidelines: string[] = ${JSON.stringify(data.guidelines, null, 2)};
`;

  const considerationsTs = `export const considerations: string[] = ${JSON.stringify(data.considerations, null, 2)};
`;

  const figmaPromptTs = `import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: ${JSON.stringify(data.figmaPromptText)},
  figmaFileUrl: undefined,
  tips: ${JSON.stringify(data.figmaTips, null, 2)},
};
`;

  const examplesTs = `import { Example } from '../../../../types';

// TODO: Add real-world screenshot examples
export const examples: Example[] = [];
`;

  const codeExamplesTs = `import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "${title} Demo",
    description: "Interactive demonstration of the ${title} pattern.",
    language: "tsx",
    componentId: "${slug}-demo",
    code: ${JSON.stringify(data.demoComponentCode)},
  },
];
`;

  return {
    files: {
      [`${dir}/index.ts`]: indexTs,
      [`${dir}/guidelines.ts`]: guidelinesTs,
      [`${dir}/considerations.ts`]: considerationsTs,
      [`${dir}/figma-prompt.ts`]: figmaPromptTs,
      [`${dir}/examples.ts`]: examplesTs,
      [`${dir}/code-examples.ts`]: codeExamplesTs,
    },
    exportName,
  };
}

export function patchPatternsRegistry(
  currentContent: string,
  slug: string,
  exportName: string,
): string {
  // Add import after the last existing pattern import
  const lastImportMatch = Array.from(currentContent.matchAll(/^import \{[^}]+\} from '\.\/patterns\/patterns\/[^']+';$/gm));
  if (lastImportMatch.length === 0) throw new Error('Could not find import block in patterns.ts');
  const lastImport = lastImportMatch[lastImportMatch.length - 1];
  const insertAfter = lastImport.index! + lastImport[0].length;
  const newImport = `\nimport { ${exportName} } from './patterns/patterns/${slug}';`;
  const withImport = currentContent.slice(0, insertAfter) + newImport + currentContent.slice(insertAfter);

  // Add to patterns array before the closing bracket
  const arrayCloseIdx = withImport.lastIndexOf('];');
  if (arrayCloseIdx === -1) throw new Error('Could not find patterns array close in patterns.ts');
  const withEntry = withImport.slice(0, arrayCloseIdx) + `  ${exportName},\n` + withImport.slice(arrayCloseIdx);

  return withEntry;
}
