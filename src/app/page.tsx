'use client';

import Hero from '../components/sections/Hero';
import PatternCategories from '../components/sections/PatternCategories';
import SmartSuggestions from '../components/sections/SmartSuggestions';
import Navbar from '../components/layout/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">
        {/* Smart Suggestions Section */}
        <SmartSuggestions />
        
        <section id="categories" className="py-12 md:py-16">
          <PatternCategories />
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 mt-24 border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 text-center">
          <p className="text-sm text-gray-600">
            Built with ☕ by Imran · 
            <a href="https://www.imranaidesign.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 ml-1">Portfolio</a> · 
            <a href="https://github.com/reportkaro" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 ml-1">GitHub</a> · 
            <a href="https://www.linkedin.com/in/imsaif/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 ml-1">LinkedIn</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
