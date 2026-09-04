'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NewspaperIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  AcademicCapIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { useSavedCount } from '@/hooks/useSavedCount';
import { AiuxMarkOutline } from '@/components/icons/AiuxMarkOutline';

// Lazy-load SearchModal to defer loading pattern/guide/newsletter data until search is opened
const SearchModal = dynamic(() => import('../ui/SearchModal'), { ssr: false });

const Navbar = ({
  /** True on learn-console pages, where the bar matches the console slab. */
  inConsole = false,
}: { inConsole?: boolean } = {}) => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { count: savedCount } = useSavedCount();

  // Pattern routes mount SavedItemsBar, which shows the same number in a sticky
  // bar. Two live counts of the same thing in one viewport reads as clutter, so
  // the badge yields there and the bar carries it. The "Saved" nav item itself
  // stays; only the number is suppressed.
  const packBarShowsCount = pathname === '/patterns' || pathname.startsWith('/patterns/');
  const showBadge = savedCount > 0 && !packBarShowsCount;

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
      return pathname === '/';
    }
    if (href === '/guides') {
      return pathname.startsWith('/guides');
    }
    if (href === '/resources') {
      return pathname === '/resources' || pathname.startsWith('/prompts') || pathname.startsWith('/agent-readability-audit-kit');
    }
    return pathname.startsWith(href);
  };

  // Get link classes based on active state - minimal style with no layout shift
  const getLinkClasses = (href: string) => {
    const active = isActive(href);
    return `flex items-center gap-2 px-2 sm:px-4 py-2 transition-colors duration-200 ease-out text-base border-b-2 ${
      active
        ? 'text-text-primary border-text-primary font-semibold'
        : 'text-text-secondary hover:text-text-primary border-transparent'
    }`;
  };

  return (
    // The content width is 1600px either way, so the logo and the nav items do
    // not move when you cross between the console and the rest of the site —
    // that shift was visible as a jump. Only the surround changes: off the
    // console the bar is a plain full-width band, because those pages have
    // full-bleed heroes and a slabbed bar above one reads as a card floating
    // over nothing. In the console it becomes the same slab as the shell.
    <nav
      className={
        inConsole
          ? 'w-full bg-background-console'
          : 'w-full py-5 bg-surface-primary border-b border-border-primary'
      }
    >
      <div
        className={
          inConsole
            ? 'mx-auto max-w-[1600px] border-b border-border-primary bg-surface-primary px-6 py-5 lg:border-x'
            : 'mx-auto max-w-[1600px] px-6'
        }
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-primary">
            <span className="flex items-center justify-center w-9 h-9 bg-accent-subtle rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
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
          <div className="flex items-center gap-1 sm:gap-3">

            {/* The audit is the product, and it had no entry in the bar at all
                — /patterns was standing in for it. First position, ahead of the
                learning material. */}
            <Link href="/audit" className={getLinkClasses('/audit')}>
              <AiuxMarkOutline className="w-5 h-5" />
              <span className="hidden sm:inline relative">
                Tool
                <span className="invisible font-semibold block h-0" aria-hidden="true">
                  Tool
                </span>
              </span>
            </Link>

            <Link href="/guides" className={getLinkClasses('/guides')}>
              <AcademicCapIcon className="w-5 h-5" />
              <span className="hidden sm:inline relative">
                Courses
                <span className="invisible font-semibold block h-0" aria-hidden="true">
                  Courses
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

<Link href="/resources" className={getLinkClasses('/resources')}>
              <FolderIcon className="w-5 h-5" />
              <span className="hidden sm:inline relative">
                Resources
                <span className="invisible font-semibold block h-0" aria-hidden="true">
                  Resources
                </span>
              </span>
            </Link>

            <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
              <span className="relative inline-flex">
                <BookmarkIcon className="w-5 h-5" />
                {showBadge && (
                  <span
                    className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-primary px-1 text-xs font-semibold leading-none text-white"
                    aria-hidden="true"
                  >
                    {savedCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline relative">
                Saved
                <span className="invisible font-semibold block h-0" aria-hidden="true">
                  Saved
                </span>
              </span>
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-secondary cursor-pointer"
              aria-label="Search (⌘K)"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
