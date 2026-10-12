import { renderWelcomeEmail } from '../welcome-email';

describe('renderWelcomeEmail', () => {
  const base = {
    siteUrl: 'https://example.test',
    unsubscribeUrl: 'https://example.test/unsubscribe?token=abc',
    postalAddress: 'PO Box 1 <Fresno>',
    patternCount: 38,
  };

  it('carries the unsubscribe link and the escaped postal address', () => {
    const html = renderWelcomeEmail({ ...base, latestIssue: null });
    expect(html).toContain('href="https://example.test/unsubscribe?token=abc"');
    expect(html).toContain('PO Box 1 &lt;Fresno&gt;');
  });

  it('links the latest issue with its prefix stripped, and drops the block when there is none', () => {
    const withIssue = renderWelcomeEmail({ ...base, latestIssue: { title: 'This Week in AIUX: Agent Status', url: 'https://example.test/news/x' } });
    expect(withIssue).toContain('href="https://example.test/news/x"');
    expect(withIssue).toContain('>Agent Status<');
    expect(renderWelcomeEmail({ ...base, latestIssue: null })).not.toContain('Start with the latest issue');
  });
});
