/**
 * Event page colour themes. Site-level pages (the /events list) always use the
 * aiuxdesign.guide look; an individual event takes the look of the tool it
 * teaches, so a Claude session wears Claude's warm paper tone. Events can cover
 * any tool from the guides: to theme a new one (Cursor, Figma...), add its
 * band/strong colours as tokens in globals.css + tailwind.config.mjs, then one
 * entry here. Until then it falls back to the site's own look. Set per event in
 * src/data/events.ts (`theme`), defaulting to the site's own.
 *
 * - band:   the hero band behind the cover and title
 * - strong: timeline segments on the band (the build part uses the accent)
 * - soft:   small tinted fills (avatar, step numbers, the "You're booked" badge)
 */
export type EventTheme = 'aiux' | 'claude';

export const EVENT_THEMES: Record<EventTheme, { band: string; strong: string; soft: string }> = {
  aiux: {
    band: 'bg-background-grain',
    strong: 'bg-border-primary',
    soft: 'bg-background-tertiary',
  },
  claude: {
    band: 'bg-background-event',
    strong: 'bg-background-event-strong',
    soft: 'bg-background-event',
  },
};

export const eventTheme = (theme?: EventTheme) => EVENT_THEMES[theme ?? 'aiux'];
