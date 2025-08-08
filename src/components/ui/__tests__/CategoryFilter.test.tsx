import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<CategoryFilter {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<CategoryFilter {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<CategoryFilter {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<CategoryFilter {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});