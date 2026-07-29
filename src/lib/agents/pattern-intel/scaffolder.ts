import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { PATTERN_COUNT } from '@/data/pattern-count';

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
  /** componentId registered in the scaffolded demo registry */
  demoSlug: string;
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
  usedBy: z.array(z.object({
    product: z.string().min(2),
    feature: z.string().min(5),
    description: z.string().min(20),
  })).min(3).max(5),
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

VOICE: Punchy. Opinionated. No marketing fluff. No throat-clearing. Cut every sentence that doesn't earn its place. Read it back, if a sentence could be deleted without losing meaning, delete it.

NO EM DASHES (—). Use commas, periods, or colons instead. The em dash is overused and reads as filler.

Match this voice (from the Explainable AI pattern):

  Takeaway heading: "First, decide what the user can do with the explanation."
  Takeaway body: "If the answer is 'nothing,' you don't need an explanation, you need a better decision. Every explanation should map to an action the user can take: change an input, correct data, escalate, appeal. No action, no explanation."

  Judgment-call entry: "The decision is high-stakes and contestable (medical, credit, moderation), and the user needs grounds to challenge it."

  Trap: "Fake transparency: a confidence number and three tidy 'factors' that look rigorous but aren't how the model decided. Worse than no explanation."

HARD LENGTH RULES — exceeding any of these means you failed the task. Count words before responding.

- description: ONE sentence. 15-25 words. Period.
- introduction: ONE paragraph only. 40-70 words MAX. NOT two paragraphs. NOT three. ONE. State what the pattern is and the single load-bearing reason it matters in two sentences max. No "in today's world", no list of examples — examples have their own section.
- guidelines: 4-6 items, 12-18 words each, imperative ("Show…", "Cap…", "Replace…")
- considerations: 4-6 items, 12-18 words each, blunt tradeoff or tension
- judgmentCall.explainWhen / dontWhen: exactly 3 items each, 15-25 words each, concrete conditions
- judgmentCall.trap: 25-40 words, one named failure mode
- takeaways: exactly 4. heading 6-12 words (imperative). body 25-35 words (one tight thought, no listing, no "in summary")
- installPrompt: 150-300 words. Structure: 1 summary line → "Apply these moves:" → 4 numbered moves → 1 line on what to avoid → "Output: a Markdown report listing surfaces updated and surfaces flagged." NO MORE.
- figmaPromptText: 60-90 words
- figmaTips: 3-5 items, ≤ 120 chars each
- usedBy: 3-5 real products that exemplify this pattern in production. CHOOSE ONLY FROM THIS CATALOG (the only logos we have): Google, GitHub, Notion, Netflix, Spotify, OpenAI, Adobe, Photoshop, Adobe Firefly, Microsoft, ChatGPT, Claude, Bing, Figma, Slack, Discord, Gmail, Copilot, Siri, Alexa, Cortana, Loom, Superhuman, Grammarly, Perplexity, Midjourney, Dall-E, DuckDuckGo, Signal, Anthropic, Apple, Tesla, IBM, AWS, Duolingo, GPTZero, Hugging, Zapier, Cursor, Devin, Woebot, Wysa. Each entry: {product: catalog name exactly, feature: short feature name where pattern shows up, description: one sentence on which design choice exemplifies the pattern (≤ 200 chars)}

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
  "figmaTips": ["..."],
  "usedBy": [{ "product": "...", "feature": "...", "description": "..." }]
}

ALL 11 FIELDS ARE REQUIRED. Including usedBy. If you forget a field, the response is rejected.`;

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
      system: `You write minimal, self-contained React/TSX code samples for an AI design pattern library at aiuxdesign.guide.

Output ONLY the code, no prose, no markdown fences, no commentary. Start with imports, end with a default export.

