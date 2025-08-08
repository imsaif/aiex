import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoriteButton from '../FavoriteButton';

describe('FavoriteButton', () => {
  const defaultProps = {
    'patternId': 'test-id',
    'className': 'test-class',
    'size': 'md' as const,
    'showLabel': true,
    'variant': 'icon' as const
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
      const testValue = 'Test patternId';
      render(<FavoriteButton {...defaultProps} patternId={testValue} />);
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

    it('renders with className prop', () => {
      const testValue = 'Test className';
      render(<FavoriteButton {...defaultProps} className={testValue} />);
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

    it('handles showLabel boolean prop', () => {
      const { rerender } = render(<FavoriteButton {...defaultProps} showLabel={true} />);
      // Test with true value
      expect(screen.getByRole('generic')).toBeInTheDocument();
      
      rerender(<FavoriteButton {...defaultProps} showLabel={false} />);
      // Test with false value - behavior should change
    });

  });

  describe('Event Handling', () => {
    it('calls onSizeClasses when triggered', async () => {
      const onSizeClasses = jest.fn();
      const user = userEvent.setup();
      
      render(<FavoriteButton {...defaultProps} onSizeClasses={onSizeClasses} />);
      
      const element = screen.getByRole('button'); // Adjust selector as needed
      await user.click(element);
      
      expect(onSizeClasses).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when triggered', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      
      render(<FavoriteButton {...defaultProps} onClick={onClick} />);
      
      const element = screen.getByRole('button'); // Adjust selector as needed
      await user.click(element);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

  });

  describe('Form Interactions', () => {
    it('handles button clicks', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      render(<FavoriteButton {...defaultProps} onClick={onClick} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(onClick).toHaveBeenCalledTimes(1);
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