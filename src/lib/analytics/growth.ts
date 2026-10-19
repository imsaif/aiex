import { CHANNELS, CHANNEL_LABELS, type Channel } from './visit-source';

// Pure calculations behind the admin Growth page, kept apart from the queries
// so they can be tested without a database.

export const SKILL_PACK_EVENTS = ['skill_pack_downloaded', 'skills_gate_pack_downloaded'];
export const AUDIT_DONE_EVENT = 'audit_session_completed';

/** Below these, a single signup reorders the table, so no channel is named. */
export const FOCUS_MIN_SIGNUPS = 5;
export const FOCUS_MIN_VISITORS = 100;

/** Clicks this soon after sending are corporate link scanners, not readers. */
export const SCANNER_CLICK_SECONDS = 15;

export interface EventRow {
  name: string;
  properties: unknown;
}

interface Props {
  channel?: string;
  ref?: string | null;
  vid?: string | null;
}

function props(row: EventRow): Props {
  return row.properties && typeof row.properties === 'object' ? (row.properties as Props) : {};
}

function channelOf(row: EventRow): Channel {
  const c = props(row).channel;
  return c && (CHANNELS as readonly string[]).includes(c) ? (c as Channel) : 'direct';
}

export interface ChannelRow {
  channel: Channel;
  label: string;
  visitors: number;
  signups: number;
  skillPacks: number;
  audits: number;
  /** Signups per 100 visitors, or null when there are no visitors to divide by. */
  signupsPer100: number | null;
  /** Distinct tagged posts (utm_campaign) that brought visitors from this channel. */
  posts: number;
  /** Signups per tagged post: the return on your time. Null with no tagged posts. */
  signupsPerPost: number | null;
}

/**
 * One row per channel that has any activity, ranked by signups (then visitors).
 * Visitors are distinct anonymous ids from page_viewed, not page views.
 */
export function buildChannelTable(pageViews: EventRow[], conversions: EventRow[]): ChannelRow[] {
  const visitors = new Map<Channel, Set<string>>();
  const posts = new Map<Channel, Set<string>>();
  for (const row of pageViews) {
    const vid = props(row).vid;
    if (!vid) continue;
    const ch = channelOf(row);
    if (!visitors.has(ch)) visitors.set(ch, new Set());
    visitors.get(ch)!.add(vid);
    const ref = props(row).ref;
    if (ref && ch !== 'newsletter') {
      if (!posts.has(ch)) posts.set(ch, new Set());
      posts.get(ch)!.add(ref);
    }
  }

  const rows = new Map<Channel, ChannelRow>();
  const get = (ch: Channel) => {
    if (!rows.has(ch)) {
      rows.set(ch, { channel: ch, label: CHANNEL_LABELS[ch], visitors: visitors.get(ch)?.size ?? 0, signups: 0, skillPacks: 0, audits: 0, signupsPer100: null, posts: posts.get(ch)?.size ?? 0, signupsPerPost: null });
    }
    return rows.get(ch)!;
  };
  Array.from(visitors.keys()).forEach(get);
  for (const row of conversions) {
    // Events logged before visit tracking began carry no channel. They still
    // count in the headline numbers, but filing them under Direct would invent
    // a source for them.
    if (!props(row).channel) continue;
    const r = get(channelOf(row));
    if (row.name === 'newsletter_subscribed') r.signups++;
    else if (SKILL_PACK_EVENTS.includes(row.name)) r.skillPacks++;
    else if (row.name === AUDIT_DONE_EVENT) r.audits++;
  }

  return Array.from(rows.values())
    .map((r) => ({
      ...r,
      signupsPer100: r.visitors > 0 ? Math.round((r.signups / r.visitors) * 1000) / 10 : null,
      // Counts every signup from the channel, tagged or not, against the
      // tagged posts: untagged visits are usually your own bio or profile links.
      signupsPerPost: r.posts > 0 ? Math.round((r.signups / r.posts) * 10) / 10 : null,
    }))
    .sort((a, b) => b.signups - a.signups || b.visitors - a.visitors);
}

export interface Focus {
  ready: boolean;
  text: string;
}

/** The one-line answer at the top of the page. Says nothing until the data can bear it. */
export function pickFocus(table: ChannelRow[]): Focus {
  const eligible = table.filter(
    (r) => r.signups >= FOCUS_MIN_SIGNUPS && r.visitors >= FOCUS_MIN_VISITORS && r.signupsPer100 !== null,
  );
  if (eligible.length === 0) {
    const tracked = table.reduce((n, r) => n + r.signups, 0);
    return {
      ready: false,
      text: `Not enough data yet. ${tracked} signup${tracked === 1 ? '' : 's'} tracked by source so far; a channel needs ${FOCUS_MIN_SIGNUPS} before it can be compared.`,
    };
  }
  const best = [...eligible].sort((a, b) => (b.signupsPer100 ?? 0) - (a.signupsPer100 ?? 0))[0];
  const biggest = [...table].sort((a, b) => b.visitors - a.visitors)[0];
  const contrast =
    biggest && biggest.channel !== best.channel ? `, against ${biggest.signupsPer100 ?? 0} from ${biggest.label}, your biggest source` : '';
  return {
    ready: true,
    text: `${best.label} turns visitors into subscribers best: ${best.signupsPer100} signups per 100 visitors${contrast}.`,
  };
}

export interface PostRow {
  ref: string;
  channel: Channel;
  visitors: number;
  signups: number;
}

