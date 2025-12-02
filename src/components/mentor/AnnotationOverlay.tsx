'use client';

import { useState } from 'react';
import type { Annotation } from '@/types/mentor';

interface AnnotationOverlayProps {
  annotations: Annotation[];
  selectedAnnotation?: Annotation | null;
  onAnnotationSelect?: (annotation: Annotation) => void;
  containerWidth: number;
  containerHeight: number;
  zoom?: number;
}

export function AnnotationOverlay({
  annotations,
  selectedAnnotation,
  onAnnotationSelect,
  containerWidth,
  containerHeight,
  zoom = 1,
}: AnnotationOverlayProps) {
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null);

  if (!containerWidth || !containerHeight) {
    return null;
  }

  const getSeverityColor = (severity: Annotation['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-red-500',
          bg: 'bg-red-500',
          bgLight: 'bg-red-500/10',
          text: 'text-red-600',
        };
      case 'warning':
        return {
          border: 'border-yellow-500',
          bg: 'bg-yellow-500',
          bgLight: 'bg-yellow-500/10',
          text: 'text-yellow-600',
        };
      case 'suggestion':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-500',
          bgLight: 'bg-blue-500/10',
          text: 'text-blue-600',
        };
      default:
        return {
          border: 'border-gray-500',
          bg: 'bg-gray-500',
          bgLight: 'bg-gray-500/10',
          text: 'text-gray-600',
        };
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
    >
      {annotations.map((annotation, index) => {
        const colors = getSeverityColor(annotation.severity);
        const isSelected = selectedAnnotation?.id === annotation.id;
        const isHovered = hoveredAnnotation === annotation.id;
        const showTooltip = isSelected || isHovered;

        return (
          <div
            key={annotation.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
              width: `${annotation.width}%`,
              height: `${annotation.height}%`,
            }}
          >
            {/* Annotation box */}
            <div
              className={`
                absolute inset-0 border-2 rounded-lg cursor-pointer transition-all
                ${colors.border} ${colors.bgLight}
                ${isSelected ? 'ring-2 ring-offset-2 ring-accent-primary' : ''}
                ${isHovered ? 'border-4' : ''}
              `}
              onClick={() => onAnnotationSelect?.(annotation)}
              onMouseEnter={() => setHoveredAnnotation(annotation.id)}
              onMouseLeave={() => setHoveredAnnotation(null)}
            />

            {/* Number badge */}
            <div
              className={`
                absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center
                text-xs font-bold text-white shadow-md cursor-pointer
                ${colors.bg}
              `}
              onClick={() => onAnnotationSelect?.(annotation)}
              onMouseEnter={() => setHoveredAnnotation(annotation.id)}
              onMouseLeave={() => setHoveredAnnotation(null)}
            >
              {index + 1}
            </div>

            {/* Tooltip */}
            {showTooltip && (
              <div
                className={`
                  absolute z-50 w-64 p-3 rounded-xl shadow-lg border border-border-primary
                  bg-background-primary
                  ${annotation.y > 50 ? 'bottom-full mb-2' : 'top-full mt-2'}
                  ${annotation.x > 50 ? 'right-0' : 'left-0'}
                `}
              >
                {/* Severity badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`
                      px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full
                      ${colors.bg} text-white
                    `}
                  >
                    {annotation.severity}
                  </span>
                  <span className="text-xs font-medium text-text-primary">
                    {annotation.patternName}
                  </span>
                </div>

                {/* Label */}
                <p className="text-sm font-medium text-text-primary mb-1">
                  {annotation.label}
                </p>

                {/* Description */}
                <p className="text-xs text-text-secondary line-clamp-3">
                  {annotation.description}
                </p>

                {/* Learn more hint */}
                {annotation.learnMorePrompt && (
                  <p className="text-[10px] text-accent-primary mt-2">
                    Click to learn more in chat
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AnnotationOverlay;
