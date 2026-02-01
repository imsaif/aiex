import { Metadata } from 'next';
import UnsubscribeClient from './unsubscribe-client';

export const metadata: Metadata = {
  title: 'Manage Subscription | AI UX Design Guide',
  description: 'Manage your newsletter subscription preferences or unsubscribe',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';

export default function UnsubscribePage() {
  return <UnsubscribeClient />;
}
