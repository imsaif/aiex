'use client';

import React, { useState } from 'react';

type Mode = 'text' | 'voice' | 'simplified';
type Language = 'en' | 'es' | 'fr' | 'zh';

export default function UniversalAccessDemo() {
  const [mode, setMode] = useState<Mode>('text');
  const [language, setLanguage] = useState<Language>('en');

  const messages = {
    en: {
      title: 'AI Assistant',
      prompt: 'How can I help?',
      placeholder: 'Type message...'
    },
    es: {
      title: 'Asistente de IA',
      prompt: '¿Cómo puedo ayudar?',
      placeholder: 'Escribe mensaje...'
    },
    fr: {
      title: 'Assistant IA',
      prompt: 'Comment puis-je aider?',
      placeholder: 'Tapez le message...'
    },
    zh: {
      title: 'AI助手',
      prompt: '我能如何帮助?',
      placeholder: '输入消息...'
    }
  };

  const modeStyles = {
    text: { icon: '⌨️', label: 'Text Mode' },
    voice: { icon: '🎤', label: 'Voice Mode' },
    simplified: { icon: '📱', label: 'Simplified' }
  };

  const t = messages[language];
  const currentMode = modeStyles[mode];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {/* Info Banner */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          Try switching modes and languages to see the interface adapt!
        </p>
      </div>

      {/* Main Interface */}
      <div className="rounded-lg border-2 border-gray-300 p-4 bg-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{t.title}</h2>
          <div className="text-2xl">{currentMode.icon}</div>
        </div>

        {/* Message Display */}
        <div className={`p-4 rounded-lg ${
          mode === 'text' ? 'bg-gray-100 text-base' :
          mode === 'voice' ? 'bg-blue-100 text-sm' :
          'bg-green-100 text-lg font-semibold'
        }`}>
          {mode === 'voice' ? '🔊 ' : ''}{t.prompt}
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder={t.placeholder}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="text">Text</option>
            <option value="voice">Voice</option>
            <option value="simplified">Simplified</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm font-semibold mb-2">✓ Accessible Features</p>
        <ul className="text-xs space-y-1 text-green-800">
          <li>• Keyboard navigation</li>
          <li>• ARIA labels</li>
          <li>• Multiple interaction modes</li>
          <li>• Multilingual support</li>
        </ul>
      </div>
    </div>
  );
}
