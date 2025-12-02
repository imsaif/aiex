'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { AnnotationOverlay } from './AnnotationOverlay';
import type { Annotation } from '@/types/mentor';

interface CanvasViewProps {
  imageBase64: string;
  annotations?: Annotation[];
  selectedAnnotation?: Annotation | null;
  onAnnotationSelect?: (annotation: Annotation) => void;
  showAnnotations?: boolean;
}

export function CanvasView({
  imageBase64,
  annotations = [],
  selectedAnnotation,
  onAnnotationSelect,
  showAnnotations = true,
}: CanvasViewProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'original'>('overlay');
  const [zoom, setZoom] = useState(1);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Get image dimensions when loaded
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  }, [imageBase64]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setZoom(1);

  return (
    <div className="flex flex-col h-full bg-background-tertiary">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-background-primary border-b border-border-primary">
        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-background-secondary rounded-lg p-1">
          <button
            type="button"
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'original'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'overlay'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Annotated
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Compare
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors"
            title="Zoom out"
          >
            <ArrowsPointingInIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomReset}
            className="px-2 py-1 text-xs font-medium text-text-secondary hover:text-text-primary"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors"
            title="Zoom in"
          >
            <ArrowsPointingOutIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Annotation count */}
        {showAnnotations && annotations.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-error" />
              {annotations.filter(a => a.severity === 'critical').length} critical
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-warning" />
              {annotations.filter(a => a.severity === 'warning').length} warnings
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent-primary" />
              {annotations.filter(a => a.severity === 'suggestion').length} suggestions
            </span>
          </div>
        )}
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {viewMode === 'side-by-side' ? (
          // Side-by-side view
          <div className="flex gap-4 h-full min-h-[400px]">
            {/* Original */}
            <div className="flex-1 flex flex-col">
              <div className="text-xs font-medium text-text-secondary mb-2 text-center">
                Original Design
              </div>
              <div className="flex-1 relative rounded-xl overflow-hidden border border-border-primary bg-background-primary shadow-card">
                <img
                  src={imageBase64}
                  alt="Original design"
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                />
              </div>
            </div>

            {/* Annotated */}
            <div className="flex-1 flex flex-col">
              <div className="text-xs font-medium text-text-secondary mb-2 text-center">
                With Annotations
              </div>
              <div className="flex-1 relative rounded-xl overflow-hidden border border-border-primary bg-background-primary shadow-card">
                <img
                  ref={imageRef}
                  src={imageBase64}
                  alt="Annotated design"
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                  onLoad={handleImageLoad}
                />
                {showAnnotations && (
                  <AnnotationOverlay
                    annotations={annotations}
                    selectedAnnotation={selectedAnnotation}
                    onAnnotationSelect={onAnnotationSelect}
                    containerWidth={imageDimensions.width}
                    containerHeight={imageDimensions.height}
                    zoom={zoom}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          // Single view (original or overlay)
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="relative rounded-xl overflow-hidden border border-border-primary bg-background-primary shadow-card max-w-full max-h-full">
              <img
                ref={imageRef}
                src={imageBase64}
                alt="Design"
                className="max-w-full max-h-[70vh] object-contain"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                onLoad={handleImageLoad}
              />
              {viewMode === 'overlay' && showAnnotations && (
                <AnnotationOverlay
                  annotations={annotations}
                  selectedAnnotation={selectedAnnotation}
                  onAnnotationSelect={onAnnotationSelect}
                  containerWidth={imageDimensions.width}
                  containerHeight={imageDimensions.height}
                  zoom={zoom}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CanvasView;
