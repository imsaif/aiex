import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';

describe('Navbar', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Navbar {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<Navbar {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('Event Handling', () => {
    it('calls onClick when triggered', async () => {
      const user = userEvent.setup();
      
      render(<Navbar {...defaultProps} onClick={onClick} />);
      
      const element = screen.getByRole('button'); // Adjust selector as needed
      await user.click(element);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<Navbar {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<Navbar {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});