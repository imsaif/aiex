/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Accessible grey and white system inspired by Mobbin
        background: {
          primary: '#ffffff',
          secondary: '#fafafa',
          tertiary: '#f5f5f5',
        },
        surface: {
          primary: '#ffffff',
          secondary: '#f9f9f9',
          elevated: '#ffffff',
        },
        text: {
          primary: '#0d0d0d',
          secondary: '#525252',
          tertiary: '#737373',
          disabled: '#a3a3a3',
        },
        // Minimal accent colors for interactive elements
        accent: {
          primary: '#0d0d0d',
          hover: '#262626',
          subtle: '#f5f5f5',
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
        // Base structural borders
        'primary': '#f9f9f9',
        'secondary': '#f3f3f3',
        'focus': '#525252',

        // Semantic state borders
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6',

        // Interactive states
        'interactive': '#3b82f6',
        'interactive-hover': '#2563eb',
        'selected': '#3b82f6',
        'disabled': '#d1d5db',

        // Dividers and separators
        'divider': '#f9f9f9',
        'divider-subtle': '#fcfcfc',
      },
      ringColor: {
        // Standard focus ring color
        focus: '#3b82f6',
        'focus-error': '#ef4444',
        'focus-success': '#10b981',
        'focus-warning': '#f59e0b',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
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
    },
  },
  plugins: [
    // Note: @tailwindcss/typography for v4 might need different import
  ],
};