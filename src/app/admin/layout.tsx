import Link from 'next/link';
import AdminNav from './admin-nav';

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
            <AdminNav />
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
