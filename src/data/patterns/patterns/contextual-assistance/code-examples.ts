import { CodeExample } from '../../../../types';

// The build script will inject the real code string here
// import { contextualAssistanceDemoCode } from './_code/contextual-assistance-demo.js';

export const codeExamples: CodeExample[] = [
  {
    title: "Smart Text Editor with Contextual Suggestions",
    description: "This React component implements a text editor that offers contextual suggestions based on what the user is typing. It uses a debounce function to prevent too many API calls and maintains clear user control over accepting suggestions.",
    language: "tsx",
    componentId: "contextual-assistance-editor",
    code: `'use client';

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
  const suggestions: Record<string, string[]> = {
    "i want to": ["create a new project", "learn more about", "schedule a meeting"],
    "i need": ["more information about", "to finish this by", "help with"],
    "can you": ["provide more details", "explain how this works", "help me understand"],
    "how do i": ["implement this feature", "solve this problem", "get started with"],
  };
  
  const lowerText = text.toLowerCase();
  for (const [trigger, options] of Object.entries(suggestions)) {
    if (lowerText.endsWith(trigger)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return options.map(option => ({
        text: option,
        confidence: Math.random() * 0.4 + 0.6
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
  
  const debouncedText = useDebounce(text, 500);
  
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
  
  const acceptSuggestion = (suggestion: string) => {
    const newText = debouncedText + " " + suggestion;
    setText(newText);
    setSuggestions([]);
    
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSelectedSuggestion(null);
  };
  
  return (
    <div className="relative max-w-2xl w-full mx-auto">
      <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
          <span className="text-xs text-gray-600 font-medium">Smart Text Editor</span>
        </div>
        <div className="p-4">
          <textarea
            ref={textAreaRef}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Start typing... (Try phrases like 'I want to' or 'Can you')"
            value={text}
            onChange={handleTextChange}
            style={{ minHeight: "120px", maxHeight: "150px" }}
          />
        </div>
      </div>
      
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10"
          >
            <div className="p-2 bg-blue-50 border-b border-gray-200">
              <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
            </div>
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => acceptSuggestion(suggestion.text)}
                >
                  <span>{suggestion.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`
  }
]; 