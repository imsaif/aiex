import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GapCard } from '../GapCard';
import { trackAuditEvent } from '@/lib/audit/analytics';
import type { TopGap } from '@/types/audit';

jest.mock('@/lib/audit/analytics', () => ({ trackAuditEvent: jest.fn() }));

const track = trackAuditEvent as jest.Mock;

const gap = {
  pattern: 'Feedback Loops',
  headline: 'Thumbs icon has no label',
  status: 'needs-improvement',
  finding: 'The icon sits under the answer.',
  recommendation: 'Add a label.',
} as unknown as TopGap;

const ratingEvents = () => track.mock.calls.filter(([name]) => name === 'audit_gap_rated');

beforeEach(() => track.mockClear());

describe('GapCard rating', () => {
  it('records a Yes tap and shows it as selected', async () => {
    render(<GapCard gap={gap} index={2} ratable />);
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(ratingEvents()).toEqual([['audit_gap_rated', { pattern: 'Feedback Loops', position: 2, useful: true }]]);
    expect(screen.getByRole('button', { name: 'Yes' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'No' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('lets a changed mind win, logging each tap', async () => {
    render(<GapCard gap={gap} index={2} ratable />);
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(ratingEvents().map(([, props]) => props.useful)).toEqual([true, false]);
    expect(screen.getByRole('button', { name: 'No' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Yes' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('does not log a repeat tap on the same answer', async () => {
    render(<GapCard gap={gap} index={2} ratable />);
    await userEvent.dblClick(screen.getByRole('button', { name: 'Yes' }));
    expect(ratingEvents()).toHaveLength(1);
  });

  it('shows no rating on demo cards', () => {
    render(<GapCard gap={gap} index={2} />);
    expect(screen.queryByText('Was this useful?')).not.toBeInTheDocument();
  });
});
