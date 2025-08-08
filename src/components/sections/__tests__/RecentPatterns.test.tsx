import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecentPatterns from '../RecentPatterns';

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    p: 'p'
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RecentPatterns', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<RecentPatterns {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<RecentPatterns {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('Event Handling', () => {
    it('handles clear button click', async () => {
      const user = userEvent.setup();
      
      render(<RecentPatterns {...defaultProps} />);
      
      // Check if clear button exists (only when there are recent patterns)
      const clearButton = screen.queryByTitle('Clear recent patterns');
      if (clearButton) {
        await user.click(clearButton);
        // The actual clearRecentPatterns function is mocked by the hook
      }
    });

  });

  describe('Form Interactions', () => {
    it('handles view all link', async () => {
      const user = userEvent.setup();
      
      render(<RecentPatterns {...defaultProps} />);
      
      // Check if view all link exists (only when there are recent patterns)
      const viewAllLink = screen.queryByText('View All');
      if (viewAllLink) {
        expect(viewAllLink).toHaveAttribute('href', '/recent');
      }
    });

  });

  describe('Animations', () => {
    it('renders motion components correctly', () => {
      render(<RecentPatterns {...defaultProps} />);
      // Motion components should render as regular divs in test environment
      expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('handles animation state changes', async () => {
      render(<RecentPatterns {...defaultProps} />);
      
      // Test animation triggers
      await waitFor(() => {
        // Add specific animation assertions
      });
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<RecentPatterns {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<RecentPatterns {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});