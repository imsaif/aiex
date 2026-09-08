/**
 * The category key: one hue per pattern category.
 *
 * This exists to settle an emphasis problem rather than to add decoration.
 * Solid ink (`bg-text-primary`) used to mark three unrelated things at once —
 * the active rail link, the selected category pill, and the Subscribe button —
 * so "where you are", "what is filtered" and "what to click" all read at the
 * same volume and the eye could not rank them.
 *
 * The fill is now reserved for a page's single primary action. Selection is
 * shown with weight and a quiet surface instead, and the category itself is
 * carried by a small coloured dot beside its name.
 *
 * The dot is a key, never the only carrier of meaning: it always sits next to
 * the written category name, and selection is legible with the colour ignored
 * entirely. Colours are theme-independent design tokens (see
 * `--category-*` in `globals.css`), consumed as an inline custom property
 * because raw Tailwind colour utilities are not allowed in new code.
 */

/** Names match the `color` field on each category in `src/data/categories.ts`. */
const CATEGORY_HUES = [
  'blue',
  'green',
  'purple',
  'orange',
  'pink',
  'red',
  'yellow',
  'indigo',
  'teal',
] as const;

type CategoryHue = (typeof CATEGORY_HUES)[number];

function isCategoryHue(color: string): color is CategoryHue {
  return (CATEGORY_HUES as readonly string[]).includes(color);
}

/**
 * The CSS custom property for a category's dot, e.g. `var(--category-green)`.
 * Unknown colours fall back to blue rather than rendering an invisible dot.
 */
export function categoryDotColor(color: string = 'blue'): string {
  return `var(--category-${isCategoryHue(color) ? color : 'blue'})`;
}

/**
 * The selected state for a category filter pill: a wash of the category's own
 * colour with a firmer border in the same hue.
 *
 * A neutral surface was tried first and was too quiet to read as chosen at a
 * glance — the pills sit in a row of nine, so the selected one has to separate
 * from eight neighbours, not from a blank page. `color-mix` keeps the tint
 * derived from the one token rather than hand-picking eighteen more values,
 * and stays legible in both themes because the mix is against `transparent`
 * over whatever surface is underneath.
 *
 * Text stays `text-text-primary` and the weight goes to semibold, so the state
 * survives with colour ignored entirely.
 */
export function categorySelectedStyle(color: string = 'blue') {
  const hue = categoryDotColor(color);
  return {
    backgroundColor: `color-mix(in srgb, ${hue} 14%, transparent)`,
    borderColor: `color-mix(in srgb, ${hue} 55%, transparent)`,
  };
}
