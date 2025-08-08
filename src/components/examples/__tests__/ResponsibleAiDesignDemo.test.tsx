import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResponsibleAiDesignDemo from '../ResponsibleAiDesignDemo';

describe('ResponsibleAiDesignDemo', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
    });

    it('renders with correct initial structure', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      expect(screen.getByText('Responsible AI Design Assistant')).toBeInTheDocument();
      expect(screen.getByText('Analyze content for bias, inclusivity, and ethical considerations')).toBeInTheDocument();
    });

    it('renders content analysis section', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      expect(screen.getByText('Content Analysis')).toBeInTheDocument();
      expect(screen.getByText('Content Input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter content to analyze/)).toBeInTheDocument();
    });

    it('renders analysis status section', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      expect(screen.getByText('Analysis Status')).toBeInTheDocument();
      expect(screen.getByText('Content Length:')).toBeInTheDocument();
      expect(screen.getByText('Analysis Status:')).toBeInTheDocument();
    });

    it('renders best practices section', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      expect(screen.getByText('Best Practices')).toBeInTheDocument();
      expect(screen.getByText('Use inclusive language for all demographics')).toBeInTheDocument();
      expect(screen.getByText('Avoid assumptions about user abilities')).toBeInTheDocument();
    });
  });

  describe('Ethics Principles Toggle', () => {
    it('shows ethics principles when button is clicked', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const showButton = screen.getByText('Show AI Ethics Principles');
      await user.click(showButton);
      
      expect(screen.getByText('Core AI Ethics Principles')).toBeInTheDocument();
      expect(screen.getByText('Fairness')).toBeInTheDocument();
      expect(screen.getByText('Transparency')).toBeInTheDocument();
      expect(screen.getByText('Inclusivity')).toBeInTheDocument();
      expect(screen.getByText('Accountability')).toBeInTheDocument();
    });

    it('hides ethics principles when clicked again', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const showButton = screen.getByText('Show AI Ethics Principles');
      await user.click(showButton);
      
      const hideButton = screen.getByText('Hide AI Ethics Principles');
      await user.click(hideButton);
      
      expect(screen.queryByText('Core AI Ethics Principles')).not.toBeInTheDocument();
    });
  });

  describe('Content Analysis', () => {
    it('handles text input in textarea', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'Sample content for analysis');
      
      expect(textarea).toHaveValue('Sample content for analysis');
    });

    it('updates content length when typing', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'Test');
      
      // Should show 4 characters
      await waitFor(() => {
        expect(screen.getByText('4 characters')).toBeInTheDocument();
      });
    });

    it('shows analyzing status when typing enough content', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'This is a longer text that should trigger analysis process');
      
      await waitFor(() => {
        expect(screen.getByText('Analyzing...')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('shows ethics report after analysis', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'This is a longer text that should trigger analysis');
      
      // Wait for analysis to complete and report to appear
      await waitFor(() => {
        expect(screen.getByText('Ethics Report')).toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('Bias Detection', () => {
    it('detects gender bias when only male pronouns are used', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'He is a great developer and he works hard on his projects');
      
      // Wait for bias alert to appear
      await waitFor(() => {
        expect(screen.getByText(/gender bias detected/i)).toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('detects age bias when only young references are used', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'Young people are very talented and bring fresh perspectives');
      
      // Wait for age bias alert
      await waitFor(() => {
        expect(screen.getByText(/age bias detected/i)).toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('detects accessibility issues with visual language', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'Please look at this interface and see the important features');
      
      // Wait for accessibility alert
      await waitFor(() => {
        expect(screen.getByText(/accessibility concern/i)).toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('Ethics Scores', () => {
    it('displays overall score after analysis', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'This is neutral content without any bias indicators');
      
      await waitFor(() => {
        expect(screen.getByText('Overall Score')).toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('displays inclusivity and transparency scores', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'Content for analysis testing purposes');
      
      await waitFor(() => {
        expect(screen.getByText('Inclusivity')).toBeInTheDocument();
        expect(screen.getByText('Transparency')).toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('shows bias alerts section when issues are found', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'He should look at this feature carefully');
      
      await waitFor(() => {
        expect(screen.getByText('Bias Alerts')).toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('Analysis Status Updates', () => {
    it('shows waiting status for short content', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      expect(screen.getByText('Waiting for content')).toBeInTheDocument();
    });

    it('updates issues count when bias is detected', async () => {
      const user = userEvent.setup();
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'He should see this important feature');
      
      await waitFor(() => {
        expect(screen.getByText('Issues Found:')).toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Ethics principles button should be accessible
      expect(screen.getByText('Show AI Ethics Principles')).toBeInTheDocument();
    });

    it('has proper form controls', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('placeholder');
    });

    it('has proper headings structure', () => {
      render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      expect(screen.getByText('Responsible AI Design Assistant')).toBeInTheDocument();
      expect(screen.getByText('Content Analysis')).toBeInTheDocument();
      expect(screen.getByText('Analysis Status')).toBeInTheDocument();
      expect(screen.getByText('Best Practices')).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot in initial state', () => {
      const { container } = render(<ResponsibleAiDesignDemo {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with ethics principles shown', async () => {
      const user = userEvent.setup();
      const { container } = render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const showButton = screen.getByText('Show AI Ethics Principles');
      await user.click(showButton);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with content and analysis', async () => {
      const user = userEvent.setup();
      const { container } = render(<ResponsibleAiDesignDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Enter content to analyze/);
      await user.type(textarea, 'Sample content for testing');
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});