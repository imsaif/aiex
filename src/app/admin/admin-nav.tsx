'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/newsletter', label: 'Newsletter' },
  { href: '/admin/subscribers', label: 'Subscribers' },
  { href: '/admin/social', label: 'Social' },
  { href: '/admin/publish', label: 'Publish' },
  { href: '/admin/audit-samples', label: 'Audit Samples' },
  { href: '/admin/patterns/review', label: 'New Patterns' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-semibold text-text-primary mr-2">Admin</span>
      {links.map(({ href, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-accent-primary/10 text-accent-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
