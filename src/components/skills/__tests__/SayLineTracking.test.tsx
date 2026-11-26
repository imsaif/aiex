import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SayLine } from '../SayLine';
import { trackAuditEvent } from '@/lib/audit/analytics';

jest.mock('@/lib/audit/analytics', () => ({ trackAuditEvent: jest.fn() }));

describe('SayLine copy tracking', () => {
  beforeEach(() => {
    (trackAuditEvent as jest.Mock).mockClear();
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
  });

  it('records where the copy happened', () => {
    render(<SayLine text="Fix the most important one." track={{ where: 'walkthrough', target: 'code', step: 4 }} />);
    fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    expect(trackAuditEvent).toHaveBeenCalledWith('skills_say_copied', { where: 'walkthrough', target: 'code', step: 4 });
  });

  it('records nothing when no place is given', () => {
    render(<SayLine text="Anything" />);
    fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    expect(trackAuditEvent).not.toHaveBeenCalled();
  });
});
