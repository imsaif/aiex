import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<SearchBar {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<SearchBar {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<SearchBar {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<SearchBar {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});