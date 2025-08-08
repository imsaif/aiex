import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SafeExplorationDemo from '../SafeExplorationDemo';

// Mock window.alert
const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('SafeExplorationDemo', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy.mockClear();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
    });

    it('renders with correct initial structure', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('Safe Exploration Playground')).toBeInTheDocument();
      expect(screen.getByText('Experiment freely without fear of breaking anything')).toBeInTheDocument();
    });

    it('renders exploration mode controls', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByDisplayValue('Sandbox Mode')).toBeInTheDocument();
      expect(screen.getByText('Safety Info')).toBeInTheDocument();
    });

    it('renders safety information by default', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('Safety Features')).toBeInTheDocument();
      expect(screen.getByText('Isolated Environment:')).toBeInTheDocument();
      expect(screen.getByText('Automatic Backups:')).toBeInTheDocument();
      expect(screen.getByText('Easy Undo:')).toBeInTheDocument();
    });

    it('renders custom experiment creation section', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('Start New Experiment')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('My AI Experiment')).toBeInTheDocument();
      expect(screen.getByText('Start Custom Experiment')).toBeInTheDocument();
    });

    it('renders predefined experiment templates', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('Quick Start Templates')).toBeInTheDocument();
      expect(screen.getByText('AI Writing Style')).toBeInTheDocument();
      expect(screen.getByText('Interface Layout')).toBeInTheDocument();
      expect(screen.getByText('Data Visualization')).toBeInTheDocument();
      expect(screen.getByText('Automation Rules')).toBeInTheDocument();
    });

    it('renders sidebar sections', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('Exploration History')).toBeInTheDocument();
      expect(screen.getByText('Current Mode')).toBeInTheDocument();
      expect(screen.getByText('Safe Exploration Tips')).toBeInTheDocument();
    });
  });

  describe('Safety Information Toggle', () => {
    it('shows safety info by default', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('Safety Features')).toBeInTheDocument();
    });

    it('hides safety info when toggle is clicked', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const toggleButton = screen.getByText('Safety Info');
      await user.click(toggleButton);
      
      expect(screen.queryByText('Safety Features')).not.toBeInTheDocument();
    });

    it('shows safety info when toggled back on', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const toggleButton = screen.getByText('Safety Info');
      await user.click(toggleButton);
      await user.click(toggleButton);
      
      expect(screen.getByText('Safety Features')).toBeInTheDocument();
    });

    it('displays current mode in safety info', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText(/Current Mode: Sandbox/)).toBeInTheDocument();
    });
  });

  describe('Exploration Modes', () => {
    it('changes exploration mode when select is changed', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const modeSelect = screen.getByDisplayValue('Sandbox Mode');
      await user.selectOptions(modeSelect, 'guided');
      
      expect(modeSelect).toHaveValue('guided');
      expect(screen.getByText(/Current Mode: Guided/)).toBeInTheDocument();
    });

    it('updates mode description when mode changes', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const modeSelect = screen.getByDisplayValue('Sandbox Mode');
      await user.selectOptions(modeSelect, 'freeform');
      
      expect(screen.getByText('Full freedom with safety nets')).toBeInTheDocument();
    });

    it('displays correct mode status in sidebar', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const modeSelect = screen.getByDisplayValue('Sandbox Mode');
      await user.selectOptions(modeSelect, 'guided');
      
      expect(screen.getByText('Guided')).toBeInTheDocument(); // In mode status section
    });
  });

  describe('Custom Experiment Creation', () => {
    it('handles experiment name input', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const nameInput = screen.getByPlaceholderText('My AI Experiment');
      await user.type(nameInput, 'Test Experiment');
      
      expect(nameInput).toHaveValue('Test Experiment');
    });

    it('enables start button when name is provided', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const nameInput = screen.getByPlaceholderText('My AI Experiment');
      const startButton = screen.getByText('Start Custom Experiment');
      
      expect(startButton).toBeDisabled();
      
      await user.type(nameInput, 'Test');
      expect(startButton).toBeEnabled();
    });

    it('starts custom experiment when button is clicked', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const nameInput = screen.getByPlaceholderText('My AI Experiment');
      const startButton = screen.getByText('Start Custom Experiment');
      
      await user.type(nameInput, 'My Test Experiment');
      await user.click(startButton);
      
      expect(screen.getByText('🧪 Active Experiment: My Test Experiment')).toBeInTheDocument();
    });

    it('starts predefined experiment when template is clicked', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const template = screen.getByText('AI Writing Style');
      await user.click(template);
      
      expect(screen.getByText('🧪 Active Experiment: AI Writing Style')).toBeInTheDocument();
    });
  });

  describe('Active Experiment Session', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      // Start an experiment
      const nameInput = screen.getByPlaceholderText('My AI Experiment');
      await user.type(nameInput, 'Test Session');
      const startButton = screen.getByText('Start Custom Experiment');
      await user.click(startButton);
    });

    it('displays active experiment header', () => {
      expect(screen.getByText('🧪 Active Experiment: Test Session')).toBeInTheDocument();
      expect(screen.getByText('Custom experiment created by user')).toBeInTheDocument();
    });

    it('shows experiment controls', () => {
      expect(screen.getByText('Undo Last')).toBeInTheDocument();
      expect(screen.getByText('Discard')).toBeInTheDocument();
      expect(screen.getByText('Save & Apply')).toBeInTheDocument();
    });

    it('displays experiment workspace', () => {
      expect(screen.getByText('Experiment Workspace')).toBeInTheDocument();
      expect(screen.getByText('Try an experimental change:')).toBeInTheDocument();
    });

    it('shows empty state when no changes made', () => {
      expect(screen.getByText('No changes made yet')).toBeInTheDocument();
      expect(screen.getByText('Click any button above to start experimenting')).toBeInTheDocument();
    });

    it('disables undo button when no changes', () => {
      const undoButton = screen.getByText('Undo Last');
      expect(undoButton).toBeDisabled();
    });
  });

  describe('Experimental Changes', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      // Start an experiment
      const template = screen.getByText('Interface Layout');
      await user.click(template);
    });

    it('makes experimental changes when buttons are clicked', async () => {
      const user = userEvent.setup();
      
      const darkModeButton = screen.getByText('Dark Mode');
      await user.click(darkModeButton);
      
      expect(screen.getByText('Changes Made:')).toBeInTheDocument();
      expect(screen.getByText('1. Changed color scheme to dark mode')).toBeInTheDocument();
    });

    it('tracks multiple changes', async () => {
      const user = userEvent.setup();
      
      const darkModeButton = screen.getByText('Dark Mode');
      const aiBoostButton = screen.getByText('AI Boost');
      
      await user.click(darkModeButton);
      await user.click(aiBoostButton);
      
      expect(screen.getByText('1. Changed color scheme to dark mode')).toBeInTheDocument();
      expect(screen.getByText('2. Enabled advanced AI suggestions')).toBeInTheDocument();
    });

    it('enables undo button after making changes', async () => {
      const user = userEvent.setup();
      
      const darkModeButton = screen.getByText('Dark Mode');
      await user.click(darkModeButton);
      
      const undoButton = screen.getByText('Undo Last');
      expect(undoButton).toBeEnabled();
    });

    it('undoes last change when undo button is clicked', async () => {
      const user = userEvent.setup();
      
      const darkModeButton = screen.getByText('Dark Mode');
      const aiBoostButton = screen.getByText('AI Boost');
      
      await user.click(darkModeButton);
      await user.click(aiBoostButton);
      
      const undoButton = screen.getByText('Undo Last');
      await user.click(undoButton);
      
      expect(screen.queryByText('2. Enabled advanced AI suggestions')).not.toBeInTheDocument();
      expect(screen.getByText('1. Changed color scheme to dark mode')).toBeInTheDocument();
    });

    it('removes all changes section when no changes remain', async () => {
      const user = userEvent.setup();
      
      const darkModeButton = screen.getByText('Dark Mode');
      await user.click(darkModeButton);
      
      const undoButton = screen.getByText('Undo Last');
      await user.click(undoButton);
      
      expect(screen.queryByText('Changes Made:')).not.toBeInTheDocument();
      expect(screen.getByText('No changes made yet')).toBeInTheDocument();
    });

    it('generates safety guard for destructive actions', async () => {
      const user = userEvent.setup();
      
      const deleteButton = screen.getByText('Delete Files');
      await user.click(deleteButton);
      
      expect(screen.getByText('🛡️ Safety Guards')).toBeInTheDocument();
      expect(screen.getByText('Destructive action detected - backup automatically created')).toBeInTheDocument();
    });

    it('removes destructive action guard when undoing destructive changes', async () => {
      const user = userEvent.setup();
      
      const deleteButton = screen.getByText('Delete Files');
      await user.click(deleteButton);
      
      expect(screen.getByText('Destructive action detected - backup automatically created')).toBeInTheDocument();
      
      const undoButton = screen.getByText('Undo Last');
      await user.click(undoButton);
      
      expect(screen.queryByText('Destructive action detected - backup automatically created')).not.toBeInTheDocument();
    });
  });

  describe('Safety Guards', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      // Start an experiment to generate safety guards
      const template = screen.getByText('AI Writing Style');
      await user.click(template);
    });

    it('displays safety guards when experiment starts', () => {
      expect(screen.getByText('🛡️ Safety Guards')).toBeInTheDocument();
      expect(screen.getByText('This experiment is isolated from your main data and settings')).toBeInTheDocument();
      expect(screen.getByText('Automatic backup created before starting experiment')).toBeInTheDocument();
      expect(screen.getByText('Experiment will auto-expire in 24 hours for safety')).toBeInTheDocument();
    });

    it('shows different guards based on exploration mode', async () => {
      const user = userEvent.setup();
      
      // Change to guided mode and restart experiment
      const modeSelect = screen.getByDisplayValue('Sandbox Mode');
      await user.selectOptions(modeSelect, 'guided');
      
      expect(screen.getByText('Guided mode: Step-by-step assistance available')).toBeInTheDocument();
    });

    it('shows freeform mode warnings', async () => {
      const user = userEvent.setup();
      
      // Change to freeform mode
      const modeSelect = screen.getByDisplayValue('Sandbox Mode');
      await user.selectOptions(modeSelect, 'freeform');
      
      expect(screen.getByText('Advanced mode: Some changes may require manual review')).toBeInTheDocument();
    });

    it('displays appropriate safety guard icons and types', () => {
      expect(screen.getByText('🎯')).toBeInTheDocument(); // scope icon
      expect(screen.getByText('🔒')).toBeInTheDocument(); // data icon
      expect(screen.getByText('scope - warning')).toBeInTheDocument();
      expect(screen.getByText('data - info')).toBeInTheDocument();
    });
  });

  describe('Experiment Management', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      // Start an experiment
      const template = screen.getByText('Data Visualization');
      await user.click(template);
    });

    it('discards experiment when discard button is clicked', async () => {
      const user = userEvent.setup();
      
      const discardButton = screen.getByText('Discard');
      await user.click(discardButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Experimental changes have been discarded. Your main workspace is unchanged.');
      expect(screen.queryByText('🧪 Active Experiment:')).not.toBeInTheDocument();
      expect(screen.getByText('Start New Experiment')).toBeInTheDocument();
    });

    it('saves experiment when save & apply button is clicked', async () => {
      const user = userEvent.setup();
      
      const saveButton = screen.getByText('Save & Apply');
      await user.click(saveButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Experimental changes have been saved to your main workspace!');
      expect(screen.queryByText('🧪 Active Experiment:')).not.toBeInTheDocument();
    });

    it('clears safety guards when experiment ends', async () => {
      const user = userEvent.setup();
      
      expect(screen.getByText('🛡️ Safety Guards')).toBeInTheDocument();
      
      const discardButton = screen.getByText('Discard');
      await user.click(discardButton);
      
      expect(screen.queryByText('🛡️ Safety Guards')).not.toBeInTheDocument();
    });
  });

  describe('Exploration History', () => {
    it('shows empty history initially', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('No experiments yet')).toBeInTheDocument();
    });

    it('tracks experiments in history', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      // Start and complete first experiment
      const template1 = screen.getByText('AI Writing Style');
      await user.click(template1);
      
      expect(screen.getByText('AI Writing Style')).toBeInTheDocument(); // In history
      expect(screen.getByText('0 changes made (Active)')).toBeInTheDocument();
    });

    it('marks completed experiments in history', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      // Start experiment
      const template = screen.getByText('Automation Rules');
      await user.click(template);
      
      // Make a change
      const darkModeButton = screen.getByText('Dark Mode');
      await user.click(darkModeButton);
      
      // End experiment
      const discardButton = screen.getByText('Discard');
      await user.click(discardButton);
      
      expect(screen.getByText('1 changes made (Completed)')).toBeInTheDocument();
    });
  });

  describe('Mode Status Display', () => {
    it('displays correct initial status', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('Mode:')).toBeInTheDocument();
      expect(screen.getByText('Sandbox')).toBeInTheDocument();
      expect(screen.getByText('Active Experiments:')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // No active experiments
      expect(screen.getByText('Safety Guards:')).toBeInTheDocument();
    });

    it('updates active experiment count when experiment starts', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const template = screen.getByText('Interface Layout');
      await user.click(template);
      
      // Find the Active Experiments count (should be 1)
      const activeExperimentsRow = screen.getByText('Active Experiments:').closest('div');
      expect(activeExperimentsRow).toHaveTextContent('1');
    });

    it('updates safety guards count', async () => {
      const user = userEvent.setup();
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const template = screen.getByText('AI Writing Style');
      await user.click(template);
      
      // Safety guards should be greater than 0
      const safetyGuardsRow = screen.getByText('Safety Guards:').closest('div');
      expect(safetyGuardsRow).not.toHaveTextContent('0');
    });
  });

  describe('Accessibility', () => {
    it('has proper form controls', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const nameInput = screen.getByRole('textbox', { name: /Experiment Name/i });
      expect(nameInput).toBeInTheDocument();
      
      const modeSelect = screen.getByRole('combobox');
      expect(modeSelect).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const safetyButton = screen.getByRole('button', { name: 'Safety Info' });
      expect(safetyButton).toBeInTheDocument();
      
      const startButton = screen.getByRole('button', { name: 'Start Custom Experiment' });
      expect(startButton).toBeInTheDocument();
    });

    it('has proper headings structure', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByText('Safe Exploration Playground')).toBeInTheDocument();
      expect(screen.getByText('Start New Experiment')).toBeInTheDocument();
      expect(screen.getByText('Quick Start Templates')).toBeInTheDocument();
      expect(screen.getByText('Exploration History')).toBeInTheDocument();
    });

    it('provides proper labels for form controls', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      expect(screen.getByLabelText('Experiment Name')).toBeInTheDocument();
    });

    it('provides proper disabled states', () => {
      render(<SafeExplorationDemo {...defaultProps} />);
      
      const startButton = screen.getByText('Start Custom Experiment');
      expect(startButton).toBeDisabled();
      expect(startButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot in initial state', () => {
      const { container } = render(<SafeExplorationDemo {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with hidden safety info', async () => {
      const user = userEvent.setup();
      const { container } = render(<SafeExplorationDemo {...defaultProps} />);
      
      const toggleButton = screen.getByText('Safety Info');
      await user.click(toggleButton);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with active experiment', async () => {
      const user = userEvent.setup();
      const { container } = render(<SafeExplorationDemo {...defaultProps} />);
      
      const template = screen.getByText('AI Writing Style');
      await user.click(template);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with experimental changes', async () => {
      const user = userEvent.setup();
      const { container } = render(<SafeExplorationDemo {...defaultProps} />);
      
      const template = screen.getByText('Data Visualization');
      await user.click(template);
      
      const darkModeButton = screen.getByText('Dark Mode');
      await user.click(darkModeButton);
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});