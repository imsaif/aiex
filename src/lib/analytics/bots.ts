// User agents that load pages but are not people. Checked where beacons
// arrive (/api/events, /api/vitals), because a client-side check only covers
// the code paths that remember to call it.
//
// "moto g power (2022)" is Lighthouse's default mobile emulation, and current
// Lighthouse no longer adds "Chrome-Lighthouse" to it. The nightly speed tests
// load eight production URLs three times each in that guise, and in the four
// weeks to 2026-10-13 they made up about 2,900 of 11,150 recorded page loads
// and 171 of 688 audit_demo_viewed events. lighthouserc.json now appends an
// "aiux-speedtest" token; the device string stays here for older rows and for
// PageSpeed Insights runs by anyone else. The cost is the rare real visitor on
// that exact phone.
const SYNTHETIC_UA =
  /Chrome-Lighthouse|aiux-speedtest|HeadlessChrome|PhantomJS|Puppeteer|Playwright|moto g power \(2022\)|bot\b|crawler|spider|Google-InspectionTool|Google-Read-Aloud|facebookexternalhit|Slackbot|vercel-screenshot/i;

export function isSyntheticUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return false;
  return SYNTHETIC_UA.test(ua);
}

/** Prisma filter fragment for historical rows: same rule, as SQL-able substrings. */
export const SYNTHETIC_UA_SUBSTRINGS = [
  'Chrome-Lighthouse',
  'aiux-speedtest',
  'HeadlessChrome',
  'moto g power (2022)',
  'bot',
  'crawler',
  'spider',
];
