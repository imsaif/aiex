import { newestIssue, shouldAutoDraft } from '../daily';

const now = new Date('2026-10-30T09:00:00Z');

describe('newestIssue', () => {
  it('picks the most recent issue regardless of order', () => {
    const issues = [
      { id: 'a', createdAt: '2026-10-28T03:10:00Z' },
      { id: 'b', createdAt: '2026-10-30T03:10:00Z' },
      { id: 'c', createdAt: '2026-10-29T03:10:00Z' },
    ];
    expect(newestIssue(issues)?.id).toBe('b');
  });

  it('returns null for no issues', () => {
    expect(newestIssue([])).toBeNull();
  });
});

describe('shouldAutoDraft', () => {
  const today = { id: 't', createdAt: '2026-10-30T03:10:00Z' };

  it("drafts today's issue when it has no posts", () => {
    expect(shouldAutoDraft(today, 0, now)).toBe(true);
  });

  it('never redrafts an issue that already has posts', () => {
    expect(shouldAutoDraft(today, 3, now)).toBe(false);
  });

  it('leaves older issues to the button', () => {
    expect(shouldAutoDraft({ id: 'o', createdAt: '2026-10-27T03:10:00Z' }, 0, now)).toBe(false);
  });
});
