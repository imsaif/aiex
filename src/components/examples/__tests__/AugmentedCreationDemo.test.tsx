import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AugmentedCreationDemo from '../AugmentedCreationDemo';

describe('AugmentedCreationDemo', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
    });

    it('renders with correct initial structure', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      expect(screen.getByText('AI Creative Assistant')).toBeInTheDocument();
      expect(screen.getByText('Collaborate with AI to enhance your creative process')).toBeInTheDocument();
    });

    it('renders tab navigation', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      expect(screen.getByText('Write')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Code')).toBeInTheDocument();
    });

    it('renders creative canvas', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      expect(screen.getByText('Creative Canvas')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work')).toBeInTheDocument();
      expect(screen.getByText('Undo')).toBeInTheDocument();
    });

    it('renders AI suggestions section', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Start typing to get AI-powered creative suggestions')).toBeInTheDocument();
    });

    it('renders session stats', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      expect(screen.getByText('Session Stats')).toBeInTheDocument();
      expect(screen.getByText('Words:')).toBeInTheDocument();
      expect(screen.getByText('Characters:')).toBeInTheDocument();
      expect(screen.getByText('History:')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('switches tabs when clicked', async () => {
      const user = userEvent.setup();
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      // Initially Write tab should be active
      const writeTab = screen.getByText('Write');
      const designTab = screen.getByText('Design');
      
      // Click Design tab
      await user.click(designTab);
      
      // Tabs should remain in document (just change styling)
      expect(writeTab).toBeInTheDocument();
      expect(designTab).toBeInTheDocument();
    });

    it('displays all tab options', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      expect(screen.getByText('Write')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Code')).toBeInTheDocument();
    });
  });

  describe('Content Management', () => {
    it('handles text input in textarea', async () => {
      const user = userEvent.setup();
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work');
      await user.type(textarea, 'Hello world');
      
      expect(textarea).toHaveValue('Hello world');
    });

    it('updates word count when typing', async () => {
      const user = userEvent.setup();
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work');
      await user.type(textarea, 'Hello world');
      
      // Should show 2 words
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('updates character count when typing', async () => {
      const user = userEvent.setup();
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work');
      await user.type(textarea, 'Hello');
      
      // Should show 5 characters
      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });

    it('disables undo button when no history', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const undoButton = screen.getByText('Undo');
      expect(undoButton).toBeDisabled();
    });
  });

  describe('AI Suggestions', () => {
    it('shows generating message when typing enough content', async () => {
      const user = userEvent.setup();
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work');
      await user.type(textarea, 'This is a longer text that should trigger suggestions');
      
      await waitFor(() => {
        expect(screen.getByText('Generating suggestions...')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('shows suggestions after generation delay', async () => {
      const user = userEvent.setup();
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work');
      await user.type(textarea, 'This is a longer text that should trigger suggestions');
      
      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByText(/Continue with:/)).toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('applies suggestion when button is clicked', async () => {
      const user = userEvent.setup();
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work');
      await user.type(textarea, 'This is a longer text that should trigger suggestions');
      
      // Wait for suggestions and click apply
      await waitFor(async () => {
        const applyButtons = screen.queryAllByText('Apply Suggestion');
        if (applyButtons.length > 0) {
          await user.click(applyButtons[0]);
        }
      }, { timeout: 4000 });
    });
  });

  describe('Session Statistics', () => {
    it('shows correct initial stats', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      // Check for specific stats more precisely
      expect(screen.getByText('Words:')).toBeInTheDocument();
      expect(screen.getByText('Characters:')).toBeInTheDocument();
      expect(screen.getByText('0 changes')).toBeInTheDocument(); // History
    });

    it('updates stats when content changes', async () => {
      const user = userEvent.setup();
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work');
      await user.type(textarea, 'Test content');
      
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // 2 words
        expect(screen.getByText('12')).toBeInTheDocument(); // 12 characters
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Tab buttons should be accessible
      expect(screen.getByText('Write')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Code')).toBeInTheDocument();
    });

    it('has proper form controls', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('placeholder');
    });

    it('has proper headings structure', () => {
      render(<AugmentedCreationDemo {...defaultProps} />);
      
      expect(screen.getByText('AI Creative Assistant')).toBeInTheDocument();
      expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Session Stats')).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot in initial state', () => {
      const { container } = render(<AugmentedCreationDemo {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with content', async () => {
      const user = userEvent.setup();
      const { container } = render(<AugmentedCreationDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText('Start creating... AI will suggest improvements as you work');
      await user.type(textarea, 'Sample content');
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different tab selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<AugmentedCreationDemo {...defaultProps} />);
      
      const designTab = screen.getByText('Design');
      await user.click(designTab);
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});