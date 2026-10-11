import type { Resend } from 'resend';
import { syncSegment, tagSiteLinks, wrapEmail, wantsDaily, UNSUBSCRIBE_PLACEHOLDER, type LocalSubscriber } from '../resend-send';

jest.setTimeout(20000);

describe('tagSiteLinks', () => {
  const site = 'https://www.aiuxdesign.guide';

  it('tags links to our own site', () => {
    const out = tagSiteLinks('<a href="https://www.aiuxdesign.guide/poll/oct-10?c=yes">', site, 'oct-10');
    expect(out).toContain('href="https://www.aiuxdesign.guide/poll/oct-10?c=yes&amp;utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=oct-10"');
  });

  it('leaves third-party links and already-tagged links alone', () => {
    const third = '<a href="https://abcnews.com/story?id=1">';
    const tagged = '<a href="https://www.aiuxdesign.guide/audit?utm_source=newsletter&amp;utm_campaign=x">';
    expect(tagSiteLinks(third, site, 'c')).toBe(third);
    expect(tagSiteLinks(tagged, site, 'c')).toBe(tagged);
  });
});

describe('wrapEmail', () => {
  const html = wrapEmail({
    content: '<style>.a{color:red}</style><div class="a">Issue</div>',
    siteUrl: 'https://www.aiuxdesign.guide',
    campaign: 'oct-10',
    postalAddress: 'PO Box 1 <Hyderabad>',
    unsubscribeUrl: UNSUBSCRIBE_PLACEHOLDER,
  });

  it('moves style blocks into the head', () => {
    expect(html.indexOf('<style>')).toBeLessThan(html.indexOf('</head>'));
    expect(html.split('<body')[1]).not.toContain('<style');
  });

  it('adds the unsubscribe link and the escaped postal address', () => {
    expect(html).toContain(`href="${UNSUBSCRIBE_PLACEHOLDER}"`);
    expect(html).toContain('PO Box 1 &lt;Hyderabad&gt;');
  });
});

describe('wantsDaily', () => {
  it('is active subscribers on the "all" frequency only', () => {
    expect(wantsDaily({ email: 'a', active: true, emailFrequency: 'all' })).toBe(true);
    expect(wantsDaily({ email: 'a', active: true, emailFrequency: 'weekly' })).toBe(false);
    expect(wantsDaily({ email: 'a', active: false, emailFrequency: 'all' })).toBe(false);
  });
});

// A fake Resend holding contacts and one segment's membership.
function fakeResend(contacts: { email: string; unsubscribed: boolean }[], members: string[]) {
  const all = contacts.map((c, i) => ({ id: `c${i}`, created_at: '', first_name: null, last_name: null, ...c }));
  const inSeg = new Set(members);
  const calls: string[] = [];
  const page = <T,>(data: T[]) => ({ data: { object: 'list', data, has_more: false }, error: null });
  const resend = {
    segments: { list: async () => ({ data: { data: [{ id: 'seg', name: 'AI UX Daily', created_at: '' }] }, error: null }) },
    contacts: {
      list: async (o: { segmentId?: string }) => page(o.segmentId ? all.filter((c) => inSeg.has(c.email)) : all),
      create: async (o: { email: string }) => { calls.push(`create ${o.email}`); all.push({ id: `n-${o.email}`, created_at: '', first_name: null, last_name: null, email: o.email, unsubscribed: false }); return { data: { id: 'x' }, error: null }; },
      segments: {
        add: async (o: { email: string }) => { calls.push(`add ${o.email}`); inSeg.add(o.email); return { data: { id: 'x' }, error: null }; },
        remove: async (o: { contactId: string }) => { const c = all.find((x) => x.id === o.contactId)!; calls.push(`remove ${c.email}`); inSeg.delete(c.email); return { data: { id: 'x', deleted: true }, error: null }; },
      },
    },
  };
  return { resend: resend as unknown as Resend, calls };
}

describe('syncSegment', () => {
  const local: LocalSubscriber[] = [
    { email: 'new@x.com', active: true, emailFrequency: 'all' },
    { email: 'left@x.com', active: true, emailFrequency: 'all' },
    { email: 'gone@x.com', active: false, emailFrequency: 'all' },
    { email: 'stays@x.com', active: true, emailFrequency: 'all' },
  ];

  it('mirrors Resend unsubscribes back and never re-adds them', async () => {
    const { resend, calls } = fakeResend(
      [{ email: 'left@x.com', unsubscribed: true }, { email: 'gone@x.com', unsubscribed: false }, { email: 'stays@x.com', unsubscribed: false }],
      ['left@x.com', 'gone@x.com', 'stays@x.com'],
    );
    const mirrored: string[] = [];
    const result = await syncSegment(resend, local.map((s) => ({ ...s })), async (emails) => { mirrored.push(...emails); });

    expect(mirrored).toEqual(['left@x.com']);
    expect([...calls].sort()).toEqual(['add new@x.com', 'create new@x.com', 'remove gone@x.com', 'remove left@x.com']);
    expect(calls.join(' ')).not.toMatch(/add left@x\.com/);
    expect(result.added).toBe(1);
  });

  it('writes nothing on a dry run', async () => {
    const { resend, calls } = fakeResend([], []);
    const result = await syncSegment(resend, local.map((s) => ({ ...s })), async () => { throw new Error('must not mirror'); }, { dryRun: true });
    expect(calls).toEqual([]);
    expect(result.added).toBe(3);
  });

  it('refuses a sync bigger than the write budget', async () => {
    const { resend, calls } = fakeResend([], []);
    await expect(syncSegment(resend, local.map((s) => ({ ...s })), async () => undefined, { maxWrites: 2 })).rejects.toThrow(/import-resend-contacts/);
    expect(calls).toEqual([]);
  });
});
