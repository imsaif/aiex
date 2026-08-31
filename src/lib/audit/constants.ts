// Master switch for the client-side audit gate. OFF since 2026-08-31.
//
// Turned off on evidence, not preference. The gate fired after a SINGLE audit
// and did not overlay the page — it REPLACED the homepage's primary "Get your
// skills" CTA with an email-capture form, so a returning visitor who had run
// one audit arrived to find the main action missing. In the 30 days to
// 2026-08-31 that hit 18 people (roughly a third of everyone who engaged that
// month) and `audit_unlock_submitted` has NEVER been recorded — not a low
// conversion rate, zero rows all-time, against 40 impressions and 4 dismissals.
// It also contradicted the standing rule to hold off gating until 50+ sessions.
//
// While this is false, `needsUnlock` and `atFinalCap` are forced false in
// useAuditCount, so nothing downstream has to know the gate exists. The costs
// stay bounded by the server-side net (RATE_LIMITS.ANALYSES_PER_DAY = 10 per IP
// per day), which was always the real ceiling. Flip back to true when there is
// enough volume for gating to be worth measuring.
export const PAYWALL_ENABLED = false;

export const FREE_AUDIT_LIMIT: number = 1;
export const UNLOCKED_AUDIT_LIMIT: number = 4;

// The canonical path for "I want to audit my design" intent. Every surface that
// sends an already-decided reader to the tool should import this rather than
// hardcode its own copy of the string.
//
// This exists because of a real drift. `cca5ec3` (2026-08-01) moved the canonical
// tool URL from `/` to `/audit` and updated the homepage and both pattern-page
// CTAs, but the newsletter generator kept its OWN hardcoded copy in `auditUrl()`
// and silently kept sending readers to `/`. That went unnoticed for nine days and
// was only caught by reading a beehiiv click report, because a stale-but-valid
// URL fails silently: nothing 404s, the reader just lands on the marketing demo
// step instead of the upload screen (~80% drop, per Clarity).
//
// Note this is a PATH, not a full URL. The newsletter prefixes SITE_URL because
// email needs absolute links; in-app callers use it as-is with next/link.
export const AUDIT_PATH = '/audit';
