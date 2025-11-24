/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Accessible grey and white system using CSS variables for dark mode support
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
        },
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          elevated: 'var(--surface-elevated)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          disabled: 'var(--text-disabled)',
        },
        // Minimal accent colors for interactive elements
        accent: {
          primary: 'var(--accent-primary)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
        },
        // Border colors (also available for all color utilities)
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
          focus: 'var(--border-focus)',
          success: 'var(--border-success)',
          error: 'var(--border-error)',
          warning: 'var(--border-warning)',
          info: 'var(--border-info)',
        },
        // Muted category colors for icons
        category: {
          blue: '#3B82F6',
          purple: '#8B5CF6', 
          amber: '#F59E0B',
          teal: '#14B8A6',
          indigo: '#6366F1',
          green: '#10B981',
          rose: '#F43F5E',
          orange: '#F97316',
          cyan: '#06B6D4',
          emerald: '#059669',
          violet: '#7C3AED',
          pink: '#EC4899',
          slate: '#64748B',
          neutral: '#6B7280',
        },
      },
      borderColor: {
        // Base structural borders using CSS variables for dark mode support
        'primary': 'var(--border-primary)',
        'secondary': 'var(--border-secondary)',
        'focus': 'var(--border-focus)',

        // Semantic state borders
        'success': 'var(--border-success)',
        'error': 'var(--border-error)',
        'warning': 'var(--border-warning)',
        'info': 'var(--border-info)',

        // Interactive states
        'interactive': 'var(--border-interactive)',
        'interactive-hover': 'var(--border-interactive-hover)',
        'selected': 'var(--border-selected)',
        'disabled': 'var(--border-disabled)',

        // Dividers and separators
        'divider': 'var(--border-divider)',
        'divider-subtle': 'var(--border-divider-subtle)',
      },
      textColor: {
        // Make background colors available as text colors using CSS variables
        'background-primary': 'var(--background-primary)',
        'background-secondary': 'var(--background-secondary)',
        'background-tertiary': 'var(--background-tertiary)',
      },
      ringColor: {
        // Standard focus ring color using CSS variables
        focus: 'var(--ring-focus)',
        'focus-error': 'var(--ring-focus-error)',
        'focus-success': 'var(--ring-focus-success)',
        'focus-warning': 'var(--ring-focus-warning)',
      },
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui'],
      },
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
        tight: '-.025em',
        normal: '0',
        wide: '.025em',
        wider: '.05em',
        widest: '.25em',
      },
      // Refined shadows - fold.money inspired
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'elevated': '0 12px 32px rgba(0, 0, 0, 0.1)',
      },
      // Extended border radius for softer feel
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      // Animation timing
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    // Note: @tailwindcss/typography for v4 might need different import
  ],
};