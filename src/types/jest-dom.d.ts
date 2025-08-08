import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toHaveAttribute(attr: string, value?: string): R
      toBeDisabled(): R
      toHaveTextContent(text: string | RegExp): R
      toHaveValue(value: string | number): R
      toBeVisible(): R
      toBeChecked(): R
      toHaveFocus(): R
      toHaveStyle(css: string | object): R
      toBeEmptyDOMElement(): R
      toBeInvalid(): R
      toBeRequired(): R
      toBeValid(): R
      toContainElement(element: HTMLElement | null): R
      toContainHTML(html: string): R
      toHaveAccessibleDescription(description?: string | RegExp): R
      toHaveAccessibleName(name?: string | RegExp): R
      toHaveDescription(description?: string | RegExp): R
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R
      toHaveErrorMessage(message?: string | RegExp): R
      toHaveFormValues(expectedValues: Record<string, unknown>): R
      toHaveRole(role: string): R
      toHaveTitle(title?: string | RegExp): R
    }
  }
}