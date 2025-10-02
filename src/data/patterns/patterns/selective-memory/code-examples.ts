import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "AI Memory Management Dashboard",
    description: "This React component demonstrates selective memory controls, allowing users to view, categorize, and manage what the AI remembers, with options to keep, forget, or temporarily ignore specific memories.",
    language: "tsx",
    componentId: "selective-memory-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Memory {
  id: string;
  content: string;
  category: 'personal' | 'work' | 'preferences' | 'temporary';
  importance: 'high' | 'medium' | 'low';
  createdAt: Date;
  status: 'active' | 'ignored' | 'forgotten';
  usedCount: number;
}

export default function SelectiveMemoryDemo() {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      content: 'User prefers detailed technical explanations',
      category: 'preferences',
      importance: 'high',
      createdAt: new Date('2024-01-15'),
      status: 'active',
      usedCount: 15
    },
    {
      id: '2',
      content: 'Working on React project with TypeScript',
      category: 'work',
      importance: 'medium',
      createdAt: new Date('2024-02-01'),
      status: 'active',
      usedCount: 8
    },
    {
      id: '3',
      content: 'Lives in San Francisco',
      category: 'personal',
      importance: 'low',
      createdAt: new Date('2024-01-20'),
      status: 'active',
      usedCount: 3
    },
    {
      id: '4',
      content: 'Likes minimal code examples',
      category: 'preferences',
      importance: 'medium',
      createdAt: new Date('2024-02-10'),
      status: 'active',
      usedCount: 12
    },
    {
      id: '5',
      content: 'Exploring AI design patterns',
      category: 'temporary',
      importance: 'low',
      createdAt: new Date('2024-02-15'),
      status: 'active',
      usedCount: 2
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'active' | 'ignored' | 'forgotten'>('all');
  const [newMemory, setNewMemory] = useState('');

  const updateMemoryStatus = (id: string, status: 'active' | 'ignored' | 'forgotten') => {
    setMemories(prev => prev.map(m =>
      m.id === id ? { ...m, status } : m
    ));
  };

  const deleteMemory = (id: string) => {
    if (confirm('Permanently delete this memory? This cannot be undone.')) {
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  const addMemory = () => {
    if (!newMemory.trim()) return;

    const memory: Memory = {
      id: Date.now().toString(),
      content: newMemory,
      category: 'temporary',
      importance: 'low',
      createdAt: new Date(),
      status: 'active',
      usedCount: 0
    };

    setMemories(prev => [...prev, memory]);
    setNewMemory('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-purple-100 text-purple-700';
      case 'work': return 'bg-blue-100 text-blue-700';
      case 'preferences': return 'bg-green-100 text-green-700';
      case 'temporary': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high': return '⭐⭐⭐';
      case 'medium': return '⭐⭐';
      case 'low': return '⭐';
      default: return '';
    }
  };

  const filteredMemories = memories.filter(m =>
    filter === 'all' || m.status === filter
  );

  const stats = {
    total: memories.length,
    active: memories.filter(m => m.status === 'active').length,
    ignored: memories.filter(m => m.status === 'ignored').length,
    forgotten: memories.filter(m => m.status === 'forgotten').length
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Try this:</strong> Manage AI memories - mark as ignored (temporary) or forget (permanent). See how control affects AI context!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3 space-y-4">
          <div className="flex gap-2 mb-4">
            {(['all', 'active', 'ignored', 'forgotten'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={\`px-4 py-2 rounded-lg transition-colors \${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }\`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && \` (\${stats[f]})\`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            {filteredMemories.map(memory => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={\`bg-white border rounded-lg p-4 \${
                  memory.status === 'ignored' ? 'opacity-60' :
                  memory.status === 'forgotten' ? 'opacity-40 line-through' : ''
                }\`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={\`text-xs px-2 py-1 rounded \${getCategoryColor(memory.category)}\`}>
                        {memory.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getImportanceIcon(memory.importance)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Used {memory.usedCount} times
                      </span>
                    </div>
                    <p className="text-gray-800">{memory.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Added {memory.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {memory.status === 'active' && (
                    <>
                      <button
                        onClick={() => updateMemoryStatus(memory.id, 'ignored')}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                      >
                        Ignore Temporarily
                      </button>
                      <button
                        onClick={() => updateMemoryStatus(memory.id, 'forgotten')}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Forget
                      </button>
                    </>
                  )}
                  {memory.status === 'ignored' && (
                    <button
                      onClick={() => updateMemoryStatus(memory.id, 'active')}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Restore
                    </button>
                  )}
                  {memory.status === 'forgotten' && (
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete Permanently
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Add New Memory</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMemory()}
                placeholder="What should the AI remember?"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addMemory}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Memory Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Active:</span>
                <span className="font-medium">{stats.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Ignored:</span>
                <span className="font-medium">{stats.ignored}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Forgotten:</span>
                <span className="font-medium">{stats.forgotten}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Memory Status</h4>
            <div className="text-xs text-gray-700 space-y-1">
              <p><strong>Active:</strong> Used in AI responses</p>
              <p><strong>Ignored:</strong> Temporarily hidden</p>
              <p><strong>Forgotten:</strong> Permanently removed</p>
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
            Export All Memories
          </button>
        </div>
      </div>
    </div>
  );
}`
  }
];
