import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Top Navigation */}
      <nav className="bg-surface-primary border-b border-border-primary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-1">
              <Link
                href="/admin/newsletter"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-md transition-colors"
              >
                Newsletter
              </Link>
              <Link
                href="/admin/subscribers"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-md transition-colors"
              >
                Subscribers
              </Link>
              <Link
                href="/admin/social"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-md transition-colors"
              >
                Social
              </Link>
            </div>
            <Link
              href="/"
              className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
