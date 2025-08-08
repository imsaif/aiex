import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from '../Card';

describe('Card', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Card {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<Card {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<Card {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<Card {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});