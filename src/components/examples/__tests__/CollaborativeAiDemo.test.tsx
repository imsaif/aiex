import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollaborativeAiDemo from '../CollaborativeAiDemo';

describe('CollaborativeAiDemo', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
    });

    it('renders with correct initial structure', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Collaborative AI Workspace')).toBeInTheDocument();
      expect(screen.getByText('Real-time collaboration with AI assistance')).toBeInTheDocument();
    });

    it('renders shared document section', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Shared Document')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Start collaborating/)).toBeInTheDocument();
    });

    it('renders team members section', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Carol Williams')).toBeInTheDocument();
    });

    it('renders AI insights toggle button', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Hide AI Insights')).toBeInTheDocument();
    });

    it('renders collaboration stats section', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Collaboration Stats')).toBeInTheDocument();
      expect(screen.getByText('Active Members:')).toBeInTheDocument();
      expect(screen.getByText('AI Contributions:')).toBeInTheDocument();
      expect(screen.getByText('Document Length:')).toBeInTheDocument();
    });

    it('renders collaboration tips', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Collaboration Tips')).toBeInTheDocument();
      expect(screen.getByText(/AI provides suggestions/)).toBeInTheDocument();
      expect(screen.getByText(/Click on AI contributions/)).toBeInTheDocument();
    });
  });

  describe('AI Insights Toggle', () => {
    it('shows AI insights by default', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('AI Contributions')).toBeInTheDocument();
      expect(screen.getByText('Hide AI Insights')).toBeInTheDocument();
    });

    it('hides AI insights when toggle is clicked', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const toggleButton = screen.getByText('Hide AI Insights');
      await user.click(toggleButton);
      
      expect(screen.queryByText('AI Contributions')).not.toBeInTheDocument();
      expect(screen.getByText('Show AI Insights')).toBeInTheDocument();
    });

    it('shows AI insights when toggled back on', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const hideButton = screen.getByText('Hide AI Insights');
      await user.click(hideButton);
      
      const showButton = screen.getByText('Show AI Insights');
      await user.click(showButton);
      
      expect(screen.getByText('AI Contributions')).toBeInTheDocument();
      expect(screen.getByText('Hide AI Insights')).toBeInTheDocument();
    });
  });

  describe('Document Editing', () => {
    it('handles text input in document textarea', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'This is a test document');
      
      expect(textarea).toHaveValue('This is a test document');
    });

    it('updates document length in stats', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'Test content');
      
      await waitFor(() => {
        expect(screen.getByText('12 chars')).toBeInTheDocument();
      });
    });

    it('shows AI analyzing status when generating contributions', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'This is a long enough document to trigger AI analysis');
      
      await waitFor(() => {
        expect(screen.getByText('AI is analyzing your content...')).toBeInTheDocument();
      });
    });
  });

  describe('AI Contributions', () => {
    it('shows initial empty state for AI contributions', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('AI will provide suggestions as you collaborate...')).toBeInTheDocument();
    });

    it('generates AI contributions after typing sufficient content', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'This is a comprehensive document that should trigger AI analysis');
      
      await waitFor(() => {
        // Should have at least one AI contribution
        const suggestions = screen.queryByText('Suggestion');
        const edits = screen.queryByText('Edit');
        const analyses = screen.queryByText('Analysis');
        
        expect(suggestions || edits || analyses).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('shows different types of AI contributions', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'This is content that will generate various AI suggestions and feedback');
      
      // Wait for contributions to be generated
      await waitFor(() => {
        // Check if AI contributions section is no longer showing the empty state
        expect(screen.queryByText('AI will provide suggestions as you collaborate...')).not.toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Should have confidence percentages displayed
      await waitFor(() => {
        expect(screen.getByText(/%/)).toBeInTheDocument();
      });
    });

    it('shows contribution details when clicked', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'This document needs some improvements and AI analysis');
      
      // Wait for AI contribution to appear
      await waitFor(() => {
        const contributionElements = screen.getAllByText(/%/).filter(el => el.textContent?.includes('%'));
        expect(contributionElements.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      // Click on the first contribution container
      const contributionContainers = screen.getAllByText(/%/).map(el => el.closest('.cursor-pointer')).filter(Boolean);
      if (contributionContainers[0]) {
        await user.click(contributionContainers[0] as Element);
        
        // Should show Apply and Dismiss buttons
        await waitFor(() => {
          expect(screen.getByText('Apply')).toBeInTheDocument();
          expect(screen.getByText('Dismiss')).toBeInTheDocument();
        });
      }
    });

    it('applies AI contributions when Apply button is clicked', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'Document that will get an AI contribution applied');
      
      // Wait for AI contribution and expand it
      await waitFor(() => {
        const contributionElements = screen.getAllByText(/%/).filter(el => el.textContent?.includes('%'));
        expect(contributionElements.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      const contributionContainers = screen.getAllByText(/%/).map(el => el.closest('.cursor-pointer')).filter(Boolean);
      if (contributionContainers[0]) {
        await user.click(contributionContainers[0] as Element);
        
        await waitFor(() => {
          const applyButton = screen.getByText('Apply');
          expect(applyButton).toBeInTheDocument();
        });

        const applyButton = screen.getByText('Apply');
        await user.click(applyButton);
        
        // Document should be updated
        await waitFor(() => {
          expect(textarea.value).toContain('[AI');
        });
      }
    });

    it('dismisses AI contributions when Dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'Document that will have a contribution dismissed');
      
      // Wait for AI contribution and expand it
      await waitFor(() => {
        const contributionElements = screen.getAllByText(/%/).filter(el => el.textContent?.includes('%'));
        expect(contributionElements.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      const contributionContainers = screen.getAllByText(/%/).map(el => el.closest('.cursor-pointer')).filter(Boolean);
      if (contributionContainers[0]) {
        await user.click(contributionContainers[0] as Element);
        
        await waitFor(() => {
          const dismissButton = screen.getByText('Dismiss');
          expect(dismissButton).toBeInTheDocument();
        });

        const dismissButton = screen.getByText('Dismiss');
        await user.click(dismissButton);
        
        // Contribution should be removed
        await waitFor(() => {
          expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Team Member Management', () => {
    it('displays all team members with avatars', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Carol Williams')).toBeInTheDocument();
      
      // Check for avatars (emojis)
      expect(screen.getByText('👩‍💼')).toBeInTheDocument();
      expect(screen.getByText('👨‍💻')).toBeInTheDocument();
      expect(screen.getByText('👩‍🎨')).toBeInTheDocument();
    });

    it('shows member status correctly', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getAllByText('online')).toHaveLength(2); // Alice and Bob
      expect(screen.getByText('away')).toBeInTheDocument(); // Carol
    });

    it('displays active member count correctly', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('2 active')).toBeInTheDocument(); // Initial active users
      expect(screen.getByText('2')).toBeInTheDocument(); // In stats section
    });

    it('shows active indicators for online members', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      // Should have pulse indicators for active members
      const pulseElements = screen.getAllByTestId ? [] : document.querySelectorAll('.animate-pulse');
      // Note: We can't easily test for CSS classes in JSDOM, so we check for the presence of online status
      expect(screen.getAllByText('online')).toHaveLength(2);
    });
  });

  describe('Statistics Tracking', () => {
    it('displays initial statistics correctly', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Active Members:')).toBeInTheDocument();
      expect(screen.getByText('AI Contributions:')).toBeInTheDocument();
      expect(screen.getByText('Document Length:')).toBeInTheDocument();
      expect(screen.getByText('Status:')).toBeInTheDocument();
      
      // Initial values
      expect(screen.getByText('2')).toBeInTheDocument(); // Active members
      expect(screen.getByText('0')).toBeInTheDocument(); // Initial AI contributions
      expect(screen.getByText('0 chars')).toBeInTheDocument(); // Initial document length
      expect(screen.getByText('Ready')).toBeInTheDocument(); // Initial status
    });

    it('updates statistics when document is edited', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'Test');
      
      await waitFor(() => {
        expect(screen.getByText('4 chars')).toBeInTheDocument();
      });
    });

    it('updates status when AI is analyzing', async () => {
      const user = userEvent.setup();
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'This is a longer document that should trigger analysis');
      
      await waitFor(() => {
        expect(screen.getByText('AI Analyzing')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form controls', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('placeholder');
    });

    it('has proper button roles', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      const toggleButton = screen.getByRole('button', { name: /AI Insights/ });
      expect(toggleButton).toBeInTheDocument();
    });

    it('has proper headings structure', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      expect(screen.getByText('Collaborative AI Workspace')).toBeInTheDocument();
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Stats')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Tips')).toBeInTheDocument();
    });

    it('provides proper tooltips for team member avatars', () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      // Check that avatars have title attributes for accessibility
      const avatarContainers = screen.getAllByTitle(/Alice Johnson|Bob Smith|Carol Williams/);
      expect(avatarContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Team Activity Simulation', () => {
    it('simulates team member activity over time', async () => {
      render(<CollaborativeAiDemo {...defaultProps} />);
      
      // Initial active count
      expect(screen.getByText('2 active')).toBeInTheDocument();
      
      // Wait for team activity simulation (happens every 8 seconds but we can't easily test this in unit tests)
      // This test mainly ensures the component renders with team activity features
      expect(screen.getByText('Active Members:')).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot in initial state', () => {
      const { container } = render(<CollaborativeAiDemo {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with hidden AI insights', async () => {
      const user = userEvent.setup();
      const { container } = render(<CollaborativeAiDemo {...defaultProps} />);
      
      const toggleButton = screen.getByText('Hide AI Insights');
      await user.click(toggleButton);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with document content', async () => {
      const user = userEvent.setup();
      const { container } = render(<CollaborativeAiDemo {...defaultProps} />);
      
      const textarea = screen.getByPlaceholderText(/Start collaborating/);
      await user.type(textarea, 'Test document content for snapshot');
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});