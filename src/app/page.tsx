'use client';

import Hero from '../components/sections/Hero';
import PatternCategories from '../components/sections/PatternCategories';
import Navbar from '../components/layout/Navbar';
import ScrollToTop from '../components/ui/ScrollToTop';
import categories from '../data/categories'; // Import categories data

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />
      <Hero />
      
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">
        <section id="categories" className="py-12 md:py-16">
          <PatternCategories categories={categories} />
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 mt-24 border-t border-border-primary">
        <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 text-center">
          <p className="text-sm text-text-secondary">
            Built with ☕ by Imran · 
            <a href="https://www.imranaidesign.com/" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">Portfolio</a> · 
            <a href="https://github.com/imsaif" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">GitHub</a> · 
            <a href="https://www.linkedin.com/in/imsaif/" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary ml-1">LinkedIn</a>
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </main>
  );
}
