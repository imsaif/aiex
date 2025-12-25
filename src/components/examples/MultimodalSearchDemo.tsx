import React, { useState, useRef, useEffect } from 'react';

export default function MultimodalSearchDemo() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'text' | 'voice' | 'transitioning'>('text');
  const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const speechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setHasVoiceSupport(speechRecognition);
  }, []);

  const startVoiceMode = () => {
    console.log('startVoiceMode called, hasVoiceSupport:', hasVoiceSupport);

    if (!hasVoiceSupport) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    setTranscript('');
    setMode('transitioning');
    console.log('Mode set to transitioning');

    // Wait for fade out, then switch to voice
    setTimeout(() => {
      setMode('voice');
      console.log('Mode set to voice');
      startRecognition();
    }, 400);
  };

  const startRecognition = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionClass = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.results[event.results.length - 1];
        setTranscript(current[0].transcript);

        if (current.isFinal) {
          // Wait a moment to show the final transcript before exiting
          setTimeout(() => exitVoiceMode(current[0].transcript), 800);
        }
      };

      recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
        console.log('Speech recognition error:', e.error);
        // Don't auto-exit on error, let user cancel manually
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        // Don't auto-exit - let user cancel manually or speak again
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
    }
  };

  const exitVoiceMode = (finalText?: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setMode('transitioning');

    setTimeout(() => {
      if (finalText) {
        setQuery(finalText);
      }
      setTranscript('');
      setMode('text');
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 400);
  };

  const cancelVoiceMode = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    exitVoiceMode();
  };

  const isTextVisible = mode === 'text';
  const isVoiceVisible = mode === 'voice';

  return (
    <div className="max-w-lg mx-auto p-6">

      {/* Main Container - fixed height to prevent collapse */}
      <div className="relative min-h-[280px]">
        {/* Text Input Mode */}
        <div
          className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 ease-out ${
            isTextVisible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="relative flex items-center bg-surface-primary dark:bg-surface-elevated border border-border-primary rounded-full shadow-sm hover:shadow-md transition-shadow">
            {/* Search Icon */}
            <div className="pl-4 text-text-tertiary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or click to speak..."
              className="flex-1 px-3 py-4 bg-transparent border-0 focus:outline-none focus:ring-0 text-text-primary placeholder-text-tertiary"
            />

            {/* Voice Button */}
            <button
              onClick={startVoiceMode}
              disabled={!hasVoiceSupport}
              className={`mr-2 p-2.5 rounded-full transition-all duration-200 ${
                hasVoiceSupport
                  ? 'bg-text-primary text-background-primary hover:opacity-80 hover:scale-105'
                  : 'bg-background-tertiary text-text-disabled cursor-not-allowed'
              }`}
              title="Search by voice"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="10" width="2" height="4" rx="1" />
                <rect x="8" y="7" width="2" height="10" rx="1" />
                <rect x="12" y="4" width="2" height="16" rx="1" />
                <rect x="16" y="7" width="2" height="10" rx="1" />
                <rect x="20" y="10" width="2" height="4" rx="1" />
              </svg>
            </button>
          </div>

          {/* Hint */}
          <p className="text-center text-xs text-text-tertiary mt-4">
            Click the voice icon to speak
          </p>

          {/* Result display */}
          {query && (
            <div className="mt-4 p-4 bg-background-secondary rounded-xl border border-border-primary">
              <p className="text-sm text-text-secondary mb-1">Your search:</p>
              <p className="text-text-primary font-medium">{query}</p>
            </div>
          )}
        </div>

        {/* Voice Input Mode */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
            isVoiceVisible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-105 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="w-full bg-text-primary rounded-3xl p-8 shadow-elevated">
            <div className="flex flex-col items-center space-y-5">
              {/* Animated Orb */}
              <div className="relative">
                <div className="w-20 h-20 bg-background-primary/10 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-14 h-14 bg-background-primary rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="4" y="10" width="2" height="4" rx="1" />
                      <rect x="8" y="7" width="2" height="10" rx="1" />
                      <rect x="12" y="4" width="2" height="16" rx="1" />
                      <rect x="16" y="7" width="2" height="10" rx="1" />
                      <rect x="20" y="10" width="2" height="4" rx="1" />
                    </svg>
                  </div>
                </div>

                {/* Pulsing rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-background-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                <p className="text-background-primary font-medium text-lg">
                  {transcript || 'Listening...'}
                </p>
                {!transcript && (
                  <p className="text-background-primary/60 text-sm mt-1">Speak now</p>
                )}
              </div>

              {/* Sound Wave Bars */}
              <div className="flex items-center justify-center space-x-1 h-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-background-primary rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      height: `${12 + (i === 2 ? 12 : i === 1 || i === 3 ? 8 : 0)}px`,
                    }}
                  />
                ))}
              </div>

              {/* Cancel */}
              <button
                onClick={cancelVoiceMode}
                className="px-6 py-2 bg-background-primary/20 hover:bg-background-primary/30 text-background-primary rounded-full text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
