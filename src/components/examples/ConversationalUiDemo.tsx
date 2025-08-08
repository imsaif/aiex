import React, { useState, useRef, useEffect } from 'react';

// Define message types
type MessageRole = 'user' | 'bot' | 'system';

interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  isLoading?: boolean;
}

// Simple knowledge base for demo purposes
const knowledgeBase = {
  'pricing': 'Our pricing starts at $10/month for the basic plan, $25/month for pro, and $50/month for enterprise.',
  'refund': 'We offer a 30-day money-back guarantee for all our plans. You can request a refund from your account page.',
  'account': 'You can manage your account settings by clicking on your profile picture in the top right corner.',
  'contact': 'You can reach our support team at support@example.com or call us at (555) 123-4567.',
  'hours': 'Our support team is available Monday through Friday, 9am to 5pm Eastern Time.'
};

// Function to get response from knowledge base or handle escalation
const getBotResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const lowercaseMessage = message.toLowerCase();
  
  // Check if user wants to talk to a human
  if (lowercaseMessage.includes('human') || 
      lowercaseMessage.includes('agent') || 
      lowercaseMessage.includes('person') || 
      lowercaseMessage.includes('representative')) {
    return "I'll connect you with a human support agent right away. Please hold while I transfer your chat...";
  }
  
  // Check knowledge base for relevant responses
  for (const [keyword, response] of Object.entries(knowledgeBase)) {
    if (lowercaseMessage.includes(keyword)) {
      return response;
    }
  }
  
  // Handle greetings
  if (lowercaseMessage.includes('hello') || 
      lowercaseMessage.includes('hi') || 
      lowercaseMessage.includes('hey')) {
    return "Hello! I'm your AI assistant. How can I help you today?";
  }
  
  // Handle thanks
  if (lowercaseMessage.includes('thank') || 
      lowercaseMessage.includes('thanks')) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  
  // Default response
  return "I'm not sure I understand your question. You can ask me about our pricing, refund policy, account settings, or contact information. If you'd prefer to speak with a human agent, just let me know.";
};

export default function ConversationalUiDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isTransferringToHuman, setIsTransferringToHuman] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isWaitingForResponse) return;
    
    // Generate a unique ID for the message
    const userMessageId = Date.now().toString();
    const botResponseId = (Date.now() + 1).toString();
    
    // Add user message
    const userMessage: Message = {
      id: userMessageId,
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };
    
    // Add temporary bot message with loading state
    const tempBotMessage: Message = {
      id: botResponseId,
      content: '',
      role: 'bot',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, userMessage, tempBotMessage]);
    setInputValue('');
    setIsWaitingForResponse(true);
    
    try {
      // Get response from AI
      const responseContent = await getBotResponse(inputValue);
      
      // Check if we need to transfer to human
      if (responseContent.includes("I'll connect you with a human")) {
        setIsTransferringToHuman(true);
        
        // Simulate a human joining after a delay
        setTimeout(() => {
          setMessages(prev => [
            ...prev.filter(m => m.id !== botResponseId),
            {
              id: botResponseId,
              content: responseContent,
              role: 'bot',
              timestamp: new Date()
            },
            {
              id: Date.now().toString(),
              content: "This is Sarah from customer support. I can see your conversation history. How can I help you today?",
              role: 'system',
              timestamp: new Date()
            }
          ]);
          setIsTransferringToHuman(false);
          setIsWaitingForResponse(false);
        }, 3000);
      } else {
        // Update the temporary bot message with the actual response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botResponseId 
              ? { ...msg, content: responseContent, isLoading: false } 
              : msg
          )
        );
        setIsWaitingForResponse(false);
      }
    } catch {
      // Handle error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botResponseId 
            ? { 
                ...msg, 
                content: "Sorry, I'm having trouble connecting. Please try again in a moment.", 
                isLoading: false 
              } 
            : msg
        )
      );
      setIsWaitingForResponse(false);
    }
  };

  // Render the appropriate message bubble based on role
  const renderMessage = (message: Message) => {
    if (message.isLoading) {
      return (
        <div key={message.id} className="flex items-start mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-xs sm:max-w-md relative">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      );
    }

    switch (message.role) {
      case 'user':
        return (
          <div key={message.id} className="flex items-start mb-4 justify-end">
            <div className="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-xs sm:max-w-md">
              {message.content}
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        );
      case 'bot':
        return (
          <div key={message.id} className="flex items-start mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.584 2.568a.75.75 0 01.832 0l7 4a.75.75 0 010 1.312l-7 4a.75.75 0 01-.832 0l-7-4a.75.75 0 010-1.312l7-4z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 6.5a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-xs sm:max-w-md">
              {message.content}
            </div>
          </div>
        );
      case 'system':
        return (
          <div key={message.id} className="flex items-start mb-4">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="bg-green-100 rounded-lg py-2 px-4 max-w-xs sm:max-w-md">
              {message.content}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-300 rounded-md bg-white shadow-sm">
      {/* Chat header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Support Assistant</h3>
          <p className="text-sm text-gray-500">
            {isWaitingForResponse && isTransferringToHuman 
              ? "Connecting to a support agent..." 
              : "Online • Usually responds in a few minutes"}
          </p>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map(message => renderMessage(message))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isWaitingForResponse && isTransferringToHuman}
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !inputValue.trim() || isWaitingForResponse
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
            disabled={!inputValue.trim() || isWaitingForResponse}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {isWaitingForResponse && isTransferringToHuman 
            ? "Connecting you to a human support agent..."
            : "Ask about pricing, refunds, account settings, or contact information. You can also ask to speak with a human agent."}
        </div>
      </form>
    </div>
  );
} 