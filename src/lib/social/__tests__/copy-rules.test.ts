import { cleanCopy, findExperienceClaims } from '../copy-rules';

describe('cleanCopy', () => {
  it('removes emojis, including joined ones, without leaving double spaces', () => {
    expect(cleanCopy('Agents need supervision 🤔 not chat 🚀')).toBe('Agents need supervision not chat');
    expect(cleanCopy('Team 👨‍👩‍👧 win')).toBe('Team win');
    expect(cleanCopy('Big week 🔥.')).toBe('Big week.');
  });

  it('turns a spaced em or en dash between clauses into a comma', () => {
    expect(cleanCopy('The model got faster — the UI did not')).toBe('The model got faster, the UI did not');
    expect(cleanCopy('Ship it – then measure')).toBe('Ship it, then measure');
  });

  it('turns a glued dash into a hyphen', () => {
    expect(cleanCopy('pages 10–20')).toBe('pages 10-20');
  });

  it('keeps line breaks and plain text untouched', () => {
    expect(cleanCopy('Line one.\n\nLine two.')).toBe('Line one.\n\nLine two.');
  });
});

describe('findExperienceClaims', () => {
  it('flags invented first-person experience', () => {
    expect(findExperienceClaims("I tested it and we've built a demo")).toEqual(['I tested', "we've built"]);
  });

  it('ignores opinions and third-person facts', () => {
    expect(findExperienceClaims('I think teams should test this. Figma tested it.')).toEqual([]);
  });
});
