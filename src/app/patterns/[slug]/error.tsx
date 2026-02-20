'use client';

export default function PatternError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-background-primary flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong
        </h2>
        <p className="text-text-secondary mb-6">
          This pattern failed to load. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-text-primary rounded-lg font-medium hover:bg-background-secondary transition-colors"
          >
            Back to patterns
          </a>
        </div>
      </div>
    </main>
  );
}
