import Anthropic from '@anthropic-ai/sdk';
import { JudgeVerdictSchema, type JudgeVerdict, type EvalTask } from './types';

const JUDGE_MODEL = process.env.EVAL_JUDGE_MODEL || 'claude-sonnet-4-6';

/**
 * Blind pairwise judge.
 *
 * Two things keep this honest, and both are easy to lose in a refactor:
 *
 * 1. The judge is never told that a skill library exists, that one response had help, or
 *    which patterns are in the pack. It is told only the designer's question and two
 *    answers. A judge that knows there is a treatment arm will find one.
 *
 * 2. Which response is shown first is randomised per pair by the caller, so a position
 *    bias cannot masquerade as an effect.
 *
 * The rubric is in RUBRIC.md and is deliberately phrased around the designer's problem
 * rather than pattern doctrine. Scoring "did it apply the pattern well" would score the
 * pack against its own definition of good.
 */

/**
 * Skill text carries its origin. Left in, it tells the judge which arm it is reading.
 *
 * Pattern names are deliberately left alone: baseline Claude already uses terms like
 * "progressive disclosure", so they are not a reliable tell, and removing them would strip
 * real substance out of both arms rather than just the marking.
 */
export function scrub(text: string): string {
  return text
    .replace(/https?:\/\/(www\.)?aiuxdesign\.guide\S*/gi, '[link]')
    .replace(/aiuxdesign\.guide/gi, '[site]')
    .replace(/\baiux[-\w]*/gi, 'pattern')
    .replace(
      /When this applies, make the smallest change that genuinely realises the pattern\.[^\n]*/gi,
      ''
    )
    .replace(/^Reference:.*$/gim, '')
    .replace(/^\s*Why it matters:\s*/gim, '')
    .trim();
}

const SYSTEM = `You are a principal product designer reviewing two answers to the same design question. You do not know where either answer came from and must not speculate about it.

Score each answer 0-5 on five axes:

- diagnosis: does it identify why the current design fails THIS user in THIS scenario, rather than restating the question or jumping straight to solutions?
- specificity: are recommendations anchored to concrete, nameable UI, rather than directional advice?
- tradeoff: does it acknowledge a real cost, tension, or a case where its own advice does not apply? Pure upside scores low.
- actionability: could a designer act on this without coming back with questions?
- groundedness: are claims tied to what was actually described, with no invented product facts, users or data?

Then make a forced choice: which answer would you rather hand to the designer who asked? Use "tie" only when you genuinely cannot separate them.

Judge the substance. Ignore length, formatting, headings and confidence of tone. A longer answer is not a better one. Do not reward an answer for using design vocabulary; reward it for being right and usable.

Reply with ONLY a JSON object:
{"responseOne":{"diagnosis":n,"specificity":n,"tradeoff":n,"actionability":n,"groundedness":n},"responseTwo":{...same keys...},"preferred":"one"|"two"|"tie","reasoning":"one or two sentences"}`;

export async function judgePair(
  client: Anthropic,
  task: EvalTask,
  responseOne: string,
  responseTwo: string
): Promise<JudgeVerdict> {
  const message = await client.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 1500,
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: `THE DESIGNER ASKED:
${task.prompt}

--- RESPONSE ONE ---
${scrub(responseOne)}

--- RESPONSE TWO ---
${scrub(responseTwo)}`,
      },
    ],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return JudgeVerdictSchema.parse(JSON.parse(json));
}
