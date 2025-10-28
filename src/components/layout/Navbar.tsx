'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  
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
    <nav className="w-full bg-transparent py-6 absolute top-0 left-0 right-0 z-10">
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-primary">
            <span className="flex items-center justify-center w-9 h-9 bg-accent-subtle border border-border-primary rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-text-primary">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                <path d="M12 10l1-2.2 1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="white" />
              </svg>
            </span>
            <span className="text-xl font-medium tracking-tight">aiux</span>
          </Link>

          {/* GitHub Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/imsaif/aiex"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-text-primary hover:text-accent-primary transition-colors duration-200 rounded-lg hover:bg-accent-subtle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">GitHub</span>
            </a>
            <Link
              href="/guides"
              className="flex items-center gap-2 px-3 py-2 text-text-primary hover:text-accent-primary transition-colors duration-200 rounded-lg hover:bg-accent-subtle"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">Guides</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 