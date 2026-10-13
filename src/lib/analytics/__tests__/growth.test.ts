import { classifyVisit, decodeVisit, encodeVisit } from '../visit-source';
import { isSyntheticUserAgent } from '../bots';
import { buildChannelTable, buildFormTable, buildPostTable, emailClickStats, formLabel, pickFocus } from '../growth';
import { toEmailEventRow } from '../email-events';

const HOST = 'www.aiuxdesign.guide';

describe('classifyVisit', () => {
  it('reads common referrers', () => {
    expect(classifyVisit('https://www.google.com/', '', HOST)).toEqual({ channel: 'search', ref: null });
    expect(classifyVisit('https://www.linkedin.com/feed/', '', HOST)?.channel).toBe('linkedin');
    expect(classifyVisit('https://lnkd.in/abc', '', HOST)?.channel).toBe('linkedin');
    expect(classifyVisit('https://t.co/xyz', '', HOST)?.channel).toBe('x');
    expect(classifyVisit('https://old.reddit.com/r/UXDesign', '', HOST)?.channel).toBe('reddit');
    expect(classifyVisit('https://l.instagram.com/', '', HOST)?.channel).toBe('instagram');
    expect(classifyVisit('https://chatgpt.com/', '', HOST)?.channel).toBe('ai');
    expect(classifyVisit('https://news.ycombinator.com/', '', HOST)?.channel).toBe('other');
  });

  it('treats Gemini as an AI assistant, not search', () => {
    expect(classifyVisit('https://gemini.google.com/app', '', HOST)?.channel).toBe('ai');
  });

  it('lets a utm tag win over the referrer, and keeps the post name', () => {
    expect(classifyVisit('', '?utm_source=linkedin&utm_campaign=agent-oversight', HOST)).toEqual({
      channel: 'linkedin',
      ref: 'agent-oversight',
    });
    expect(classifyVisit('https://www.google.com/', '?utm_source=newsletter&utm_medium=email', HOST)?.channel).toBe('newsletter');
  });

  it('returns null for an internal click so the visit keeps its source', () => {
    expect(classifyVisit('https://www.aiuxdesign.guide/patterns', '', HOST)).toBeNull();
    expect(classifyVisit('https://aiuxdesign.guide/', '', HOST)).toBeNull();
  });

  it('ignores a newsletter tag on a link clicked from inside the site', () => {
    expect(classifyVisit('https://www.aiuxdesign.guide/news/ai-ux-daily-oct-13', '?utm_source=newsletter&utm_medium=email', HOST)).toBeNull();
  });

  it('calls a bare arrival direct', () => {
    expect(classifyVisit('', '', HOST)).toEqual({ channel: 'direct', ref: null });
  });

  it('round-trips through the cookie and rejects junk', () => {
    const v = { channel: 'reddit' as const, ref: 'my post' };
    expect(decodeVisit(encodeVisit(v))).toEqual(v);
    expect(decodeVisit('nonsense|x')).toBeNull();
    expect(decodeVisit(undefined)).toBeNull();
  });
});

