import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Adaptive Dashboard with Usage-Based Layout",
    description: "A simple dashboard that reorders widgets based on how often you interact with them.",
    language: "tsx",
    componentId: "adaptive-dashboard",
    code: `'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Widget {
  id: string;
  title: string;
  usage: number;
}

const initialWidgets: Widget[] = [
  { id: 'sales', title: 'Sales', usage: 0 },
  { id: 'analytics', title: 'Analytics', usage: 0 },
  { id: 'tasks', title: 'Tasks', usage: 0 },
  { id: 'messages', title: 'Messages', usage: 0 }
];

export default function AdaptiveDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);

  const handleClick = (id: string) => {
    setWidgets(prev => {
      const updated = prev.map(w =>
        w.id === id ? { ...w, usage: w.usage + 1 } : w
      );
      // Sort by usage (most used first)
      return updated.sort((a, b) => b.usage - a.usage);
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Adaptive Dashboard</h2>
      <p className="text-gray-600">Click widgets to see them reorder by usage</p>

      <div className="grid grid-cols-2 gap-4">
        {widgets.map((widget) => (
          <motion.div
            key={widget.id}
            layout
            transition={{ duration: 0.3 }}
            onClick={() => handleClick(widget.id)}
            className="p-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
          >
            <h3 className="font-semibold">{widget.title}</h3>
            <p className="text-sm">Clicks: {widget.usage}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}`
  }
]; 