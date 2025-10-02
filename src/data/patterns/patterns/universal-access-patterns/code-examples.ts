import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Universal Access AI Interface",
    description: "This React component demonstrates universal access patterns with multiple interaction modes, accessibility controls, and adaptive complexity levels to ensure equitable AI access for all users.",
    language: "tsx",
    componentId: "universal-access-patterns-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibilitySettings {
  mode: 'voice' | 'text' | 'visual' | 'simplified';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  contrast: 'normal' | 'high' | 'dark';
  language: 'en' | 'es' | 'fr' | 'zh';
  complexity: 'simple' | 'intermediate' | 'expert';
  screenReader: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  complexity: 'simple' | 'intermediate' | 'expert';
}

export default function UniversalAccessPatternsDemo() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    mode: 'text',
    fontSize: 'medium',
    contrast: 'normal',
    language: 'en',
    complexity: 'intermediate',
    screenReader: false
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'How can I help you today?',
      sender: 'ai',
      complexity: 'simple'
    }
  ]);

  const [input, setInput] = useState('');

  const translations = {
    en: {
      title: 'Universal Access AI',
      placeholder: 'Type your message...',
      send: 'Send',
      settings: 'Settings'
    },
    es: {
      title: 'IA de Acceso Universal',
      placeholder: 'Escribe tu mensaje...',
      send: 'Enviar',
      settings: 'Configuración'
    },
    fr: {
      title: 'IA à Accès Universel',
      placeholder: 'Tapez votre message...',
      send: 'Envoyer',
      settings: 'Paramètres'
    },
    zh: {
      title: '通用访问AI',
      placeholder: '输入您的消息...',
      send: '发送',
      settings: '设置'
    }
  };

  const t = translations[settings.language];

  const getResponse = (userMessage: string): string => {
    const responses = {
      simple: \`I understand. I can help with that.\`,
      intermediate: \`I understand your request about "\${userMessage}". I can provide assistance with that.\`,
      expert: \`I've analyzed your query regarding "\${userMessage}". I can provide comprehensive assistance including detailed explanations and advanced options.\`
    };
    return responses[settings.complexity];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      complexity: settings.complexity
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: getResponse(input),
      sender: 'ai',
      complexity: settings.complexity
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInput('');
  };

  const getFontSize = () => {
    const sizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg', xl: 'text-xl' };
    return sizes[settings.fontSize];
  };

  const getContrastClass = () => {
    switch (settings.contrast) {
      case 'high': return 'bg-white text-black border-black';
      case 'dark': return 'bg-gray-900 text-white border-gray-700';
      default: return 'bg-white text-gray-800 border-gray-200';
    }
  };

  const getModeIcon = () => {
    switch (settings.mode) {
      case 'voice': return '🎤';
      case 'text': return '⌨️';
      case 'visual': return '👁️';
      case 'simplified': return '📱';
      default: return '💬';
    }
  };

  return (
    <div className={\`max-w-4xl mx-auto p-4 \${getFontSize()}\`}>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Try this:</strong> Adjust accessibility settings to see how the AI adapts to different modes, languages, and complexity levels!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className={\`rounded-lg border-2 p-4 \${getContrastClass()}\`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl">{t.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getModeIcon()}</span>
                <span className="text-xs opacity-60">{settings.mode} mode</span>
              </div>
            </div>

            <div className="space-y-3 mb-4 h-64 overflow-y-auto" role="log" aria-live="polite">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={\`flex \${message.sender === 'user' ? 'justify-end' : 'justify-start'}\`}
                >
                  <div
                    className={\`max-w-[80%] p-3 rounded-lg \${
                      message.sender === 'user'
                        ? settings.contrast === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : settings.contrast === 'dark'
                        ? 'bg-gray-800 border border-gray-600'
                        : 'bg-gray-100 text-gray-800'
                    }\`}
                    role="article"
                    aria-label={\`\${message.sender === 'user' ? 'You' : 'AI'} said: \${message.text}\`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                aria-label="Message input"
                className={\`flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 \${
                  settings.contrast === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }\`}
              />
              <button
                onClick={handleSend}
                aria-label={t.send}
                className={\`px-4 py-2 rounded-lg font-medium transition-colors \${
                  settings.contrast === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }\`}
              >
                {t.send}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-base">Accessibility {t.settings}</h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-medium mb-1">Interaction Mode</label>
                <select
                  value={settings.mode}
                  onChange={(e) => setSettings(prev => ({ ...prev, mode: e.target.value as any }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  aria-label="Select interaction mode"
                >
                  <option value="text">Text</option>
                  <option value="voice">Voice</option>
                  <option value="visual">Visual</option>
                  <option value="simplified">Simplified</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: e.target.value as any }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  aria-label="Select font size"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Contrast</label>
                <select
                  value={settings.contrast}
                  onChange={(e) => setSettings(prev => ({ ...prev, contrast: e.target.value as any }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  aria-label="Select contrast mode"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Contrast</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as any }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="zh">中文</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Complexity</label>
                <select
                  value={settings.complexity}
                  onChange={(e) => setSettings(prev => ({ ...prev, complexity: e.target.value as any }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  aria-label="Select response complexity"
                >
                  <option value="simple">Simple</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.screenReader}
                    onChange={(e) => setSettings(prev => ({ ...prev, screenReader: e.target.checked }))}
                    className="w-4 h-4"
                    aria-label="Enable screen reader optimization"
                  />
                  <span>Screen Reader Mode</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2">Active Features</h4>
            <div className="text-xs space-y-1">
              <p>✓ Keyboard navigation</p>
              <p>✓ ARIA labels</p>
              <p>✓ Responsive design</p>
              <p>✓ Multi-language support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
  }
];
