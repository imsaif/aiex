import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyCodeButton from '../CopyCodeButton';

describe('CopyCodeButton', () => {
  const defaultProps = {
    'code': 'test-value'
};

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.alert
    global.alert = jest.fn();
    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<CopyCodeButton {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<CopyCodeButton {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

  });

  describe('Props', () => {
    it('renders with code prop', () => {
      const testValue = 'Test code';
      render(<CopyCodeButton {...defaultProps} code={testValue} />);
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

  });

  describe('Event Handling', () => {
    it('calls onClick when triggered', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      
      render(<CopyCodeButton {...defaultProps} onClick={onClick} />);
      
      const element = screen.getByRole('button'); // Adjust selector as needed
      await user.click(element);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<CopyCodeButton {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<CopyCodeButton {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});