'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Squares2X2Icon,
  BookOpenIcon,
  SparklesIcon,
  BeakerIcon,
  ChevronDownIcon,
  NewspaperIcon,
  MagnifyingGlassIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import { ThemeToggle } from '../ui/ThemeToggle';
import SearchModal from '../ui/SearchModal';

const Navbar = () => {
  const pathname = usePathname();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle dropdown open with delay cancel
  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsResourcesOpen(true);
  }, []);

  // Handle dropdown close with delay
  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsResourcesOpen(false);
    }, 150); // 150ms delay before closing
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Global keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if a route is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/patterns');
    }
    return pathname.startsWith(href);
  };

  // Check if any resource route is active
  const isResourcesActive = () => {
    return pathname.startsWith('/prompts') || pathname.startsWith('/guides');
  };

  // Get link classes based on active state - minimal style with no layout shift
  const getLinkClasses = (href: string) => {
    const active = isActive(href);
    return `flex items-center gap-2 px-4 py-2 transition-colors duration-200 ease-out text-base border-b-2 ${
      active
        ? 'text-text-primary border-text-primary font-semibold'
        : 'text-text-secondary hover:text-text-primary border-transparent'
    }`;
  };

  // Get dropdown trigger classes
  const getDropdownTriggerClasses = () => {
    const active = isResourcesActive();
    return `flex items-center gap-2 px-4 py-2 transition-colors duration-200 ease-out text-base border-b-2 cursor-pointer ${
      active
        ? 'text-text-primary border-text-primary font-semibold'
        : 'text-text-secondary hover:text-text-primary border-transparent'
    }`;
  };

  // Get dropdown item classes
  const getDropdownItemClasses = (href: string) => {
    const active = isActive(href);
    return `flex items-center gap-3 px-4 py-3 transition-colors ${
      active
        ? 'text-text-primary bg-surface-secondary font-medium'
        : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
    }`;
  };

  return (
    <nav className="w-full py-5 bg-surface-primary border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-primary">
            <span className="flex items-center justify-center w-9 h-9 bg-accent-subtle rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-text-primary"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                <path
                  d="M12 10l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="text-xl font-medium tracking-tight">aiux</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <Link href="/" className={getLinkClasses('/')}>
              <Squares2X2Icon className="w-5 h-5" />
              <span className="hidden sm:inline relative">
                Patterns
                <span className="invisible font-semibold block h-0" aria-hidden="true">
                  Patterns
                </span>
              </span>
            </Link>

            <Link href="/news" className={getLinkClasses('/news')}>
              <NewspaperIcon className="w-5 h-5" />
              <span className="hidden sm:inline relative">
                News
                <span className="invisible font-semibold block h-0" aria-hidden="true">
                  News
                </span>
              </span>
            </Link>

            <Link href="/audit" className={getLinkClasses('/audit')}>
              <BeakerIcon className="w-5 h-5" />
              <span className="hidden sm:inline relative">
                Audit
                <span className="invisible font-semibold block h-0" aria-hidden="true">
                  Audit
                </span>
              </span>
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className={getDropdownTriggerClasses()}>
                <FolderIcon className="w-5 h-5" />
                <span className="hidden sm:inline relative">
                  Resources
                  <span className="invisible font-semibold block h-0" aria-hidden="true">
                    Resources
                  </span>
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isResourcesOpen && (
                <>
                  {/* Invisible bridge to prevent gap issues */}
                  <div className="absolute top-full right-0 h-2 w-48" />
                  <div className="absolute top-full right-0 pt-2 w-48 z-50">
                    <div className="bg-surface-primary border border-border-primary rounded-xl shadow-lg overflow-hidden">
                      <Link
                        href="/prompts"
                        className={getDropdownItemClasses('/prompts')}
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Prompts</span>
                      </Link>
                      <Link
                        href="/guides"
                        className={getDropdownItemClasses('/guides')}
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        <BookOpenIcon className="w-5 h-5" />
                        <span>Guides</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-secondary cursor-pointer"
              aria-label="Search (⌘K)"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <div className="relative">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
