import { render, screen } from '../../../utils/test-utils'
import CodeBlock from '../CodeBlock'

describe('CodeBlock Component', () => {
  const mockCode = `function hello() {
  console.log("Hello, World!");
}`

  beforeEach(() => {
    // Reset clipboard mock
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders code content correctly', () => {
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      expect(screen.getByText(/Hello, World!/)).toBeInTheDocument()
      expect(screen.getByText(/function hello/)).toBeInTheDocument()
    })

    it('applies correct language class', () => {
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      const codeElement = screen.getByRole('code')
      expect(codeElement).toHaveClass('language-javascript')
    })

    it('renders with different languages', () => {
      const { rerender } = render(<CodeBlock code="print('hello')" language="python" />)
      
      let codeElement = screen.getByRole('code')
      expect(codeElement).toHaveClass('language-python')

      rerender(<CodeBlock code="<div>Hello</div>" language="html" />)
      codeElement = screen.getByRole('code')
      expect(codeElement).toHaveClass('language-html')
    })

    it('handles empty code gracefully', () => {
      render(<CodeBlock code="" language="javascript" />)
      
      const codeElement = screen.getByRole('code')
      expect(codeElement).toBeInTheDocument()
      expect(codeElement).toHaveClass('language-javascript')
    })

    it('displays the language name', () => {
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      expect(screen.getByText('javascript')).toBeInTheDocument()
    })
  })

  describe('Copy Functionality', () => {
    it('renders copy button', () => {
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      const copyButton = screen.getByRole('button')
      expect(copyButton).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
    })

    it('copies code to clipboard when copy button is clicked', async () => {
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      const copyButton = screen.getByRole('button')
      fireEvent.click(copyButton)
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode)
    })

    it('shows copied state after clicking copy button', async () => {
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      const copyButton = screen.getByRole('button')
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })

    it('resets copied state after timeout', async () => {
      jest.useFakeTimers()
      
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      const copyButton = screen.getByRole('button')
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
      
      // Fast-forward time
      jest.advanceTimersByTime(2000)
      
      await waitFor(() => {
        expect(screen.getByText('Copy')).toBeInTheDocument()
      })
      
      jest.useRealTimers()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      const preElement = screen.getByRole('code').closest('pre')
      expect(preElement).toBeInTheDocument()
    })

    it('preserves code formatting', () => {
      const multiLineCode = `line 1
line 2
  indented line`
      
      render(<CodeBlock code={multiLineCode} language="text" />)
      
      const codeElement = screen.getByRole('code')
      expect(codeElement.textContent).toContain('line 1')
      expect(codeElement.textContent).toContain('line 2')
      expect(codeElement.textContent).toContain('indented line')
    })

    it('copy button is accessible', () => {
      render(<CodeBlock code={mockCode} language="javascript" />)
      
      const copyButton = screen.getByRole('button')
      expect(copyButton).toBeInTheDocument()
      expect(copyButton).not.toHaveAttribute('aria-label') // Uses text content instead
    })
  })
}) 