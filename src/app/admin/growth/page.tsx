import { Metadata } from 'next';
import Link from 'next/link';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getGrowthData } from '@/lib/analytics/growth-data';
import { CHANNEL_LABELS } from '@/lib/analytics/visit-source';
import { FORM_NOT_RECORDED } from '@/lib/analytics/growth';
import LinkTagger from './link-tagger';

export const metadata: Metadata = {
  title: 'Growth | Admin | AI UX Design',
  description: 'Where visitors come from and what turns them into subscribers',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

const fmt = (n: number) => n.toLocaleString('en-US');
const day = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`bg-surface-primary border border-border-primary rounded-card p-loose ${className}`}>{children}</section>;
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Card>
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="mt-tight text-3xl font-bold text-text-primary">{value}</p>
      <p className="mt-tight text-sm text-text-secondary">{note}</p>
    </Card>
  );
}

export default async function GrowthPage() {
  if (!(await checkAdminAuth())) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-text-secondary">
        Log in from <Link className="text-accent-primary underline" href="/admin/newsletter">Newsletter</Link> first.
      </div>
    );
  }

  const d = await getGrowthData();
  const lastWeek = d.weeks[3].loads;
  const prevWeek = d.weeks[2].loads;
  const maxLoads = Math.max(1, ...d.weeks.map((w) => w.loads));
  const maxForm = Math.max(1, ...d.byForm.map((f) => f.joined));
  const formTotal = d.byForm.reduce((n, f) => n + f.joined, 0);
  const topForm = d.byForm.find((f) => f.label !== FORM_NOT_RECORDED);
  // Until channels have enough signups to compare, the best form is the
  // most useful thing to say: it is real data from the subscriber list.
  const headline =
    d.focus.ready || !topForm
      ? d.focus.text
      : `Most signups came from ${topForm.label}: ${topForm.joined} of ${formTotal} in the last 4 weeks. Channels get compared once each has 5 signups.`;
  const trackingDays = d.trackingSince ? Math.max(1, Math.round((Date.now() - d.trackingSince.getTime()) / 86_400_000)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-loose">
        <h1 className="text-3xl font-bold text-text-primary">Growth</h1>
        <p className="mt-1 text-text-secondary">Last 4 weeks · real visitors only (speed tests, crawlers and your own visits are left out)</p>
      </header>

      <section className="mb-default rounded-card bg-accent-primary p-loose text-white">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Where your time pays off</p>
        <p className="mt-tight text-xl font-semibold">{headline}</p>
      </section>

      <div className="mb-default grid grid-cols-1 gap-default sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Page loads" value={fmt(lastWeek)} note={`Last 7 days · ${fmt(prevWeek)} the week before`} />
        <Stat
          label="New subscribers"
          value={`${d.subscribers.joined - d.subscribers.left >= 0 ? '+' : ''}${d.subscribers.joined - d.subscribers.left}`}
          note={`${d.subscribers.joined} joined, ${d.subscribers.left} left · ${fmt(d.subscribers.active)} total`}
        />
        <Stat
          label="Newsletter clicks"
          value={d.email.rate === null ? 'n/a' : `${d.email.rate}%`}
          note={d.email.rate === null ? 'Shows a day after the next send' : `${d.email.clickers} of ${d.email.delivered} readers clicked, newest issue over a day old`}
        />
        <Stat label="Skill packs" value={fmt(d.skillPacks)} note="Downloaded, last 4 weeks" />
        <Stat label="Audits finished" value={fmt(d.auditsFinished)} note="Last 4 weeks" />
      </div>

      <Card className="mb-default">
        <div className="flex flex-wrap items-baseline justify-between gap-tight">
          <h2 className="text-lg font-bold text-text-primary">Signups by form</h2>
          <p className="text-sm text-text-secondary">Which part of the site people subscribed from · last 4 weeks</p>
        </div>
        {d.byForm.length === 0 ? (
          <p className="mt-default text-text-secondary">No signups in the last 4 weeks.</p>
        ) : (
          <ul className="mt-default divide-y divide-border-primary text-sm">
            {d.byForm.map((f) => (
              <li key={f.label} className="grid grid-cols-[minmax(0,12rem)_1fr_auto] items-center gap-snug py-tight">
                <span className="font-semibold text-text-primary">{f.label}</span>
                <span className="h-2 rounded-pill bg-background-secondary">
                  <span
                    className="block h-2 rounded-pill bg-accent-primary"
                    style={{ width: `${Math.round((f.joined / maxForm) * 100)}%` }}
                  />
                </span>
                <span className="text-right text-text-secondary">
                  <strong className="text-text-primary">{f.joined}</strong> joined · {f.stillSubscribed} still subscribed
                </span>
              </li>
            ))}
          </ul>
        )}
        {d.byForm.some((f) => f.label === FORM_NOT_RECORDED) && (
          <p className="mt-tight text-sm text-text-secondary">
            Not recorded: audit-report signups and beehiiv-side signups before 13 Oct 2026, when both started saving their form.
          </p>
        )}
      </Card>

      <Card className="mb-default">
        <div className="flex flex-wrap items-baseline justify-between gap-tight">
          <h2 className="text-lg font-bold text-text-primary">Where visitors come from, ranked by signups</h2>
          <p className="text-sm text-text-secondary">
            {d.trackingSince ? `Tracking since ${day(d.trackingSince)} (${trackingDays} day${trackingDays === 1 ? '' : 's'})` : 'Tracking starts with the next visit'}
          </p>
        </div>
        {d.channels.length === 0 ? (
          <p className="mt-default text-text-secondary">No tracked visits yet.</p>
        ) : (
          <div className="mt-default overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-primary text-left text-xs uppercase tracking-wide text-text-secondary">
                  <th className="py-tight font-semibold">Channel</th>
                  <th className="py-tight text-right font-semibold">Visitors</th>
                  <th className="py-tight text-right font-semibold">Signups</th>
                  <th className="py-tight text-right font-semibold">Skill packs</th>
                  <th className="py-tight text-right font-semibold">Audits</th>
                  <th className="py-tight text-right font-semibold">Signups per 100</th>
                  <th className="py-tight text-right font-semibold">Tagged posts</th>
                  <th className="py-tight text-right font-semibold">Signups per post</th>
                </tr>
              </thead>
              <tbody>
                {d.channels.map((c) => (
                  <tr key={c.channel} className="border-b border-border-primary last:border-0">
                    <td className="py-snug font-semibold text-text-primary">{c.label}</td>
                    <td className="py-snug text-right text-text-primary">{fmt(c.visitors)}</td>
                    <td className="py-snug text-right font-bold text-text-primary">{c.signups}</td>
                    <td className="py-snug text-right text-text-primary">{c.skillPacks}</td>
                    <td className="py-snug text-right text-text-primary">{c.audits}</td>
                    <td className="py-snug text-right text-text-primary">{c.signupsPer100 ?? 'n/a'}</td>
                    <td className="py-snug text-right text-text-primary">{c.posts || '-'}</td>
                    <td className="py-snug text-right font-bold text-text-primary">{c.signupsPerPost ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-default lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold text-text-primary">Page loads per week</h2>
          <p className="mt-1 text-sm text-text-secondary">Full page loads; clicks between pages are not in this chart.</p>
          <div className="mt-default flex h-40 items-end gap-default border-b border-border-primary">
            {d.weeks.map((w) => (
              <div key={w.start.toISOString()} className="flex h-full flex-1 flex-col items-center justify-end">
                <span className="mb-1 text-xs font-bold text-text-primary">{fmt(w.loads)}</span>
                <div className="w-full rounded-t bg-accent-primary" style={{ height: `${Math.round((w.loads / maxLoads) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-tight flex gap-default text-xs text-text-secondary">
            {d.weeks.map((w) => (
              <span key={w.start.toISOString()} className="flex-1 text-center">{day(w.start)}</span>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-text-primary">Your posts</h2>
          <p className="mt-1 text-sm text-text-secondary">Visits and signups from links made with the tagger below.</p>
          {d.posts.length === 0 ? (
            <p className="mt-default text-sm text-text-secondary">No tagged links have brought visitors yet.</p>
          ) : (
            <ul className="mt-default divide-y divide-border-primary text-sm">
              {d.posts.map((p) => (
                <li key={p.ref} className="flex items-center gap-snug py-tight">
                  <span className="w-24 shrink-0 font-semibold text-text-secondary">{CHANNEL_LABELS[p.channel]}</span>
                  <span className="flex-1 truncate text-text-primary">{p.ref}</span>
                  <span className="text-text-secondary">{p.visitors} visitors</span>
                  <span className="w-20 text-right font-bold text-text-primary">{p.signups} signups</span>
                </li>
              ))}
            </ul>
          )}
          <LinkTagger />
        </Card>
      </div>
    </div>
  );
}
