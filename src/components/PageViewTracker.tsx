'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/audit/analytics';

// Logs one page_viewed per page shown, including in-app navigations, which
// the Web Vitals log cannot see. Feeds the admin Growth page.
export default function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackPageView();
  }, [pathname]);
  return null;
}
