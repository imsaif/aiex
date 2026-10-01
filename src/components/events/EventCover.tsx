import Image from 'next/image';
import EventCoverAnimated from '@/components/events/EventCoverAnimated';
import type { EventItem } from '@/data/events';

/**
 * The event's cover, shared by the event page and its confirmation page: the
 * animated layers when they exist, else the still image framed in a white card,
 * else a typographic cover.
 */
export function EventCover({ event }: { event: EventItem }) {
  if (event.coverLayers) {
    return <EventCoverAnimated title={event.title} lines={event.coverLayers.lines} dots={event.coverLayers.dots} />;
  }
  if (event.coverImage) {
    return (
      // Framed in the same white card as the date box, so it sits on the band as
      // an object rather than dissolving into it.
      <div className="p-3 rounded-2xl bg-surface-primary">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority />
        </div>
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

export default EventCover;
