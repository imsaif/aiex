import { createHash } from 'crypto';

/**
 * Newsletter polls, self-hosted. Replaces the beehiiv poll block.
 *
 * An email poll is a set of ordinary links, one per answer, pointing at
 * /poll/<issueSlug>?c=<choiceId>. No JavaScript, no embed, works in every mail
 * client. The link opens a page where the reader confirms with one tap.
 *
 * Votes are ANONYMOUS by design, and that is a constraint rather than a
 * preference: the newsletter ships by pasting one HTML document into a beehiiv
 * post, so every recipient receives byte-identical links. There is no
 * per-person token to put in a URL. See docs/specs/newsletter-polls.md.
 */

export interface PollChoice {
  id: string;
  label: string;
}

export interface PollDefinition {
  question: string;
  choices: PollChoice[];
}

/**
 * The default attached to every generated issue. Matches the question the
 * beehiiv poll asked, so the 3 historical responses in the September 2026
 * export remain comparable.
 */
export const DEFAULT_POLL: PollDefinition = {
  question: 'Was this issue worth your time?',
  choices: [
    { id: 'yes', label: 'Yes, genuinely useful' },
    { id: 'skim', label: 'Skimmed it, some value' },
    { id: 'no', label: 'Not really' },
  ],
};

/**
 * Reads the poll off a stored `NewsletterDraft.structuredData` blob. Issues
 * generated before this feature have no `poll` key; they fall back to the
 * default so an old issue's links still resolve to a valid choice set rather
 * than 404ing a reader who opens a week-old email.
 */
export function pollFromStructuredData(structuredData: unknown): PollDefinition {
  const poll = (structuredData as { poll?: unknown } | null)?.poll;
  if (!poll || typeof poll !== 'object') return DEFAULT_POLL;

  const { question, choices } = poll as { question?: unknown; choices?: unknown };
  if (typeof question !== 'string' || !Array.isArray(choices) || choices.length === 0) {
    return DEFAULT_POLL;
  }

  const parsed = choices.filter(
    (c): c is PollChoice =>
      !!c &&
      typeof (c as PollChoice).id === 'string' &&
      typeof (c as PollChoice).label === 'string'
  );
  return parsed.length > 0 ? { question, choices: parsed } : DEFAULT_POLL;
}

export function isValidChoice(poll: PollDefinition, choiceId: string | undefined): boolean {
  return !!choiceId && poll.choices.some((c) => c.id === choiceId);
}

/**
 * Best-effort de-duplication handle. NOT identity — never surface it, never
 * join it to a subscriber.
 *
 * Salted with the issue slug as well as the server secret, so the same reader
 * produces a different hash on every issue and cannot be followed across them.
 * Mirrors the 16-char convention in src/lib/audit/sample.ts.
 */
export function voterHash(
  issueSlug: string,
  ip: string | null | undefined,
  userAgent: string | null | undefined
): string | null {
  if (!ip || ip === 'unknown') return null;
  const salt = process.env.AUDIT_SAMPLE_IP_SALT || process.env.HANDBOOK_TOKEN_SECRET || 'aiux';
  return createHash('sha256')
    .update(`${salt}:${issueSlug}:${ip}:${userAgent || ''}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Third line of defence on /poll/<slug>, behind the confirm tap and the rule
 * that ignores taps in the minutes after a send.
 *
 * Opening the link is not a vote: since Nov 2026 only a tap on the page records
 * one, because mail scanners run real Chrome with ordinary user-agents, which
 * this check cannot see. Measured on Nov 4 2026: all 29 votes arrived within
 * 10 minutes of the first, split across every answer. This still drops the
 * tools that announce themselves, should any of them submit the form.
 */
export function isLikelyBot(userAgent: string | null, secPurpose: string | null): boolean {
  if (secPurpose && secPurpose.toLowerCase().includes('prefetch')) return true;
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  if (!ua.includes('mozilla/')) return true;
  return /bot|crawler|spider|slurp|preview|scan|fetch|monitor|curl|wget|python-|headless|proofpoint|barracuda|mimecast|godaddy/.test(
    ua
  );
}
