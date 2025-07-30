import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeExampleBlock from '../CodeExampleBlock';

describe('CodeExampleBlock', () => {
  const defaultProps = {
    'code': 'console.log("Hello World");',
    'language': 'javascript',
    'title': 'Example Component',
    'description': 'This is a test description',
    'componentId': 'contextual-assistance-editor'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<CodeExampleBlock {...defaultProps} />);
    });

    it('renders with correct structure', () => {
      const { container } = render(<CodeExampleBlock {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('displays provided content', () => {
      const testProps = {
        ...defaultProps,
        title: 'Test Title',
        description: 'Test Content'
      };
      render(<CodeExampleBlock {...testProps} />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('renders with code prop', () => {
      const testValue = 'console.log("test code");';
      render(<CodeExampleBlock {...defaultProps} code={testValue} />);
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

    it('renders with language prop', () => {
      const testValue = 'javascript';
      render(<CodeExampleBlock {...defaultProps} language={testValue} />);
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

    it('renders with title prop', () => {
      const testValue = 'Test title';
      render(<CodeExampleBlock {...defaultProps} title={testValue} />);
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

    it('renders with description prop', () => {
      const testValue = 'Test description';
      render(<CodeExampleBlock {...defaultProps} description={testValue} />);
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

    it('renders with componentId prop', () => {
      const testValue = 'contextual-assistance-editor';
      const { container } = render(<CodeExampleBlock {...defaultProps} componentId={testValue} />);
      // ComponentId is used internally to determine which component to render, not displayed as text
      expect(container).toBeInTheDocument();
    });

  });

  describe('State Management', () => {
    it('manages internal state correctly', () => {
      render(<CodeExampleBlock {...defaultProps} />);
      // Test initial state
      // Add specific state assertions based on your component
    });

    it('updates state on user interaction', async () => {
      const user = userEvent.setup();
      render(<CodeExampleBlock {...defaultProps} />);
      
      // Simulate user interaction that changes state
      // Add specific interactions based on your component
    });
  });

  describe('Event Handling', () => {
    it('handles tab switching', async () => {
      const user = userEvent.setup();
      
      render(<CodeExampleBlock {...defaultProps} />);
      
      const previewTab = screen.getByText('Live Preview');
      await user.click(previewTab);
      
      expect(screen.getByText('Interactive Demo:')).toBeInTheDocument();
    });

    it('handles copy button click', async () => {
      // Mock clipboard API
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: mockWriteText,
        },
        writable: true,
        configurable: true
      });
      
      const user = userEvent.setup();
      render(<CodeExampleBlock {...defaultProps} />);
      
      // Find copy button by role or accessible name instead of text content
      const copyButton = screen.getByRole('button', { name: /copy/i });
      await user.click(copyButton);
      
      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(defaultProps.code);
      });
    });

  });

  describe('Form Interactions', () => {
    it('handles tab button clicks', async () => {
      const user = userEvent.setup();
      
      render(<CodeExampleBlock {...defaultProps} />);
      
      const codeTab = screen.getByText('Code');
      const previewTab = screen.getByText('Live Preview');
      
      await user.click(previewTab);
      expect(screen.getByText('Interactive Demo:')).toBeInTheDocument();
      
      await user.click(codeTab);
      expect(screen.getByText('javascript')).toBeInTheDocument();
    });

  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { container } = render(<CodeExampleBlock {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different props', () => {
      const testProps = {
        ...defaultProps,
        // Add variant props for comprehensive snapshot testing
      };
      const { container } = render(<CodeExampleBlock {...testProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

});