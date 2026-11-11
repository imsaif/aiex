/**
 * Guidebot: an educational guide to aiuxdesign.guide. A manual agent loop
 * (stop_reason drives it) with three tools: search the site, read a page,
 * and hand a support case to Imran. It never changes anything itself.
 */
import Anthropic from '@anthropic-ai/sdk';
import { getPage, searchSite } from './content-index';

export const GUIDEBOT_MODEL = process.env.GUIDEBOT_MODEL ?? 'claude-haiku-5-5';

const SYSTEM = `You are Guidebot, the guide on aiuxdesign.guide. The site teaches designers AI UX: design patterns, courses on AI tools (Claude Code, Claude Design, Claude Docs, Cursor, GitHub), checklists and events. Many visitors are new to AI UX.

How you answer:
- Search the site before you answer, and read the page you plan to rely on. Answer only from what the site's pages say.
- Explain any term in plain words before you use it. Keep it short: two to four sentences.
- End with a link to the page that teaches more, written as a full URL starting with https://www.aiuxdesign.guide.
- If the site doesn't cover the question, say so plainly, and link the closest page only if it genuinely helps. Don't fill gaps from general knowledge, and don't recommend tools or products the site doesn't cover.
- Never state a price, date or policy you didn't read on a page.
- Refunds, cancellations and booking changes: promise nothing. First ask for the email address Imran should reply to, and which event or purchase it is about. Once you have the email, call hand_off_to_imran once, with a short summary, then tell the visitor Imran will reply by email.
- If a question is very short or could mean several things, give the closest answer and ask one short question to narrow it down.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_site',
    description:
      'Searches aiuxdesign.guide by keywords and returns up to five matching pages (patterns, courses, lessons, events, the audit page), each with its URL, title and a one-line summary. Use it first for every question. It only knows this site; it cannot search the web. Use a few plain keywords, for example "calibrated trust" or "claude design export design system".',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'A few plain keywords' } },
      required: ['query'],
    },
  },
  {
    name: 'read_page',
    description:
      'Returns the full text of one page on aiuxdesign.guide, given a URL that search_site returned. Use it before you answer from a page, so the answer reflects what the page actually says. It returns an error for URLs that are not on this site.',
    input_schema: {
      type: 'object',
      properties: { url: { type: 'string', description: 'A URL returned by search_site' } },
      required: ['url'],
    },
  },
  {
    name: 'hand_off_to_imran',
    description:
      'Passes a support request to Imran, who runs the site, for him to handle by email. Use it only for refunds, cancellations, booking changes, or a problem with a purchase, and only once the visitor has given an email address for the reply; ask for it first. Call it once per request. It does not refund or change anything; it only records the request.',
    input_schema: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'What the visitor needs, in one or two sentences' },
        visitor_email: { type: 'string', description: 'The email address the visitor gave, if they gave one' },
      },
      required: ['summary', 'visitor_email'],
    },
  },
];

export interface ToolCallRecord {
  name: string;
  input: Record<string, unknown>;
  isError: boolean;
}

export interface GuidebotResult {
  answer: string;
  toolCalls: ToolCallRecord[];
  handoffs: { summary: string; visitor_email?: string }[];
  inputTokens: number;
  outputTokens: number;
  stopReason: string | null;
}

function runTool(name: string, input: Record<string, string>, handoffs: GuidebotResult['handoffs']) {
  switch (name) {
    case 'search_site': {
      const hits = searchSite(input.query ?? '');
      if (hits.length === 0) return { content: 'No pages matched. Try different keywords.', isError: false };
      return {
        content: JSON.stringify(hits.map((p) => ({ url: p.url, title: p.title, summary: p.summary }))),
        isError: false,
      };
    }
    case 'read_page': {
      const page = getPage(input.url ?? '');
      if (!page) return { content: `No page on aiuxdesign.guide matches "${input.url}".`, isError: true };
      return { content: `${page.title}\n${page.url}\n\n${page.text.slice(0, 6000)}`, isError: false };
    }
    case 'hand_off_to_imran': {
      // v1 records the request only; sending the email comes with the live version.
      handoffs.push({ summary: input.summary ?? '', visitor_email: input.visitor_email });
      return { content: 'Recorded. Imran will reply to the visitor by email.', isError: false };
    }
    default:
      return { content: `Unknown tool: ${name}`, isError: true };
  }
}

/** Earlier turns of the same chat, as plain text, oldest first. */
export interface GuidebotTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function askGuidebot(
  question: string,
  client = new Anthropic(),
  history: GuidebotTurn[] = []
): Promise<GuidebotResult> {
  const messages: Anthropic.MessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: 'user', content: question },
  ];
  const result: GuidebotResult = { answer: '', toolCalls: [], handoffs: [], inputTokens: 0, outputTokens: 0, stopReason: null };

  // Safety net only: the loop really ends when Claude stops asking for tools.
  for (let turn = 0; turn < 10; turn++) {
    const response = await client.messages.create({
      model: GUIDEBOT_MODEL,
      max_tokens: 4000,
      system: SYSTEM,
      tools: TOOLS,
      messages,
    });
    result.inputTokens += response.usage.input_tokens;
    result.outputTokens += response.usage.output_tokens;
    result.stopReason = response.stop_reason;
    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'tool_use') {
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;
        const input = block.input as Record<string, string>;
        const out = runTool(block.name, input, result.handoffs);
        result.toolCalls.push({ name: block.name, input, isError: out.isError });
        results.push({ type: 'tool_result', tool_use_id: block.id, content: out.content, is_error: out.isError });
      }
      messages.push({ role: 'user', content: results });
      continue;
    }
    if (response.stop_reason === 'pause_turn') continue;

    result.answer = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    return result;
  }
  result.answer = '(stopped: too many turns)';
  return result;
}
