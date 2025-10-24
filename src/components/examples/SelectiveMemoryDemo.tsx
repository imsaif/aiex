'use client';

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

const INITIAL_MEMORIES: Memory[] = [
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
];

export default function SelectiveMemoryDemo() {
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);

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

  const exportMemories = () => {
    const dataToExport = memories.map(m => ({
      content: m.content,
      category: m.category,
      importance: m.importance,
      status: m.status,
      usedCount: m.usedCount,
      createdAt: m.createdAt.toISOString()
    }));

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-memories-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetDemo = () => {
    setMemories(INITIAL_MEMORIES);
    setFilter('all');
    setNewMemory('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-[#262626] text-white';
      case 'work': return 'bg-[#0d0d0d] text-white';
      case 'preferences': return 'bg-[#525252] text-white';
      case 'temporary': return 'bg-[#737373] text-white';
      default: return 'bg-[#737373] text-white';
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

  // Get only active memories for the response
  const activeMemories = memories.filter(m => m.status === 'active');

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6 p-4 bg-white border-2 border-[#0d0d0d] rounded-lg">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <p className="text-sm text-[#0d0d0d] font-medium mb-2">
              <strong>How to use:</strong> Click the buttons under each memory to change what the AI remembers.
            </p>
            <div className="text-xs text-gray-700 space-y-1">
              <p>• <strong>⏸ Ignore Temporarily</strong> = Hide the memory from AI responses</p>
              <p>• <strong>✕ Forget</strong> = Mark memory for deletion</p>
              <p>• <strong>↻ Restore</strong> = Bring back ignored memories</p>
            </div>
            <p className="text-xs text-gray-700 mt-2">Watch the <strong>AI Response Preview</strong> on the right update as you modify memories!</p>
          </div>
          <button
            onClick={resetDemo}
            className="px-3 py-2 bg-white text-[#0d0d0d] border-2 border-[#0d0d0d] rounded text-sm font-medium hover:bg-[#0d0d0d] hover:text-white active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
          >
            ↻ Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Memory Management */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Memory Management</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(['all', 'active', 'ignored', 'forgotten'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filter === f
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== 'all' && ` (${stats[f]})`}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredMemories.map(memory => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`rounded-lg p-4 border-2 transition-all bg-white ${
                  memory.status === 'active'
                    ? 'border-[#0d0d0d] shadow-md'
                    : memory.status === 'ignored'
                    ? 'opacity-60 border-dashed border-gray-400'
                    : 'opacity-40 border-dotted border-gray-400 line-through'
                }`}
              >
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(memory.category)}`}>
                      {memory.category}
                    </span>
                    <span className="text-xs text-gray-500">{getImportanceIcon(memory.importance)}</span>
                  </div>
                  <p className="text-sm text-gray-800">{memory.content}</p>
                </div>

                <div className="flex gap-2 flex-wrap pt-2 mt-2 border-t border-gray-200">
                  {memory.status === 'active' && (
                    <>
                      <button
                        onClick={() => updateMemoryStatus(memory.id, 'ignored')}
                        className="px-3 py-1.5 text-sm font-medium bg-white text-[#0d0d0d] border-2 border-[#0d0d0d] rounded-lg hover:bg-[#0d0d0d] hover:text-white active:scale-95 transition-all cursor-pointer"
                      >
                        ⏸ Ignore
                      </button>
                      <button
                        onClick={() => updateMemoryStatus(memory.id, 'forgotten')}
                        className="px-3 py-1.5 text-sm font-medium bg-[#0d0d0d] text-white border-2 border-[#0d0d0d] rounded-lg hover:bg-[#262626] active:scale-95 transition-all cursor-pointer"
                      >
                        ✕ Forget
                      </button>
                    </>
                  )}
                  {memory.status === 'ignored' && (
                    <button
                      onClick={() => updateMemoryStatus(memory.id, 'active')}
                      className="px-3 py-1.5 text-sm font-medium bg-white text-[#0d0d0d] border-2 border-[#0d0d0d] rounded-lg hover:bg-[#0d0d0d] hover:text-white active:scale-95 transition-all cursor-pointer"
                    >
                      ↻ Restore
                    </button>
                  )}
                  {memory.status === 'forgotten' && (
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="px-3 py-1.5 text-sm font-medium bg-[#525252] text-white border-2 border-[#525252] rounded-lg hover:bg-[#737373] active:scale-95 transition-all cursor-pointer"
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="bg-white border-2 border-[#0d0d0d] rounded-lg p-3">
            <h4 className="text-sm font-semibold mb-2">Add Memory</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMemory()}
                placeholder="What to remember?"
                className="flex-1 px-2 py-2 border-2 border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0d0d0d]"
              />
              <button
                onClick={addMemory}
                className="px-3 py-2 bg-[#0d0d0d] text-white rounded text-sm hover:bg-[#262626] transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </div>

          <button
            onClick={exportMemories}
            className="w-full px-3 py-2 bg-white text-[#0d0d0d] border-2 border-[#0d0d0d] rounded text-sm hover:bg-[#0d0d0d] hover:text-white transition-colors font-medium"
          >
            ↓ Export
          </button>
        </div>

        {/* RIGHT COLUMN: AI Response Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-3">AI Response Preview</h3>
          <div className="bg-gray-100 border-2 border-[#0d0d0d] rounded-lg p-4 min-h-[500px] flex flex-col">
            <div className="bg-white rounded-lg p-4 flex-1 mb-3 shadow-sm border-2 border-gray-200">
              <p className="text-gray-800 leading-relaxed mb-4">
                {activeMemories.length > 0
                  ? "Based on what I remember about you, here's my response tailored to your preferences and context..."
                  : "I notice you've ignored or forgotten all your memories. My response would be generic without any personalization."}
              </p>

              {activeMemories.length > 0 && (
                <div className="bg-white rounded p-3 border-2 border-[#0d0d0d]">
                  <p className="text-xs text-[#0d0d0d] mb-2 font-semibold">
                    Memories I'm using:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeMemories.map(m => (
                      <span
                        key={m.id}
                        className="inline-block text-xs bg-[#0d0d0d] text-white px-2 py-1 rounded border-2 border-[#0d0d0d]"
                      >
                        ✓ {m.content.substring(0, 25)}
                        {m.content.length > 25 ? '...' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-3 border-2 border-[#0d0d0d]">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Total</p>
                  <p className="text-2xl font-bold text-[#0d0d0d]">{stats.total}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Active</p>
                  <p className="text-2xl font-bold text-[#0d0d0d]">{stats.active}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Ignored</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.ignored}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Forgotten</p>
                  <p className="text-2xl font-bold text-gray-400">{stats.forgotten}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
