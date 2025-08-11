export const contextualAssistanceDemoCode = `
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type definitions
interface Suggestion {
  text: string;
  confidence: number;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Mock AI service - in a real app, replace with actual API call
async function getContextualSuggestions(text: string): Promise<Suggestion[]> {
  // Common phrases that might follow certain beginnings
  const suggestions: Record<string, string[]> = {
    "i want to": ["create a new project", "learn more about", "schedule a meeting"],
    "i need": ["more information about", "to finish this by", "help with"],
    "can you": ["provide more details", "explain how this works", "help me understand"],
    "how do i": ["implement this feature", "solve this problem", "get started with"],
  };
  
  // Check if the text ends with any of our trigger phrases
  const lowerText = text.toLowerCase();
  for (const [trigger, options] of Object.entries(suggestions)) {
    if (lowerText.endsWith(trigger)) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return matching suggestions with confidence scores
      return options.map(option => ({
        text: option,
        confidence: Math.random() * 0.4 + 0.6 // Random confidence between 0.6-1.0
      }));
    }
  }
  
  return [];
}

export default function ContextualAssistanceDemo() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Debounce the input to avoid too many API calls
  const debouncedText = useDebounce(text, 500);
  
  // Get contextual suggestions when the debounced text changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedText.length > 5) {
        setLoading(true);
        try {
          const newSuggestions = await getContextualSuggestions(debouncedText);
          setSuggestions(newSuggestions);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    fetchSuggestions();
  }, [debouncedText]);
  
  // Handle accepting a suggestion
  const acceptSuggestion = (suggestion: string) => {
    // Find where current input ends
    const currentInput = debouncedText.toLowerCase();
    let triggerPhrase = "";
    
    // Find which trigger phrase was used
    for (const trigger of ["i want to", "i need", "can you", "how do i"]) {
      if (currentInput.endsWith(trigger)) {
        triggerPhrase = trigger;
        break;
      }
    }
    
    if (triggerPhrase) {
      // Replace the text by keeping everything up to the trigger phrase
      // and then appending the suggestion
      const upToTrigger = debouncedText.substring(0, debouncedText.length);
      const newText = upToTrigger + " " + suggestion;
      setText(newText);
    }
    
    // Clear suggestions after accepting one
    setSuggestions([]);
    
    // Focus back on the textarea
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };
  
  // Handle textarea input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSelectedSuggestion(null);
  };
  
  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle keys if we have suggestions
    if (suggestions.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev === null ? 0 : Math.min(prev + 1, suggestions.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev === null ? suggestions.length - 1 : Math.max(prev - 1, 0)
        );
        break;
      case "Tab":
      case "Enter":
        // Accept the selected suggestion if one is selected
        if (selectedSuggestion !== null) {
          e.preventDefault();
          acceptSuggestion(suggestions[selectedSuggestion].text);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSuggestions([]);
        setSelectedSuggestion(null);
        break;
    }
  };
  
  return (
    <div className="relative max-w-2xl w-full mx-auto">
      <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-600 font-medium">Smart Text Editor</span>
        </div>
        <div className="p-4">
          <textarea
            ref={textAreaRef}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Start typing... (Try phrases like 'I want to' or 'Can you')"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            style={{ minHeight: "120px", maxHeight: "150px" }}
          />
          
          {loading && (
            <div className="absolute right-8 top-11 text-blue-500">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Suggestion popup */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10"
          >
            <div className="p-2 bg-blue-50 border-b border-gray-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
            </div>
            
            <ul className="py-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className={\`px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between ${
                    selectedSuggestion === index ? 'bg-blue-50' : ''
                  }\`}
                  onClick={() => acceptSuggestion(suggestion.text)}
                  onMouseEnter={() => setSelectedSuggestion(index)}
                >
                  <span>{suggestion.text}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {Math.round(suggestion.confidence * 100)}% match
                  </span>
                </li>
              ))}
            </ul>
            
            <div className="p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
              <span>Tab or Enter to accept • Esc to dismiss</span>
              <button 
                onClick={() => setSuggestions([])} 
                className="text-gray-700 hover:text-gray-900"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tips that appear based on context - these would normally be more sophisticated */}
      {debouncedText.length > 100 && !debouncedText.includes('.') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-yellow-800 font-medium">Writing Tip</p>
            <p className="text-xs text-yellow-700 mt-1">
              Consider breaking your text into sentences with periods for better readability.
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
        <p className="font-medium">Try typing one of these phrases to see contextual suggestions:</p>
        <ul className="mt-1 space-y-1 list-disc list-inside">
          <li>&quot;I want to&quot;</li>
          <li>&quot;I need&quot;</li>
          <li>&quot;Can you&quot;</li>
          <li>&quot;How do I&quot;</li>
        </ul>
      </div>
    </div>
  );
} 
`;
