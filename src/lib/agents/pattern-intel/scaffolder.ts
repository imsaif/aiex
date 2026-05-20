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
  description: z.string().min(20),
  introduction: z.string().min(100),
  tags: z.array(z.string()).min(2).max(10),
  guidelines: z.array(z.string()).min(3).max(10),
  considerations: z.array(z.string()).min(3).max(10),
  judgmentCall: z.object({
    explainWhen: z.array(z.string()).min(2),
    dontWhen: z.array(z.string()).min(2),
    trap: z.string().min(20),
  }),
  takeaways: z.array(z.object({
    heading: z.string().min(10),
    body: z.string().min(30),
  })).min(3),
  installPrompt: z.string().min(100),
  figmaPromptText: z.string().min(50),
  figmaTips: z.array(z.string()).min(2),
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

  const systemPrompt = `You generate content for AI UX design pattern pages at aiuxdesign.guide.

VOICE: Punchy. Opinionated. No marketing fluff. No throat-clearing. Cut every sentence that doesn't earn its place. Read it back — if a sentence could be deleted without losing meaning, delete it. Match this voice (from the Explainable AI pattern):

  Takeaway heading: "First, decide what the user can do with the explanation."
  Takeaway body: "If the answer is 'nothing,' you don't need an explanation, you need a better decision. Every explanation should map to an action the user can take: change an input, correct data, escalate, appeal. No action, no explanation."

  Judgment-call entry: "The decision is high-stakes and contestable (medical, credit, moderation), and the user needs grounds to challenge it."

  Trap: "Fake transparency: a confidence number and three tidy 'factors' that look rigorous but aren't how the model decided. Worse than no explanation."

LENGTH TARGETS (hard ceilings — go shorter if you can):
- description: ≤ 200 chars, one sentence
- introduction: 2 short paragraphs, ≤ 600 chars TOTAL. Not 1200. State what the pattern is and the single load-bearing reason it matters. No "in today's world…", no examples list — those live in the Examples section.
- guidelines: 4-6 items, each ≤ 140 chars, imperative voice ("Show…", "Cap…", "Replace…")
- considerations: 4-6 items, each ≤ 140 chars, blunt tradeoffs
- judgmentCall.explainWhen / dontWhen: 3 items each, each ≤ 180 chars, concrete conditions
- judgmentCall.trap: ≤ 250 chars, one named failure mode
- takeaways: exactly 4. heading ≤ 80 chars (imperative). body ≤ 200 chars (one tight paragraph, no listing)
- installPrompt: 800-1500 chars. Structured as: 1-line summary → "Apply these moves to AI surfaces in this codebase:" → 4 numbered moves with concrete instructions → 1 sentence on what to avoid → "Output: a Markdown report listing surfaces updated and surfaces flagged."
- figmaPromptText: ≤ 500 chars
- figmaTips: 3-5 items, ≤ 120 chars each

Return strict JSON, no markdown fences, no commentary. Schema:
{
  "description": "...",
  "introduction": "...",
  "tags": ["..."],
  "guidelines": ["..."],
  "considerations": ["..."],
  "judgmentCall": { "explainWhen": ["..."], "dontWhen": ["..."], "trap": "..." },
  "takeaways": [{ "heading": "...", "body": "..." }],
  "installPrompt": "...",
  "figmaPromptText": "...",
  "figmaTips": ["..."]
}`;

  const userPrompt = `Generate the pattern content. Be punchy.

Title: ${title}
Category: ${category}
Problem: ${problem}
Solution: ${solution}
Context: ${rationale}

The 4 takeaways are the most important thing. They must be the 4 ranked design moves a reader applies in their product — heading is the imperative ("Decide what the user can do first"), body explains the move in ≤ 200 chars with a sharp line, not a paragraph of throat-clearing.`;

  // Run editorial content and code example in parallel — separate calls
  // so the code example has its own token budget and doesn't truncate JSON.
  const [editorialResponse, codeResponse] = await Promise.all([
    anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 6000,
      temperature: 0.3,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    }),
    anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 3000,
      temperature: 0.2,
      system: `You write minimal, self-contained React/TSX code samples for an AI design pattern library.

Output ONLY the code, no prose, no markdown fences, no commentary. Start with imports, end with a default export.

Constraints:
- Single React component, default exported
- Uses only \`import React, { useState } from 'react';\` (no other imports)
- Inline Tailwind className strings — no external CSS, no styled-components
- Concrete and runnable, not pseudocode
- 60-120 lines total
- Demonstrates the pattern interactively (a button, a toggle, a state change — something the reader can mentally execute)
- Realistic placeholder data baked in
- No comments explaining the obvious; only flag the non-obvious load-bearing decisions`,
      messages: [{
        role: 'user',
        content: `Write a minimal interactive React component that demonstrates the "${title}" pattern.

Problem the pattern solves: ${problem}
Solution: ${solution}

The component should show the pattern in action — not a generic UI, but the specific design move that defines this pattern. A reader should look at this and understand: "oh, THAT's how you do it."`,
      }],
    }),
  ]);

  const text = editorialResponse.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const rawCode = codeResponse.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:tsx|jsx|typescript|javascript)?\s*\n/, '')
    .replace(/\n```\s*$/, '');

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
    title: ${JSON.stringify(`${title} — Implementation`)},
    description: ${JSON.stringify(`A minimal React example showing how to implement the ${title} pattern.`)},
    language: "tsx",
    componentId: ${JSON.stringify(`${slug}-demo`)},
    code: ${JSON.stringify(rawCode)},
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

  // Add to patterns array before the closing bracket.
  // Ensure the previous last entry ends with a comma (some entries don't).
  const arrayCloseIdx = withImport.lastIndexOf('];');
  if (arrayCloseIdx === -1) throw new Error('Could not find patterns array close in patterns.ts');
  const before = withImport.slice(0, arrayCloseIdx);
  const after = withImport.slice(arrayCloseIdx);
  const beforeTrimmed = before.replace(/,?\s*$/, '');
  const withEntry = `${beforeTrimmed},\n  ${exportName},\n${after}`;

  return withEntry;
}
