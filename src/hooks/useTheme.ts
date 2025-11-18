'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to get current theme and apply appropriate filters
 * Returns filter string based on current theme
 */
export function useThemeFilter(baseFilter: string = 'grayscale(100%)'): string {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial theme
    const html = document.documentElement;
    const theme = html.getAttribute('data-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(theme === 'dark' || (theme === null && prefersDark));

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const newTheme = html.getAttribute('data-theme');
      setIsDark(newTheme === 'dark' || (newTheme === null && prefersDark));
    });

    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return baseFilter;

  // Apply invert filter in dark mode
  return isDark ? `${baseFilter} invert(1)` : baseFilter;
}

/**
 * Get the current theme (light or dark)
 */
export function useCurrentTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    const dataTheme = html.getAttribute('data-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(dataTheme === 'dark' || (dataTheme === null && prefersDark) ? 'dark' : 'light');

    const observer = new MutationObserver(() => {
      const newTheme = html.getAttribute('data-theme');
      setTheme(newTheme === 'dark' || (newTheme === null && prefersDark) ? 'dark' : 'light');
    });

    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  return mounted ? theme : 'light';
}
