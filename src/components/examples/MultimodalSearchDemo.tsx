import React, { useState, useRef } from 'react';

export default function MultimodalSearchDemo() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [interactionMode, setInteractionMode] = useState('text');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for voice support on component mount
  React.useEffect(() => {
    const speechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setHasVoiceSupport(speechRecognition);
  }, []);

  const mockSearch = (searchQuery: string): string[] => {
    if (!searchQuery.trim()) return [];
    
    const mockResults = [
      'React documentation',
      'Multimodal UI patterns',
      'Voice interface design',
      'Accessibility best practices',
      'User experience guidelines'
    ].filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return mockResults.slice(0, 3);
  };

  const handleVoiceInput = () => {
    if (!hasVoiceSupport) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionClass = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setInteractionMode('voice');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInteractionMode('text');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      const searchResults = mockSearch(transcript);
      setResults(searchResults);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInteractionMode('text');
    };

    recognition.start();
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setInteractionMode('text');
    
    // Debounced search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearTimeout((window as any).searchTimeout);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).searchTimeout = setTimeout(() => {
      const searchResults = mockSearch(value);
      setResults(searchResults);
    }, 300);
  };

  const handleResultClick = (result: string) => {
    setQuery(result);
    setResults([]);
    setInteractionMode('touch');
    
    // Simulate a brief touch feedback
    setTimeout(() => {
      setInteractionMode('text');
    }, 500);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setInteractionMode('text');
  };

  const getInteractionModeStyles = () => {
    switch (interactionMode) {
      case 'voice': 
        return {
          container: 'border-red-300 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 shadow-red-100',
          glow: 'shadow-lg shadow-red-200/50'
        };
      case 'touch': 
        return {
          container: 'border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 shadow-emerald-100',
          glow: 'shadow-lg shadow-emerald-200/50'
        };
      default: 
        return {
          container: 'border-blue-300 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 shadow-blue-100',
          glow: 'shadow-lg shadow-blue-200/50'
        };
    }
  };

  const styles = getInteractionModeStyles();

  return (
    <div className="max-w-md mx-auto p-8 space-y-6">
      {/* Header with gradient text */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Multimodal Search
        </h3>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            interactionMode === 'voice' ? 'bg-red-500 animate-pulse' :
            interactionMode === 'touch' ? 'bg-emerald-500' : 'bg-blue-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700 capitalize">{interactionMode} Mode</span>
        </div>
      </div>

      {/* Enhanced Search Input Container */}
      <div className={`relative transition-all duration-500 ease-out ${styles.container} ${styles.glow} border-2 rounded-2xl p-1 backdrop-blur-sm`}>
        <div className="flex items-center space-x-3 bg-white/80 rounded-xl p-1">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={handleTextInput}
              placeholder="Type your search or use voice..."
              className="w-full p-4 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-500 font-medium"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-full"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <button
            onClick={handleVoiceInput}
            disabled={!hasVoiceSupport}
            className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-red-300' 
                : hasVoiceSupport 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-blue-300' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-gray-200'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice search'}
          >
            {isListening ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1c-1.654 0-3 1.346-3 3v8c0 1.654 1.346 3 3 3s3-1.346 3-3V4c0-1.654-1.346-3-3-3z"/>
                <path d="M19 10v2c0 3.866-3.134 7-7 7s-7-3.134-7-7v-2h2v2c0 2.761 2.239 5 5 5s5-2.239 5-5v-2h2z"/>
                <path d="M11 20h2v3h-2z"/>
                <path d="M7 23h10v1H7z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Voice Status */}
      {isListening && (
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm font-semibold">Listening...</span>
          </div>
        </div>
      )}

      {/* Enhanced Search Results */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden animate-slide-up">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-gray-600 font-semibold">Search Results</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleResultClick(result)}
                className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 focus:outline-none focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors">{result}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Interaction Mode Indicators */}
      <div className="flex justify-center space-x-6 py-4">
        {/* Text Mode */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            interactionMode === 'text'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-300/50 scale-110'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <svg className={`w-5 h-5 ${interactionMode === 'text' ? 'text-white' : 'text-gray-500'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span className={`text-xs font-medium transition-colors capitalize ${
            interactionMode === 'text' ? 'text-blue-600' : 'text-gray-500'
          }`}>
            Text
          </span>
        </div>

        {/* Voice Mode */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            interactionMode === 'voice'
              ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-300/50 scale-110'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <svg className={`w-5 h-5 ${interactionMode === 'voice' ? 'text-white' : 'text-gray-500'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v1a7 7 0 01-14 0v-1" />
            </svg>
          </div>
          <span className={`text-xs font-medium transition-colors capitalize ${
            interactionMode === 'voice' ? 'text-red-600' : 'text-gray-500'
          }`}>
            Voice
          </span>
        </div>

        {/* Touch Mode */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            interactionMode === 'touch'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-300/50 scale-110'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <svg className={`w-5 h-5 ${interactionMode === 'touch' ? 'text-white' : 'text-gray-500'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5a2.5 2.5 0 015 0v-1.5a2.5 2.5 0 015 0v1.5a2.5 2.5 0 015 0v6a2.5 2.5 0 01-5 0v-6a2.5 2.5 0 00-5 0v6a2.5 2.5 0 01-5 0v-6z" />
            </svg>
          </div>
          <span className={`text-xs font-medium transition-colors capitalize ${
            interactionMode === 'touch' ? 'text-emerald-600' : 'text-gray-500'
          }`}>
            Touch
          </span>
        </div>
      </div>

      {/* Enhanced Instructions */}
      <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">How to use:</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Type to search with text input</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span>Click microphone for voice search</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span>Tap results to select them</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
} 