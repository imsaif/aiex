import { agendaSegments, totalMinutes, type EventItem } from '@/data/events';

/**
 * The session drawn to scale: one bar, split by how long each part takes. The
 * longest part (the build) carries the accent, because it is the promise of the
 * event. Below the bar, each part with its start time and what happens.
 */
export function EventTimeline({ event }: { event: EventItem }) {
  const segments = agendaSegments(event);
  const longest = Math.max(...segments.map((s) => s.minutes));

  return (
    <div>
      <p className="font-semibold text-text-primary mb-3">How the {totalMinutes(event)} minutes go</p>
      <div className="flex h-4 gap-1" aria-hidden="true">
        {segments.map((s) => (
          <span
            key={s.time}
            className={`rounded-full ${s.minutes === longest ? 'bg-accent-primary' : 'bg-background-event-strong'}`}
            style={{ flexGrow: s.minutes, flexBasis: 0 }}
          />
        ))}
      </div>
      <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {segments.map((s) => (
          <li key={s.time}>
            <p className="text-sm text-text-secondary">
              {s.time} · {s.minutes} min
            </p>
            <p className="font-semibold text-text-primary">{s.label}</p>
            <p className="text-sm leading-relaxed text-text-secondary mt-1">{s.item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default EventTimeline;
