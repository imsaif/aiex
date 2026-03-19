'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import SmartSearchChat from '../ui/SmartSearchChat';
import { Pattern } from '../../types';

export default function Hero() {
  const router = useRouter();

  // Handle scroll to Discover section
  const scrollToDiscover = () => {
    const discoverSection = document.getElementById('categories');
    if (discoverSection) {
      discoverSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle pattern selection from search
  const handlePatternSelect = (pattern: Pattern) => {
    router.push(`/patterns/${pattern.slug}`);
  };

  return (
    <div
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Clean minimal background */}
      <div className="absolute inset-0 bg-background-primary" />
      {/* Minimal decorative elements */}
      <div className="absolute left-[15%] top-[20%] w-24 h-24 md:w-36 md:h-36 rounded-full bg-accent-subtle opacity-40 blur-2xl" />
      <div className="absolute right-[20%] bottom-[30%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-background-tertiary opacity-60 blur-3xl" />
      <div className="absolute left-[25%] bottom-[15%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-accent-subtle opacity-30 blur-2xl" />
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            AI UX Design Patterns
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            How the world&apos;s best AI products design their experiences, documented, analyzed, and continuously updated.
          </motion.p>
          
          {/* Smart Search Chat */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <SmartSearchChat 
              onPatternSelect={handlePatternSelect}
              className="w-full"
            />
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Button
              variant="primary"
              size="lg"
              className="text-base px-8 py-4"
              onClick={scrollToDiscover}
            >
              Explore
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
