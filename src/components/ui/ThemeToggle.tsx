'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

// Written only when a visitor clicks the toggle. Absent means "follow the OS".
const CHOICE_KEY = 'theme-choice';
const LEGACY_KEY = 'theme';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setMounted(true);

    // The old 'theme' key was written on every first visit, so it recorded
    // whatever the OS happened to be at that moment rather than a choice, and
    // pinned it forever. It cannot tell the two apart, so it is dropped.
    localStorage.removeItem(LEGACY_KEY);

    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const choice = localStorage.getItem(CHOICE_KEY);
    const initial = choice ? choice === 'dark' : system.matches;
    setIsDark(initial);
    applyTheme(initial);

    // With no explicit choice, keep following the OS as it changes (macOS
    // Auto appearance flips at sunset).
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(CHOICE_KEY)) return;
      setIsDark(event.matches);
      applyTheme(event.matches);
    };
    system.addEventListener('change', onSystemChange);
    return () => system.removeEventListener('change', onSystemChange);
  }, []);

  // Tailwind's dark: variant keys off data-theme, so it is always set, even
  // when following the OS. Only a click saves anything.
  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    html.style.colorScheme = dark ? 'dark' : 'light';
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
    localStorage.setItem(CHOICE_KEY, newIsDark ? 'dark' : 'light');
  };

  // Return placeholder with same dimensions to prevent layout shift during hydration
  // Button = p-2 (8px padding) + w-6 h-6 icon (24px) = 40px = w-10 h-10
  if (!mounted) {
    return <div className="w-10 h-10" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative p-2 rounded-lg bg-transparent hover:bg-background-secondary transition-all duration-300 cursor-pointer"
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
