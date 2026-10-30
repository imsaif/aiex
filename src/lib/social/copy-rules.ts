/**
 * House rules for the social drafts the admin Social tab writes from a newsletter
 * issue. The prompts ask for these, and cleanCopy() enforces the two that can be
 * enforced mechanically, because a prompt-only rule gets ignored often enough
 * (see the selection incidents in .claude/rules/newsletter-and-infra.md).
 *
 * Why these rules: the drafts post under Imran's name. Emojis and em dashes read
 * as machine-written, and an invented first-person experience ("I tested this")
 * is a claim a reader can check.
 */

/** Pasted into every LinkedIn and X prompt. */
export const WRITING_RULES = `Writing rules (all required):
- No emojis anywhere.
- No em dashes or en dashes. Use a comma, a colon or a full stop.
- No "not X but Y" or "it's not X, it's Y" constructions. Say the plain statement.
- No sentence fragments for punch. Write full sentences.
- No hype words: game-changer, revolutionary, unlock, supercharge, dive in.
- Opinions about the news are welcome. Never invent first-person experience: do not write "I tested", "I tried", "I built", "I used", "we ran" or anything else that claims something was done. The author adds those himself.`;

// Pictographic emoji plus the joiners and variation selectors that glue them
// together, so a family or flag emoji leaves no stray invisible characters.
// Built with the constructor because tsconfig targets es5, which rejects the `u`
// flag on a regex literal; every runtime this code runs on supports it.
const EMOJI = new RegExp('[\\p{Extended_Pictographic}\\u{1F1E6}-\\u{1F1FF}\\u{FE0F}\\u{200D}\\u{20E3}]', 'gu');

/**
 * Removes emojis and em/en dashes from a draft. A spaced dash between clauses
 * becomes a comma; a dash glued between words (a range or compound) becomes a
 * hyphen. Whitespace left behind by a removed emoji is tidied, line breaks kept.
 */
export function cleanCopy(text: string): string {
  return text
    .replace(EMOJI, '')
    .replace(/\s+[—–]\s+/g, ', ')
    .replace(/[—–]/g, '-')
    .replace(/,\s*,/g, ',')
    .replace(/[ \t]+([,.:;!?])/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/^[ \t]+/gm, '')
    .trim();
}

const EXPERIENCE_CLAIM =
  /\b(?:I|we)(?:'ve| have)?\s+(?:just\s+)?(?:tested|tried|built|used|ran|run|shipped|designed|measured|audited|interviewed)\b/gi;

/**
 * First-person experience claims in a draft, e.g. "I tested", "we've built".
 * The prompt forbids them; the Social tab shows any that slip through so the
 * reviewer either backs the claim or deletes it.
 */
export function findExperienceClaims(text: string): string[] {
  return Array.from(new Set((text.match(EXPERIENCE_CLAIM) ?? []).map((m) => m.replace(/\s+/g, ' '))));
}
