import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Text-to-Voice Transition Interface",
    description: "A React component demonstrating smooth transitions between text and voice input modes with animated visual feedback.",
    language: "tsx",
    componentId: "multimodal-search",
    code: `import React, { useState, useRef, useEffect } from 'react';

export default function MultimodalSearch() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'text' | 'voice' | 'transitioning'>('text');
  const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setHasVoiceSupport(supported);
  }, []);

  const startVoiceMode = () => {
    if (!hasVoiceSupport) return;

    setTranscript('');
    setMode('transitioning');

    // Smooth transition: fade out text, then show voice
    setTimeout(() => {
      setMode('voice');
      startRecognition();
    }, 400);
  };

  const startRecognition = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const current = event.results[event.results.length - 1];
      setTranscript(current[0].transcript);

      if (current.isFinal) {
        setTimeout(() => exitVoiceMode(current[0].transcript), 800);
      }
    };

    recognition.start();
  };

  const exitVoiceMode = (finalText) => {
    recognitionRef.current?.stop();
    setMode('transitioning');

    setTimeout(() => {
      if (finalText) setQuery(finalText);
      setTranscript('');
      setMode('text');
    }, 400);
  };

  const isTextVisible = mode === 'text';
  const isVoiceVisible = mode === 'voice';

  return (
    <div className="relative min-h-[280px]">
      {/* Text Input Mode */}
      <div className={\`absolute inset-0 transition-all duration-500 \${
        isTextVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }\`}>
        <div className="flex items-center border rounded-full p-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or click to speak..."
            className="flex-1 px-4 py-3 bg-transparent"
          />
          <button
            onClick={startVoiceMode}
            disabled={!hasVoiceSupport}
            className="p-2.5 rounded-full bg-text-primary text-background-primary"
          >
            {/* Sound wave icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="10" width="2" height="4" rx="1" />
              <rect x="8" y="7" width="2" height="10" rx="1" />
              <rect x="12" y="4" width="2" height="16" rx="1" />
              <rect x="16" y="7" width="2" height="10" rx="1" />
              <rect x="20" y="10" width="2" height="4" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Voice Input Mode */}
      <div className={\`absolute inset-0 transition-all duration-500 \${
        isVoiceVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
      }\`}>
        <div className="bg-text-primary rounded-3xl p-8 text-center">
          {/* Animated orb */}
          <div className="w-20 h-20 mx-auto bg-background-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-14 h-14 bg-background-primary rounded-full" />
          </div>

          <p className="text-background-primary mt-4 text-lg">
            {transcript || 'Listening...'}
          </p>

          <button
            onClick={() => exitVoiceMode()}
            className="mt-4 px-6 py-2 bg-background-primary/20 text-background-primary rounded-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}`
  }
];
