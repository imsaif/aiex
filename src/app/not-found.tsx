import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-6xl font-bold text-text-tertiary mb-4">404</p>
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Page not found
          </h1>
          <p className="text-text-secondary mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white dark:text-gray-900 rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Browse Patterns
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border-primary text-text-primary rounded-lg font-medium hover:bg-background-secondary transition-colors"
            >
              Try the Audit Tool
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-text-tertiary">
            <Link href="/news" className="hover:text-text-primary transition-colors">
              News
            </Link>
            <span>·</span>
            <Link href="/guides" className="hover:text-text-primary transition-colors">
              Guides
            </Link>
            <span>·</span>
            <Link href="/prompts" className="hover:text-text-primary transition-colors">
              Figma Prompts
            </Link>
            <span>·</span>
            <Link href="/toolkit" className="hover:text-text-primary transition-colors">
              Toolkit
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
