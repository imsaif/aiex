'use client';

import Hero from '../components/sections/Hero';
import PatternCategories from '../components/sections/PatternCategories';
import RecentPatterns from '../components/sections/RecentPatterns';
import SmartSuggestions from '../components/sections/SmartSuggestions';
import Navbar from '../components/layout/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16">
        {/* Recent Patterns Section */}
        <RecentPatterns />
        
        {/* Smart Suggestions Section */}
        <SmartSuggestions />
        
        <section id="categories" className="py-12 md:py-16">
          <PatternCategories />
        </section>
      </div>

      {/* Footer */}
      <footer className="py-16 mt-24 bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-16 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="text-center">
              <p className="text-lg text-gray-700 font-medium mb-1">
                Built with <span className="text-red-500">❤️</span> by 
                <span className="text-gray-900 font-semibold ml-1">Imran</span>
              </p>
              <p className="text-sm text-gray-500">
                AI Experience Designer & Developer
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <a 
                href="https://www.imranaidesign.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <span className="text-2xl text-gray-600 mb-1">🌐</span>
                <span className="text-xs font-medium text-gray-600">Portfolio</span>
              </a>
              
              <a 
                href="https://github.com/reportkaro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <span className="text-2xl text-gray-600 mb-1">💻</span>
                <span className="text-xs font-medium text-gray-600">GitHub</span>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/imsaif/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <span className="text-2xl text-gray-600 mb-1">💼</span>
                <span className="text-xs font-medium text-gray-600">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
