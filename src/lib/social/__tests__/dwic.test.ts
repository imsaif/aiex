import { buildDwicSlides, DWIC_ARTICLES, findArticle } from '../dwic';
import { SLIDE_COUNT } from '../slides';

describe('dwic article social assets', () => {
  it('finds an article by slug and nothing for an unknown one', () => {
    expect(findArticle('building-empathy-in-the-terminal')?.title).toBe('Building empathy in the terminal');
    expect(findArticle('nope')).toBeUndefined();
    expect(findArticle(null)).toBeUndefined();
  });

  it.each(DWIC_ARTICLES.map((a) => [a.slug, a] as const))('%s fills the same four slide kinds as a newsletter issue', (_slug, article) => {
    const slides = buildDwicSlides(article);
    expect(slides).toHaveLength(SLIDE_COUNT);
    expect(slides.map((s) => s.kind)).toEqual(['cover', 'stories', 'idea', 'link']);
    for (const s of slides) expect(s.alt.length).toBeGreaterThan(30);
  });

  it.each(DWIC_ARTICLES.map((a) => [a.slug, a] as const))('%s keeps share-card rows short enough not to be cut', (_slug, article) => {
    // The share card shortens headlines over 65 characters with "...".
    for (const item of article.card.items) expect(item.headline.length).toBeLessThanOrEqual(65);
    expect(article.card.items.length).toBeLessThanOrEqual(5);
  });

  it.each(DWIC_ARTICLES.map((a) => [a.slug, a] as const))('%s links to its own article page', (_slug, article) => {
    expect(article.url).toBe(`https://www.designwithclaude.com/design-research/${article.slug}`);
    expect(article.post).toContain(article.url);
  });
});
