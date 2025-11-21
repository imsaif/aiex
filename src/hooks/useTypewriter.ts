import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  speed?: number; // milliseconds per character
  enabled?: boolean;
  onComplete?: () => void;
}

interface UseTypewriterReturn {
  displayedText: string;
  isTyping: boolean;
}

export function useTypewriter(
  text: string,
  { speed = 10, enabled = true, onComplete }: UseTypewriterOptions = {}
): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    // Reset and start typing
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.();
      }
    }, speed);

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [text, speed, enabled, onComplete]);

  return {
    displayedText: enabled ? displayedText : text,
    isTyping,
  };
}
