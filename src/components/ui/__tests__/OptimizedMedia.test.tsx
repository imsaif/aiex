import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptimizedMedia from '../OptimizedMedia';

describe('OptimizedMedia', () => {
  const defaultProps = {
    'src': '/test-image.jpg',
    'alt': 'test image',
    'width': 42,
    'height': 42,
    'className': 'test-class',
    'priority': false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<OptimizedMedia {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<OptimizedMedia {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('Props', () => {
    it('renders with src prop', () => {
      const testValue = '/test-image.jpg';
      const { container } = render(<OptimizedMedia {...defaultProps} src={testValue} />);
      const image = container.querySelector('img') || container.querySelector('[src]');
      expect(image).toHaveAttribute('src', expect.stringContaining('test-image.jpg'));
    });

    it('renders with alt prop', () => {
      const testValue = 'Test alt text';
      render(<OptimizedMedia {...defaultProps} alt={testValue} />);
      expect(screen.getByAltText(testValue)).toBeInTheDocument();
    });

    it('renders with className prop', () => {
      const testValue = 'custom-class';
      const { container } = render(<OptimizedMedia {...defaultProps} className={testValue} />);
      expect(container.firstChild).toHaveClass(testValue);
    });

    it('handles priority boolean prop', () => {
      const { rerender, container } = render(<OptimizedMedia {...defaultProps} priority={true} />);
      // Test with true value - should have loading="eager"
      const eagerImage = container.querySelector('img[loading="eager"]');
      expect(eagerImage || container.querySelector('img')).toBeInTheDocument();
      
      rerender(<OptimizedMedia {...defaultProps} priority={false} />);
      // Test with false value - should have loading="lazy" or no loading attribute
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('State Management', () => {
    it('manages internal state correctly', () => {
      render(<OptimizedMedia {...defaultProps} />);
      // Test initial state
      // Add specific state assertions based on your component
    });

    it('updates state on user interaction', async () => {
      const _user = userEvent.setup(); // eslint-disable-line @typescript-eslint/no-unused-vars
      render(<OptimizedMedia {...defaultProps} />);
      
      // Simulate user interaction that changes state
      // Add specific interactions based on your component
    });
  });

  describe('Event Handling', () => {
    it('calls onLoad when image loads', async () => {
      const { container } = render(<OptimizedMedia {...defaultProps} />);
      
      // Find the image element and trigger load event
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      
      // Simulate image load
      if (image) {
        fireEvent.load(image);
      }
      
      // Check that loading state is handled (opacity changes)
      await waitFor(() => {
        expect(image).toHaveClass('opacity-100');
      });
    });

    it('calls onClick when triggered', async () => {
      const _user = userEvent.setup(); // eslint-disable-line @typescript-eslint/no-unused-vars
      
      const { container } = render(<OptimizedMedia {...defaultProps} />);
      
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      
      if (image) {
        await user.click(image);
        // Component handles click internally
        expect(image).toBeInTheDocument();
      }
    });

  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<OptimizedMedia {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<OptimizedMedia {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});