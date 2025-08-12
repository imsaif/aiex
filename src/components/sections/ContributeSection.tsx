import React from 'react';

const ContributeSection = () => (
  <div className="glass text-center py-16 px-6 rounded-2xl shadow-lg border border-purple-50 relative overflow-hidden">
    {/* Background shape */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-purple-100 to-indigo-50 rounded-full -mr-32 -mt-32 opacity-60"></div>
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-blue-100 to-purple-50 rounded-full -ml-24 -mb-24 opacity-60"></div>
    
    <div className="relative z-10">
      <h2 className="text-3xl font-bold mb-4 gradient-text">Contribute a Pattern</h2>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Have a design pattern or best practice to share? Help grow the community by contributing your knowledge and expertise to our collection!
      </p>
      <a
        href="https://github.com/imsaif/aiex/blob/main/CONTRIBUTING.md"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
      >
        Submit a Pattern
      </a>
    </div>
  </div>
);

export default ContributeSection;
