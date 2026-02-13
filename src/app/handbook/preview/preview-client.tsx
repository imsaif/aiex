'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function PDFPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Validate and open PDF in new window
  useEffect(() => {
    if (!token || !email) {
      router.push('/handbook');
      return;
    }

    if (token.length < 10 || !email.includes('@')) {
      router.push('/handbook');
      return;
    }

    // Open PDF in new tab
    window.open('/downloads/ai-ux-checklist.pdf', '_blank');
    // Redirect to homepage
    router.push('/');
  }, [token, email, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Opening PDF...</p>
      </div>
    </div>
  );
}

export function HandbookPreviewClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div><p className="text-gray-600">Loading...</p></div></div>}>
      <PDFPreviewContent />
    </Suspense>
  );
}
