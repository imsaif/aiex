import { extractPublisherUrl } from '../google-news';

describe('extractPublisherUrl', () => {
  it('keeps query values Google escapes (the Oct 2026 ABC News 404)', () => {
    const text = String.raw`)]}'
[["wrb.fr","Fbv4je","[\"garturlres\",\"https://abcnews.com/GMA/News/rogue-ai-agent/story?id\\u003d126345\\u0026x\\u003d1\",1]",null]]`;
    expect(extractPublisherUrl(text)).toBe('https://abcnews.com/GMA/News/rogue-ai-agent/story?id=126345&x=1');
  });

  it('reads a plain URL', () => {
    expect(extractPublisherUrl('["garturlres","https://www.figma.com/blog/post/",1]')).toBe('https://www.figma.com/blog/post/');
  });

  it('skips Google News URLs and returns null when there is no publisher URL', () => {
    expect(extractPublisherUrl('"https://news.google.com/rss/articles/abc"')).toBeNull();
  });
});
