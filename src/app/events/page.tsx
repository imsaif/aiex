import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import EventShell from '@/components/events/EventShell';
import RoughIcon from '@/components/events/RoughIcon';
import { EVENTS, formatEventDate, type EventItem } from '@/data/events';

export const metadata: Metadata = {
  title: 'Events | Hands-on sessions with AI design and build tools',
  description: 'Small, hands-on sessions where you build with the AI tools from our guides, on your own project, with help when you get stuck.',
  alternates: { canonical: 'https://www.aiuxdesign.guide/events' },
  openGraph: {
    title: 'Events | aiuxdesign.guide',
    description: 'Small, hands-on sessions with the AI tools from our guides, in Hyderabad and online.',
    url: 'https://www.aiuxdesign.guide/events',
    siteName: 'aiuxdesign.guide',
    type: 'website',
  },
};

// Upcoming and past are split by the clock, so the page re-renders hourly and
// an event moves to "Past" on its own after it ends.
export const revalidate = 3600;

function EventRow({ event, past }: { event: EventItem; past: boolean }) {
  const { day, timeRange, month, dayNum } = formatEventDate(event);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col sm:flex-row gap-5 p-4 rounded-2xl border border-border-primary bg-surface-primary hover:border-text-secondary transition-colors"
    >
      <div className="relative w-full sm:w-44 shrink-0 aspect-square overflow-hidden rounded-xl bg-background-secondary">
        {event.coverImage && (
          <Image
            src={event.coverImage}
            alt=""
            fill
            sizes="(min-width: 640px) 176px, 100vw"
            className={`object-cover ${past ? 'grayscale' : ''}`}
          />
        )}
      </div>
      <div className="min-w-0 flex flex-col justify-center gap-3 py-1">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 shrink-0 rounded-xl border border-border-primary flex flex-col items-center justify-center leading-none">
            <span className="text-[10px] font-semibold text-text-secondary">{month}</span>
            <span className="text-base font-bold text-text-primary">{dayNum}</span>
          </span>
          <div>
            <p className="text-sm font-medium text-text-primary">{day}</p>
            <p className="text-sm text-text-secondary">{timeRange}</p>
          </div>
        </div>
        <span className="self-start px-2.5 py-1 rounded-full text-xs font-medium border border-border-primary text-text-secondary">
          {event.tool}
        </span>
        <h2 className="text-xl md:text-2xl font-bold leading-snug text-text-primary group-hover:underline underline-offset-4">
          {event.title}
        </h2>
        <p className="flex items-center gap-2 text-sm text-text-secondary">
          <RoughIcon icon={event.format === 'online' ? VideoCameraIcon : MapPinIcon} className="w-4 h-4" />
          {event.format === 'online' ? `Online${event.platform ? `, ${event.platform}` : ''}` : `${event.venue?.name}, ${event.venue?.area}`}
          {!past && <span className="text-text-primary font-medium">· {event.priceLabel}</span>}
        </p>
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const now = Date.now();
  const byStart = (a: EventItem, b: EventItem) => new Date(a.start).getTime() - new Date(b.start).getTime();
  const upcoming = EVENTS.filter((e) => new Date(e.end).getTime() > now).sort(byStart);
  const past = EVENTS.filter((e) => new Date(e.end).getTime() <= now).sort(byStart).reverse();

  const hero = (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-2 pb-12 md:pb-16">
      <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-4" style={{ color: 'var(--text-hero)' }}>
        Events
      </h1>
      <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-text-primary">
        Small, hands-on sessions where you build with the AI tools from our guides, on your own project, with help when you get stuck.
      </p>
    </div>
  );

  return (
    <EventShell hero={hero} site>
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
        <h2 className="text-sm font-medium text-text-secondary mb-4">Upcoming</h2>
        {upcoming.length > 0 ? (
          <div className="space-y-4">
            {upcoming.map((e) => (
              <EventRow key={e.slug} event={e} past={false} />
            ))}
          </div>
        ) : (
          <p className="p-6 rounded-2xl border border-border-primary text-text-secondary">
            No sessions scheduled right now. The next one is announced in the{' '}
            <Link href="/news" className="text-text-primary underline underline-offset-2">
              newsletter
            </Link>
            .
          </p>
        )}

        {past.length > 0 && (
          <>
            <h2 className="text-sm font-medium text-text-secondary mt-14 mb-4">Past</h2>
            <div className="space-y-4">
              {past.map((e) => (
                <EventRow key={e.slug} event={e} past />
              ))}
            </div>
          </>
        )}
      </div>
    </EventShell>
  );
}
