'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    // Check scroll position and update visibility
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const handleClick = () => {
    scrollTo('top');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed z-50 p-3 rounded-full bg-accent-primary text-white dark:text-gray-900 shadow-lg hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 cursor-pointer"
          style={{ bottom, right }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
          aria-label="Scroll to top"
        >
          <ChevronUpIcon className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
} 