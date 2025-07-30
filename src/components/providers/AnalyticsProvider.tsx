'use client';

import React from 'react';
import { usePageTracking } from '../../hooks/usePageTracking';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Automatically track page views
  usePageTracking();

  // This component just enables analytics tracking without rendering anything
  return <>{children}</>;
}