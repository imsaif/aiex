"use client";

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

export default function ContextualAssistanceEditor() {
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
        e.preventDefault();
        if (selectedSuggestion !== null) {
          acceptSuggestion(suggestions[selectedSuggestion].text);
        }
        break;
      case "Escape":
        setSuggestions([]);
        setSelectedSuggestion(null);
        break;
    }
  };
  
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <textarea
        ref={textAreaRef}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Start typing... Try phrases like 'I want to' or 'How do I'"
      />
      
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => acceptSuggestion(suggestion.text)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                  index === selectedSuggestion ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{suggestion.text}</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(suggestion.confidence * 100)}% match
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {loading && (
        <div className="absolute right-4 top-4 text-gray-400">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
} 