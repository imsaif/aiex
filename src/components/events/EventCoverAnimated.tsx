import Image from 'next/image';

interface Props {
  title: string;
  /** Ink layer (black lines) and dot layer (coloured shapes), both transparent. */
  lines: string;
  dots: string;
}

const BOIL_SEEDS = [1, 7, 13];

/**
 * The cover illustration, alive: both layers wobble like hand-redrawn ink (a
 * "line boil", three displacement frames at about 6 fps) and the dot network
 * drifts slowly against the hand. The keyframes are in globals.css under
 * "Event cover"; reduced-motion visitors get the still drawing.
 */
export function EventCoverAnimated({ title, lines, dots }: Props) {
  return (
    <div className="p-3 rounded-2xl bg-surface-primary">
      <div
        role="img"
        aria-label={title}
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-background-event-cover"
      >
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          {BOIL_SEEDS.map((seed, i) => (
            <filter key={seed} id={`event-boil-${i + 1}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed={seed} />
              <feDisplacementMap in="SourceGraphic" scale="3" />
            </filter>
          ))}
        </svg>
        <Image src={dots} alt="" fill className="object-cover event-cover-dots" priority />
        <Image src={lines} alt="" fill className="object-cover event-cover-lines" priority />
      </div>
    </div>
  );
}

export default EventCoverAnimated;
