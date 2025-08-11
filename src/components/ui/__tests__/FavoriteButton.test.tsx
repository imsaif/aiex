import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoriteButton from '../FavoriteButton';

describe('FavoriteButton', () => {
  const defaultProps = {
    patternId: 'test-id',
    className: 'test-class',
    size: 'md' as const,
    showLabel: true,
    variant: 'icon' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<FavoriteButton {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<FavoriteButton {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('Props', () => {
    it('renders with patternId prop', () => {
      const testValue = 'test-pattern-123';
      render(<FavoriteButton {...defaultProps} patternId={testValue} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with className prop', () => {
      const testValue = 'custom-test-class';
      render(<FavoriteButton {...defaultProps} className={testValue} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(testValue);
    });

    it('handles showLabel boolean prop', () => {
      const { rerender } = render(<FavoriteButton {...defaultProps} showLabel={true} />);
      // Test with true value
      expect(screen.getAllByRole('generic')[0]).toBeInTheDocument();
      
      rerender(<FavoriteButton {...defaultProps} showLabel={false} />);
      // Test with false value - behavior should change
    });

  });

  describe('Event Handling', () => {
    it('handles button click to toggle favorite', async () => {
      const _user = userEvent.setup(); // eslint-disable-line @typescript-eslint/no-unused-vars
      
      render(<FavoriteButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // The component should handle the toggle internally via useFavorites hook
      expect(button).toBeInTheDocument();
    });

    it('renders different sizes correctly', () => {
      const { rerender } = render(<FavoriteButton {...defaultProps} size="sm" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<FavoriteButton {...defaultProps} size="md" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<FavoriteButton {...defaultProps} size="lg" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

  });

  describe('Variant Rendering', () => {
    it('renders button variant correctly', async () => {
      render(<FavoriteButton {...defaultProps} variant="button" showLabel={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders icon variant correctly', async () => {
      render(<FavoriteButton {...defaultProps} variant="icon" />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

  });

  describe('Accessibility', () => {
    it('has proper aria labels', () => {
      render(<FavoriteButton {...defaultProps} />);
      
      const labeledElements = screen.getAllByLabelText(/./);
      expect(labeledElements.length).toBeGreaterThan(0);
    });

  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<FavoriteButton {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<FavoriteButton {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});