import { Metadata } from 'next';
import type { ComponentType, SVGProps } from 'react';
import {
  BookOpenIcon,
  CameraIcon,
  ComputerDesktopIcon,
  LightBulbIcon,
  MapPinIcon,
  UserCircleIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import RoughIcon from '@/components/events/RoughIcon';
import { eventTheme } from '@/components/events/theme';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import EventShell from '@/components/events/EventShell';
import EventRegistration from '@/components/events/EventRegistration';
import EventTimeline from '@/components/events/EventTimeline';
import EventCover from '@/components/events/EventCover';
import HeroBookingAction from '@/components/events/HeroBookingAction';
import BookingLinkCatcher from '@/components/events/BookingLinkCatcher';
import {
  EVENTS,
  getEvent,
  isRegistrationOpen,
  formatEventDate,
  googleCalendarUrl,
  type EventItem,
} from '@/data/events';

// Registration closes by the clock (isRegistrationOpen), so re-render hourly
// rather than freezing the page as it was at deploy.
export const revalidate = 3600;

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

// Turns any link label that appears in the text into that link, so a host line
// like "Founder of aiuxdesign.guide" links in place instead of repeating below.
function linkify(text: string, links: { label: string; url: string }[] = []) {
  if (links.length === 0) return text;
  const pattern = new RegExp(`(${links.map((l) => l.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);
  return text.split(pattern).map((part, i) => {
    const link = links.find((l) => l.label === part);
    return link ? (
      <a
        key={i}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-text-primary underline underline-offset-2 hover:text-accent-primary"
      >
        {part}
      </a>
    ) : (
      part
    );
  });
}

// Every block on the page is the same box as the booking card: a heading strip
// over a padded body, so content reads as grouped rather than floating.
function Section({
  title,
  icon,
  children,
  className = 'mt-6',
}: {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${className} rounded-2xl border border-border-primary bg-surface-primary overflow-hidden`}>
      <h2 className="px-6 py-4 flex items-center gap-3 text-sm font-medium text-text-primary bg-background-secondary border-b border-border-primary">
        <RoughIcon icon={icon} />
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

  // Lets Google show this as an event (date, venue, price) in search. Mirrors
  // the visible page; schema.org/Event.
  const site = 'https://www.aiuxdesign.guide';
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.tagline,
    startDate: event.start,
    endDate: event.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      event.format === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    location:
      event.format === 'online'
        ? { '@type': 'VirtualLocation', url: `${site}/events/${event.slug}` }
        : {
            '@type': 'Place',
            name: event.venue?.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: event.venue?.address,
              addressLocality: 'Hyderabad',
              addressRegion: 'Telangana',
              addressCountry: 'IN',
            },
          },
    ...(event.coverImage ? { image: [`${site}${event.coverImage}`] } : {}),
    organizer: { '@type': 'Person', name: event.host.name, url: event.host.url ?? site },
    offers: {
      '@type': 'Offer',
      url: `${site}/events/${event.slug}`,
      price: String(event.price),
      priceCurrency: event.currency,
      availability: 'https://schema.org/InStock',
    },
  };

  const hero = (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-2 pb-12 md:pb-20 grid gap-8 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-x-16 items-start">
      <EventCover event={event} />

      <div className="min-w-0">
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-5" style={{ color: 'var(--text-hero)' }}>
          {event.title}
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-text-primary mb-10">{event.tagline}</p>

        <EventTimeline event={event} />

        <div className="mt-10 p-6 rounded-2xl bg-surface-primary flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-xl border border-border-primary flex flex-col items-center justify-center leading-none">
                <span className="text-[10px] font-semibold text-text-secondary">{month}</span>
                <span className="text-lg font-bold text-text-primary">{dayNum}</span>
              </span>
              <div>
                <p className="font-medium text-text-primary">{day}</p>
                <p className="text-sm text-text-secondary">{timeRange}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-xl border border-border-primary flex items-center justify-center text-text-secondary">
                {event.format === 'online' ? (
                  <RoughIcon icon={VideoCameraIcon} />
                ) : (
                  <RoughIcon icon={MapPinIcon} />
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
          </div>
          <HeroBookingAction slug={event.slug} theme={event.theme} />
        </div>
      </div>
    </div>
  );

  return (
    <EventShell hero={hero} theme={event.theme}>
      <BookingLinkCatcher slug={event.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      {/* Phone order: details, then host. Desktop: host on the left, details on the right. */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-14 grid gap-10 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-x-16 items-start">
        <aside className="order-last md:order-none">
          <Section title="Hosted by" icon={UserCircleIcon} className="">
            <div className="flex items-center gap-3">
              {event.host.photo ? (
                <Image src={event.host.photo} alt={event.host.name} width={40} height={40} className="rounded-full object-cover" />
              ) : (
                <span className={`w-10 h-10 shrink-0 rounded-full ${eventTheme(event.theme).soft} text-text-primary flex items-center justify-center text-sm font-semibold`}>
                  {initials(event.host.name)}
                </span>
              )}
              <div>
                {event.host.url ? (
                  <a href={event.host.url} target="_blank" rel="noopener noreferrer" className="font-medium text-text-primary hover:text-text-secondary">
                    {event.host.name}
                  </a>
                ) : (
                  <span className="font-medium text-text-primary">{event.host.name}</span>
                )}
                <p className="text-sm text-text-secondary">{linkify(event.host.role, event.host.links)}</p>
              </div>
            </div>
            <a
              href={`mailto:${event.contactEmail}?subject=${encodeURIComponent(event.title)}`}
              className="mt-4 inline-block text-sm text-text-secondary hover:text-text-primary"
            >
              Contact the host
            </a>
          </Section>
        </aside>

        <div className="min-w-0">
          <Section title="About" icon={BookOpenIcon} className="">
            <div className="space-y-5 leading-relaxed text-text-primary">
              {event.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Section>

          <Section title="Why attend" icon={LightBulbIcon}>
            <ul className="space-y-4 leading-relaxed">
              {event.whyAttend.map((w) => (
                <li key={w.title} className="text-text-primary">
                  <span className="font-semibold">{w.title}.</span>{' '}
                  <span className="text-text-secondary">{w.body}</span>
                </li>
              ))}
            </ul>
          </Section>

          {event.photos && event.photos.items.length > 0 && (
            <Section title={event.photos.title} icon={CameraIcon}>
              <div className="grid grid-cols-2 gap-3">
                {event.photos.items.map((photo) => (
                  <div key={photo.src} className="relative aspect-[3/2] overflow-hidden rounded-xl bg-background-secondary">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 768px) 360px, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Who it is for" icon={UserGroupIcon}>
            <ul className="space-y-3 leading-relaxed text-text-primary">
              {event.whoFor.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Section>

          <Section title="What you will need" icon={ComputerDesktopIcon}>
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
              finePrint={event.finePrint}
            />
          </div>

          <Section title="Location" icon={MapPinIcon}>
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
