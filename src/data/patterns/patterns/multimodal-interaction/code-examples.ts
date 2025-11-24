import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Multimodal Search Interface",
    description: "A comprehensive React component demonstrating voice input, text input, touch interactions, and visual feedback for a search interface.",
    language: "tsx",
    componentId: "multimodal-search",
    code: `import React, { useState, useRef } from 'react';

export default function MultimodalSearch() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
  const [results, setResults] = useState([]);
  const [interactionMode, setInteractionMode] = useState('text');
  const recognitionRef = useRef(null);

  // Check for voice support on component mount
  React.useEffect(() => {
    const speechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setHasVoiceSupport(speechRecognition);
  }, []);

  const mockSearch = (searchQuery) => {
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

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
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

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      const searchResults = mockSearch(transcript);
      setResults(searchResults);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInteractionMode('text');
    };

    recognition.start();
  };

  const handleTextInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    setInteractionMode('text');
    
    // Debounced search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      const searchResults = mockSearch(value);
      setResults(searchResults);
    }, 300);
  };

  const handleResultClick = (result) => {
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

  const getInteractionModeColor = () => {
    switch (interactionMode) {
      case 'voice': return 'border-red-200 bg-red-50';
      case 'touch': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Multimodal Search</h3>
        <p className="text-sm text-gray-600">
          Current mode: <span className="font-medium capitalize">{interactionMode}</span>
        </p>
      </div>

      {/* Search Input Container */}
      <div className={\`relative transition-all duration-300 \$\{getInteractionModeColor()\} border-2 rounded-lg p-1\`}>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={handleTextInput}
            placeholder="Type your search or use voice..."
            className="flex-1 p-3 border-0 bg-transparent focus:outline-none focus:ring-0"
          />
          
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear search"
            >
              ✕
            </button>
          )}
          
          <button
            onClick={handleVoiceInput}
            disabled={!hasVoiceSupport}
            className={\`p-3 rounded-lg transition-all duration-200 \$\{
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : hasVoiceSupport 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            \}\`}
            title={isListening ? 'Stop listening' : 'Start voice search'}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
        </div>
      </div>

      {/* Voice Status */}
      {isListening && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-sm font-medium">Listening...</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="p-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 font-medium">Results (tap to select)</span>
          </div>
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result)}
              className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 focus:outline-none focus:bg-blue-50"
            >
              <span className="text-gray-800">{result}</span>
            </button>
          ))}
        </div>
      )}

      {/* Interaction Mode Indicators */}
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className={\`w-2 h-2 rounded-full \$\{interactionMode === 'text' ? 'bg-blue-500' : 'bg-gray-300'\}\`}></div>
          <span className="text-gray-600">Text</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={\`w-2 h-2 rounded-full \$\{interactionMode === 'voice' ? 'bg-red-500' : 'bg-gray-300'\}\`}></div>
          <span className="text-gray-600">Voice</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={\`w-2 h-2 rounded-full \$\{interactionMode === 'touch' ? 'bg-green-500' : 'bg-gray-300'\}\`}></div>
          <span className="text-gray-600">Touch</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>• Type to search with text</p>
        <p>• Click microphone for voice search</p>
        <p>• Tap results to select</p>
      </div>
    </div>
  );
}`
  }
]; 