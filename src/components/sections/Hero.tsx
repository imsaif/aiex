'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import AdvancedSearchBar from '../ui/AdvancedSearchBar';
import { Pattern } from '../../types';

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const followX = useSpring(mouseX, springConfig);
  const followY = useSpring(mouseY, springConfig);
  
  // Floating animation for 3D elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    }
  };

  // Pulse animation
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.7, 0.5],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
    }
  };

  // Rotate animation
  const rotateAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 40,
      ease: "linear",
      repeat: Infinity,
    }
  };

  // Handle mouse movement for interactive elements
  // Throttle mouse movement using requestAnimationFrame
  const mouseMoveFrame = useRef<number | null>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseMoveFrame.current !== null) {
      cancelAnimationFrame(mouseMoveFrame.current);
    }
    mouseMoveFrame.current = requestAnimationFrame(() => {
      const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
      const x = e.clientX - left;
      const y = e.clientY - top;
      mouseX.set(x - width / 2);
      mouseY.set(y - height / 2);
    });
  };

  // Handle scroll to Discover section
  const scrollToDiscover = () => {
    const discoverSection = document.getElementById('categories');
    if (discoverSection) {
      discoverSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle pattern selection from search
  const handlePatternSelect = (pattern: Pattern) => {
    router.push(`/patterns/${pattern.id}`);
  };

  // Generate particles
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; color: string }[]>([]);
  
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const colors = [
        'rgba(99, 102, 241, 0.4)', // indigo-500
        'rgba(126, 34, 206, 0.4)',  // purple-700
        'rgba(219, 39, 119, 0.4)',  // pink-600
        'rgba(79, 70, 229, 0.3)',   // indigo-600
        'rgba(147, 51, 234, 0.3)'   // purple-600
      ];
      
      for (let i = 0; i < 7; i++) { // Reduced from 15 to 7
        newParticles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 50 + 10,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-purple-50">
        {/* Static gradient background, removed animated SVG */}
        {/* Particles with simple CSS animation */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, index) => (
            <div
              key={index}
              className="absolute rounded-full blur-xl particle-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                background: particle.color,
                animationDelay: `${index * 0.5}s`
              }}
            />
          ))}
        </div>
        {/* Animated grid removed for simplicity */}
      </div>
      {/* 3D decorative elements - reduced to 3 */}
      <div
        className="absolute left-[15%] top-[20%] w-24 h-24 md:w-36 md:h-36 rounded-full bg-gradient-to-r from-pink-300 to-pink-400 opacity-20 blur-2xl"
        // Removed Framer Motion, static
      />
      <div
        className="absolute right-[20%] bottom-[30%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-15 blur-3xl"
        // Removed Framer Motion, static
      />
      {/* Removed one floating and one pulsing element for simplicity */}
      <div
        className="absolute left-[25%] bottom-[15%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 opacity-20 blur-2xl"
        // Removed Framer Motion, static
      />
      {/* Rotating rings removed for simplicity */}
      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Discover AI Design<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Inspiration & Patterns
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Explore real-world examples of effective AI interfaces and learn from the best implementations
          </motion.p>
          
          {/* Advanced Search Bar */}
          <motion.div 
            className="mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <AdvancedSearchBar 
              onPatternSelect={handlePatternSelect}
              placeholder="Search patterns, categories, or use cases..."
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
              variant="gradient" 
              size="lg"
              className="text-base px-8 py-4"
              onClick={scrollToDiscover}
            >
              Browse All Patterns
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/*
.particle-float {
  animation: particleFloat 8s ease-in-out infinite alternate;
}
@keyframes particleFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-20px); }
}
*/
