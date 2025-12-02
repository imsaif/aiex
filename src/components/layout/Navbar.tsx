'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Squares2X2Icon, BookOpenIcon, SparklesIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../ui/ThemeToggle';

const Navbar = () => {
  const pathname = usePathname();

  // Check if a route is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/patterns');
    }
    return pathname.startsWith(href);
  };

  // Get link classes based on active state - minimal style with no layout shift
  const getLinkClasses = (href: string) => {
    const active = isActive(href);
    return `flex items-center gap-2 px-4 py-2 transition-colors duration-200 ease-out text-sm border-b-2 ${
      active
        ? 'text-text-primary border-text-primary font-semibold'
        : 'text-text-secondary hover:text-text-primary border-transparent'
    }`;
  };

  const scrollToDiscover = (e: React.MouseEvent) => {
    // Only handle scroll on homepage
    if (pathname === '/') {
      e.preventDefault();
      const discoverSection = document.getElementById('categories');
      if (discoverSection) {
        discoverSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="w-full py-5 bg-surface-primary border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-primary">
            <span className="flex items-center justify-center w-9 h-9 bg-accent-subtle rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-text-primary">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                <path d="M12 10l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="white" />
              </svg>
            </span>
            <span className="text-xl font-medium tracking-tight">aiux</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <Link href="/" className={getLinkClasses('/')}>
              <Squares2X2Icon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm relative">
                Patterns
                <span className="invisible font-semibold block h-0" aria-hidden="true">Patterns</span>
              </span>
            </Link>
            <Link href="/prompts" className={getLinkClasses('/prompts')}>
              <SparklesIcon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm relative">
                Prompts
                <span className="invisible font-semibold block h-0" aria-hidden="true">Prompts</span>
              </span>
            </Link>
            <Link href="/audit" className={getLinkClasses('/audit')}>
              <BeakerIcon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm relative">
                Audit
                <span className="invisible font-semibold block h-0" aria-hidden="true">Audit</span>
              </span>
            </Link>
            <Link href="/guides" className={getLinkClasses('/guides')}>
              <BookOpenIcon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm relative">
                Guides
                <span className="invisible font-semibold block h-0" aria-hidden="true">Guides</span>
              </span>
            </Link>

            {/* Theme Toggle */}
            <div className="relative">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 