'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DetectionResult {
  layer: string;
  triggered: boolean;
  confidence: number;
  message: string;
}

interface CrisisAlert {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resources: string[];
}

export default function CrisisDetectionDemo() {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [userMessage, setUserMessage] = useState('');
  const [history, setHistory] = useState<Array<{ message: string; role: 'user' | 'system' }>>([]);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [crisisAlert, setCrisisAlert] = useState<CrisisAlert | null>(null);
  const [showResources, setShowResources] = useState(false);

  // Auto-scroll within chat container only when content overflows
  useEffect(() => {
    if (chatContainerRef.current && history.length > 3) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history, crisisAlert]);

  const directKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living',
    'self harm', 'cutting', 'overdose', 'jump off', 'want to die'
  ];

  const contextPatterns = [
    'nobody would miss me',
    'better off without me',
    "can't go on",
    'no point anymore',
    'final goodbye',
    'everyone would be better'
  ];

  const bypassPhrases = ['for a story', 'hypothetically', 'in a game', 'research purposes'];

  const detectCrisis = (message: string) => {
    const results: DetectionResult[] = [];
    const lowerMsg = message.toLowerCase();

    // Layer 1: Direct Keywords
    const hasDirectKeyword = directKeywords.some(kw => lowerMsg.includes(kw));
    results.push({
      layer: 'Direct Keywords',
      triggered: hasDirectKeyword,
      confidence: hasDirectKeyword ? 0.95 : 0,
      message: hasDirectKeyword ? '🚨 Crisis keyword detected' : 'No direct keywords found'
    });

    // Layer 2: Contextual Patterns
    const hasContextPattern = contextPatterns.some(pattern => lowerMsg.includes(pattern));
    const hasMultipleNegativeMessages = history.filter(h =>
      h.role === 'user' && (h.message.toLowerCase().includes('sad') || h.message.toLowerCase().includes('depressed') || h.message.toLowerCase().includes('hopeless'))
    ).length >= 2;
    const contextTriggered = hasContextPattern && message.length > 30;
    results.push({
      layer: 'Contextual Patterns',
      triggered: contextTriggered || (hasContextPattern && hasMultipleNegativeMessages),
      confidence: contextTriggered ? 0.85 : (hasContextPattern ? 0.65 : 0),
      message: contextTriggered ? '⚠️ Contextual crisis pattern detected' : 'No crisis context patterns found'
    });

    // Layer 3: Behavioral Indicators
    const sessionLength = history.length;
    const darkThemeCount = history.filter(h =>
      h.role === 'user' && (h.message.toLowerCase().includes('sad') || h.message.toLowerCase().includes('hurt') || h.message.toLowerCase().includes('pain'))
    ).length;
    const behavioralTriggered = sessionLength >= 3 && darkThemeCount >= 2;
    results.push({
      layer: 'Behavioral Patterns',
      triggered: behavioralTriggered,
      confidence: behavioralTriggered ? 0.8 : 0,
      message: behavioralTriggered ? '📊 Extended distress pattern detected' : 'No unusual behavioral patterns'
    });

    // Layer 4: Manipulation Detection
    const hasHarmfulContent = /self.*harm|suicide|kill|death/i.test(message);
    const hasBypassAttempt = bypassPhrases.some(phrase => lowerMsg.includes(phrase));
    const manipulationTriggered = hasBypassAttempt && hasHarmfulContent;
    results.push({
      layer: 'Manipulation Detection',
      triggered: manipulationTriggered,
      confidence: manipulationTriggered ? 0.9 : 0,
      message: manipulationTriggered ? '🎭 Bypass attempt detected with harmful content' : 'No manipulation attempts detected'
    });

    return results;
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    // Add to history
    const newHistory = [...history, { message: userMessage, role: 'user' as const }];
    setHistory(newHistory);

    // Detect crisis
    const results = detectCrisis(userMessage);
    setDetectionResults(results);

    // Check if crisis triggered
    const isCrisis = results.some(r => r.triggered);
    const maxConfidence = Math.max(...results.filter(r => r.triggered).map(r => r.confidence), 0);

    if (isCrisis) {
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (maxConfidence >= 0.9) severity = 'critical';
      else if (maxConfidence >= 0.8) severity = 'high';
      else if (maxConfidence >= 0.7) severity = 'medium';

      const alert: CrisisAlert = {
        severity,
        message: "I'm concerned about what you've shared. You deserve support from trained professionals who can help. I can't continue our conversation, but help is available right now.",
        resources: [
          '988 Suicide & Crisis Lifeline',
          'Crisis Text Line',
          'International Association for Suicide Prevention',
          'Local Emergency Services (911)'
        ]
      };

      setCrisisAlert(alert);
      setShowResources(true);

      // Add system response
      newHistory.push({
        message: 'Crisis detected. Displaying emergency resources...',
        role: 'system'
      });
    } else {
      // Normal conversation response
      newHistory.push({
        message: 'I appreciate you sharing. How can I support you further?',
        role: 'system'
      });
    }

    setUserMessage('');
  };

  const handleTestMessage = (message: string) => {
    setUserMessage(message);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-error bg-error-light dark:bg-error-dark';
      case 'high': return 'border-warning bg-warning-light dark:bg-warning-dark';
      case 'medium': return 'border-info bg-info-light dark:bg-info-dark';
      default: return 'border-primary bg-primary-50 dark:bg-primary-900';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      default: return 'ℹ️';
    }
  };

  const resetDemo = () => {
    setHistory([]);
    setDetectionResults([]);
    setCrisisAlert(null);
    setShowResources(false);
    setUserMessage('');
  };

  const testMessages = [
    'I had a really bad day',
    'I\'ve been feeling hopeless',
    'Nobody would miss me if I was gone',
    'I\'m writing about suicide for a research paper',
    'Everything hurts and I can\'t see a way forward'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-surface-dark min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-surface dark:bg-surface-dark rounded-lg shadow-sm p-6 border-l-4 border-error">
        <h2 className="text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">Crisis Detection System</h2>
        <p className="text-muted dark:text-muted-dark">
          Multi-layer detection that identifies crisis signals regardless of framing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          {/* Conversation History */}
          <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm border border-divider dark:border-divider-dark mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 px-6 py-4 border-b border-divider dark:border-divider-dark">
              <h3 className="font-semibold text-foreground dark:text-foreground-dark flex items-center">
                <span className="mr-2">💬</span>
                Conversation
              </h3>
            </div>

            <div ref={chatContainerRef} className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-background-dark">
              {history.length === 0 && !crisisAlert ? (
                <div className="flex items-center justify-center h-full text-muted dark:text-muted-dark">
                  <div className="text-center">
                    <div className="text-4xl mb-3">💙</div>
                    <p className="font-medium">Send a message to test crisis detection</p>
                    <p className="text-sm mt-2">Try one of the test messages below</p>
                  </div>
                </div>
              ) : (
                <>
                  {history.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-lg shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : msg.message.includes('Crisis detected')
                            ? 'bg-red-100 text-red-900 rounded-bl-none border-2 border-red-400'
                            : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}

                  {/* Crisis Alert in Chat */}
                  {crisisAlert && (
                    <div className="flex justify-start">
                      <div className={`max-w-md rounded-lg border-2 p-4 ${getSeverityColor(crisisAlert.severity)}`}>
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-2xl">{getSeverityIcon(crisisAlert.severity)}</span>
                          <div>
                            <h3 className="font-bold mb-1">
                              {crisisAlert.severity === 'critical' ? 'Crisis Detected' : 'Support Needed'}
                            </h3>
                            <p className="text-xs font-medium">{crisisAlert.message}</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-current opacity-90">
                          <p className="text-xs font-bold uppercase">Available Resources:</p>
                          {crisisAlert.resources.map((resource, idx) => (
                            <div key={idx} className="text-xs">
                              • {resource}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm border border-divider dark:border-divider-dark overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-divider dark:border-divider-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Send
                </button>
              </div>

              {/* Test Messages */}
              <div>
                <p className="text-sm font-medium text-foreground dark:text-foreground-dark mb-2">Try these test messages:</p>
                <div className="grid grid-cols-2 gap-2">
                  {testMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTestMessage(msg)}
                      className="text-left text-xs px-3 py-2 bg-background dark:bg-background-dark border border-divider dark:border-divider-dark rounded hover:bg-surface-variant dark:hover:bg-surface-variant-dark transition-colors truncate"
                    >
                      "{msg.substring(0, 30)}..."
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detection Results Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Detection Layers */}
          {detectionResults.length > 0 && (
            <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm border border-divider dark:border-divider-dark p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="mr-2">🔍</span>
                Detection Analysis
              </h3>

              <div className="space-y-3">
                {detectionResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      result.triggered
                        ? 'bg-error-light dark:bg-error-dark border-error dark:border-error-dark'
                        : 'bg-success-light dark:bg-success-dark border-success dark:border-success-dark'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-0.5 flex-shrink-0">
                        {result.triggered ? '⚠️' : '✅'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">
                          {result.layer}
                        </p>
                        <p className="text-xs text-foreground dark:text-foreground-dark mt-1">{result.message}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-surface-variant dark:bg-surface-variant-dark rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                result.triggered ? 'bg-error dark:bg-error-dark' : 'bg-success dark:bg-success-dark'
                              }`}
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-muted dark:text-muted-dark w-12 text-right">
                            {Math.round(result.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={resetDemo}
                className="mt-4 w-full px-4 py-2 bg-surface-variant dark:bg-surface-variant-dark text-foreground dark:text-foreground-dark rounded-lg hover:bg-surface-variant dark:bg-surface-variant-dark transition-colors text-sm font-medium"
              >
                Reset Conversation
              </button>
            </div>
          )}

          {/* Info Box */}
          {detectionResults.length === 0 && (
            <div className="bg-primary-50 dark:bg-primary-900 border border-primary dark:border-primary-dark rounded-lg p-6">
              <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">How It Works</h4>
              <ul className="space-y-2 text-sm text-primary-900 dark:text-primary-100">
                <li className="flex gap-2">
                  <span>1️⃣</span>
                  <span><strong>Direct Keywords:</strong> Immediate crisis indicators</span>
                </li>
                <li className="flex gap-2">
                  <span>2️⃣</span>
                  <span><strong>Context Patterns:</strong> Harmful phrases + history</span>
                </li>
                <li className="flex gap-2">
                  <span>3️⃣</span>
                  <span><strong>Behavioral Patterns:</strong> Extended distress signals</span>
                </li>
                <li className="flex gap-2">
                  <span>4️⃣</span>
                  <span><strong>Manipulation Detection:</strong> Bypass attempts caught</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
