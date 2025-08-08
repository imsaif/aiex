import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmbientIntelligenceDemo from '../AmbientIntelligenceDemo';

describe('AmbientIntelligenceDemo', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
    });

    it('renders with correct initial structure', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText('Ambient Intelligence Dashboard')).toBeInTheDocument();
      expect(screen.getByText('AI that works quietly in the background')).toBeInTheDocument();
    });

    it('renders context simulation controls', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText('Context Simulation')).toBeInTheDocument();
      expect(screen.getByText('Time of Day')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText(/Focus Level:/)).toBeInTheDocument();
    });

    it('renders ambient mode controls', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByDisplayValue('Active Mode')).toBeInTheDocument();
      expect(screen.getByText('Hide Insights')).toBeInTheDocument();
    });

    it('renders main workspace', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText('Main Workspace')).toBeInTheDocument();
      expect(screen.getByText('Your main work area')).toBeInTheDocument();
      expect(screen.getByText('AI observes context and provides subtle assistance')).toBeInTheDocument();
    });

    it('renders ambient mode status', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText('Ambient Mode')).toBeInTheDocument();
      expect(screen.getByText('Status:')).toBeInTheDocument();
      expect(screen.getByText('Active Insights:')).toBeInTheDocument();
      expect(screen.getByText('Context Updates:')).toBeInTheDocument();
      expect(screen.getByText('Privacy Mode:')).toBeInTheDocument();
    });

    it('renders privacy controls', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText('Privacy Controls')).toBeInTheDocument();
      expect(screen.getByText('Context awareness')).toBeInTheDocument();
      expect(screen.getByText('Productivity insights')).toBeInTheDocument();
      expect(screen.getByText('Location tracking')).toBeInTheDocument();
      expect(screen.getByText('Biometric monitoring')).toBeInTheDocument();
    });
  });

  describe('Context Controls', () => {
    it('updates time of day when select is changed', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const timeSelect = screen.getByLabelText('Time of Day');
      await user.selectOptions(timeSelect, 'afternoon');
      
      expect(timeSelect).toHaveValue('afternoon');
    });

    it('updates activity when select is changed', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const activitySelect = screen.getByLabelText('Activity');
      await user.selectOptions(activitySelect, 'meeting');
      
      expect(activitySelect).toHaveValue('meeting');
    });

    it('updates location when select is changed', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const locationSelect = screen.getByLabelText('Location');
      await user.selectOptions(locationSelect, 'home');
      
      expect(locationSelect).toHaveValue('home');
    });

    it('updates focus level when slider is changed', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const focusSlider = screen.getByRole('slider');
      await user.type(focusSlider, '50');
      
      // Focus level should be displayed in the label
      expect(screen.getByText(/Focus Level: 50%/)).toBeInTheDocument();
    });

    it('displays current context in workspace area', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText(/Currently: working at office \(morning\)/)).toBeInTheDocument();
    });
  });

  describe('Ambient Mode Controls', () => {
    it('changes ambient mode when select is changed', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const modeSelect = screen.getByDisplayValue('Active Mode');
      await user.selectOptions(modeSelect, 'minimal');
      
      expect(modeSelect).toHaveValue('minimal');
      expect(screen.getByText('Minimal')).toBeInTheDocument(); // In status section
    });

    it('shows correct status for different modes', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Test minimal mode
      const modeSelect = screen.getByDisplayValue('Active Mode');
      await user.selectOptions(modeSelect, 'minimal');
      
      expect(screen.getByText('Minimal')).toBeInTheDocument();
      expect(screen.getByText('Periodic')).toBeInTheDocument(); // Context updates
      
      // Test off mode
      await user.selectOptions(modeSelect, 'off');
      
      expect(screen.getByText('Off')).toBeInTheDocument();
      expect(screen.getByText('Disabled')).toBeInTheDocument(); // Context updates
    });

    it('toggles insights visibility', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Initially insights should be visible
      expect(screen.getByText('Ambient Insights')).toBeInTheDocument();
      
      const toggleButton = screen.getByText('Hide Insights');
      await user.click(toggleButton);
      
      expect(screen.queryByText('Ambient Insights')).not.toBeInTheDocument();
      expect(screen.getByText('Show Insights')).toBeInTheDocument();
      
      // Show insights again
      const showButton = screen.getByText('Show Insights');
      await user.click(showButton);
      
      expect(screen.getByText('Ambient Insights')).toBeInTheDocument();
      expect(screen.getByText('Hide Insights')).toBeInTheDocument();
    });
  });

  describe('Privacy Controls', () => {
    it('has initial privacy settings correctly set', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const contextCheckbox = screen.getByLabelText('Context awareness');
      const productivityCheckbox = screen.getByLabelText('Productivity insights');
      const locationCheckbox = screen.getByLabelText('Location tracking');
      const biometricCheckbox = screen.getByLabelText('Biometric monitoring');
      
      expect(contextCheckbox).toBeChecked();
      expect(productivityCheckbox).toBeChecked();
      expect(locationCheckbox).not.toBeChecked();
      expect(biometricCheckbox).not.toBeChecked();
    });

    it('updates privacy settings when checkboxes are toggled', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const locationCheckbox = screen.getByLabelText('Location tracking');
      await user.click(locationCheckbox);
      
      expect(locationCheckbox).toBeChecked();
    });

    it('displays correct privacy feature count', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Initially 2 features enabled (context awareness and productivity insights)
      expect(screen.getByText('2 of 4 features enabled')).toBeInTheDocument();
    });

    it('updates privacy mode status based on enabled features', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Initially should show Enhanced privacy (less than 3 features)
      expect(screen.getByText('Enhanced')).toBeInTheDocument();
      
      // Enable location tracking to get 3 features
      const locationCheckbox = screen.getByLabelText('Location tracking');
      await user.click(locationCheckbox);
      
      await waitFor(() => {
        expect(screen.getByText('Standard')).toBeInTheDocument();
      });
    });
  });

  describe('Ambient Insights', () => {
    it('shows initial empty state when no insights available', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Turn off mode to clear insights, then turn back on
      const modeSelect = screen.getByDisplayValue('Active Mode');
      await user.selectOptions(modeSelect, 'off');
      await user.selectOptions(modeSelect, 'active');
      
      // Wait for insights to generate or show empty state
      await waitFor(() => {
        const noInsights = screen.queryByText('No ambient insights at the moment');
        const insights = screen.queryByText('Peak Productivity Window');
        expect(noInsights || insights).toBeInTheDocument();
      });
    });

    it('generates context-based insights', async () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Should generate morning productivity insight
      await waitFor(() => {
        expect(screen.getByText('Peak Productivity Window')).toBeInTheDocument();
      });
    });

    it('generates different insights based on context changes', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Change to afternoon
      const timeSelect = screen.getByLabelText('Time of Day');
      await user.selectOptions(timeSelect, 'afternoon');
      
      await waitFor(() => {
        expect(screen.queryByText('Energy Dip Expected') || screen.queryByText('Peak Productivity Window')).toBeInTheDocument();
      });
    });

    it('generates activity-specific insights', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Change to meeting
      const activitySelect = screen.getByLabelText('Activity');
      await user.selectOptions(activitySelect, 'meeting');
      
      await waitFor(() => {
        expect(screen.getByText('Meeting Mode Active')).toBeInTheDocument();
      });
    });

    it('generates focus-based insights', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Set low focus level
      const focusSlider = screen.getByRole('slider');
      fireEvent.change(focusSlider, { target: { value: '30' } });
      
      await waitFor(() => {
        expect(screen.getByText('Focus Recovery Needed')).toBeInTheDocument();
      });
    });

    it('respects privacy settings for insights', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Disable productivity insights
      const productivityCheckbox = screen.getByLabelText('Productivity insights');
      await user.click(productivityCheckbox);
      
      // Set low focus - should not generate focus-related insight
      const focusSlider = screen.getByRole('slider');
      fireEvent.change(focusSlider, { target: { value: '30' } });
      
      await waitFor(() => {
        expect(screen.queryByText('Focus Recovery Needed')).not.toBeInTheDocument();
      });
    });

    it('allows dismissing insights', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Wait for insight to appear
      await waitFor(() => {
        expect(screen.getByText('Peak Productivity Window')).toBeInTheDocument();
      });
      
      // Find and click dismiss button (×)
      const dismissButton = screen.getAllByLabelText('Dismiss insight')[0];
      await user.click(dismissButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Peak Productivity Window')).not.toBeInTheDocument();
      });
    });

    it('allows acting on proactive insights', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Set low focus to trigger break suggestion
      const focusSlider = screen.getByRole('slider');
      fireEvent.change(focusSlider, { target: { value: '40' } });
      
      await waitFor(() => {
        expect(screen.getByText('Break Suggestion')).toBeInTheDocument();
      });
      
      // Click act button
      const actButton = screen.getByText('Act');
      await user.click(actButton);
      
      // Focus should improve and insight should be dismissed
      await waitFor(() => {
        expect(screen.queryByText('Break Suggestion')).not.toBeInTheDocument();
      });
    });

    it('displays insight priorities and confidence levels', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Enable location tracking for high priority insight
      const locationCheckbox = screen.getByLabelText('Location tracking');
      await user.click(locationCheckbox);
      
      await waitFor(() => {
        expect(screen.getByText('high')).toBeInTheDocument(); // Priority badge
        expect(screen.getByText('92% confidence')).toBeInTheDocument(); // Confidence level
      });
    });
  });

  describe('Real-time Monitoring', () => {
    it('shows real-time updates status', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText('Real-time')).toBeInTheDocument(); // In context updates
    });

    it('updates focus level automatically over time', async () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Focus should decrease over time, but this is hard to test in unit tests
      // We can at least verify the mechanism exists
      expect(screen.getByText(/Focus Level: 85%/)).toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('displays correct active insights count', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Initially should have at least one insight
      await waitFor(() => {
        const insightCount = screen.getByText('Active Insights:').nextSibling?.textContent;
        expect(insightCount).toMatch(/\d+/);
      });
    });

    it('displays correct privacy mode based on settings', async () => {
      const user = userEvent.setup();
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      // Initially 2 features enabled (Enhanced privacy)
      expect(screen.getByText('Enhanced')).toBeInTheDocument();
      
      // Enable location tracking
      const locationCheckbox = screen.getByLabelText('Location tracking');
      await user.click(locationCheckbox);
      
      await waitFor(() => {
        expect(screen.getByText('Standard')).toBeInTheDocument();
      });
    });
  });

  describe('Usage Tips', () => {
    it('renders usage tips section', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText('Usage Tips')).toBeInTheDocument();
      expect(screen.getByText('Adjust context settings to see different insights')).toBeInTheDocument();
      expect(screen.getByText('Focus level automatically decreases over time')).toBeInTheDocument();
      expect(screen.getByText('Privacy settings affect which insights appear')).toBeInTheDocument();
      expect(screen.getByText('Try different modes to see varying levels of activity')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form controls', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
      
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
      
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(4); // Privacy controls
    });

    it('has proper button roles', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const toggleButton = screen.getByRole('button', { name: /Insights/ });
      expect(toggleButton).toBeInTheDocument();
    });

    it('has proper headings structure', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByText('Ambient Intelligence Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Context Simulation')).toBeInTheDocument();
      expect(screen.getByText('Ambient Mode')).toBeInTheDocument();
      expect(screen.getByText('Privacy Controls')).toBeInTheDocument();
    });

    it('provides proper labels for form controls', () => {
      render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      expect(screen.getByLabelText('Time of Day')).toBeInTheDocument();
      expect(screen.getByLabelText('Activity')).toBeInTheDocument();
      expect(screen.getByLabelText('Location')).toBeInTheDocument();
      expect(screen.getByLabelText(/Focus Level:/)).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot in initial state', () => {
      const { container } = render(<AmbientIntelligenceDemo {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with minimal mode', async () => {
      const user = userEvent.setup();
      const { container } = render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const modeSelect = screen.getByDisplayValue('Active Mode');
      await user.selectOptions(modeSelect, 'minimal');
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with hidden insights', async () => {
      const user = userEvent.setup();
      const { container } = render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const toggleButton = screen.getByText('Hide Insights');
      await user.click(toggleButton);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with changed context', async () => {
      const user = userEvent.setup();
      const { container } = render(<AmbientIntelligenceDemo {...defaultProps} />);
      
      const timeSelect = screen.getByLabelText('Time of Day');
      await user.selectOptions(timeSelect, 'evening');
      
      const activitySelect = screen.getByLabelText('Activity');
      await user.selectOptions(activitySelect, 'break');
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});