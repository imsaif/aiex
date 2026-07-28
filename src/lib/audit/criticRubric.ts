/**
 * The single definition of "what a good audit finding is". Embedded by BOTH:
 *  - the offline eval judge (tests/audit-evals/judge.ts) — holistic 0-5 axis scores
 *  - the runtime verification critic (src/lib/audit/critic.ts) — per-finding verdicts
 * Keep this the one source of truth so the live loop and the eval stay aligned.
 */
export const AUDIT_QUALITY_RUBRIC = `A high-quality AI UX audit finding satisfies all of:

1. FAITHFULNESS — the finding's \`evidence\` quotes or describes a UI element that is ACTUALLY present in the screenshot. Made-up elements are the worst failure.
2. SPECIFICITY — the \`finding\` references concrete visible UI ("the input box at the bottom has no token counter"), not a generic pattern restatement ("the chat lacks confidence visualization").
3. PATTERN FIT — the pattern genuinely applies to the surface shown (no agentic patterns on a chat surface, no error-recovery on a settings page).
4. ACTIONABILITY — the \`recommendation\` is a concrete fix a designer can ship this week, not a definition of the pattern.
5. NO FABRICATION — no finding claims a control is missing when it is visible (small icons under a message, hover states, sidebar items all count as present). False-absence is the single most damaging failure for this audit.`;
