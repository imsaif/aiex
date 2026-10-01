import type { ComponentType, SVGProps } from 'react';

/**
 * A Heroicons outline icon with its stroke roughened so it reads as drawn by
 * hand, matching the animated cover. The roughening is a fixed displacement
 * filter (`event-rough`, defined once in EventShell), so the icons stay still:
 * the cover is the only thing on the page that moves.
 */
export function RoughIcon({
  icon: Icon,
  className = 'w-5 h-5',
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
}) {
  return (
    <Icon
      aria-hidden="true"
      strokeWidth={1.8}
      className={`${className} shrink-0`}
      style={{ filter: 'url(#event-rough)' }}
    />
  );
}

/** The filter RoughIcon points at. Rendered once per event page. */
export function RoughIconFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="event-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="2.6" />
      </filter>
    </svg>
  );
}

export default RoughIcon;
