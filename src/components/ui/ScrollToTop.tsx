'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import useSmoothScroll from '@/hooks/useSmoothScroll';

interface ScrollToTopProps {
  threshold?: number;
  right?: number;
  bottom?: number;
}

export default function ScrollToTop({
  threshold = 300,
  right = 20,
  bottom = 20
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const handleClick = () => {
    scrollTo('top');
  };

  return (
    <button
      className={`fixed z-50 p-3 rounded-full bg-accent-primary text-white dark:text-gray-900 shadow-lg hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 cursor-pointer transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
      style={{ bottom, right }}
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      <ChevronUpIcon className="w-6 h-6" />
    </button>
  );
}
