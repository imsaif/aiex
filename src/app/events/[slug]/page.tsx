import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import EventShell from '@/components/events/EventShell';
import EventRegistration from '@/components/events/EventRegistration';
import {
  EVENTS,
  getEvent,
  isRegistrationOpen,
  formatEventDate,
  googleCalendarUrl,
  type EventItem,
} from '@/data/events';

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  const { day, timeRange } = formatEventDate(event);
  const url = `https://www.aiuxdesign.guide/events/${event.slug}`;
  return {
    title: `${event.title} | ${day}`,
    description: `${event.tagline} ${day}, ${timeRange}. ${event.priceLabel}.`,
    openGraph: {
      title: event.title,
      description: `${day}, ${timeRange}. ${event.tagline}`,
      url,
      siteName: 'aiuxdesign.guide',
      type: 'website',
      ...(event.coverImage ? { images: [event.coverImage] } : {}),
    },
    alternates: { canonical: url },
  };
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

function Cover({ event }: { event: EventItem }) {
  if (event.coverImage) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority />
      </div>
    );
  }
  // Typographic cover until a real image is supplied.
  return (
    <div className="aspect-square w-full rounded-2xl bg-accent-primary text-text-on-accent p-8 flex flex-col justify-between">
      <span className="text-sm font-medium opacity-80">
        {event.format === 'online' ? 'Online workshop' : 'Workshop'}
      </span>
      <span className="text-3xl md:text-4xl font-bold leading-tight">{event.title}</span>
    </div>
  );
}

// Every block on the page is the same box as the booking card: a heading strip
// over a padded body, so content reads as grouped rather than floating.
function Section({ title, children, className = 'mt-6' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`${className} rounded-2xl border border-border-primary bg-surface-primary overflow-hidden`}>
      <h2 className="px-6 py-4 text-sm font-medium text-text-secondary bg-background-secondary border-b border-border-primary">
        {title}
      </h2>
      <div className="p-6 md:p-7">{children}</div>
    </section>
  );
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const { day, timeRange, month, dayNum } = formatEventDate(event);
  const open = isRegistrationOpen(event);
  const mapQuery = event.venue ? encodeURIComponent(`${event.venue.name}, ${event.venue.address}`) : '';

  return (
    <EventShell>
      {/* Phone order: cover, event, host. Desktop: cover and host on the left, event on the right. */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-8 grid gap-10 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-16 md:gap-y-10">
        <div className="md:col-start-1 md:row-start-1">
          <Cover event={event} />
        </div>

        <aside className="order-last md:order-none md:col-start-1 md:row-start-2">
          <Section title="Hosted by" className="">
            <div className="flex items-center gap-3">
              {event.host.photo ? (
                <Image src={event.host.photo} alt={event.host.name} width={40} height={40} className="rounded-full object-cover" />
              ) : (
                <span className="w-10 h-10 rounded-full bg-accent-subtle text-accent-primary flex items-center justify-center text-sm font-semibold">
                  {initials(event.host.name)}
                </span>
              )}
              <div>
                {event.host.url ? (
                  <a href={event.host.url} target="_blank" rel="noopener noreferrer" className="font-medium text-text-primary hover:text-accent-primary">
                    {event.host.name}
                  </a>
                ) : (
                  <span className="font-medium text-text-primary">{event.host.name}</span>
                )}
                <p className="text-sm text-text-secondary">{event.host.role}</p>
              </div>
            </div>
            {event.host.links && event.host.links.length > 0 && (
              <ul className="mt-5 space-y-2">
                {event.host.links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-text-primary underline underline-offset-2 hover:text-accent-primary"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={`mailto:${event.contactEmail}?subject=${encodeURIComponent(event.title)}`}
              className="mt-4 inline-block text-sm text-text-secondary hover:text-accent-primary"
            >
              Contact the host
            </a>
          </Section>
        </aside>

        {/* Right: what, when, where, details, then booking */}
        <div className="min-w-0 md:col-start-2 md:row-start-1 md:row-span-2">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-5" style={{ color: 'var(--text-hero)' }}>
            {event.title}
          </h1>
          <p className="text-lg leading-relaxed text-text-secondary mb-8">{event.tagline}</p>

          <div className="space-y-5 p-6 rounded-2xl border border-border-primary bg-surface-primary">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-xl border border-border-primary bg-surface-primary flex flex-col items-center justify-center leading-none">
                <span className="text-[10px] font-semibold text-text-secondary">{month}</span>
                <span className="text-lg font-bold text-text-primary">{dayNum}</span>
              </span>
              <div>
                <p className="font-medium text-text-primary">{day}</p>
                <p className="text-sm text-text-secondary">{timeRange}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-xl border border-border-primary bg-surface-primary flex items-center justify-center text-text-secondary">
                {event.format === 'online' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                )}
              </span>
              <div>
                {event.format === 'online' ? (
                  <>
                    <p className="font-medium text-text-primary">Online{event.platform ? `, on ${event.platform}` : ''}</p>
                    <p className="text-sm text-text-secondary">Link emailed after your setup check</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-text-primary">{event.venue?.name}</p>
                    <p className="text-sm text-text-secondary">{event.venue?.area}</p>
                  </>
                )}
              </div>
            </div>
            <div className="pt-5 border-t border-border-primary">
              <a
                href="#book"
                className="flex w-full sm:inline-flex sm:w-auto items-center justify-center px-6 py-3 rounded-xl font-medium bg-accent-primary text-text-on-accent hover:bg-accent-hover transition-colors"
              >
                Book your seat
              </a>
            </div>
          </div>

          <Section title="About">
            <div className="space-y-5 leading-relaxed text-text-primary">
              {event.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Section>

          <Section title="Why attend">
            <ul className="space-y-4 leading-relaxed">
              {event.whyAttend.map((w) => (
                <li key={w.title} className="text-text-primary">
                  <span className="font-semibold">{w.title}.</span>{' '}
                  <span className="text-text-secondary">{w.body}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Who it is for">
            <ul className="list-disc pl-5 space-y-3 leading-relaxed text-text-primary">
              {event.whoFor.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Section>

          <Section title="Agenda">
            <ol className="space-y-4">
              {event.agenda.map((a) => (
                <li key={a.time} className="flex gap-4">
                  <span className="w-14 shrink-0 font-mono text-sm text-text-secondary pt-0.5">{a.time}</span>
                  <span className="text-text-primary">{a.item}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="What you will need">
            <ul className="list-disc pl-5 space-y-3 leading-relaxed text-text-primary">
              {event.bring.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Section>

          <div id="book" className="mt-6 scroll-mt-8">
            <EventRegistration
              slug={event.slug}
              open={open}
              priceLabel={event.priceLabel}
              seats={event.seats}
              paymentLink={event.paymentLink}
              calendarUrl={googleCalendarUrl(event)}
            />
          </div>

          <Section title="The fine print">
            <ul className="list-disc pl-5 space-y-3 leading-relaxed text-text-secondary text-sm">
              {event.finePrint.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Section>

          <Section title="Location">
            {event.format === 'online' ? (
              <p className="text-text-primary">
                Online{event.platform ? ` on ${event.platform}` : ''}. Join from anywhere; the link is emailed once
                your setup check is done.
              </p>
            ) : (
              <>
                <p className="font-medium text-text-primary">{event.venue?.name}</p>
                <p className="text-sm text-text-secondary mb-4">{event.venue?.address}</p>
                <iframe
                  title={`Map of ${event.venue?.name}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="w-full h-64 rounded-xl border border-border-primary"
                  loading="lazy"
                />
              </>
            )}
          </Section>
        </div>
      </div>
    </EventShell>
  );
}
