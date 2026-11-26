import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonRenderer from '../LessonRenderer';

jest.mock('@/components/guides/DynamicPreview', () => ({ DynamicPreview: () => null }));

describe('LessonRenderer links', () => {
  it('turns [label](/path) into a real link and keeps the text around it', () => {
    render(
      <LessonRenderer
        sections={[{ type: 'text', content: 'Use the free [AI UX Audit Tool](/audit) to score it.' }]}
      />
    );
    const link = screen.getByRole('link', { name: 'AI UX Audit Tool' });
    expect(link).toHaveAttribute('href', '/audit');
    expect(screen.queryByText(/\]\(/)).toBeNull();
    expect(screen.getByText(/Use the free/)).toBeInTheDocument();
  });

  it('opens outside links in a new tab', () => {
    render(<LessonRenderer sections={[{ type: 'text', content: 'See [the docs](https://example.com/a).' }]} />);
    expect(screen.getByRole('link', { name: 'the docs' })).toHaveAttribute('target', '_blank');
  });

  it('still renders bold inside the same text', () => {
    render(<LessonRenderer sections={[{ type: 'text', content: '**Important:** read [this](/skills).' }]} />);
    expect(screen.getByText('Important:').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'this' })).toHaveAttribute('href', '/skills');
  });
});