Constraints:
- Single React component, default exported
- Uses only \`import React, { useState } from 'react';\` (no other imports)
- 80-150 lines total
- Demonstrates the pattern interactively with a meaningful state change
- Realistic placeholder data baked in
- No em dashes anywhere
- No comments explaining the obvious
- MUST include a Reset button in the top-right of the demo that restores the component to its initial state. Store initial state in a const at the top of the component and have Reset re-initialize every useState. Place it as a small ghost button: \`<button onClick={reset} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">Reset</button>\` in a flex row at the top of the card, right-aligned next to the demo title

DESIGN SYSTEM (these are required, do not use raw Tailwind colors like bg-blue-500 or bg-gray-100, the brand uses semantic tokens):

Surfaces:
- bg-surface-primary, bg-surface-secondary (cards, panels)
- bg-background-primary, bg-background-secondary (page surfaces)

Text:
- text-text-primary (headings, body emphasis)
- text-text-secondary (supporting copy)
- text-text-tertiary (timestamps, captions, eyebrows)

Borders:
- border-border-primary, border-border-secondary (use these, never border-gray-200)

Status colors (use sparingly, only for state):
- bg-status-success / text-status-success (positive)
- bg-status-warning / text-status-warning (caution)
- bg-status-error / text-status-error (negative)

Accents:
- bg-accent-primary, text-accent-primary (CTAs, key emphasis)

Spacing and layout:
- Use rounded-lg or rounded-xl on cards
- Use p-4 to p-6 for card padding
- Build for max-w-4xl viewport, the demo container is wide
- Use grid or flex layouts with gap-3 or gap-4
- Hover states with transition-colors

Typography hierarchy:
- text-lg or text-xl for section headings
- text-sm for body
- text-xs for metadata

Build the component to look like it belongs on the same page as the existing ${PATTERN_COUNT} patterns. Editorial, calm, hairline borders, generous whitespace. Not flashy.`,
      messages: [{
        role: 'user',
        content: `Write an interactive React component that demonstrates the "${title}" pattern.

Problem: ${problem}
Solution: ${solution}

The component should show the pattern in action. Use the brand design tokens listed above. A reader should look at this and understand the specific design move that defines this pattern.`,
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

  // Belt-and-suspenders: strip any em dashes that slipped through
  const stripEmDash = (s: string) => s.replace(/—/g, ',').replace(/\s,\s/g, ', ');
  data = JSON.parse(JSON.stringify(data, (_, v) => typeof v === 'string' ? stripEmDash(v) : v));

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

  // Build example stubs from usedBy — image/altText left empty for admin
  // to fill in later. The Used-by row will auto-populate from the title
  // (first word = product name, must match the logo catalog).
  const exampleStubs = data.usedBy.map((u) => ({
    title: `${u.product} ${u.feature}`,
    description: u.description,
    image: '',
    altText: '',
  }));

  const examplesTs = `import { Example } from '../../../../types';

// TODO: Add real screenshots — image and altText are empty until then
export const examples: Example[] = ${JSON.stringify(exampleStubs, null, 2)};
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

  // Strip any default export from the raw code (we add our own) and ensure
  // the file is a self-contained React component with no external imports
  // beyond React.
  const componentName = exportName.charAt(0).toUpperCase() + exportName.slice(1) + 'Demo';
  const cleanedCode = rawCode
    .replace(/^import [^;]+;[\r\n]*/gm, '')
    .replace(/^export default function \w+/gm, `function ${componentName}`)
    .replace(/^export default function/gm, `function ${componentName}`)
    .replace(/^export default \w+;?[\r\n]*$/gm, '')
    .trim();

  // @ts-nocheck: generated demos have loose typing (untyped useState, any params);
  // they are self-contained and isolated, so we skip strict TS rather than fight Claude
  const demoComponentFile = `'use client';
// @ts-nocheck

import React, { useState } from 'react';

${cleanedCode}

export default ${componentName};
`;

  const demoPath = `src/components/examples/scaffolded/${slug}-demo.tsx`;

  return {
    files: {
      [`${dir}/index.ts`]: indexTs,
      [`${dir}/guidelines.ts`]: guidelinesTs,
      [`${dir}/considerations.ts`]: considerationsTs,
      [`${dir}/figma-prompt.ts`]: figmaPromptTs,
      [`${dir}/examples.ts`]: examplesTs,
      [`${dir}/code-examples.ts`]: codeExamplesTs,
      [demoPath]: demoComponentFile,
    },
    exportName,
    demoSlug: `${slug}-demo`,
  };
}

export function patchScaffoldedRegistry(currentContent: string, demoSlug: string): string {
  if (currentContent.includes(`'${demoSlug}':`)) return currentContent;
  const importName = demoSlug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const newImport = `const ${importName} = dynamic(() => import('./${demoSlug}'), { ssr: false });\n`;

  // Insert the dynamic-import line above the exported object
  const exportIdx = currentContent.indexOf('export const scaffoldedDemos');
  if (exportIdx === -1) throw new Error('Could not find scaffoldedDemos export');
  const withImport = currentContent.slice(0, exportIdx) + newImport + currentContent.slice(exportIdx);

  // Find the closing `};` of the scaffoldedDemos object and insert the new entry just before it
  const closeIdx = withImport.indexOf('};', withImport.indexOf('scaffoldedDemos'));
  if (closeIdx === -1) throw new Error('Could not find scaffoldedDemos closing brace');
  return withImport.slice(0, closeIdx) + `  '${demoSlug}': ${importName},\n` + withImport.slice(closeIdx);
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
