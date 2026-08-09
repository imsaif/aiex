import { parseCsv, normaliseUrl } from '../click-attribution';

describe('parseCsv', () => {
  it('parses a simple row', () => {
    expect(parseCsv('url,clicks\nhttps://a.com,5')).toEqual([
      ['url', 'clicks'],
      ['https://a.com', '5'],
    ]);
  });

  it('keeps commas inside quoted fields', () => {
    expect(parseCsv('title,clicks\n"Figma, Inc ships",3')).toEqual([
      ['title', 'clicks'],
      ['Figma, Inc ships', '3'],
    ]);
  });

  it('unescapes doubled quotes', () => {
    expect(parseCsv('a\n"say ""hi"""')).toEqual([['a'], ['say "hi"']]);
  });

  it('ignores a trailing newline', () => {
    expect(parseCsv('a,b\n1,2\n')).toEqual([['a', 'b'], ['1', '2']]);
  });

  it('handles CRLF line endings', () => {
    expect(parseCsv('a,b\r\n1,2')).toEqual([['a', 'b'], ['1', '2']]);
  });
});

describe('normaliseUrl', () => {
  it('strips utm params', () => {
    expect(normaliseUrl('https://vercel.com/blog/x?utm_source=tldrdesign')).toBe(
      'https://vercel.com/blog/x',
    );
  });

  it('strips www and lowercases the host', () => {
    expect(normaliseUrl('https://WWW.Figma.com/blog/y')).toBe('https://figma.com/blog/y');
  });

  it('drops a trailing slash and the fragment', () => {
    expect(normaliseUrl('https://a.com/b/#top')).toBe('https://a.com/b');
  });

  it('keeps meaningful query params', () => {
    expect(normaliseUrl('https://a.com/p?id=7&utm_medium=email')).toBe('https://a.com/p?id=7');
  });

  it('returns non-URLs unchanged', () => {
    expect(normaliseUrl('not a url')).toBe('not a url');
  });

  it('treats two forms of the same link as equal', () => {
    const a = normaliseUrl('https://www.nngroup.com/articles/prove/?utm_source=rss');
    const b = normaliseUrl('https://nngroup.com/articles/prove');
    expect(a).toBe(b);
  });

  it('keeps the path separator on a root path with a surviving query', () => {
    expect(normaliseUrl('https://a.com/?x=1')).toBe('https://a.com/?x=1');
  });

  it('is idempotent across bare origin, trailing-slash path, and root-plus-query shapes', () => {
    const shapes = [
      'https://a.com',
      'https://a.com/b/',
      'https://a.com/?x=1',
    ];
    for (const shape of shapes) {
      const once = normaliseUrl(shape);
      const twice = normaliseUrl(once);
      expect(twice).toBe(once);
    }
  });
});
