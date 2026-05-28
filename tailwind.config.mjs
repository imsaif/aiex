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
          grain: 'var(--background-grain)',
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
        // Status colors for feedback states
        status: {
          success: '#10b981',  // emerald-500
          error: '#ef4444',    // red-500
          warning: '#f59e0b',  // amber-500
          info: '#3b82f6',     // blue-500
        },
        // Social platform brand colors
        social: {
          twitter: '#000000',
          'twitter-hover': '#333333',
          linkedin: '#0a66c2',
          'linkedin-hover': '#004182',
          'linkedin-light': '#bfdbfe', // for light text on dark bg
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
        sans: ['var(--font-satoshi)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
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
      // Shadow / elevation scale — semantic, dark-mode aware via CSS vars.
      // `subtle` kept as legacy; `flat/card/card-hover/elevated/popover` are
      // the new design-system tokens.
      boxShadow: {
        'subtle': '0 2px 8px rgba(51, 65, 85, 0.04)',
        'flat': 'var(--shadow-flat)',
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'elevated': 'var(--shadow-elevated)',
        'modal': 'var(--shadow-modal)',
        'popover': 'var(--shadow-popover)',
      },
      // Border radius — role-named tokens (design-system) + legacy size-named.
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        // Design-system tokens
        'input': 'var(--radius-input)',
        'card': 'var(--radius-card)',
        'modal': 'var(--radius-modal)',
        'mockup': 'var(--radius-mockup)',
        'pill': 'var(--radius-pill)',
      },
      // Z-index stack — explicit layering tokens. Rule: new code uses these,
      // never raw `z-50`. Old code is on the migration backlog.
      zIndex: {
        'base': 'var(--z-base)',
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'overlay': 'var(--z-overlay)',
        'modal': 'var(--z-modal)',
        'toast': 'var(--z-toast)',
        'tooltip': 'var(--z-tooltip)',
      },
      // Motion durations — semantic, mapped to perceptual research.
      // Use `duration-snap` for taps, `duration-quick` for hover,
      // `duration-base` for modals, `duration-deliberate` for page-level.
      transitionDuration: {
        'snap': 'var(--duration-snap)',
        'quick': 'var(--duration-quick)',
        'base': 'var(--duration-base)',
        'deliberate': 'var(--duration-deliberate)',
      },
      // Easings — `ease-out-expo` kept for compat; new tokens via CSS vars.
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-expo': 'var(--ease-out-expo)',
        'in-out-soft': 'var(--ease-in-out-soft)',
        'spring': 'var(--ease-spring)',
      },
      // Spacing aliases — semantic names for component-internal rhythm.
      // Use `p-default`, `gap-loose`, etc. instead of raw `p-4`, `gap-6`.
      spacing: {
        'tight': 'var(--space-tight)',
        'snug': 'var(--space-snug)',
        'default': 'var(--space-default)',
        'loose': 'var(--space-loose)',
        'roomy': 'var(--space-roomy)',
      },
    },
  },
  plugins: [
    // Note: @tailwindcss/typography for v4 might need different import
  ],
};