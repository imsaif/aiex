import { render, screen, fireEvent } from '../../../utils/test-utils'
import Button from '../Button'

import { fireEvent } from '@testing-library/react';
describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-indigo-600') // primary variant
      expect(button).toHaveClass('px-4 py-2') // md size
    })

    it('renders children correctly', () => {
      render(<Button>Test Button</Button>)
      
      expect(screen.getByText('Test Button')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('renders primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-indigo-600 text-white')
    })

    it('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-100 text-gray-800')
    })

    it('renders outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border border-gray-300 bg-white text-gray-700')
    })

    it('renders gradient variant correctly', () => {
      render(<Button variant="gradient">Gradient</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gradient-to-r from-indigo-500 to-purple-600')
    })
  })

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3 py-1.5 text-sm')
    })

    it('renders medium size correctly', () => {
      render(<Button size="md">Medium</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4 py-2 text-sm')
    })

    it('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6 py-3 text-base')
    })
  })

  describe('Full Width', () => {
    it('renders full width when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full')
    })

    it('does not render full width by default', () => {
      render(<Button>Normal Width</Button>)
      
      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('w-full')
    })
  })

  describe('Interactions', () => {
    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Clickable</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('can be disabled', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      
      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('forwards other button props', () => {
      render(<Button type="submit" data-testid="submit-button">Submit</Button>)
      
      const button = screen.getByTestId('submit-button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      render(<Button>Focus me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none focus:ring-2 focus:ring-offset-2')
    })

    it('supports aria attributes', () => {
      render(
        <Button aria-label="Custom label" aria-describedby="description">
          Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })
  })

  describe('Base Classes', () => {
    it('always includes base classes', () => {
      render(<Button>Base Classes</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('relative inline-flex items-center justify-center rounded-full font-medium cursor-pointer')
    })
  })
}) 