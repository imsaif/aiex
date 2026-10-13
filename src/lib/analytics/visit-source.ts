// Where a visit came from, worked out once on the landing page load and then
// carried on every event of that visit (see PageViewTracker). In the App Router
// `document.referrer` keeps its original value across in-app navigation and the
// utm params vanish after the first route change, so re-reading them per page
// view would turn one LinkedIn reader of five pages into five arrivals.

export const CHANNELS = [
  'search',
  'linkedin',
  'x',
  'reddit',
  'instagram',
  'newsletter',
  'ai',
  'other',
  'direct',
] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABELS: Record<Channel, string> = {
  search: 'Google and search',
  linkedin: 'LinkedIn',
  x: 'X',
  reddit: 'Reddit',
  instagram: 'Instagram',
  newsletter: 'Newsletter',
  ai: 'AI assistants',
  other: 'Other sites',
  direct: 'Direct',
};

export interface VisitSource {
  channel: Channel;
  /** The post or campaign tag (utm_campaign), when the link carried one. */
  ref: string | null;
}

// The session cookie the server reads to attribute a signup to its visit.
export const VISIT_COOKIE = 'aiux_visit';

// First match wins: AI assistants come first because gemini.google.com would
// otherwise read as a search engine.
const HOST_CHANNELS: Array<[RegExp, Channel]> = [
  [/(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com)$/, 'ai'],
  [/(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|yandex|baidu)\./, 'search'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin'],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, 'x'],
  [/(^|\.)(reddit\.com|redd\.it)$/, 'reddit'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)(mail\.google\.com|outlook\.live\.com|outlook\.office\.com|beehiiv\.com|links\.aiuxdesign\.guide)$/, 'newsletter'],
];

const SOURCE_PARAM_CHANNELS: Record<string, Channel> = {
  newsletter: 'newsletter',
  email: 'newsletter',
  beehiiv: 'newsletter',
  linkedin: 'linkedin',
  li: 'linkedin',
  x: 'x',
  twitter: 'x',
  reddit: 'reddit',
  instagram: 'instagram',
  ig: 'instagram',
  google: 'search',
  chatgpt: 'ai',
  'chatgpt.com': 'ai',
  perplexity: 'ai',
};

const REF_MAX = 60;

function hostChannel(host: string): Channel | null {
  for (const [re, channel] of HOST_CHANNELS) if (re.test(host)) return channel;
  return null;
}

/**
 * Classify a landing load. An explicit utm_source wins over the referrer,
 * because LinkedIn and email clients often strip the referrer entirely.
 * Returns null for an internal arrival (same-site referrer), which means
 * "keep whatever this visit already had".
 */
export function classifyVisit(
  referrer: string,
  search: string,
  siteHost: string,
): VisitSource | null {
  let refHost = '';
  try {
    refHost = referrer ? new URL(referrer).host.toLowerCase().replace(/^www\./, '') : '';
  } catch {
    refHost = '';
  }
  const ownHost = siteHost.toLowerCase().replace(/^www\./, '');
  // A click from inside the site never changes the visit's source, even when
  // the link carries a tag: 126 stored /news issues link back here with
  // utm_source=newsletter, which would relabel every website reader.
  if (refHost && refHost === ownHost) return null;

  const params = new URLSearchParams(search);
  const rawRef = params.get('utm_campaign') || params.get('ref');
  const ref = rawRef ? rawRef.trim().slice(0, REF_MAX) || null : null;
  const utm = (params.get('utm_source') || '').trim().toLowerCase();

  if (utm) {
    const channel = SOURCE_PARAM_CHANNELS[utm] ?? hostChannel(utm) ?? 'other';
    return { channel, ref };
  }
  if (!refHost) return { channel: 'direct', ref };
  return { channel: hostChannel(refHost) ?? 'other', ref };
}

export function encodeVisit(v: VisitSource): string {
  return encodeURIComponent(`${v.channel}|${v.ref ?? ''}`);
}

export function decodeVisit(raw: string | undefined | null): VisitSource | null {
  if (!raw) return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  const [channel, ref] = decoded.split('|');
  if (!(CHANNELS as readonly string[]).includes(channel)) return null;
  return { channel: channel as Channel, ref: ref ? ref.slice(0, REF_MAX) : null };
}
