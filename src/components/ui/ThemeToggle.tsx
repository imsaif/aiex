'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check current theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(isDarkMode);
    applyTheme(isDarkMode);
  }, []);

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.style.colorScheme = 'dark';
      html.setAttribute('data-theme', 'dark');
    } else {
      html.style.colorScheme = 'light';
      html.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative p-2 rounded-lg bg-transparent hover:bg-background-secondary transition-all duration-300"
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun icon - shown in light mode, morphs to moon on hover; shown in dark mode on hover */}
      <div
        className={`transition-all duration-500 ${
          (!isDark && !isHovering) || (isDark && isHovering)
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-180 scale-0'
        }`}
      >
        <SunIcon className="w-6 h-6 text-text-primary" />
      </div>

      {/* Moon icon - shown in dark mode, morphs to sun on hover; shown in light mode on hover */}
      <div
        className={`absolute top-1.5 left-1.5 transition-all duration-500 ${
          (isDark && !isHovering) || (!isDark && isHovering)
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-180 scale-0'
        }`}
      >
        <MoonIcon className="w-6 h-6 text-text-primary" />
      </div>
    </button>
  );
}