describe('isSyntheticUserAgent', () => {
  it('catches the speed tests, old and new', () => {
    expect(isSyntheticUserAgent('Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 Chrome/136 Mobile Safari/537.36')).toBe(true);
    expect(isSyntheticUserAgent('... Mobile Safari/537.36 aiux-speedtest')).toBe(true);
    expect(isSyntheticUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true);
  });

  it('lets real browsers through', () => {
    expect(isSyntheticUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15')).toBe(false);
    expect(isSyntheticUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) Mobile/15E148')).toBe(false);
    expect(isSyntheticUserAgent(null)).toBe(false);
  });
});

const view = (channel: string, vid: string, ref: string | null = null) => ({ name: 'page_viewed', properties: { channel, vid, ref } });
const signup = (channel: string, ref: string | null = null) => ({ name: 'newsletter_subscribed', properties: { channel, ref } });

describe('buildChannelTable', () => {
  it('counts visitors once however many pages they read, and ranks by signups', () => {
    const views = [view('linkedin', 'a'), view('linkedin', 'a'), view('linkedin', 'b'), view('search', 'c'), view('search', 'd'), view('search', 'e')];
    const conv = [signup('linkedin'), signup('linkedin'), signup('search'), { name: 'skill_pack_downloaded', properties: { channel: 'search' } }];
    const t = buildChannelTable(views, conv);
    expect(t.map((r) => r.channel)).toEqual(['linkedin', 'search']);
    expect(t[0]).toMatchObject({ visitors: 2, signups: 2, signupsPer100: 100 });
    expect(t[1]).toMatchObject({ visitors: 3, signups: 1, skillPacks: 1, signupsPer100: 33.3 });
  });

  it('leaves out events logged before tracking began, rather than calling them direct', () => {
    expect(buildChannelTable([], [{ name: 'skill_pack_downloaded', properties: { count: 3 } }])).toEqual([]);
    const t = buildChannelTable([], [signup('direct')]);
    expect(t[0]).toMatchObject({ channel: 'direct', signups: 1, visitors: 0, signupsPer100: null });
  });
});

describe('pickFocus', () => {
  it('names nothing until a channel has enough signups', () => {
    const t = buildChannelTable([view('linkedin', 'a')], [signup('linkedin')]);
    const f = pickFocus(t);
    expect(f.ready).toBe(false);
    expect(f.text).toMatch(/Not enough data yet\. 1 signup tracked/);
  });

  it('names the best converting channel once the data can bear it', () => {
    const views = [
      ...Array.from({ length: 400 }, (_, i) => view('search', `s${i}`)),
      ...Array.from({ length: 120 }, (_, i) => view('linkedin', `l${i}`)),
    ];
    const conv = [...Array.from({ length: 6 }, () => signup('search')), ...Array.from({ length: 6 }, () => signup('linkedin'))];
    const f = pickFocus(buildChannelTable(views, conv));
    expect(f.ready).toBe(true);
    expect(f.text).toBe('LinkedIn turns visitors into subscribers best: 5 signups per 100 visitors, against 1.5 from Google and search, your biggest source.');
  });
});

describe('buildPostTable', () => {
  it('groups tagged visits and signups by post', () => {
    const rows = buildPostTable([view('linkedin', 'a', 'weekly'), view('linkedin', 'b', 'weekly'), view('x', 'c', 'states')], [signup('linkedin', 'weekly')]);
    expect(rows).toEqual([
      { ref: 'weekly', channel: 'linkedin', visitors: 2, signups: 1 },
      { ref: 'states', channel: 'x', visitors: 1, signups: 0 },
    ]);
  });
});

describe('email events', () => {
  const base = { data: { broadcast_id: 'b1', email_id: 'e1', to: ['Reader@Example.com'], subject: 'AI UX Daily', created_at: '2026-10-14T03:30:00.000Z' } };

  it('stores a hash, never the address', () => {
    const row = toEmailEventRow({ type: 'email.delivered', ...base });
    expect(row?.name).toBe('email_delivered');
    expect(row?.sessionId).toBe('b1');
    expect(JSON.stringify(row)).not.toMatch(/example\.com/i);
  });

  it('drops unsubscribe clicks and opens, and times other clicks', () => {
    const click = (link: string, ts: string) => toEmailEventRow({ type: 'email.clicked', data: { ...base.data, click: { link, timestamp: ts } } });
    expect(click('https://aiuxdesign.guide/unsubscribe?t=1', '2026-10-14T05:00:00.000Z')).toBeNull();
    expect(click('https://www.aiuxdesign.guide/news', '2026-10-14T03:30:04.000Z')?.properties.secondsAfterSend).toBe(4);
    expect(toEmailEventRow({ type: 'email.opened', ...base })).toBeNull();
  });

  it('counts unique clickers and ignores link scanners', () => {
    const ev = (name: string, recipient: string, secondsAfterSend?: number) => ({ name, properties: { recipient, secondsAfterSend } });
    const stats = emailClickStats([
      ev('email_delivered', 'r1'), ev('email_delivered', 'r2'), ev('email_delivered', 'r3'), ev('email_delivered', 'r4'),
      ev('email_clicked', 'r1', 600), ev('email_clicked', 'r1', 900), ev('email_clicked', 'r2', 3),
    ]);
    expect(stats).toEqual({ delivered: 4, clickers: 1, rate: 25 });
  });
});

describe('buildFormTable', () => {
  it('groups forms the way they read on the site, unrecorded last', () => {
    const rows = buildFormTable(
      [
        { source: null, count: 9 },
        { source: 'guides', count: 7 },
        { source: 'guides-hero', count: 2 },
        { source: 'news', count: 8 },
        { source: 'pattern-skills-pack', count: 3 },
        { source: 'homepage-skills-pack', count: 2 },
      ],
      [
        { source: 'guides', count: 6 },
        { source: 'news', count: 7 },
      ],
    );
    expect(rows.map((r) => [r.label, r.joined, r.stillSubscribed])).toEqual([
      ['Courses', 9, 6],
      ['News issues', 8, 7],
      ['Skill packs', 5, 0],
      ['Not recorded', 9, 0],
    ]);
  });

  it('shows an unknown form under its own name', () => {
    expect(formLabel('brand-new-form')).toBe('brand-new-form');
    expect(formLabel('audit-report')).toBe('Audit');
    expect(formLabel('beehiiv')).toBe('beehiiv (recommendations)');
  });
});
