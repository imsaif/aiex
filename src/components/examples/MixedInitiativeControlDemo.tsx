'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FieldId = 'headline' | 'subhead' | 'cta';

interface Field {
  id: FieldId;
  label: string;
  variants: string[];
}

const FIELDS: Field[] = [
  {
    id: 'headline',
    label: 'Headline',
    variants: [
      'Design AI products users actually trust',
      'Ship AI features designers can be proud of',
      'The design language of trustworthy AI',
    ],
  },
  {
    id: 'subhead',
    label: 'Subheadline',
    variants: [
      'Tested patterns from 50+ shipped AI products, in one library.',
      'Stop reinventing AI UX. Start from what already works.',
      '36 patterns drawn from real shipped AI tools.',
    ],
  },
  {
    id: 'cta',
    label: 'CTA',
    variants: ['Browse the library', 'Run my first audit', 'See the patterns'],
  },
];

interface LogEntry {
  id: number;
  who: 'ai' | 'you';
  text: string;
}

export default function MixedInitiativeControlDemo() {
  const [fieldText, setFieldText] = useState<Record<FieldId, string>>({
    headline: FIELDS[0].variants[0],
    subhead: FIELDS[1].variants[0],
    cta: FIELDS[2].variants[0],
  });
  const [editingField, setEditingField] = useState<FieldId | null>(null);
  const [aiTarget, setAiTarget] = useState<FieldId>('headline');
  const [aiPhase, setAiPhase] = useState<'thinking' | 'typing' | 'idle'>('thinking');
  const [aiTyped, setAiTyped] = useState<string>('');
  const [log, setLog] = useState<LogEntry[]>([
    { id: 1, who: 'ai', text: 'Started with Headline' },
  ]);
  const variantIndexRef = useRef<Record<FieldId, number>>({ headline: 0, subhead: 0, cta: 0 });
  const logIdRef = useRef(2);

  const pushLog = useCallback((who: 'ai' | 'you', text: string) => {
    setLog((prev) => [...prev.slice(-4), { id: logIdRef.current++, who, text }]);
  }, []);

  // AI loop — slowed down considerably for clarity
  useEffect(() => {
    if (editingField === aiTarget) return; // AI yields when user is editing same field

    if (aiPhase === 'thinking') {
      setAiTyped('');
      const t = setTimeout(() => setAiPhase('typing'), 2200);
      return () => clearTimeout(t);
    }
    if (aiPhase === 'typing') {
      const variants = FIELDS.find((f) => f.id === aiTarget)!.variants;
      const next = variants[variantIndexRef.current[aiTarget] % variants.length];
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setAiTyped(next.slice(0, i));
        if (i >= next.length) {
          clearInterval(interval);
          setFieldText((prev) => ({ ...prev, [aiTarget]: next }));
          variantIndexRef.current[aiTarget]++;
          pushLog('ai', `Updated ${labelOf(aiTarget)}`);
          setAiPhase('idle');
        }
      }, 55);
      return () => clearInterval(interval);
    }
    if (aiPhase === 'idle') {
      const t = setTimeout(() => {
        const order: FieldId[] = ['headline', 'subhead', 'cta'];
        const currentIdx = order.indexOf(aiTarget);
        let next: FieldId = order[(currentIdx + 1) % order.length];
        if (next === editingField) next = order[(currentIdx + 2) % order.length];
        setAiTarget(next);
        setAiPhase('thinking');
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [aiPhase, aiTarget, editingField, pushLog]);

  // When user starts editing the AI's current field, AI yields
  useEffect(() => {
    if (editingField && editingField === aiTarget && aiPhase !== 'idle') {
      pushLog('you', `Took over ${labelOf(editingField)}`);
      setAiPhase('idle');
    }
  }, [editingField, aiTarget, aiPhase, pushLog]);

  const onFieldFocus = (id: FieldId) => {
    setEditingField(id);
    if (id !== aiTarget) {
      pushLog('you', `Editing ${labelOf(id)} in parallel`);
    }
  };

  const onFieldBlur = (id: FieldId) => {
    if (editingField === id) {
      setEditingField(null);
    }
  };

  const onFieldChange = (id: FieldId, value: string) => {
    setFieldText((prev) => ({ ...prev, [id]: value }));
  };

  const reset = () => {
    setFieldText({
      headline: FIELDS[0].variants[0],
      subhead: FIELDS[1].variants[0],
      cta: FIELDS[2].variants[0],
    });
    setEditingField(null);
    setAiTarget('headline');
    setAiPhase('thinking');
    setAiTyped('');
    variantIndexRef.current = { headline: 0, subhead: 0, cta: 0 };
    setLog([{ id: logIdRef.current++, who: 'ai', text: 'Reset — starting with Headline' }]);
  };

  const aiStatus =
    editingField === aiTarget
      ? `Yielded — you have ${labelOf(aiTarget)}`
      : aiPhase === 'thinking'
      ? `Thinking about ${labelOf(aiTarget)}…`
      : aiPhase === 'typing'
      ? `Writing ${labelOf(aiTarget)}…`
      : `Pausing before next field`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface-primary border border-primary rounded-xl overflow-hidden">
        {/* Status bar — single source of truth, no jumping */}
        <div className="px-5 py-3 border-b border-primary flex items-center gap-3">
          <motion.span
            animate={{ opacity: aiPhase === 'idle' || editingField === aiTarget ? 0.4 : [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-purple-500 shrink-0"
          />
          <span className="text-sm text-text-primary flex-1 truncate">{aiStatus}</span>
          <button
            onClick={reset}
            className="text-[11px] text-text-tertiary hover:text-text-primary underline-offset-2 hover:underline shrink-0"
          >
            Reset
          </button>
        </div>

        {/* Mocked hero — fixed-height column to prevent reflow */}
        <div className="p-6 bg-canvas-grid space-y-5 min-h-[320px]">
          {FIELDS.map((f) => {
            const isEditing = editingField === f.id;
            const isAiTarget = aiTarget === f.id && aiPhase === 'typing' && !isEditing;
            const showText = isAiTarget ? aiTyped : fieldText[f.id];

            return (
              <FieldRow
                key={f.id}
                field={f}
                value={showText}
                isEditing={isEditing}
                isAiTarget={aiTarget === f.id && !isEditing}
                isWriting={isAiTarget}
                onFocus={() => onFieldFocus(f.id)}
                onBlur={() => onFieldBlur(f.id)}
                onChange={(v) => onFieldChange(f.id, v)}
              />
            );
          })}
        </div>

        {/* Activity log — fixed height, max 5 entries */}
        <div className="px-5 py-3 border-t border-primary bg-surface-secondary/40 h-[88px] overflow-hidden">
          <div className="text-[10px] uppercase tracking-wide text-text-tertiary font-semibold mb-1.5">Activity</div>
          <div className="space-y-1">
            <AnimatePresence initial={false}>
              {log.slice(-3).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] flex items-center gap-2 leading-tight"
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                      entry.who === 'ai' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                  />
                  <span className="text-text-primary font-medium w-7 shrink-0">{entry.who === 'ai' ? 'AI' : 'You'}</span>
                  <span className="text-text-secondary truncate">{entry.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-primary text-xs text-text-tertiary">
          Click any field to edit. The AI keeps working in the background. Click the field it&apos;s currently writing and it yields.
        </div>
      </div>
    </div>
  );
}

function labelOf(id: FieldId): string {
  return FIELDS.find((f) => f.id === id)!.label;
}

interface FieldRowProps {
  field: Field;
  value: string;
  isEditing: boolean;
  isAiTarget: boolean;
  isWriting: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (v: string) => void;
}

function FieldRow({ field, value, isEditing, isAiTarget, isWriting, onFocus, onBlur, onChange }: FieldRowProps) {
  const ring = isEditing
    ? 'ring-2 ring-blue-500'
    : isAiTarget
    ? 'ring-2 ring-purple-500'
    : 'ring-1 ring-transparent';

  const baseInput = `w-full bg-background-primary rounded-lg px-4 py-3 transition-shadow ${ring} focus:outline-none`;

  let inputClass = baseInput;
  if (field.id === 'headline') inputClass += ' text-xl md:text-2xl font-bold text-text-primary';
  else if (field.id === 'subhead') inputClass += ' text-sm text-text-secondary';
  else inputClass = `bg-accent-primary text-background-primary rounded-lg px-4 py-2 text-sm font-medium focus:outline-none ${ring}`;

  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-text-tertiary font-semibold mb-1.5 h-4 flex items-center gap-2">
        <span>{field.label}</span>
        {isEditing && <span className="text-blue-600 dark:text-blue-400 normal-case tracking-normal">— you</span>}
        {isAiTarget && !isEditing && (
          <span className="text-purple-600 dark:text-purple-400 normal-case tracking-normal">
            — AI {isWriting ? 'writing' : 'preparing'}
          </span>
        )}
      </div>

      {field.id === 'cta' ? (
        <input
          type="text"
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isAiTarget && !isEditing}
          className={inputClass}
          style={{ minWidth: 180 }}
          placeholder="CTA"
        />
      ) : (
        <input
          type="text"
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isAiTarget && !isEditing}
          className={inputClass}
          placeholder={field.label}
        />
      )}
    </div>
  );
}
