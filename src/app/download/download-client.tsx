'use client';

import Link from 'next/link';

export function DownloadClient() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/handbook.pdf';
    link.download = 'AI-Design-Patterns-Handbook.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-4-2m4 2l4-2" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Download Handbook
        </h1>
        <p className="text-gray-600 text-center mb-2">
          6 Essential AI Design Patterns
        </p>
        <p className="text-sm text-gray-500 text-center mb-8">
          Get the complete PDF handbook with patterns, implementation guides, and real-world examples.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-700">15-minute read</span>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-700">100% free</span>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-700">No email required</span>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition mb-4 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>

        {/* Back Link */}
        <Link
          href="/"
          className="block text-center text-gray-600 hover:text-gray-900 text-sm transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
