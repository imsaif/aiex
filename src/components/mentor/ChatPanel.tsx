'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { ChatMessage, MentorSession, Annotation, FixPrompt } from '@/types/mentor';

interface ChatPanelProps {
  session: MentorSession | null;
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  onAnnotationClick?: (annotation: Annotation) => void;
  onFixPromptCopy?: (prompt: FixPrompt) => void;
}

export function ChatPanel({
  session,
  onSendMessage,
  isLoading = false,
  onAnnotationClick,
  onFixPromptCopy,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isNearBottomRef = useRef(true);

  // Track if user is near bottom of chat
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  }, []);

  // Only auto-scroll if user is near bottom (don't interrupt reading)
  useEffect(() => {
    if (messagesContainerRef.current && isNearBottomRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [session?.messages]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    await onSendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopyPrompt = useCallback((prompt: FixPrompt) => {
    navigator.clipboard.writeText(prompt.prompt);
    onFixPromptCopy?.(prompt);
  }, [onFixPromptCopy]);

  // Quick action suggestions
  const suggestions = [
    'What patterns am I missing?',
    'How do I fix the most critical issue?',
    'Explain this pattern to me',
    'Generate fix prompts for Figma',
  ];

  return (
    <div className="flex flex-col h-full bg-background-primary border-l border-border-primary">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-primary">
        <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary text-sm">Design Mentor</h3>
          <p className="text-xs text-text-tertiary">Ask questions about your design</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4">
        {!session?.messages?.length ? (
          // Empty state with suggestions
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mb-4">
              <SparklesIcon className="w-6 h-6 text-accent-primary" />
            </div>
            <h4 className="font-semibold text-text-primary mb-2">
              I&apos;m your AI Design Mentor
            </h4>
            <p className="text-sm text-text-secondary mb-6 max-w-xs">
              Ask me about your design audit, patterns, or how to improve specific areas.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInputValue(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-background-secondary text-text-secondary hover:bg-background-tertiary hover:text-text-primary transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Message list
          <>
            {session.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onAnnotationClick={onAnnotationClick}
                onCopyPrompt={handleCopyPrompt}
              />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-background-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border-primary">
        <div className="flex items-end gap-2 bg-background-secondary rounded-2xl px-4 py-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your design..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-text-primary placeholder:text-text-tertiary max-h-[120px]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`
              p-2 rounded-full transition-all
              ${inputValue.trim() && !isLoading
                ? 'bg-accent-primary text-white hover:bg-accent-hover'
                : 'bg-background-tertiary text-text-tertiary cursor-not-allowed'
              }
            `}
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

// Message bubble component
interface MessageBubbleProps {
  message: ChatMessage;
  onAnnotationClick?: (annotation: Annotation) => void;
  onCopyPrompt?: (prompt: FixPrompt) => void;
}

function MessageBubble({ message, onAnnotationClick, onCopyPrompt }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center flex-shrink-0">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl
            ${isUser
              ? 'bg-accent-primary text-white rounded-tr-sm'
              : 'bg-background-secondary text-text-primary rounded-tl-sm'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Annotations (if any) */}
        {message.annotations && message.annotations.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.annotations.map((annotation) => (
              <button
                key={annotation.id}
                type="button"
                onClick={() => onAnnotationClick?.(annotation)}
                className="w-full text-left px-3 py-2 rounded-lg bg-background-tertiary hover:bg-background-secondary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`
                      w-2 h-2 rounded-full
                      ${annotation.severity === 'critical' ? 'bg-red-500' : ''}
                      ${annotation.severity === 'warning' ? 'bg-yellow-500' : ''}
                      ${annotation.severity === 'suggestion' ? 'bg-blue-500' : ''}
                    `}
                  />
                  <span className="text-xs font-medium text-text-primary">
                    {annotation.label}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {annotation.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Fix prompts (if any) */}
        {message.fixPrompts && message.fixPrompts.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.fixPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="px-3 py-2 rounded-lg bg-background-tertiary border border-border-primary"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-primary">
                    {prompt.patternName}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopyPrompt?.(prompt)}
                    className="text-xs font-medium text-accent-primary hover:text-accent-hover"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-text-secondary font-mono bg-background-secondary rounded px-2 py-1.5 line-clamp-3">
                  {prompt.prompt}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] text-text-tertiary mt-1 ${isUser ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default ChatPanel;