/** Tagged social links (utm_campaign), one row per tag, most visitors first. Newsletter links excluded. */
export function buildPostTable(pageViews: EventRow[], signups: EventRow[]): PostRow[] {
  const byRef = new Map<string, { channel: Channel; vids: Set<string>; signups: number }>();
  for (const row of pageViews) {
    const { ref, vid } = props(row);
    // Newsletter links carry the issue's own tags; they are not posts.
    if (!ref || !vid || channelOf(row) === 'newsletter') continue;
    if (!byRef.has(ref)) byRef.set(ref, { channel: channelOf(row), vids: new Set(), signups: 0 });
    byRef.get(ref)!.vids.add(vid);
  }
  for (const row of signups) {
    const ref = props(row).ref;
    if (ref && byRef.has(ref)) byRef.get(ref)!.signups++;
  }
  return Array.from(byRef.entries())
    .map(([ref, v]) => ({ ref, channel: v.channel, visitors: v.vids.size, signups: v.signups }))
    .sort((a, b) => b.visitors - a.visitors);
}

export interface EmailClickStats {
  delivered: number;
  clickers: number;
  rate: number | null;
}

/** Unique readers who clicked a real link, over unique recipients delivered to. */
export function emailClickStats(events: EventRow[]): EmailClickStats {
  const delivered = new Set<string>();
  const clickers = new Set<string>();
  for (const row of events) {
    const p = row.properties as { recipient?: string; secondsAfterSend?: number } | null;
    if (!p?.recipient) continue;
    if (row.name === 'email_delivered') delivered.add(p.recipient);
    if (row.name === 'email_clicked') {
      if (typeof p.secondsAfterSend === 'number' && p.secondsAfterSend < SCANNER_CLICK_SECONDS) continue;
      clickers.add(p.recipient);
    }
  }
  return {
    delivered: delivered.size,
    clickers: clickers.size,
    rate: delivered.size > 0 ? Math.round((clickers.size / delivered.size) * 1000) / 10 : null,
  };
}

// Signup forms grouped the way they read on the site. Anything unlisted shows
// under its raw name, so a new form is visible rather than silently lumped in.
const FORM_GROUPS: Array<[string, string[]]> = [
  ['Courses', ['guides', 'guides-hero']],
  ['News issues', ['news']],
  ['Skill packs', ['pattern-skills-pack', 'homepage-skills-pack', 'newsletter-skills-pack', 'skills-hero']],
  ['Handbook', ['handbook']],
  ['Pattern pages', ['patterns', 'patterns-hero', 'patterns-grid']],
  ['Audit', ['audit', 'audit-report', 'audit-kit', 'audit-unlock', 'audit-waitlist']],
  ['Homepage', ['homepage-hero', 'homepage-hero-pre-audit', 'direct']],
  ['Checklists', ['agentic-checklist', 'accessibility-checklist', 'toolkit']],
  ['Site footer', ['footer']],
  ['beehiiv (recommendations)', ['beehiiv']],
];

export const FORM_NOT_RECORDED = 'Not recorded';

export function formLabel(source: string | null): string {
  if (!source) return FORM_NOT_RECORDED;
  const group = FORM_GROUPS.find(([, sources]) => sources.includes(source));
  return group ? group[0] : source;
}

export interface FormRow {
  label: string;
  joined: number;
  stillSubscribed: number;
}

interface SourceCount {
  source: string | null;
  count: number;
}

/** Signups per form, most first, with "Not recorded" always last. */
export function buildFormTable(joined: SourceCount[], active: SourceCount[]): FormRow[] {
  const rows = new Map<string, FormRow>();
  const get = (label: string) => {
    if (!rows.has(label)) rows.set(label, { label, joined: 0, stillSubscribed: 0 });
    return rows.get(label)!;
  };
  joined.forEach((j) => (get(formLabel(j.source)).joined += j.count));
  active.forEach((a) => (get(formLabel(a.source)).stillSubscribed += a.count));
  return Array.from(rows.values()).sort((a, b) => {
    if (a.label === FORM_NOT_RECORDED) return 1;
    if (b.label === FORM_NOT_RECORDED) return -1;
    return b.joined - a.joined;
  });
}

export interface DeviceRow {
  device: 'phone' | 'tablet' | 'desktop';
  label: string;
  readers: number;
  share: number;
}

const DEVICE_LABELS = { phone: 'Phone', tablet: 'Tablet', desktop: 'Desktop' } as const;

/**
 * Newsletter readers by device: unique recipients who clicked from each device,
 * scanner clicks left out. Someone who clicked from both counts once on each.
 * Shares are of readers with a known device.
 */
export function emailDeviceStats(events: EventRow[]): DeviceRow[] {
  const sets = { phone: new Set<string>(), tablet: new Set<string>(), desktop: new Set<string>() };
  for (const row of events) {
    if (row.name !== 'email_clicked') continue;
    const p = row.properties as { recipient?: string; secondsAfterSend?: number; device?: string } | null;
    if (!p?.recipient || !p.device || !(p.device in sets)) continue;
    if (typeof p.secondsAfterSend === 'number' && p.secondsAfterSend < SCANNER_CLICK_SECONDS) continue;
    sets[p.device as keyof typeof sets].add(p.recipient);
  }
  const total = sets.phone.size + sets.tablet.size + sets.desktop.size;
  return (['phone', 'desktop', 'tablet'] as const)
    .map((device) => ({
      device,
      label: DEVICE_LABELS[device],
      readers: sets[device].size,
      share: total > 0 ? Math.round((sets[device].size / total) * 100) : 0,
    }))
    .filter((r) => r.device !== 'tablet' || r.readers > 0);
}
