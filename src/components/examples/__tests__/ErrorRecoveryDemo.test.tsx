import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorRecoveryDemo from '../ErrorRecoveryDemo';

describe('ErrorRecoveryDemo', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
    });

    it('renders with correct initial structure', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      expect(screen.getByText('Error Recovery & Graceful Degradation')).toBeInTheDocument();
      expect(screen.getByText('Experience how AI systems handle failures and provide recovery options')).toBeInTheDocument();
    });

    it('renders AI query input section', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      expect(screen.getByText('AI Query Input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Try keywords:/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Process Query' })).toBeInTheDocument();
    });

    it('renders system status sidebar', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      expect(screen.getByText('System Status')).toBeInTheDocument();
      expect(screen.getByText('State:')).toBeInTheDocument();
      expect(screen.getByText('Confidence:')).toBeInTheDocument();
      expect(screen.getByText('Retry Count:')).toBeInTheDocument();
    });

    it('renders error types section', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      expect(screen.getByText('Error Types')).toBeInTheDocument();
      expect(screen.getByText('Timeout')).toBeInTheDocument();
      expect(screen.getByText('Unavailable')).toBeInTheDocument();
      expect(screen.getByText('Low Confidence')).toBeInTheDocument();
      expect(screen.getByText('Unexpected')).toBeInTheDocument();
    });

    it('renders recovery strategies section', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      expect(screen.getByText('Recovery Strategies')).toBeInTheDocument();
      expect(screen.getByText('Automatic retry with backoff')).toBeInTheDocument();
      expect(screen.getByText('Fallback to cached results')).toBeInTheDocument();
      expect(screen.getByText('Graceful degradation')).toBeInTheDocument();
      expect(screen.getByText('User feedback collection')).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('handles text input in query field', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      await user.type(input, 'test query');
      
      expect(input).toHaveValue('test query');
    });

    it('disables submit button for empty input', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button for non-empty input', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'test');
      expect(submitButton).toBeEnabled();
    });

    it('disables input during processing', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'success');
      await user.click(submitButton);
      
      expect(input).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });

  describe('Error Simulation', () => {
    it('simulates timeout error when "timeout" keyword is used', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'timeout test');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Timeout Error')).toBeInTheDocument();
        expect(screen.getByText(/Request timed out/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('simulates unavailable error when "unavailable" keyword is used', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'unavailable service');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Unavailable Error')).toBeInTheDocument();
        expect(screen.getByText(/AI service is currently unavailable/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('simulates unexpected error when "error" keyword is used', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'error test');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
        expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('simulates low confidence when "low confidence" keywords are used', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'low confidence test');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Low Confidence')).toBeInTheDocument();
        expect(screen.getByText(/Results found but with lower confidence/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('shows successful results for normal queries', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'success test');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Processing Results')).toBeInTheDocument();
        expect(screen.getByText(/Successfully processed your request/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Recovery Options', () => {
    it('displays recovery options for errors', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'error');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Recovery Options:')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
        expect(screen.getByText('Simplify Query')).toBeInTheDocument();
        expect(screen.getByText('Manual Mode')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('handles retry recovery option', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'error');
      await user.click(submitButton);
      
      await waitFor(() => {
        const retryButton = screen.getByText('Try Again');
        expect(retryButton).toBeInTheDocument();
      }, { timeout: 3000 });

      const retryButton = screen.getByText('Try Again');
      await user.click(retryButton);
      
      // Should show recovering state and then retry the operation
      await waitFor(() => {
        expect(screen.getByText('Recovering')).toBeInTheDocument();
      });
    });

    it('handles fallback recovery option', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'timeout');
      await user.click(submitButton);
      
      await waitFor(() => {
        const fallbackButton = screen.getByText('Reduce Scope');
        expect(fallbackButton).toBeInTheDocument();
      }, { timeout: 3000 });

      const fallbackButton = screen.getByText('Reduce Scope');
      await user.click(fallbackButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Process a smaller portion/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('handles manual mode recovery option', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'error');
      await user.click(submitButton);
      
      await waitFor(() => {
        const manualButton = screen.getByText('Manual Mode');
        expect(manualButton).toBeInTheDocument();
      }, { timeout: 3000 });

      const manualButton = screen.getByText('Manual Mode');
      await user.click(manualButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Switched to manual mode/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('handles feedback recovery option', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'unavailable');
      await user.click(submitButton);
      
      await waitFor(() => {
        const feedbackButton = screen.getByText('Report Issue');
        expect(feedbackButton).toBeInTheDocument();
      }, { timeout: 3000 });

      const feedbackButton = screen.getByText('Report Issue');
      await user.click(feedbackButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Feedback sent successfully/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('System State Management', () => {
    it('shows initial system state as working', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      expect(screen.getByText('Working')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // retry count
    });

    it('updates system state during processing', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'test');
      await user.click(submitButton);
      
      // Should show processing indicator
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('updates retry count after recovery attempts', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'error');
      await user.click(submitButton);
      
      await waitFor(() => {
        const retryButton = screen.getByText('Try Again');
        expect(retryButton).toBeInTheDocument();
      }, { timeout: 3000 });

      const retryButton = screen.getByText('Try Again');
      await user.click(retryButton);
      
      // Retry count should increment
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument(); // updated retry count
      }, { timeout: 3000 });
    });

    it('shows correct state colors and icons', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      // Initial working state should have green color
      expect(screen.getByText('Working')).toHaveClass('text-green-600');
      
      // Trigger error state
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'error');
      await user.click(submitButton);
      
      await waitFor(() => {
        // Error state should have red color
        expect(screen.getByText('Error')).toHaveClass('text-red-600');
      }, { timeout: 3000 });
    });
  });

  describe('Form Submission', () => {
    it('handles form submission via Enter key', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      
      await user.type(input, 'success');
      await user.keyboard('{Enter}');
      
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('prevents submission with empty input', async () => {
      const user = userEvent.setup();
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.click(submitButton);
      
      // Should not start processing
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form controls', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('has proper button roles', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('has proper headings structure', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      expect(screen.getByText('Error Recovery & Graceful Degradation')).toBeInTheDocument();
      expect(screen.getByText('System Status')).toBeInTheDocument();
      expect(screen.getByText('Error Types')).toBeInTheDocument();
      expect(screen.getByText('Recovery Strategies')).toBeInTheDocument();
    });

    it('shows proper disabled states', () => {
      render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot in initial state', () => {
      const { container } = render(<ErrorRecoveryDemo {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with query input', async () => {
      const user = userEvent.setup();
      const { container } = render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      await user.type(input, 'test query');
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with error state', async () => {
      const user = userEvent.setup();
      const { container } = render(<ErrorRecoveryDemo {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/Try keywords:/);
      const submitButton = screen.getByRole('button', { name: 'Process Query' });
      
      await user.type(input, 'error');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});