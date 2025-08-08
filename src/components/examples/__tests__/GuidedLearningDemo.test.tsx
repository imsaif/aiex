import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuidedLearningDemo from '../GuidedLearningDemo';

// Mock document methods for testing
const mockQuerySelector = jest.fn();
const mockQuerySelectorAll = jest.fn(() => []);
const mockClassListAdd = jest.fn();
const mockClassListRemove = jest.fn();

Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: mockQuerySelector,
});

Object.defineProperty(document, 'querySelectorAll', {
  writable: true,
  value: mockQuerySelectorAll,
});

describe('GuidedLearningDemo', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuerySelector.mockReturnValue({
      classList: {
        add: mockClassListAdd,
        remove: mockClassListRemove,
      },
    });
    mockQuerySelectorAll.mockReturnValue([
      {
        classList: {
          remove: mockClassListRemove,
        },
      },
    ]);
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<GuidedLearningDemo {...defaultProps} />);
    });

    it('renders with correct initial structure', () => {
      render(<GuidedLearningDemo {...defaultProps} />);
      
      // Check for main components - use heading role for specificity
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Dashboard Basics')).toBeInTheDocument();
      expect(screen.getByText('Learn how to navigate and use your dashboard effectively')).toBeInTheDocument();
    });

    it('renders navigation menu', () => {
      render(<GuidedLearningDemo {...defaultProps} />);
      
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders analytics section', () => {
      render(<GuidedLearningDemo {...defaultProps} />);
      
      expect(screen.getByText('Analytics Overview')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$12,345')).toBeInTheDocument();
    });

    it('renders tutorial controls', () => {
      render(<GuidedLearningDemo {...defaultProps} />);
      
      expect(screen.getByText('beginner')).toBeInTheDocument();
      expect(screen.getByText('⏱️ 5 minutes')).toBeInTheDocument();
      expect(screen.getByText('📋 5 steps')).toBeInTheDocument();
      expect(screen.getByText('Start Tutorial')).toBeInTheDocument();
    });
  });

  describe('Tutorial State Management', () => {
    it('starts tutorial when Start Tutorial button is clicked', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      // Tutorial overlay should appear
      expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
      expect(screen.getByText('Welcome to Your Dashboard')).toBeInTheDocument();
    });

    it('shows correct progress bar when tutorial is active', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      expect(screen.getByText('20% complete')).toBeInTheDocument();
    });

    it('navigates through tutorial steps correctly', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      // First step
      expect(screen.getByText('Welcome to Your Dashboard')).toBeInTheDocument();
      
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Second step
      expect(screen.getByText('Navigation Menu')).toBeInTheDocument();
      expect(screen.getByText('40% complete')).toBeInTheDocument();
    });

    it('handles previous button correctly', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      // Go to next step
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Go back to previous step
      const previousButton = screen.getByText('Previous');
      await user.click(previousButton);
      
      expect(screen.getByText('Welcome to Your Dashboard')).toBeInTheDocument();
      expect(screen.getByText('20% complete')).toBeInTheDocument();
    });

    it('disables previous button on first step', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      const previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
    });
  });

  describe('Tutorial Features', () => {
    it('shows and hides hints correctly', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      // Go to step with hint
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Show hint
      const showHintButton = screen.getByText('Show Hint');
      await user.click(showHintButton);
      
      expect(screen.getByText('💡 Hint:')).toBeInTheDocument();
      expect(screen.getByText('Look for the Analytics link in the left sidebar')).toBeInTheDocument();
      
      // Hide hint
      const hideHintButton = screen.getByText('Hide Hint');
      await user.click(hideHintButton);
      
      expect(screen.queryByText('💡 Hint:')).not.toBeInTheDocument();
    });

    it('skips tutorial when Skip Tutorial button is clicked', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      const skipButton = screen.getByText('Skip Tutorial');
      await user.click(skipButton);
      
      // Should return to initial state
      expect(screen.getByText('Start Tutorial')).toBeInTheDocument();
      expect(screen.queryByText('Step 1 of 5')).not.toBeInTheDocument();
    });

    it('completes tutorial on final step', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      // Navigate to final step
      let nextButton = screen.getByText('Next');
      for (let i = 0; i < 4; i++) {
        await user.click(nextButton);
        if (i < 3) {
          nextButton = screen.getByText('Next');
        }
      }
      
      // Final step should show Complete button
      const completeButton = screen.getByText('Complete');
      await user.click(completeButton);
      
      // Should show completion state
      expect(screen.getByText('Tutorial completed!')).toBeInTheDocument();
      expect(screen.getByText('Restart Tutorial')).toBeInTheDocument();
    });

    it('handles element highlighting', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      // Go to step with target element
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      // Should call querySelector and add highlight class
      expect(mockQuerySelector).toHaveBeenCalledWith('.navigation-menu');
      expect(mockClassListAdd).toHaveBeenCalledWith('tutorial-highlight');
    });
  });

  describe('Filter Interaction', () => {
    it('handles filter dropdown changes', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const filterSelect = screen.getByDisplayValue('Last 30 days');
      await user.selectOptions(filterSelect, 'Last 7 days');
      
      expect(filterSelect).toHaveValue('Last 7 days');
    });

    it('handles export button click', async () => {
      const user = userEvent.setup();
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const exportButton = screen.getByText('Export');
      await user.click(exportButton);
      
      // Button should remain in document (no action defined, just visual feedback)
      expect(exportButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Start button should be accessible
      const startButton = screen.getByText('Start Tutorial');
      expect(startButton).toBeInTheDocument();
    });

    it('has proper headings structure', () => {
      render(<GuidedLearningDemo {...defaultProps} />);
      
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Dashboard Basics')).toBeInTheDocument();
    });

    it('has proper form controls', () => {
      render(<GuidedLearningDemo {...defaultProps} />);
      
      const selectElement = screen.getByDisplayValue('Last 30 days');
      expect(selectElement).toHaveRole('combobox');
    });
  });

  describe('Cleanup', () => {
    it('removes highlighting when component unmounts', () => {
      const { unmount } = render(<GuidedLearningDemo {...defaultProps} />);
      
      unmount();
      
      // Cleanup function should be called
      expect(mockQuerySelectorAll).toHaveBeenCalledWith('.tutorial-highlight');
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot in initial state', () => {
      const { container } = render(<GuidedLearningDemo {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot when tutorial is active', async () => {
      const user = userEvent.setup();
      const { container } = render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot when tutorial is completed', async () => {
      const user = userEvent.setup();
      const { container } = render(<GuidedLearningDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Tutorial');
      await user.click(startButton);
      
      // Complete tutorial quickly
      let nextButton = screen.getByText('Next');
      for (let i = 0; i < 4; i++) {
        await user.click(nextButton);
        if (i < 3) {
          nextButton = screen.getByText('Next');
        }
      }
      
      const completeButton = screen.getByText('Complete');
      await user.click(completeButton);
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});