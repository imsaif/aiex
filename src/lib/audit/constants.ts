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
